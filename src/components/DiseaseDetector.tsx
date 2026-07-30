import React, { useState } from "react";
import axios from "axios";
import CameraCapture from "./CameraCapture.tsx";
import { ShieldAlert, ShieldCheck, Heart, AlertTriangle, Sprout, Loader2, RefreshCw } from "lucide-react";

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
  preferredLanguage?: "en" | "hi" | "mr";
}

export default function DiseaseDetector({ userId, preferredLanguage = "en" }: DiseaseDetectorProps) {
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
        preferredLanguage
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
          AI Crop Disease Diagnosis
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Upload or capture a photo of your crop's infected leaves, roots or stem. Our botanist-grade diagnostic vision model will estimate the infection, explain causes, and recommend organic-first treatments.
        </p>

        {!photo && (
          <CameraCapture
            onCapture={handleCapture}
            title="Snap Crop Photo"
            overlayText="Align infected areas clearly under focus"
          />
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-medium animate-pulse">Running diagnostic checks... analyzing vein patterns...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs text-center space-y-3">
            <p>{error}</p>
            <button
              onClick={reset}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg text-[11px] transition-all"
            >
              Try Again
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
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Diagnosis Result</span>
                <h3 className="text-xl font-bold leading-tight mt-0.5">
                  {diagnosis.diseaseName}
                </h3>
                <p className="text-xs font-semibold mt-1 opacity-90">
                  Target Crop: <span className="underline">{diagnosis.cropName}</span> | Confidence Score: {diagnosis.confidence}%
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
                    <Sprout className="w-4 h-4 text-emerald-600" /> Detected Symptoms
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{diagnosis.symptoms}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Root Causes
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{diagnosis.causes}</p>
                </div>
              </div>

              {/* Organic First Treatment */}
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-xs space-y-1.5">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-emerald-600 animate-pulse" /> Recommended Organic Treatments (Safe First)
                </h4>
                <p className="text-emerald-900 leading-relaxed font-medium">{diagnosis.organicTreatment}</p>
              </div>

              {/* Chemical Treatment */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <h4 className="font-bold text-slate-800">Chemical Treatments (Minimum Effective Dose / Last Resort)</h4>
                <p className="text-slate-600 leading-relaxed">{diagnosis.chemicalTreatment || "No severe chemical treatment recommended. Stick to clean biological solutions."}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800">Preventive Measures for Next Season</h4>
                  <p className="text-slate-600 leading-relaxed">{diagnosis.preventiveMeasures}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-800">Estimated Recovery Time</h4>
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
                <RefreshCw className="w-4 h-4" /> Diagnose Another Plant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
