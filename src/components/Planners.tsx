import React, { useState } from "react";
import axios from "axios";
import { 
  Sprout, 
  Droplets, 
  Calendar, 
  IndianRupee, 
  Compass, 
  Clock, 
  Leaf, 
  CheckCircle, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.tsx";

interface FertilizerResult {
  recommendedFertilizer: string;
  quantity: string;
  schedule: string;
  organicAlternatives: string;
  estimatedCost: number;
  environmentalExplanation: string;
}

interface IrrigationResult {
  waterRequirement: string;
  frequency: string;
  bestTiming: string;
  waterSavingRecommendations: string;
}

interface PlannersProps {
  userId?: string;
  defaultSoilType?: string;
}

export default function Planners({ userId, defaultSoilType = "Loamy" }: PlannersProps) {
  const { t, language } = useLanguage();
  const plT = t.planners;

  const [activeTab, setActiveTab] = useState<"fertilizer" | "irrigation">("fertilizer");

  // Fertilizer States
  const [fertCrop, setFertCrop] = useState("Tomato");
  const [fertStage, setFertStage] = useState("Vegetative Phase");
  const [fertSoil, setFertSoil] = useState(defaultSoilType);
  const [fertSize, setFertSize] = useState("1.5");
  const [fertLoading, setFertLoading] = useState(false);
  const [fertResult, setFertResult] = useState<FertilizerResult | null>(null);
  const [fertError, setFertError] = useState<string | null>(null);

  // Irrigation States
  const [irrigCrop, setIrrigCrop] = useState("Tomato");
  const [irrigStage, setIrrigStage] = useState("Vegetative Phase");
  const [irrigSoil, setIrrigSoil] = useState(defaultSoilType);
  const [irrigLoading, setIrrigLoading] = useState(false);
  const [irrigResult, setIrrigResult] = useState<IrrigationResult | null>(null);
  const [irrigError, setIrrigError] = useState<string | null>(null);

  const handleFertilizerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFertLoading(true);
    setFertError(null);
    setFertResult(null);

    try {
      const res = await axios.post("/api/plans/fertilizer", {
        crop: fertCrop,
        growthStage: fertStage,
        soilType: fertSoil,
        fieldSize: parseFloat(fertSize),
        userId,
        preferredLanguage: language
      });
      setFertResult(res.data.result);
    } catch (err: any) {
      setFertError(err.response?.data?.error || "Failed to compile fertilizer plan.");
    } finally {
      setFertLoading(false);
    }
  };

  const handleIrrigationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIrrigLoading(true);
    setIrrigError(null);
    setIrrigResult(null);

    try {
      const res = await axios.post("/api/plans/irrigation", {
        crop: irrigCrop,
        growthStage: irrigStage,
        soilType: irrigSoil,
        userId,
        preferredLanguage: language
      });
      setIrrigResult(res.data.result);
    } catch (err: any) {
      setIrrigError(err.response?.data?.error || "Failed to compile irrigation schedule.");
    } finally {
      setIrrigLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="planners-module">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-100 bg-white p-2 rounded-3xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab("fertilizer")}
          className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "fertilizer"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
          id="tab-fertilizer"
        >
          <Leaf className="w-4 h-4" />
          {plT.fertilizerTab}
        </button>
        <button
          onClick={() => setActiveTab("irrigation")}
          className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "irrigation"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
          id="tab-irrigation"
        >
          <Droplets className="w-4 h-4" />
          {plT.irrigationTab}
        </button>
      </div>

      {/* Fertilizer View */}
      {activeTab === "fertilizer" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <Leaf className="w-5 h-5 text-emerald-600" />
              {plT.title} - {plT.fertilizerTab}
            </h3>
            <p className="text-xs text-slate-400">
              {plT.subtitle}
            </p>
          </div>

          <form onSubmit={handleFertilizerSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border">
            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.cropLabel}</label>
              <select 
                value={fertCrop} 
                onChange={(e) => setFertCrop(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500"
              >
                <option value="Tomato">Tomato</option>
                <option value="Rice / Paddy">Rice / Paddy</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.growthStageLabel}</label>
              <select 
                value={fertStage} 
                onChange={(e) => setFertStage(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500"
              >
                <option value="Sowing / Transplanting">Sowing / Transplanting</option>
                <option value="Vegetative Phase">Vegetative Phase</option>
                <option value="Flowering Stage">Flowering Stage</option>
                <option value="Fruit Development / Maturation">Fruit Development / Maturation</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.soilTypeLabel}</label>
              <select 
                value={fertSoil} 
                onChange={(e) => setFertSoil(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500"
              >
                <option value="Loamy">{t.soils.loamy}</option>
                <option value="Clayey">{t.soils.clayey}</option>
                <option value="Sandy">{t.soils.sandy}</option>
                <option value="Alluvial">{t.soils.alluvial}</option>
                <option value="Black Cotton Soil">{t.soils.black}</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.fieldSizeLabel}</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                value={fertSize} 
                onChange={(e) => setFertSize(e.target.value)}
                className="w-full p-2 rounded-lg border bg-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-4 flex justify-end">
              <button
                type="submit"
                disabled={fertLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                id="btn-submit-fertilizer"
              >
                {fertLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sprout className="w-4 h-4" />}
                {fertLoading ? plT.generating : plT.calculateFertilizer}
              </button>
            </div>
          </form>

          {fertError && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 text-center">
              {fertError}
            </div>
          )}

          {fertResult && (
            <div className="space-y-4 border-t border-slate-100 pt-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Safe fertilizer recom */}
                <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl text-xs space-y-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-800 block">{plT.recommendedDosage}</span>
                  <h4 className="text-base font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    {fertResult.recommendedFertilizer}
                  </h4>
                  <p><strong>Quantity:</strong> {fertResult.quantity}</p>
                </div>

                {/* Costs */}
                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Estimated Expenses</span>
                    <h4 className="text-xl font-extrabold text-slate-800 flex items-center mt-1">
                      <IndianRupee className="w-5 h-5" />
                      {fertResult.estimatedCost} <span className="text-xs font-normal text-slate-400 ml-1">Total Budget</span>
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Calculated based on local market median crop pricing index.</p>
                </div>
              </div>

              {/* Schedules and Methods */}
              <div className="p-4 bg-slate-50 rounded-2xl border text-xs space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> {plT.applicationMethod}
                </h4>
                <p className="text-slate-600 leading-relaxed font-mono">{fertResult.schedule}</p>
              </div>

              {/* Organic/compost alternatives */}
              <div className="p-4 bg-emerald-50/20 border border-emerald-100/30 rounded-2xl text-xs space-y-2">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" /> {plT.ecoImpact}
                </h4>
                <p className="text-slate-600 leading-relaxed">{fertResult.organicAlternatives}</p>
              </div>

              {/* Ground Caution */}
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs space-y-1.5 flex items-start gap-2 text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900">Runoff & Soil Flora Warning</span>
                  <p className="text-[11px] leading-normal">{fertResult.environmentalExplanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Irrigation View */}
      {activeTab === "irrigation" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <Droplets className="w-5 h-5 text-emerald-600" />
              {plT.title} - {plT.irrigationTab}
            </h3>
            <p className="text-xs text-slate-400">
              {plT.subtitle}
            </p>
          </div>

          <form onSubmit={handleIrrigationSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border">
            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.cropLabel}</label>
              <select 
                value={irrigCrop} 
                onChange={(e) => setIrrigCrop(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500"
              >
                <option value="Tomato">Tomato</option>
                <option value="Rice / Paddy">Rice / Paddy</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.growthStageLabel}</label>
              <select 
                value={irrigStage} 
                onChange={(e) => setIrrigStage(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500"
              >
                <option value="Sowing / Transplanting">Sowing / Transplanting</option>
                <option value="Vegetative Phase">Vegetative Phase</option>
                <option value="Flowering Stage">Flowering Stage</option>
                <option value="Fruit Development / Maturation">Fruit Development / Maturation</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">{plT.soilTypeLabel}</label>
              <select 
                value={irrigSoil} 
                onChange={(e) => setIrrigSoil(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-white outline-none focus:border-emerald-500"
              >
                <option value="Loamy">{t.soils.loamy}</option>
                <option value="Clayey">{t.soils.clayey}</option>
                <option value="Sandy">{t.soils.sandy}</option>
                <option value="Alluvial">{t.soils.alluvial}</option>
                <option value="Black Cotton Soil">{t.soils.black}</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={irrigLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                id="btn-submit-irrigation"
              >
                {irrigLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Droplets className="w-4 h-4" />}
                {irrigLoading ? plT.generating : plT.calculateIrrigation}
              </button>
            </div>
          </form>

          {irrigError && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 text-center">
              {irrigError}
            </div>
          )}

          {irrigResult && (
            <div className="space-y-4 border-t border-slate-100 pt-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">{plT.waterVolume}</span>
                  <div className="flex items-center gap-1 text-base font-bold text-emerald-800 mt-1">
                    <Compass className="w-5 h-5 text-emerald-600" />
                    {irrigResult.waterRequirement}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">{plT.irrigationFrequency}</span>
                  <div className="flex items-center gap-1 text-base font-bold text-slate-800 mt-1">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    {irrigResult.frequency}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">{plT.wateringMethod}</span>
                  <div className="flex items-center gap-1 text-base font-bold text-amber-700 mt-1">
                    <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                    {irrigResult.bestTiming}
                  </div>
                </div>
              </div>

              {/* Water saving recommendations */}
              <div className="p-4 bg-emerald-50/20 border border-emerald-100/30 rounded-2xl text-xs space-y-2">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-600" /> Moisture Conservation & Mulching Tips
                </h4>
                <p className="text-slate-600 leading-relaxed">{irrigResult.waterSavingRecommendations}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
