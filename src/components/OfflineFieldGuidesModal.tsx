import React, { useState, useEffect } from "react";
import { 
  X, 
  Wifi, 
  WifiOff, 
  DownloadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  BookOpen, 
  Leaf, 
  Bug, 
  Sparkles, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  HardDrive,
  Clock,
  ShieldCheck
} from "lucide-react";
import { 
  getCachedFieldGuides, 
  cacheAllCriticalGuides, 
  getOfflineConfig, 
  saveOfflineConfig, 
  setSimulatedOffline, 
  getEffectiveOnlineStatus,
  getOfflineCacheStats,
  OfflineCacheStats
} from "../utils/offlineCacheManager.ts";
import { CriticalFieldGuide } from "../data/criticalFieldGuidesData.ts";
import { Bi } from "./Bilingual.tsx";

interface OfflineFieldGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilter?: string;
}

export default function OfflineFieldGuidesModal({ isOpen, onClose, initialFilter }: OfflineFieldGuidesModalProps) {
  const [guides, setGuides] = useState<CriticalFieldGuide[]>([]);
  const [stats, setStats] = useState<OfflineCacheStats>(getOfflineCacheStats());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const reloadData = () => {
    setGuides(getCachedFieldGuides());
    setStats(getOfflineCacheStats());
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
      if (initialFilter) {
        setSelectedCategory(initialFilter);
      }
    }
  }, [isOpen, initialFilter]);

  useEffect(() => {
    const handleUpdate = () => reloadData();
    window.addEventListener("krishi-offline-cache-updated", handleUpdate);
    window.addEventListener("krishi-network-status-changed", handleUpdate);
    return () => {
      window.removeEventListener("krishi-offline-cache-updated", handleUpdate);
      window.removeEventListener("krishi-network-status-changed", handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleToggleCache = () => {
    const nextState = !stats.isEnabled;
    saveOfflineConfig({ enabled: nextState });
    if (nextState) {
      cacheAllCriticalGuides();
      setSyncToast("Offline Cache Mode enabled! All critical guides are stored on this device.");
    } else {
      setSyncToast("Offline Cache Mode disabled.");
    }
    setTimeout(() => setSyncToast(null), 3500);
    reloadData();
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const res = cacheAllCriticalGuides();
      setIsSyncing(false);
      setSyncToast(`Cache Updated! ${res.count} critical guides verified offline.`);
      setTimeout(() => setSyncToast(null), 3500);
      reloadData();
    }, 600);
  };

  const handleToggleSimulated = () => {
    const next = !stats.isSimulatedOffline;
    setSimulatedOffline(next);
    reloadData();
  };

  const filteredGuides = guides.filter((g) => {
    const matchesCategory = selectedCategory === "all" || g.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      g.titleEn.toLowerCase().includes(q) ||
      g.titleHi.toLowerCase().includes(q) ||
      g.cropOrSubject.toLowerCase().includes(q) ||
      g.summaryEn.toLowerCase().includes(q) ||
      g.summaryHi.toLowerCase().includes(q) ||
      g.immediateSteps.some(s => s.stepEn.toLowerCase().includes(q) || (s.stepHi || s.hi || "").toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", labelEn: "All Critical Guides", labelHi: "सभी गाइड्स", count: guides.length },
    { id: "crops", labelEn: "Major Crops", labelHi: "प्रमुख फसलें", count: guides.filter(g => g.category === "crops").length },
    { id: "disease_pest", labelEn: "Disease & Pest IPM", labelHi: "रोग व कीट", count: guides.filter(g => g.category === "disease_pest").length },
    { id: "bio_inputs", labelEn: "Bio-Inputs & Organic", labelHi: "जैविक खाद/अर्क", count: guides.filter(g => g.category === "bio_inputs").length },
    { id: "livestock", labelEn: "Animal Husbandry", labelHi: "पशुपालन व मत्स्य", count: guides.filter(g => g.category === "livestock").length },
    { id: "custom_scan", labelEn: "My Field Scans", labelHi: "स्कैन किए गए पौधे", count: guides.filter(g => g.category === "custom_scan").length }
  ].filter(c => c.count > 0 || c.id === "all");

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        id="offline-field-guides-modal"
      >
        {/* Header Section */}
        <div className="bg-stone-50 border-b border-stone-200 p-4 md:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 leading-tight">
                  <Bi en="Critical Field Guides (Offline Ready)" sub="महत्वपूर्ण कृषि फील्ड गाइड्स (ऑफ़लाइन उपलब्ध)" />
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  Offline Cache Ready
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                <Bi 
                  en="Fully accessible in remote fields with zero internet or patchy connectivity" 
                  sub="खेत में बिना इंटरनेट या कमजोर नेटवर्क में भी संपूर्ण सामग्री उपलब्ध" 
                />
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            title="Close"
            id="btn-close-offline-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Toast Notification */}
        {syncToast && (
          <div className="bg-emerald-800 text-white text-xs px-4 py-2.5 flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{syncToast}</span>
            </div>
            <button 
              onClick={() => setSyncToast(null)} 
              className="text-emerald-200 hover:text-white text-[11px] font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Cache Control & Network Bar */}
        <div className="bg-emerald-950 text-white px-4 md:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-stone-200">
                <Bi en="Offline Cache:" sub="ऑफ़लाइन कैश:" />
              </span>
              <button
                onClick={handleToggleCache}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  stats.isEnabled 
                    ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400" 
                    : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                }`}
                id="btn-toggle-cache-mode"
              >
                {stats.isEnabled ? "ACTIVE (सक्रिय)" : "DISABLED (निष्क्रिय)"}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-stone-300 border-l border-emerald-800 pl-3">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">
                {stats.totalCached} guides ({stats.storageSizeKb} KB saved locally)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Force Sync button */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
              title="Re-sync latest manuals to local memory"
              id="btn-force-cache-sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <Bi en="Sync Cache" sub="कैश रिफ्रेश करें" />
            </button>

            {/* Simulated Offline Toggle for verification */}
            <button
              onClick={handleToggleSimulated}
              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1.5 transition-colors ${
                stats.isSimulatedOffline
                  ? "bg-amber-400 text-amber-950 font-bold hover:bg-amber-300"
                  : "bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800"
              }`}
              title="Simulate disconnected network to test offline field operation"
              id="btn-toggle-simulated-offline"
            >
              {stats.isSimulatedOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Simulated Offline (Active)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Test Offline Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="p-4 border-b border-stone-200 space-y-3 bg-white shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, disease symptom, pest, remedy, or animal..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:border-emerald-600 outline-none transition-all"
              id="input-search-offline-guides"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium text-xs transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Bi en={cat.labelEn} sub={cat.labelHi} />
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? "bg-emerald-800 text-white" : "bg-stone-200 text-stone-600"
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Guides Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-stone-50/50">
          {filteredGuides.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-sm">
                <Bi en="No matching offline guides found" sub="कोई मेल खाने वाला ऑफ़लाइन गाइड नहीं मिला" />
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                <Bi 
                  en="Try clearing your search query or select another category filter." 
                  sub="खोज शब्द बदलें या अन्य श्रेणी चुनें।" 
                />
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredGuides.map((guide) => {
              const isExpanded = expandedId === guide.id;
              return (
                <div 
                  key={guide.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all shadow-2xs overflow-hidden"
                  id={`offline-guide-card-${guide.id}`}
                >
                  {/* Card Header */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                    className="p-4 md:p-5 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-stone-50/70 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          guide.urgency === "critical"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : guide.urgency === "high"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}>
                          {guide.urgency} Priority
                        </span>

                        <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          {guide.cropOrSubject}
                        </span>

                        <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                          {guide.seasonOrStage}
                        </span>

                        {guide.isCustom && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                            Custom Farm Scan
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-stone-900 leading-snug">
                        <Bi en={guide.titleEn} sub={guide.titleHi} />
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        <Bi en={guide.summaryEn} sub={guide.summaryHi} />
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">
                        {isExpanded ? "Hide Details" : "View Protocol"}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 md:px-5 space-y-4 border-t border-stone-100 bg-stone-50/40">
                      {/* Key Symptoms / Identification */}
                      {guide.symptomsOrKeyIndicators && guide.symptomsOrKeyIndicators.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Bug className="w-3.5 h-3.5 text-amber-600" />
                            <Bi en="Field Identification & Warning Symptoms" sub="खेत में पहचान व प्रारंभिक लक्षण" />
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {guide.symptomsOrKeyIndicators.map((sym, idx) => (
                              <div key={idx} className="bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-700">
                                <span className="font-semibold text-amber-800 block mb-0.5">• Symptom {idx + 1}:</span>
                                <Bi en={sym.en} sub={sym.hi} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Immediate Emergency Steps Checklist */}
                      <div>
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <Bi en="Immediate Emergency Action Steps" sub="तत्काल किए जाने वाले प्राथमिक कार्य" />
                        </h4>
                        <div className="space-y-1.5">
                          {guide.immediateSteps.map((step, idx) => (
                            <div key={idx} className="bg-white border border-stone-200 rounded-xl p-3 text-xs flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="text-stone-700 leading-relaxed font-medium">
                                <Bi en={step.stepEn} sub={step.stepHi || step.hi} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dosage / Application Schedule */}
                      {guide.dosageOrSchedule && guide.dosageOrSchedule.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <Bi en="Dosage & Application Schedule" sub="अनुशंसित मात्रा एवं छिड़काव समय" />
                          </h4>
                          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                            {guide.dosageOrSchedule.map((d, idx) => (
                              <div key={idx} className="p-2.5 flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-4">
                                <span className="font-bold text-stone-800">
                                  <Bi en={d.itemEn} sub={d.itemHi} />
                                </span>
                                <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded-md text-[11px] self-start sm:self-auto">
                                  {d.dose}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Organic Bio-Remedy Alternative */}
                      {guide.organicRemedyEn && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950">
                          <strong className="block font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                            <Bi en="Natural / Organic Bio-Remedy Alternative" sub="प्राकृतिक एवं जैविक विकल्प" />
                          </strong>
                          <p className="leading-relaxed font-medium">
                            <Bi en={guide.organicRemedyEn} sub={guide.organicRemedyHi} />
                          </p>
                        </div>
                      )}

                      {/* Emergency Helpline */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs text-stone-500">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                          <span className="font-semibold text-stone-700">
                            <Bi en="Emergency Support:" sub="आपातकालीन संपर्क:" />
                          </span>
                          <span className="font-bold text-stone-900">{guide.emergencyContact}</span>
                        </div>

                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Locally Stored in Device RAM/Storage</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-stone-50 border-t border-stone-200 p-3.5 px-4 md:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 shrink-0">
          <span className="text-[11px]">
            <Bi 
              en="💡 Tip: Cached field guides work even when airplane mode is on in remote farm locations." 
              sub="💡 सुझाव: रिमोट खेत में हवाई जहाज मोड (Airplane Mode) में भी ये गाइड्स हमेशा खुलेंगी।" 
            />
          </span>

          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all ml-auto"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
