import axios from "axios";
import { dbConnection } from "../db/connection.js";
import { ENV } from "../config/env.js";

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP: Record<number, { condition: string; icon: string; isPrecipitation: boolean }> = {
  0: { condition: "Clear Sky", icon: "clear-day", isPrecipitation: false },
  1: { condition: "Mainly Clear", icon: "clear-day", isPrecipitation: false },
  2: { condition: "Partly Cloudy", icon: "partly-cloudy", isPrecipitation: false },
  3: { condition: "Overcast", icon: "cloudy", isPrecipitation: false },
  45: { condition: "Foggy", icon: "fog", isPrecipitation: false },
  48: { condition: "Depositing Rime Fog", icon: "fog", isPrecipitation: false },
  51: { condition: "Light Drizzle", icon: "drizzle", isPrecipitation: true },
  53: { condition: "Moderate Drizzle", icon: "drizzle", isPrecipitation: true },
  55: { condition: "Dense Drizzle", icon: "drizzle", isPrecipitation: true },
  61: { condition: "Slight Rain", icon: "rain", isPrecipitation: true },
  63: { condition: "Moderate Rain", icon: "rain", isPrecipitation: true },
  65: { condition: "Heavy Rain", icon: "heavy-rain", isPrecipitation: true },
  71: { condition: "Slight Snow", icon: "snow", isPrecipitation: true },
  73: { condition: "Moderate Snow", icon: "snow", isPrecipitation: true },
  75: { condition: "Heavy Snow", icon: "snow", isPrecipitation: true },
  80: { condition: "Scattered Showers", icon: "rain", isPrecipitation: true },
  81: { condition: "Moderate Showers", icon: "rain", isPrecipitation: true },
  82: { condition: "Violent Rain Showers", icon: "heavy-rain", isPrecipitation: true },
  95: { condition: "Thunderstorm", icon: "thunderstorm", isPrecipitation: true },
  96: { condition: "Thunderstorm with Slight Hail", icon: "thunderstorm", isPrecipitation: true },
  99: { condition: "Thunderstorm with Heavy Hail", icon: "thunderstorm", isPrecipitation: true },
};

// Wind direction compass translation
function getCompassDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index] || "N";
}

// Fallback Indian District Coordinates Reference
const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "pune": { lat: 18.5204, lon: 73.8567 },
  "mumbai": { lat: 19.0760, lon: 72.8777 },
  "nashik": { lat: 19.9975, lon: 73.7898 },
  "nagpur": { lat: 21.1458, lon: 79.0882 },
  "aurangabad": { lat: 19.8762, lon: 75.3433 },
  "ludhiana": { lat: 30.9010, lon: 75.8573 },
  "amritsar": { lat: 31.6340, lon: 74.8723 },
  "varanasi": { lat: 25.3176, lon: 82.9739 },
  "lucknow": { lat: 26.8467, lon: 80.9462 },
  "patna": { lat: 25.5941, lon: 85.1376 },
  "jaipur": { lat: 26.9124, lon: 75.7873 },
  "bhopal": { lat: 23.2599, lon: 77.4126 },
  "indore": { lat: 22.7196, lon: 75.8577 },
  "ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "coimbatore": { lat: 11.0168, lon: 76.9558 },
  "guntur": { lat: 16.3067, lon: 80.4365 },
  "howrah": { lat: 22.5958, lon: 88.2636 },
  "kolkata": { lat: 22.5726, lon: 88.3639 },
  "new delhi": { lat: 28.6139, lon: 77.2090 },
  "bengaluru": { lat: 12.9716, lon: 77.5946 },
  "hyderabad": { lat: 17.3850, lon: 78.4867 },
};

interface WeatherAlertResult {
  hasAlert: boolean;
  alert: {
    title: string;
    message: string;
    severity: "warning" | "danger" | "info";
    type: "heat" | "rain" | "wind" | "cold" | "storm";
  } | null;
  alertMessage: string;
}

