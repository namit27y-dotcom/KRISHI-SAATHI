import React, { useState, useEffect } from "react";
import { Bi } from "../Bilingual";
import { useLanguage } from "../../contexts/LanguageContext";
import { 
  LIVESTOCK_CATEGORIES, 
  LESSONS_DATABASE 
} from "../../data/livestockData";
import { 
  LivestockCategoryCode, 
  User 
} from "../../types";
import { LivestockCourseViewer } from "./LivestockCourseViewer";
import { LivestockCalculators } from "./LivestockCalculators";
import { LivestockIntegratedGuide } from "./LivestockIntegratedGuide";
import { LivestockAdminCMS } from "./LivestockAdminCMS";
import { 
  BookOpen, 
  Calculator, 
  Repeat, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  Bot, 
  Search,
  Filter,
  ShieldCheck,
  Star,
  Activity
} from "lucide-react";

interface Props {
  currentUser?: User | null;
  onOpenAIChat?: (prompt?: string) => void;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  dairy: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80",
  sheep: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&auto=format&fit=crop&q=80",
  goat: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80",
  poultry: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80",
  pig: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=80",
  beekeeping: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=800&auto=format&fit=crop&q=80",
  fisheries: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  integrated: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
};

export const LivestockDashboard: React.FC<Props> = ({ currentUser, onOpenAIChat }) => {
  const { language } = useLanguage();
  
  // Navigation sub-tab
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "calculators" | "integrated" | "admin">("overview");
  
  // Category selected for course view
  const [selectedCategory, setSelectedCategory] = useState<LivestockCategoryCode | null>(null);

  // Farming interests personalization
  const [userInterests, setUserInterests] = useState<LivestockCategoryCode[]>(() => {
    try {
      const saved = localStorage.getItem("krishi_farming_interests");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ["dairy", "fisheries", "goat"];
  });

  // Track completed lessons
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("krishi_completed_livestock_lessons");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ["lsn-dairy-1"]; // seed initial progress
  });

  // Category filter in overview
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleInterest = (code: LivestockCategoryCode) => {
    setUserInterests((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code];
      try {
        localStorage.setItem("krishi_farming_interests", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId) 
        ? prev.filter((id) => id !== lessonId) 
        : [...prev, lessonId];
      try {
        localStorage.setItem("krishi_completed_livestock_lessons", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Calculate progress for each category
  const getCategoryProgress = (code: LivestockCategoryCode) => {
    const lessons = LESSONS_DATABASE[code] || [];
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  // Quick AI inquiries
  const quickInquiries = [
    {
      en: "What should I feed my sheep for optimal weight gain?",
      hi: "भेड़ का वजन तेजी से बढ़ाने के लिए क्या आहार देना चाहिए?",
      category: "sheep"
    },
    {
      en: "How should I prepare and lime my fish pond before stocking?",
      hi: "मछली जीरा डालने से पहले तालाब की तैयारी और चूना कैसे डालें?",
      category: "fisheries"
    },
    {
      en: "What are the warning signs of Newcastle (Ranikhet) disease in poultry?",
      hi: "मुर्गियों में रानीखेत रोग के प्रारंभिक लक्षण और बचाव के उपाय क्या हैं?",
      category: "poultry"
    },
    {
      en: "How can I manage high-yield dairy cattle feed during hot summers?",
      hi: "गर्मियों में दुधारू गायों का दूध घटने से रोकने के लिए क्या खिलाएं?",
      category: "dairy"
    },
    {
      en: "What are the advantages of elevated slatted flooring in goat sheds?",
      hi: "बकरी शेड में जमीन से ऊपर मचान (Slatted) फर्श के क्या लाभ हैं?",
      category: "goat"
    }
  ];

  // If a category is selected for detailed course learning, render the Course Viewer
  if (selectedCategory) {
    return (
      <LivestockCourseViewer
        selectedCategory={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        completedLessonIds={completedLessonIds}
        onToggleComplete={handleToggleCompleteLesson}
        onOpenAIQuery={(prompt) => {
          if (onOpenAIChat) onOpenAIChat(prompt);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wide text-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <Bi en="Krishi Saathi Animal & Fish Husbandry Wing" sub="कृषि साथी पशुपालन एवं मत्स्य प्रभाग" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            <Bi 
              en="Animal & Fish Farming" 
              sub="पशुपालन एवं मत्स्य पालन" 
            />
          </h1>

          <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
            <Bi 
              en="Comprehensive scientific education, video courses, disease biosecurity, economic calculators, and AI assistance for Dairy, Sheep, Goat, Poultry, Pigs, Beekeeping, Fisheries, and Integrated Circular Systems." 
              sub="डेयरी, भेड़, बकरी, मुर्गी, सूअर, मधुमक्खी, मत्स्य पालन और एकीकृत चक्रीय खेती के लिए वैज्ञानिक प्रशिक्षण, वीडियो पाठ, आर्थिक कैलकुलेटर एवं AI सहायता।" 
            />
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>
                <strong>8</strong> <Bi en="Sectors" sub="क्षेत्र" inline />
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <Award className="w-4 h-4 text-amber-300" />
              <span>
                <strong>{completedLessonIds.length}</strong> <Bi en="Lessons Completed" sub="पाठ पूर्ण" inline />
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <Calculator className="w-4 h-4 text-teal-300" />
              <span>
                <strong>5</strong> <Bi en="Calculators" sub="कैलकुलेटर" inline />
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "overview"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <Bi en="Farming Sectors & Courses" sub="खेती क्षेत्र एवं पाठ्यक्रम" />
          </button>

          <button
            onClick={() => setActiveSubTab("calculators")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "calculators"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <Bi en="Cost & Profit Calculators" sub="लागत एवं लाभ कैलकुलेटर" />
          </button>

          <button
            onClick={() => setActiveSubTab("integrated")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "integrated"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Repeat className="w-4 h-4" />
            <Bi en="Integrated Circular Farming" sub="एकीकृत चक्रीय खेती" />
          </button>

          <button
            onClick={() => setActiveSubTab("admin")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "admin"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <Bi en="Admin CMS" sub="एडमिन CMS" />
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeSubTab === "calculators" && <LivestockCalculators />}

      {activeSubTab === "integrated" && <LivestockIntegratedGuide />}

      {activeSubTab === "admin" && <LivestockAdminCMS />}

      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* User Farming Interests Selector */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-bold text-stone-900">
                  <Bi en="Your Farming Interests" sub="आपकी खेती की रुचियाँ" />
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                <Bi en="Select your active livestock sectors to prioritize recommendations" sub="प्राथमिकता देने के लिए अपने सक्रिय पशुपालन क्षेत्र चुनें" />
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {LIVESTOCK_CATEGORIES.map((cat) => {
                const isSelected = userInterests.includes(cat.code);
                return (
                  <button
                    key={cat.code}
                    onClick={() => handleToggleInterest(cat.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-800 border-emerald-400 font-bold"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-600" : "bg-stone-300"}`} />
                    <Bi 
                      en={cat.nameEn} 
                      sub={cat.nameRegional[language] || cat.nameRegional.hi} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick AI Farming Inquiry Bar */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Bot className="w-4 h-4 text-emerald-600" />
                <Bi en="Instant AI Livestock & Fish Advisory" sub="त्वरित AI पशुपालन एवं मत्स्य परामर्श" />
              </div>
              <span className="text-[11px] text-emerald-700">
                <Bi en="Bilingual AI Assistant" sub="द्विभाषी AI सहायक" />
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {quickInquiries.map((inq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onOpenAIChat) {
                      onOpenAIChat(inq.en);
                    }
                  }}
                  className="bg-white hover:bg-emerald-100/60 text-stone-800 border border-emerald-200/80 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all text-left shadow-2xs shrink-0"
                >
                  <Bi en={inq.en} sub={inq.hi} />
                </button>
              ))}
            </div>
          </div>

          {/* 8 Main Farming Categories Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bi en="Livestock & Aquaculture Categories" sub="पशुपालन एवं मत्स्य पालन श्रेणियां" />
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                8 <Bi en="Disciplines" sub="प्रभाग" inline />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {LIVESTOCK_CATEGORIES.map((cat) => {
                const progress = getCategoryProgress(cat.code);
                const isPreferred = userInterests.includes(cat.code);

                return (
                  <div
                    key={cat.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:shadow-md ${
                      isPreferred ? "border-emerald-300 ring-1 ring-emerald-200" : "border-stone-200"
                    }`}
                  >
                    {/* Image & Badge */}
                    <div className="relative h-40 overflow-hidden bg-stone-100">
                      <img
                        src={cat.imageUrl}
                        alt={cat.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {isPreferred && (
                        <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          <Bi en="Interested" sub="रुचि" />
                        </div>
                      )}

                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <h4 className="font-bold text-base leading-tight text-white drop-shadow-sm">
                          <Bi 
                            en={cat.nameEn} 
                            sub={cat.nameRegional[language] || cat.nameRegional.hi} 
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        <Bi 
                          en={cat.descriptionEn} 
                          sub={cat.descriptionRegional[language] || cat.descriptionRegional.hi} 
                        />
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-stone-500 font-medium">
                          <span><Bi en="Learning Progress" sub="प्रगति" /></span>
                          <span className="font-bold text-emerald-700">{progress}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Action CTA */}
                      <button
                        onClick={() => setSelectedCategory(cat.code)}
                        className="w-full mt-2 bg-emerald-50 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Bi en="Open Lessons & Videos" sub="पाठ्यक्रम एवं वीडियो देखें" />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
