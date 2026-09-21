import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  MapPin, 
  Loader2, 
  CheckCircle, 
  Sprout 
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.tsx";

interface WeatherData {
  location: string;
  temp: number;
  humidity: number;
  wind: number;
  rainfallPrediction: string;
  alert: string;
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
  const { t, language, b, bt } = useLanguage();
  const wt = t.weather;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Recommendation form states
  const [stateName, setStateName] = useState(defaultState);
  const [districtName, setDistrictName] = useState(defaultDistrict);
  const [soilType, setSoilType] = useState(defaultSoilType);
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendResult, setRecommendResult] = useState<WeatherRecommendResult | null>(null);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentWeather();
  }, [districtName, stateName]);

  const fetchCurrentWeather = async () => {
    setWeatherLoading(true);
    try {
      const res = await axios.get(`/api/weather/current?district=${districtName}&state=${stateName}`);
      setWeather(res.data);
    } catch (err) {
      console.error("Error fetching mock weather:", err);
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
        userId,
        preferredLanguage: language
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
        <div className="absolute right-0 top-0 transform translate-x-12 -translate-y-6 opacity-15">
          <CloudSun className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {b("Live Block Weather", wt.liveBlockWeather)}
              </span>
              <h3 className="text-xl font-bold mt-0.5">
                {weather?.location || `${districtName}, ${stateName}`}
              </h3>
            </div>
            <span className="text-[10px] text-emerald-100/80 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
              Updated: {weather?.updatedAt || "Just now"}
            </span>
          </div>

          {weatherLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <Thermometer className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <div className="text-[10px] block text-emerald-100/90">{b("Temperature", wt.temperature)}</div>
                  <span className="text-lg font-extrabold">{weather?.temp}°C</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <Droplets className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <div className="text-[10px] block text-emerald-100/90">{b("Air Humidity", wt.humidity)}</div>
                  <span className="text-lg font-extrabold">{weather?.humidity}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <Wind className="w-5 h-5 text-emerald-100" />
                </div>
                <div>
                  <div className="text-[10px] block text-emerald-100/90">{b("Wind Speed", wt.windSpeed)}</div>
                  <span className="text-lg font-extrabold">{weather?.wind} km/h</span>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 flex flex-col justify-center">
                <div className="text-[9px] text-emerald-100 uppercase tracking-widest font-bold">
                  {b("Rainfall Forecast", wt.rainfallForecast)}
                </div>
                <p className="text-xs font-semibold mt-0.5">{weather?.rainfallPrediction}</p>
              </div>
            </div>
          )}

          {weather?.alert && (
            <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/10 text-xs flex items-start gap-2 backdrop-blur-sm">
              <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
              <p className="text-emerald-50 leading-relaxed font-medium">{weather.alert}</p>
            </div>
          )}
        </div>
      </div>

      {/* Weather Sowing Recommendations Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1.5">
            <Sprout className="w-5 h-5 text-emerald-600 shrink-0" />
            {b("Crop Recommendation", wt.cropRecommendationTitle, {
              variant: "heading",
              enClassName: "text-lg font-bold text-gray-900",
              subClassName: "text-sm font-semibold text-emerald-700"
            })}
          </h4>
          <div className="text-xs text-slate-500 mt-1">
            {b("Get AI-powered recommendations tailored to your local seasonal patterns.", wt.cropRecommendationSubtitle, {
              enClassName: "text-xs text-slate-600 font-medium",
              subClassName: "text-xs text-emerald-700/90 font-normal"
            })}
          </div>
        </div>

        <form onSubmit={handleRecommendSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border">
          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">
              {b("State", wt.stateLabel)}
            </label>
            <input 
              type="text" 
              value={stateName} 
              onChange={(e) => setStateName(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
              placeholder="e.g. Maharashtra"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">
              {b("District", wt.districtLabel)}
            </label>
            <input 
              type="text" 
              value={districtName} 
              onChange={(e) => setDistrictName(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
              placeholder="e.g. Pune"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">
              {b("Soil Type", wt.soilTypeLabel)}
            </label>
            <select 
              value={soilType} 
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Loamy">{t.soils.loamy}</option>
              <option value="Clayey">{t.soils.clayey}</option>
              <option value="Sandy">{t.soils.sandy}</option>
              <option value="Alluvial">{t.soils.alluvial}</option>
              <option value="Black Cotton Soil">{t.soils.black}</option>
            </select>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">
              {b("Sowing Season", wt.seasonLabel)}
            </label>
            <select 
              value={season} 
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Kharif (Monsoon / Sowing Jun-Jul)">{t.seasons.kharif}</option>
              <option value="Rabi (Winter / Sowing Oct-Nov)">{t.seasons.rabi}</option>
              <option value="Zaid (Summer / Sowing Mar-Apr)">{t.seasons.zaid}</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={recommendLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
              id="btn-submit-recommend"
            >
              {recommendLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <Sprout className="w-4 h-4 shrink-0" />}
              {recommendLoading 
                ? b("Analyzing...", wt.analyzing, { variant: "button" })
                : b("Analyze Crop Suitability", wt.analyzeSuitability, { variant: "button" })
              }
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
                  <CloudSun className="w-4 h-4 text-emerald-600" /> {wt.weatherAnalysis}
                </span>
                <p className="text-slate-600 leading-relaxed">{recommendResult.weatherAnalysis}</p>
              </div>

              <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-blue-500" /> {wt.rainfallPrediction}
                </span>
                <p className="text-slate-600 leading-relaxed">{recommendResult.rainfallPrediction}</p>
              </div>

              <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-amber-500 animate-pulse" /> {wt.temperatureInsights}
                </span>
                <p className="text-slate-600 leading-relaxed">{recommendResult.temperatureInsights}</p>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{wt.recommendedCrops}</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendResult.recommendations?.map((crop, i) => (
                  <div key={i} className="p-4 bg-emerald-50/20 border border-emerald-100/30 rounded-2xl text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Rank #{i+1} Crop</span>
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> {crop.cropName}
                    </h4>
                    <p><strong>{wt.sowingWindow}:</strong> {crop.suitableSowingPeriod}</p>
                    <p><strong>{wt.harvestDays}:</strong> {crop.estimatedDaysToHarvest}</p>
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
                <h5 className="font-bold text-slate-800">{wt.farmingAdvice}</h5>
                <p className="text-slate-600 leading-relaxed">{recommendResult.farmingAdvice}</p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs space-y-1.5">
                <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> {wt.riskAlerts}
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
