import React, { useState } from "react";
import { 
  Volume2, 
  Leaf, 
  MapPin, 
  Compass, 
  Droplets, 
  Sun, 
  Activity, 
  ShieldAlert, 
  Sprout, 
  AlertTriangle, 
  FileDown,
  Info
} from "lucide-react";

interface LocalName {
  language: string;
  name: string;
}

interface BotanicalInfo {
  nativeRegion: string;
  growingSeasonIndia: string;
  sunlight: string;
  waterRequirement: string;
  lifecycleDuration: string;
  beneficialUses: string;
}

interface SoilCompatibility {
  idealPhRange: string;
  idealSoilTexture: string;
  idealNutrients: string;
  compatibilityScore: string;
  soilMatchExplanation: string;
  organicAmendments: string;
}

interface SustainableFertilizer {
  firstChoiceOrganic: string;
  secondChoiceMineral: string;
  applicationMethod: string;
  environmentalCaution: string;
  companionPlanting: string;
  estimatedCostComparison: string;
}

interface PlantIdResult {
  identity: {
    scientificName: string;
    commonName: string;
    localNames: LocalName[];
    family: string;
    plantType: string;
    growthHabit: string;
    confidenceScore: number;
    uncertainCandidates?: string[];
  };
  botanicalInfo: BotanicalInfo;
  diseaseSusceptibility: {
    commonDiseases: string;
    earlyWarningSigns: string;
    isCurrentlyDiseased: boolean;
    visibleSymptoms: string;
  };
  soilCompatibility: SoilCompatibility;
  sustainableFertilizer: SustainableFertilizer;
  environmentalImpactNote: string;
  multilingualSummary: string;
}

interface FieldGuideCardProps {
  data: PlantIdResult;
  photoUrl: string;
  soilPhotoUrl?: string;
  language?: "en" | "hi" | "mr";
}