// Configurable meteorological alert threshold rules
export const WEATHER_ALERT_THRESHOLDS = {
  EXTREME_HEAT: 42,      // °C - Danger
  HEATWAVE_WARNING: 37,  // °C - Warning
  EXTREME_COLD: 4,       // °C - Danger (frost damage)
  COLD_WARNING: 10,      // °C - Warning
  TORRENTIAL_RAIN_MM: 25,// mm - Danger
  HIGH_PRECIP_PROB: 70,  // % - Warning when paired with rain condition
  GALE_WIND_KMH: 45,     // km/h - Danger
  STRONG_WIND_KMH: 30,   // km/h - Warning
};

export class WeatherService {
  // 5-minute memory cache to avoid excessive external API polling
  private static cache = new Map<string, { timestamp: number; data: any }>();
  private static CACHE_TTL_MS = 5 * 60 * 1000;

  /**
   * Geocode a district/state into latitude & longitude
   */
  public static async geocodeLocation(district: string, state: string): Promise<{ lat: number; lon: number; resolvedName: string }> {
    const cleanDistrict = district.trim().toLowerCase();
    
    // Check known coordinates map first
    if (DISTRICT_COORDINATES[cleanDistrict]) {
      return {
        lat: DISTRICT_COORDINATES[cleanDistrict].lat,
        lon: DISTRICT_COORDINATES[cleanDistrict].lon,
        resolvedName: `${district}, ${state}`
      };
    }

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`;
      const res = await axios.get(geoUrl, { timeout: 6000 });
      if (res.data?.results && res.data.results.length > 0) {
        const top = res.data.results[0];
        return {
          lat: top.latitude,
          lon: top.longitude,
          resolvedName: `${top.name}${top.admin1 ? `, ${top.admin1}` : ""}`
        };
      }
    } catch (err: any) {
      console.warn(`[WeatherService] Geocoding lookup warning for ${district}:`, err.message || err);
    }

    // Default to Pune, Maharashtra if resolution fails
    return {
      lat: 18.5204,
      lon: 73.8567,
      resolvedName: `${district || "Pune"}, ${state || "Maharashtra"}`
    };
  }

  /**
   * Evaluate meteorological alert rules against live data
   */
  public static evaluateAlertRules(
    temp: number,
    humidity: number,
    wind: number,
    precipitation: number,
    weatherCode: number,
    precipitationProbabilityMax: number,
    locationLabel: string
  ): WeatherAlertResult {
    // 1. Hail & Severe Thunderstorm (WMO 95, 96, 99)
    if ([95, 96, 99].includes(weatherCode)) {
      return {
        hasAlert: true,
        alert: {
          title: "Severe Thunderstorm & Hail Warning ⛈️",
          message: `Violent convective thunderstorm with possible hailstones detected over ${locationLabel}. Cover sensitive cash crops, secure plastic greenhouse tunnels, and shelter livestock.`,
          severity: "danger",
          type: "storm"
        },
        alertMessage: "Severe convective storm detected."
      };
    }

    // 2. Torrential Rainfall / Flood Risk
    if (precipitation >= WEATHER_ALERT_THRESHOLDS.TORRENTIAL_RAIN_MM || (precipitationProbabilityMax >= WEATHER_ALERT_THRESHOLDS.HIGH_PRECIP_PROB && precipitation >= 10)) {
      return {
        hasAlert: true,
        alert: {
          title: "Heavy Rainfall & Waterlogging Alert 🌧️",
          message: `Significant precipitation (${precipitation}mm, ${precipitationProbabilityMax}% probability) forecasted in ${locationLabel}. Clear all irrigation field trenches to prevent root suffocation.`,
          severity: "danger",
          type: "rain"
        },
        alertMessage: `Heavy precipitation of ${precipitation}mm expected.`
      };
    }

    // 3. Extreme Heatwave
    if (temp >= WEATHER_ALERT_THRESHOLDS.EXTREME_HEAT) {
      return {
        hasAlert: true,
        alert: {
          title: "Severe Heatwave Warning 🥵",
          message: `Extreme temperature recorded at ${temp}°C in ${locationLabel}. Apply dense straw mulching immediately to preserve soil moisture and irrigate during late twilight or dawn.`,
          severity: "danger",
          type: "heat"
        },
        alertMessage: `Extreme heatwave with temperatures reaching ${temp}°C.`
      };
    } else if (temp >= WEATHER_ALERT_THRESHOLDS.HEATWAVE_WARNING) {
      return {
        hasAlert: true,
        alert: {
          title: "Elevated Heat Advisory ☀️",
          message: `High daytime temperature of ${temp}°C in ${locationLabel}. Watch for flower drop in vegetables and schedule sprinkler cycles during morning hours.`,
          severity: "warning",
          type: "heat"
        },
        alertMessage: `Daytime high temperature of ${temp}°C.`
      };
    }

    // 4. Gale / High Winds
    if (wind >= WEATHER_ALERT_THRESHOLDS.GALE_WIND_KMH) {
      return {
        hasAlert: true,
        alert: {
          title: "Gale Wind / Cyclone Advisory 🌀",
          message: `Severe wind gusts reaching ${wind} km/h recorded in ${locationLabel}. Stake banana trees and young papaya plants to prevent stem breakage. Avoid chemical spraying.`,
          severity: "danger",
          type: "wind"
        },
        alertMessage: `Severe winds up to ${wind} km/h.`
      };
    } else if (wind >= WEATHER_ALERT_THRESHOLDS.STRONG_WIND_KMH) {
      return {
        hasAlert: true,
        alert: {
          title: "High Wind Alert 💨",
          message: `Breezy conditions with winds at ${wind} km/h in ${locationLabel}. Postpone foliar pesticide sprays to prevent drift waste.`,
          severity: "warning",
          type: "wind"
        },
        alertMessage: `Breezy wind velocity of ${wind} km/h.`
      };
    }

    // 5. Frost / Low Temperature
    if (temp <= WEATHER_ALERT_THRESHOLDS.EXTREME_COLD) {
      return {
        hasAlert: true,
        alert: {
          title: "Ground Frost & Cold Wave Warning ❄️",
          message: `Dangerous low temperature of ${temp}°C detected. Light evening smoke fires around field borders and apply light surface irrigation to protect tender seedlings from frost burn.`,
          severity: "danger",
          type: "cold"
        },
        alertMessage: `Freezing temperatures of ${temp}°C detected.`
      };
    } else if (temp <= WEATHER_ALERT_THRESHOLDS.COLD_WARNING) {
      return {
        hasAlert: true,
        alert: {
          title: "Winter Cold Advisory 🧣",
          message: `Chilly conditions at ${temp}°C in ${locationLabel}. Monitor rabi crops for fungal dew progression.`,
          severity: "info",
          type: "cold"
        },
        alertMessage: `Cool temperature of ${temp}°C.`
      };
    }

    // Default: No severe alerts
    return {
      hasAlert: false,
      alert: null,
      alertMessage: `No active climate alerts in ${locationLabel}. Weather conditions are favorable for regular field operations.`
    };
  }

  /**
   * Main method: Fetch live meteorological data from Open-Meteo
   */
  public static async getCurrentWeather(
    state: string = "Maharashtra",
    district: string = "Pune",
    lat?: number,
    lon?: number,
    forceRefresh: boolean = false
  ) {
    const targetState = state.trim() || "Maharashtra";
    const targetDistrict = district.trim() || "Pune";
    const cacheKey = `${targetDistrict.toLowerCase()}-${targetState.toLowerCase()}`;

    // Return cached data if valid and fresh
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL_MS)) {
        return {
          ...cached.data,
          isFromCache: true
        };
      }
    }

    // Resolve coordinates
    let latitude = lat;
    let longitude = lon;
    let locationLabel = `${targetDistrict}, ${targetState}`;

    if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
      const geo = await this.geocodeLocation(targetDistrict, targetState);
      latitude = geo.lat;
      longitude = geo.lon;
      locationLabel = geo.resolvedName;
    }

    // Query Open-Meteo real meteorological API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    try {
      const res = await axios.get(weatherUrl, { timeout: 8000 });
      const current = res.data?.current;
      const daily = res.data?.daily;

      if (!current) {
        throw new Error("Meteorological provider returned empty current data.");
      }

      const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10;
      const feelsLike = Math.round((current.apparent_temperature ?? temp) * 10) / 10;
      const humidity = Math.round(current.relative_humidity_2m ?? 50);
      const wind = Math.round((current.wind_speed_10m ?? 10) * 10) / 10;
      const windDegrees = Math.round(current.wind_direction_10m ?? 0);
      const windDirection = getCompassDirection(windDegrees);
      const precipitation = Math.round((current.precipitation ?? 0) * 10) / 10;
      const weatherCode = current.weather_code ?? 0;
      const codeInfo = WMO_CODE_MAP[weatherCode] || { condition: "Clear", icon: "clear-day", isPrecipitation: false };

      // Map 7-day forecast
      const forecastDays: any[] = [];
      if (daily?.time && Array.isArray(daily.time)) {
        for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
          const dateStr = daily.time[i];
          const dateObj = new Date(dateStr);
          const dayName = i === 0 ? "Today" : dateObj.toLocaleDateString("en-IN", { weekday: "short" });
          const code = daily.weather_code?.[i] ?? 0;
          const info = WMO_CODE_MAP[code] || { condition: "Fair", icon: "clear-day" };

          forecastDays.push({
            date: dateStr,
            day: dayName,
            maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? temp),
            minTemp: Math.round(daily.temperature_2m_min?.[i] ?? (temp - 5)),
            precipitationProbability: daily.precipitation_probability_max?.[i] ?? 0,
            condition: info.condition,
            icon: info.icon
          });
        }
      }

      // Check alert rules
      const topPrecipProb = forecastDays[0]?.precipitationProbability ?? 0;
      const alertEvaluation = this.evaluateAlertRules(
        temp,
        humidity,
        wind,
        precipitation,
        weatherCode,
        topPrecipProb,
        locationLabel
      );

      const rainfallPrediction = precipitation > 0
        ? `${precipitation}mm measured (${codeInfo.condition})`
        : topPrecipProb > 30
        ? `${topPrecipProb}% chance of rain in next 24 hours`
        : codeInfo.condition;

      const recordId = "wth-" + Math.random().toString(36).substring(2, 11);
      const resultData = {
        location: locationLabel,
        state: targetState,
        district: targetDistrict,
        latitude,
        longitude,
        temp,
        feelsLike,
        humidity,
        wind,
        windDegrees,
        windDirection,
        precipitation,
        weatherCode,
        condition: codeInfo.condition,
        icon: codeInfo.icon,
        rainfallPrediction,
        hasAlert: alertEvaluation.hasAlert,
        alert: alertEvaluation.alert,
        alertMessage: alertEvaluation.alertMessage,
        forecast: forecastDays,
        source: "Open-Meteo Live Meteorological Satellites",
        isLive: true,
        updatedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isoTimestamp: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, { timestamp: Date.now(), data: resultData });

      // Save record in db if connection available
      try {
        await dbConnection.execute(
          `INSERT INTO weather_records (id, state, district, temp, humidity, wind, rainfall_prediction, advice)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            recordId,
            targetState,
            targetDistrict,
            temp,
            humidity,
            wind,
            rainfallPrediction,
            alertEvaluation.alert?.message || alertEvaluation.alertMessage
          ]
        );
      } catch (dbErr: any) {
        // Fallback silently if db offline
      }

      return resultData;
    } catch (apiErr: any) {
      console.error("[WeatherService Provider Error]", apiErr.message || apiErr);
      
      // If cached data is available even if slightly older, return with isStale flag
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return {
          ...cached.data,
          isStale: true,
          alertMessage: "Live satellite update delayed; displaying latest cached reading."
        };
      }

      // Re-throw a formatted error for the route handler
      const error: any = new Error(`Weather provider service temporarily unavailable: ${apiErr.message || "Request timed out"}`);
      error.statusCode = 502;
      throw error;
    }
  }
}
