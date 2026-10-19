import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Compass, 
  MapPin, 
  Loader2, 
  Calendar, 
  CheckCircle, 
  Sprout 
} from "lucide-react";

interface DailyForecast {
  date: string;
  day: string;
  maxTemp: number;
  minTemp: number;
  precipitationProbability: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  location: string;
  state?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  temp: number;
  feelsLike?: number;
  humidity: number;
  wind: number;
  windDirection?: string;
  precipitation?: number;
  condition?: string;
  icon?: string;
  rainfallPrediction: string;
  hasAlert?: boolean;
  alert?: {
    title: string;
    message: string;
    severity: "warning" | "danger" | "info";
    type?: string;
  } | null;
  alertMessage?: string;
  forecast?: DailyForecast[];
  source?: string;
  isLive?: boolean;
  isStale?: boolean;
  updatedAt: string;
}

interface CropRecommend {
  cropName: string;
  suitableSowingPeriod: string;
  whyRecommended: string;
  estimatedDaysToHarvest: string;
}

interface WeatherRecommendResult {
  weatherAnalysis: string;
  rainfallPrediction: string;
  temperatureInsights: string;
  farmingAdvice: string;
  riskAlerts: string;
  recommendations: CropRecommend[];
}

interface WeatherAdvisorProps {
  userId?: string;
  defaultState?: string;
  defaultDistrict?: string;
  defaultSoilType?: string;
}