export default function FieldGuideCard({ data, photoUrl, soilPhotoUrl, language = "en" }: FieldGuideCardProps) {
  const [openSection, setOpenSection] = useState<string | null>("botanical");
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getLocalName = () => {
    if (!data.identity.localNames || data.identity.localNames.length === 0) return "";
    const found = data.identity.localNames.find((ln) => ln.language === language);
    return found ? found.name : data.identity.localNames[0].name;
  };

  // Speaks the plant identity using native HTML5 Web Speech Synthesis API
  const speakPlantSummary = () => {
    if ("speechSynthesis" in window) {
      if (isPlayingSpeech) {
        window.speechSynthesis.cancel();
        setIsPlayingSpeech(false);
        return;
      }

      const text = data.multilingualSummary || `This plant is identified as ${data.identity.commonName}, or botanically known as ${data.identity.scientificName}. It belongs to the family ${data.identity.family}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to find a suitable voice (Hindi voice if language is hi, etc.)
      const voices = window.speechSynthesis.getVoices();
      if (language === "hi") {
        const hiVoice = voices.find((v) => v.lang.startsWith("hi") || v.lang.startsWith("in"));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (language === "mr") {
        const mrVoice = voices.find((v) => v.lang.startsWith("mr") || v.lang.startsWith("in"));
        if (mrVoice) utterance.voice = mrVoice;
      }

      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);

      setIsPlayingSpeech(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported on your browser.");
    }
  };

  const downloadReportPDF = () => {
    // Generate a beautiful formatted print window which compiles a printable Field Guide Card
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>Krishi Saathi - Plant Field Report</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { font-size: 12px; color: #111; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body class="bg-white p-8">
          <div class="max-w-3xl mx-auto border border-gray-200 rounded-xl p-6 shadow-sm">
            <div class="flex justify-between items-center border-b pb-4 mb-6">
              <div>
                <h1 class="text-2xl font-bold text-green-800">KRISHI SAATHI</h1>
                <p class="text-xs text-gray-500">Botanist-Grade Crop & Plant Report</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold">Report ID: KRI-${Math.floor(100000 + Math.random() * 900000)}</p>
                <p class="text-xs text-gray-500">Date: ${new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900">${data.identity.commonName}</h2>
                <p class="italic text-gray-600 text-sm mb-2">${data.identity.scientificName}</p>
                <p class="text-lg font-medium text-green-700">${getLocalName() ? `Local Name: ${getLocalName()}` : ''}</p>
                <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Family:</strong> ${data.identity.family}</div>
                  <div><strong>Plant Type:</strong> ${data.identity.plantType}</div>
                  <div><strong>Growth Habit:</strong> ${data.identity.growthHabit}</div>
                  <div><strong>Confidence:</strong> ${data.identity.confidenceScore}%</div>
                </div>
              </div>
              <div class="flex items-center justify-center border rounded-lg bg-gray-50 p-2 overflow-hidden max-h-48">
                <img src="${photoUrl}" class="max-h-full max-w-full object-contain rounded" />
              </div>
            </div>

            <div class="space-y-4">
              <div class="border-t pt-4">
                <h3 class="font-bold text-green-800 mb-2">🌿 Botanical Guidelines</h3>
                <p class="text-sm"><strong>Native Region:</strong> ${data.botanicalInfo.nativeRegion}</p>
                <p class="text-sm"><strong>Water Depth:</strong> ${data.botanicalInfo.waterRequirement}</p>
                <p class="text-sm"><strong>Ideal Season in India:</strong> ${data.botanicalInfo.growingSeasonIndia}</p>
                <p class="text-sm"><strong>Sunlight:</strong> ${data.botanicalInfo.sunlight}</p>
                <p class="text-sm"><strong>Lifespan:</strong> ${data.botanicalInfo.lifecycleDuration}</p>
                <p class="text-sm"><strong>Primary Uses:</strong> ${data.botanicalInfo.beneficialUses}</p>
              </div>

              <div class="border-t pt-4">
                <h3 class="font-bold text-green-800 mb-2">💩 Soil Compatibility Analysis</h3>
                <p class="text-sm"><strong>Ideal Soil pH:</strong> ${data.soilCompatibility.idealPhRange}</p>
                <p class="text-sm"><strong>Ideal Texture:</strong> ${data.soilCompatibility.idealSoilTexture}</p>
                <p class="text-sm"><strong>Compatibility Rating:</strong> <span class="underline font-semibold">${data.soilCompatibility.compatibilityScore}</span></p>
                <p class="text-sm"><strong>Match Explanation:</strong> ${data.soilCompatibility.soilMatchExplanation}</p>
                <p class="text-sm"><strong>Recommended amendments:</strong> ${data.soilCompatibility.organicAmendments}</p>
              </div>

              <div class="border-t pt-4">
                <h3 class="font-bold text-green-800 mb-2">🧪 Sustainable Fertilizing & IPM Guidance</h3>
                <p class="text-sm"><strong>Organic/Bio First Choice:</strong> ${data.sustainableFertilizer.firstChoiceOrganic}</p>
                <p class="text-sm"><strong>Mineral Secondary Option:</strong> ${data.sustainableFertilizer.secondChoiceMineral}</p>
                <p class="text-sm"><strong>Methodology:</strong> ${data.sustainableFertilizer.applicationMethod}</p>
                <p class="text-sm"><strong>IPM Companion Recommendation:</strong> ${data.sustainableFertilizer.companionPlanting}</p>
                <p class="text-sm text-yellow-800 italic bg-yellow-50 p-2 rounded border border-yellow-200 mt-2"><strong>Caution:</strong> ${data.sustainableFertilizer.environmentalCaution}</p>
              </div>

              <div class="bg-green-50 border border-green-200 rounded p-4 text-xs text-green-900 mt-6">
                <strong>Environmental Commitment Note:</strong> ${data.environmentalImpactNote}
              </div>
            </div>

            <div class="text-center text-[10px] text-gray-400 mt-8 border-t pt-4 no-print">
              Generated by Krishi Saathi Platform. Use responsibly. Press Ctrl+P or Command+P to print or save.
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-md max-w-2xl mx-auto" id="field-guide-card-layout">
      {/* Photo Header */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img src={photoUrl} alt="Identified Plant" className="w-full h-full object-cover" />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            {data.identity.plantType}
          </span>
          <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Conf: {data.identity.confidenceScore}%
          </span>
        </div>

        {/* Float Speech Button */}
        <button
          onClick={speakPlantSummary}
          className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg border transition-all ${
            isPlayingSpeech 
              ? "bg-rose-500 text-white border-rose-400 animate-pulse" 
              : "bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-100"
          }`}
          title="Listen to identity summary"
          id="btn-tts-guide"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {/* Titles */}
        <div className="mb-5 border-b border-gray-50 pb-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-1">Botanical Specimen</p>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {data.identity.commonName}
              </h2>
              <h4 className="italic text-emerald-700 font-medium text-sm mt-0.5">
                {data.identity.scientificName}
              </h4>
            </div>
            
            {/* Download Report */}
            <button
              onClick={downloadReportPDF}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-700 p-2.5 rounded-xl border border-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Download PDF Field Report"
              id="btn-download-pdf-report"
            >
              <FileDown className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>

          {/* Prominent Local Name */}
          {getLocalName() && (
            <div className="mt-3 bg-emerald-50/70 border border-emerald-100/50 rounded-2xl px-4 py-2.5 inline-flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-emerald-800 font-medium">Local name:</span>
              <span className="text-sm font-bold text-emerald-900">{getLocalName()}</span>
            </div>
          )}
        </div>

        {/* Collapsible Accordion Sections */}
        <div className="space-y-3">
          {/* Section 1: Botanical Info */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection("botanical")}
              className="w-full text-left px-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 flex justify-between items-center transition-all"
            >
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                Botanical Profile
              </span>
              <span className="text-slate-400 text-xs">{openSection === "botanical" ? "Collapse" : "Expand"}</span>
            </button>

            {openSection === "botanical" && (
              <div className="p-4 bg-white text-xs text-slate-600 space-y-2 leading-relaxed border-t border-gray-100">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> <strong>Native:</strong> {data.botanicalInfo.nativeRegion}</div>
                  <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400" /> <strong>Family:</strong> {data.identity.family}</div>
                  <div className="flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-slate-400" /> <strong>Season:</strong> {data.botanicalInfo.growingSeasonIndia}</div>
                  <div className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-slate-400" /> <strong>Sunlight:</strong> {data.botanicalInfo.sunlight}</div>
                  <div className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-slate-400" /> <strong>Watering:</strong> {data.botanicalInfo.waterRequirement}</div>
                  <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400" /> <strong>Lifespan:</strong> {data.botanicalInfo.lifecycleDuration}</div>
                </div>
                <div className="pt-2 border-t border-slate-50">
                  <strong>Habit & Form:</strong> {data.identity.growthHabit}
                </div>
                <div>
                  <strong>Primary Benefits:</strong> {data.botanicalInfo.beneficialUses}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Soil Compatibility */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection("soil")}
              className="w-full text-left px-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 flex justify-between items-center transition-all"
            >
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                Soil Compatibility Check
              </span>
              <span className="text-slate-400 text-xs">{openSection === "soil" ? "Collapse" : "Expand"}</span>
            </button>

            {openSection === "soil" && (
              <div className="p-4 bg-white text-xs text-slate-600 space-y-2 border-t border-gray-100">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 mb-2">
                  <span>Soil Compatibility Rating</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">{data.soilCompatibility.compatibilityScore}</span>
                </div>
                <p><strong>Ideal pH Range:</strong> {data.soilCompatibility.idealPhRange}</p>
                <p><strong>Ideal Texture:</strong> {data.soilCompatibility.idealSoilTexture}</p>
                <p><strong>Nutrient Band:</strong> {data.soilCompatibility.idealNutrients}</p>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-500">
                  {data.soilCompatibility.soilMatchExplanation}
                </p>
                <p><strong>Sustainable Amendments:</strong> {data.soilCompatibility.organicAmendments}</p>
              </div>
            )}
          </div>

          {/* Section 3: Sustainable Fertilizer & Treatments */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection("fertilizer")}
              className="w-full text-left px-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 flex justify-between items-center transition-all"
            >
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Sustainable Fertilizer & Eco Guides
              </span>
              <span className="text-slate-400 text-xs">{openSection === "fertilizer" ? "Collapse" : "Expand"}</span>
            </button>

            {openSection === "fertilizer" && (
              <div className="p-4 bg-white text-xs text-slate-600 space-y-2.5 border-t border-gray-100">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                  <strong>First Choice (Organic / Bio-based):</strong> {data.sustainableFertilizer.firstChoiceOrganic}
                </div>
                <div>
                  <strong>Second Choice (Minimalist Mineral Option):</strong> {data.sustainableFertilizer.secondChoiceMineral}
                </div>
                <div>
                  <strong>Eco Application Method:</strong> {data.sustainableFertilizer.applicationMethod}
                </div>
                <div className="p-2.5 bg-yellow-50 text-yellow-800 border border-yellow-100 rounded-xl flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pollinator & Runoff Warnings:</strong> {data.sustainableFertilizer.environmentalCaution}
                  </div>
                </div>
                <div>
                  <strong>Companion Sowing & Nitrogen Fixation:</strong> {data.sustainableFertilizer.companionPlanting}
                </div>
                <div className="text-slate-500 font-medium">
                  <strong>Cost Matrix:</strong> {data.sustainableFertilizer.estimatedCostComparison}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Pest & Disease Reference */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection("disease")}
              className="w-full text-left px-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 flex justify-between items-center transition-all"
            >
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                Species Disease Reference
              </span>
              <span className="text-slate-400 text-xs">{openSection === "disease" ? "Collapse" : "Expand"}</span>
            </button>

            {openSection === "disease" && (
              <div className="p-4 bg-white text-xs text-slate-600 space-y-2 border-t border-gray-100">
                <p><strong>Susceptible Diseases / Pests:</strong> {data.diseaseSusceptibility.commonDiseases}</p>
                <p><strong>Early Warning Indicators:</strong> {data.diseaseSusceptibility.earlyWarningSigns}</p>
                {data.diseaseSusceptibility.isCurrentlyDiseased && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 mt-2">
                    <strong>Disease Detected in Image:</strong> {data.diseaseSusceptibility.visibleSymptoms}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Environmental Impact Note */}
        <div className="mt-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 flex gap-2">
          <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider mb-0.5">Soil-Safe Farming Commitment</span>
            <span className="text-[11px] text-emerald-900 leading-normal block">
              {data.environmentalImpactNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
