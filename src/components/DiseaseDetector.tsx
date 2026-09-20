import React, { useState } from "react";
import axios from "axios";
import CameraCapture from "./CameraCapture.tsx";
import { ShieldAlert, ShieldCheck, Heart, AlertTriangle, Sprout, Loader2, RefreshCw } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { SupportedLanguage } from "../types.ts";

interface DiseaseDiagnosis {
  cropName: string;
  diseaseName: string;
  confidence: number;
  symptoms: string;
  causes: string;
  organicTreatment: string;
  chemicalTreatment: string;
  preventiveMeasures: string;
  recoveryTime: string;
}

interface DiseaseDetectorProps {
  userId?: string;
  preferredLanguage?: SupportedLanguage;
}

export default function DiseaseDetector({ userId, preferredLanguage: propLang }: DiseaseDetectorProps) {
  const { t, language: contextLang } = useLanguage();
  const lang = propLang || contextLang || "en";
  const disT = t.disease;

  const [photo, setPhoto] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64Image: string) => {
    setPhoto(base64Image);
    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const response = await axios.post("/api/disease/analyze", {
        image: base64Image,
        userId,
        preferredLanguage: lang
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setDiagnosis(response.data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to analyze crop photo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhoto(null);
    setDiagnosis(null);
    setError(null);
  };

  const isHealthy = diagnosis && (
    diagnosis.diseaseName.toLowerCase().includes("healthy") ||
    diagnosis.diseaseName.toLowerCase() === "none"
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="disease-detector-module">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-emerald-600" />
          {disT.title}
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {disT.subtitle}
        </p>

        {!photo && (
          <CameraCapture
            onCapture={handleCapture}
            title={disT.snapTitle}
            overlayText={disT.snapOverlay}
          />
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-medium animate-pulse">{disT.analyzing}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs text-center space-y-3">
            <p>{error}</p>
            <button
              onClick={reset}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg text-[11px] transition-all"
            >
              {disT.tryAgain}
            </button>
          </div>
        )}

        {diagnosis && !loading && (
          <div className="space-y-6">
            {/* Visual Identification Banner */}
            <div className={`p-5 rounded-3xl border flex items-start gap-3.5 ${
              isHealthy 
                ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" 
                : "bg-rose-50/50 border-rose-100 text-rose-800"
            }`}>
              {isHealthy ? (
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  {isHealthy ? disT.healthyNotice : disT.diseaseDetected}
                </span>
                <h3 className="text-xl font-bold leading-tight mt-0.5">
                  {diagnosis.diseaseName}
                </h3>
                <p className="text-xs font-semibold mt-1 opacity-90">
                  {diagnosis.cropName} | {disT.confidence}: {diagnosis.confidence}%
                </p>
              </div>
            </div>

            {/* Photo Captured */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden border bg-slate-900">
              <img src={photo || ""} alt="Captured diagnostic" className="w-full h-full object-cover" />
            </div>

            {/* Detailed Metadata Tabs/List */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1">
                    <Sprout className="w-4 h-4 text-emerald-600" /> {disT.symptoms}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{diagnosis.symptoms}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> {disT.causes}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{diagnosis.causes}</p>
                </div>
              </div>

              {/* Organic First Treatment */}
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-xs space-y-1.5">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-emerald-600 animate-pulse" /> {disT.organicTreatment}
                </h4>
                <p className="text-emerald-900 leading-relaxed font-medium">{diagnosis.organicTreatment}</p>
              </div>

              {/* Chemical Treatment */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <h4 className="font-bold text-slate-800">{disT.chemicalTreatment}</h4>
                <p className="text-slate-600 leading-relaxed">{diagnosis.chemicalTreatment || "No severe chemical treatment recommended. Stick to clean biological solutions."}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800">{disT.preventiveMeasures}</h4>
                  <p className="text-slate-600 leading-relaxed">{diagnosis.preventiveMeasures}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800">{disT.recoveryTime}</h4>
                  <p className="text-slate-600 leading-relaxed font-semibold">{diagnosis.recoveryTime}</p>
                </div>
              </div>
            </div>

            {/* Recapture button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={reset}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-sm"
                id="btn-recapture-disease"
              >
                <RefreshCw className="w-4 h-4" /> {disT.tryAgain}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