export default function WeatherAdvisor({
  userId,
  defaultState = "Maharashtra",
  defaultDistrict = "Pune",
  defaultSoilType = "Loamy"
}: WeatherAdvisorProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Recommendation form states
  const [stateName, setStateName] = useState(defaultState);
  const [districtName, setDistrictName] = useState(defaultDistrict);
  const [soilType, setSoilType] = useState(defaultSoilType);
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendResult, setRecommendResult] = useState<WeatherRecommendResult | null>(null);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentWeather(false);
  }, [districtName, stateName]);

  const fetchCurrentWeather = async (forceRefresh: boolean = false) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await axios.get(
        `/api/weather/current?district=${encodeURIComponent(districtName)}&state=${encodeURIComponent(stateName)}${forceRefresh ? "&forceRefresh=true" : ""}`
      );
      setWeather(res.data);
    } catch (err: any) {
      console.error("[WeatherAdvisor Error]", err);
      setWeatherError(err.response?.data?.error || "Failed to fetch live meteorological data.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendLoading(true);
    setRecommendError(null);
    setRecommendResult(null);

    try {
      const res = await axios.post("/api/weather/recommend", {
        state: stateName,
        district: districtName,
        soilType,
        season,
        userId
      });
      setRecommendResult(res.data.result);
    } catch (err: any) {
      setRecommendError(err.response?.data?.error || "Failed to fetch crop recommendation.");
    } finally {
      setRecommendLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="weather-advisor-module">
      {/* Current block weather card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Ambient graphics */}
        <div className="absolute right-0 top-0 transform translate-x-12 -translate-y-6 opacity-15 pointer-events-none">
          <CloudSun className="w-56 h-56" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Live Meteorological Satellite
              </span>
              <h3 className="text-xl font-bold mt-0.5 flex items-center gap-2">
                {weather?.location || `${districtName}, ${stateName}`}
                {weather?.condition && (
                  <span className="text-xs font-normal text-emerald-100 bg-emerald-800/40 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                    {weather.condition}
                  </span>
                )}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-100/90 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                Updated: {weather?.updatedAt || "Just now"}
              </span>
              <button
                type="button"
                onClick={() => fetchCurrentWeather(true)}
                disabled={weatherLoading}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Fetch fresh satellite weather"
                aria-label="Refresh weather data"
              >
                <Loader2 className={`w-3.5 h-3.5 ${weatherLoading ? "animate-spin" : ""}`} />
                <span className="text-[10px] font-semibold hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {weatherError ? (
            <div className="p-4 bg-rose-900/40 border border-rose-300/30 rounded-2xl text-xs text-rose-100">
              <p className="font-semibold">{weatherError}</p>
              <button
                type="button"
                onClick={() => fetchCurrentWeather(true)}
                className="mt-2 text-[11px] underline font-bold text-rose-200 hover:text-white"
              >
                Try Reconnecting
              </button>
            </div>
          ) : weatherLoading && !weather ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : (
            <>
              {/* Primary Weather Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm flex items-center gap-3">
                  <div className="p-2 bg-amber-400/20 rounded-xl text-amber-200">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] block text-emerald-100/90">Temperature</span>
                    <span className="text-lg font-extrabold">{weather?.temp ?? "--"}°C</span>
                    {weather?.feelsLike !== undefined && (
                      <span className="text-[9px] block text-emerald-100/80">Feels {weather.feelsLike}°C</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm flex items-center gap-3">
                  <div className="p-2 bg-blue-400/20 rounded-xl text-blue-200">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] block text-emerald-100/90">Relative Humidity</span>
                    <span className="text-lg font-extrabold">{weather?.humidity ?? "--"}%</span>
                    <span className="text-[9px] block text-emerald-100/80">Moisture status</span>
                  </div>
                </div>

                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm flex items-center gap-3">
                  <div className="p-2 bg-emerald-400/20 rounded-xl text-emerald-100">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] block text-emerald-100/90">Wind Velocity</span>
                    <span className="text-lg font-extrabold">{weather?.wind ?? "--"} km/h</span>
                    {weather?.windDirection && (
                      <span className="text-[9px] block text-emerald-100/80">Direction: {weather.windDirection}</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm flex items-center gap-3">
                  <div className="p-2 bg-cyan-400/20 rounded-xl text-cyan-200">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] block text-emerald-100/90">Precipitation</span>
                    <span className="text-sm font-extrabold leading-tight block mt-0.5">
                      {weather?.precipitation !== undefined ? `${weather.precipitation} mm` : "None"}
                    </span>
                    <span className="text-[9px] block text-emerald-100/80 line-clamp-1">
                      {weather?.rainfallPrediction || "Normal"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-Day Weather Forecast Strip */}
              {weather?.forecast && weather.forecast.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 block mb-2">
                    7-Day Agronomic Outlook
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {weather.forecast.map((day, idx) => (
                      <div 
                        key={idx}
                        className="bg-white/10 hover:bg-white/15 p-2 rounded-xl text-center backdrop-blur-xs border border-white/5 transition-all"
                      >
                        <span className="text-[10px] font-bold block text-emerald-100">{day.day}</span>
                        <span className="text-xs font-black block mt-1">{day.maxTemp}° <span className="text-[10px] font-normal opacity-75">{day.minTemp}°</span></span>
                        <span className="text-[9px] block text-emerald-100/85 mt-0.5 truncate" title={day.condition}>
                          {day.condition}
                        </span>
                        {day.precipitationProbability > 0 && (
                          <span className="text-[9px] font-bold text-cyan-200 block mt-0.5">
                            💧 {day.precipitationProbability}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Climate Alert Notice */}
              {weather?.hasAlert && weather.alert ? (
                <div className={`mt-3 p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 backdrop-blur-sm ${
                  weather.alert.severity === "danger" 
                    ? "bg-rose-950/60 border-rose-300/40 text-rose-100" 
                    : "bg-amber-950/50 border-amber-300/40 text-amber-100"
                }`}>
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-300 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs">{weather.alert.title}</h5>
                    <p className="leading-relaxed mt-0.5 opacity-95">{weather.alert.message}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-emerald-100/85 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{weather?.alertMessage || "No active climate alerts in your block. Conditions are favorable for field operations."}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Weather Sowing Recommendations Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1.5">
            <Sprout className="w-5 h-5 text-emerald-600" /> Weather-Based Crop Recommendation
          </h4>
          <p className="text-xs text-slate-400">
            Analyze historical local seasons, pH soil profiles, and regional rainfall forecasts to match the perfect cash crop.
          </p>
        </div>

        <form onSubmit={handleRecommendSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border">
          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">State</label>
            <input 
              type="text" 
              value={stateName} 
              onChange={(e) => setStateName(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
              placeholder="e.g. Maharashtra"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">District</label>
            <input 
              type="text" 
              value={districtName} 
              onChange={(e) => setDistrictName(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
              placeholder="e.g. Pune"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">Soil Type</label>
            <select 
              value={soilType} 
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Loamy">Loamy</option>
              <option value="Clayey">Clayey</option>
              <option value="Sandy">Sandy</option>
              <option value="Silty">Silty</option>
              <option value="Black Cotton Soil">Black Cotton Soil</option>
            </select>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">Current Sowing Season</label>
            <select 
              value={season} 
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Kharif (Monsoon / Sowing Jun-Jul)">Kharif (Monsoon / Sowing Jun-Jul)</option>
              <option value="Rabi (Winter / Sowing Oct-Nov)">Rabi (Winter / Sowing Oct-Nov)</option>
              <option value="Zaid (Summer / Sowing Mar-Apr)">Zaid (Summer / Sowing Mar-Apr)</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={recommendLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              id="btn-submit-recommend"
            >
              {recommendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sprout className="w-4 h-4" />}
              Analyze Crop Suitability
            </button>
          </div>
        </form>

        {recommendError && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 text-center">
            {recommendError}
          </div>
        )}

        {recommendResult && (
          <div className="space-y-4 border-t border-slate-100 pt-6 animate-fade-in">
            {/* Visual breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <CloudSun className="w-4 h-4 text-emerald-600" /> Weather Outlook
                </span>
                <p className="text-slate-600 leading-relaxed">{recommendResult.weatherAnalysis}</p>
              </div>

              <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-blue-500" /> Rainfall Expectation
                </span>
                <p className="text-slate-600 leading-relaxed">{recommendResult.rainfallPrediction}</p>
              </div>

              <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-amber-500 animate-pulse" /> Thermal Suitability
                </span>
                <p className="text-slate-600 leading-relaxed">{recommendResult.temperatureInsights}</p>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Top Recommended Crops</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendResult.recommendations?.map((crop, i) => (
                  <div key={i} className="p-4 bg-emerald-50/20 border border-emerald-100/30 rounded-2xl text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Rank #{i+1} Crop</span>
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> {crop.cropName}
                    </h4>
                    <p><strong>Ideal Sowing:</strong> {crop.suitableSowingPeriod}</p>
                    <p><strong>Harvest Span:</strong> {crop.estimatedDaysToHarvest}</p>
                    <p className="text-[11px] text-slate-500 italic mt-1 border-t border-slate-100/50 pt-1">
                      {crop.whyRecommended}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sowing Advice & Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border text-xs space-y-1.5">
                <h5 className="font-bold text-slate-800">Agronomist Sowing Wisdom</h5>
                <p className="text-slate-600 leading-relaxed">{recommendResult.farmingAdvice}</p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs space-y-1.5">
                <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Climate Risk & Pest Warnings
                </h5>
                <p className="text-amber-950 leading-relaxed">{recommendResult.riskAlerts}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
