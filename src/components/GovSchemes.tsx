import React, { useState } from "react";
import axios from "axios";
import { 
  FileText, 
  Search, 
  ExternalLink, 
  Calendar, 
  CheckSquare, 
  ArrowRight, 
  Sparkles, 
  Loader2 
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.tsx";

interface Scheme {
  name: string;
  eligibility: string;
  benefits: string;
  requiredDocuments: string;
  officialLink: string;
  lastApplicationDate: string;
}

interface SchemeResult {
  matchingSchemes: Scheme[];
  personalizedAdvice: string;
}

interface GovSchemesProps {
  userState?: string;
  userCrop?: string;
  userLandArea?: number;
  userId?: string;
}

export default function GovSchemes({
  userState = "Maharashtra",
  userCrop = "Cotton",
  userLandArea = 1.5,
  userId
}: GovSchemesProps) {
  const { t, language } = useLanguage();
  const scT = t.schemes;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchemeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predefinedSchemes = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      desc: "Income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
      type: "Income Support"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana (PM-FBY)",
      desc: "Crop insurance supporting farmers against yield loss due to natural calamities, pests or diseases.",
      type: "Crop Insurance"
    },
    {
      name: "Soil Health Card Scheme",
      desc: "Balanced fertilizer application based on macro & micronutrient soil tests issued every 2 years.",
      type: "Soil Management"
    },
    {
      name: "Per Drop More Crop (Micro Irrigation)",
      desc: "Subsidies of up to 55% for small and marginal farmers to install drip or sprinkler irrigation systems.",
      type: "Subsidy"
    }
  ];

  const handleSearch = async (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = customQuery || query;
    if (!searchQuery && !customQuery) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.post("/api/schemes/query", {
        query: searchQuery,
        state: userState,
        crop: userCrop,
        landSize: userLandArea,
        userId,
        preferredLanguage: language
      });

      setResult(res.data.result);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to search government schemes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="gov-schemes-module">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1.5">
            <FileText className="w-5 h-5 text-emerald-600" />
            {scT.title}
          </h3>
          <p className="text-xs text-slate-400">
            {scT.subtitle} ({userLandArea} Acres, {userState})
          </p>
        </div>

        {/* Query Input */}
        <form onSubmit={(e) => handleSearch(e)} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={scT.searchPlaceholder}
            className="w-full pl-10 pr-28 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
            id="btn-scheme-search"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {scT.queryAi}
          </button>
        </form>

        {/* Quick Query Shortcuts */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={(e) => { setQuery("Subsidies for micro drip irrigation"); handleSearch(e, "Subsidies for micro drip irrigation"); }}
              className="text-[10px] bg-slate-50 hover:bg-slate-100 border text-slate-600 px-3 py-1.5 rounded-full transition-all"
            >
              Drip Subsidies
            </button>
            <button
              onClick={(e) => { setQuery("Eligibility for small farmers crop insurance PM-FBY"); handleSearch(e, "Eligibility for small farmers crop insurance PM-FBY"); }}
              className="text-[10px] bg-slate-50 hover:bg-slate-100 border text-slate-600 px-3 py-1.5 rounded-full transition-all"
            >
              Crop Insurance (PM-FBY)
            </button>
            <button
              onClick={(e) => { setQuery("How to get free soil health testing card"); handleSearch(e, "How to get free soil health testing card"); }}
              className="text-[10px] bg-slate-50 hover:bg-slate-100 border text-slate-600 px-3 py-1.5 rounded-full transition-all"
            >
              Soil Health Card
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 text-center">
            {error}
          </div>
        )}

        {/* Predefined directory shown if no active query result */}
        {!result && !loading && (
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Popular National Initiatives</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedSchemes.map((sch, i) => (
                <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col justify-between text-xs space-y-2">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1.5">{sch.type}</span>
                    <h5 className="font-bold text-slate-800 leading-tight">{sch.name}</h5>
                    <p className="text-slate-500 leading-relaxed text-[11px] mt-1">{sch.desc}</p>
                  </div>
                  <button 
                    onClick={(e) => { setQuery(`Tell me about ${sch.name}`); handleSearch(e, `Tell me about ${sch.name}`); }}
                    className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 hover:underline mt-2 self-start"
                  >
                    {scT.eligibilityCheck} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Results */}
        {result && !loading && (
          <div className="space-y-6 border-t border-slate-100 pt-6 animate-fade-in">
            {/* Advice banner */}
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-100/50 text-xs flex gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-800">{scT.eligibilityCheck}</span>
                <p className="text-[11px] leading-relaxed mt-0.5">{result.personalizedAdvice}</p>
              </div>
            </div>

            {/* Scheme Cards */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Matched Schemes</h4>
              {result.matchingSchemes?.map((sch, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100/70 text-xs space-y-3.5 relative overflow-hidden">
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="font-bold text-slate-900 text-sm leading-tight max-w-[80%]">{sch.name}</h5>
                    <a
                      href={sch.officialLink || "https://pmkisan.gov.in/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 p-1.5 rounded-lg bg-white border border-slate-100 shadow-sm"
                      title={scT.applyOnPortal}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <strong className="text-slate-500 block text-[10px] uppercase font-mono">{scT.criteria}:</strong>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{sch.eligibility}</p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-slate-500 block text-[10px] uppercase font-mono">{scT.benefits}:</strong>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{sch.benefits}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white border rounded-xl space-y-1">
                    <strong className="text-slate-500 block text-[10px] uppercase font-mono flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> {scT.documents}:
                    </strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed pl-4.5">{sch.requiredDocuments}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: 
                      <strong className="text-rose-600">{sch.lastApplicationDate}</strong>
                    </span>
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-mono">Gov Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
