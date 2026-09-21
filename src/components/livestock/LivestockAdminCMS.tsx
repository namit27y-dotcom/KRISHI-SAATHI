import React, { useState } from "react";
import { Bi } from "../Bilingual";
import { useLanguage } from "../../contexts/LanguageContext";
import { 
  Plus, 
  Settings, 
  CheckCircle2, 
  FileText, 
  Video, 
  Globe2, 
  Layers, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Code
} from "lucide-react";
import { LIVESTOCK_CATEGORIES, LESSONS_DATABASE } from "../../data/livestockData";
import { LivestockCategoryCode, Lesson, SupportedLanguage } from "../../types";

export const LivestockAdminCMS: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<LivestockCategoryCode>("dairy");
  const [lessonsList, setLessonsList] = useState<Lesson[]>(LESSONS_DATABASE.dairy || []);
  
  // New Lesson form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleHi, setNewTitleHi] = useState("");
  const [newDescEn, setNewDescEn] = useState("");
  const [newDescHi, setNewDescHi] = useState("");
  const [newDuration, setNewDuration] = useState(15);
  const [newVideoUrl, setNewVideoUrl] = useState("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  const [newSafetyEn, setNewSafetyEn] = useState("");
  const [newSafetyHi, setNewSafetyHi] = useState("");

  const handleCategorySwitch = (cat: LivestockCategoryCode) => {
    setSelectedCat(cat);
    setLessonsList(LESSONS_DATABASE[cat] || []);
    setIsAddingNew(false);
  };

  const handleTogglePublish = (lessonId: string) => {
    setLessonsList((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, isPublished: !l.isPublished } : l))
    );
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleEn.trim()) return;

    const newLesson: Lesson = {
      id: `lsn-${selectedCat}-${Date.now().toString().slice(-4)}`,
      moduleId: `mod-${selectedCat}-custom`,
      categoryId: selectedCat,
      orderNumber: lessonsList.length + 1,
      titleEn: newTitleEn,
      titleRegional: {
        en: newTitleEn,
        hi: newTitleHi || newTitleEn,
        mr: newTitleHi || newTitleEn,
        mai: newTitleHi || newTitleEn,
        bho: newTitleHi || newTitleEn,
        pa: newTitleEn,
        ta: newTitleEn,
        te: newTitleEn,
        bn: newTitleEn,
        es: newTitleEn,
        vi: newTitleEn,
        sw: newTitleEn
      },
      descriptionEn: newDescEn,
      descriptionRegional: {
        en: newDescEn,
        hi: newDescHi || newDescEn,
        mr: newDescHi || newDescEn,
        mai: newDescHi || newDescEn,
        bho: newDescHi || newDescEn,
        pa: newDescEn,
        ta: newDescEn,
        te: newDescEn,
        bn: newDescEn,
        es: newDescEn,
        vi: newDescEn,
        sw: newDescEn
      },
      durationMinutes: newDuration,
      keyPointsEn: ["Key fundamental concept covered in this module."],
      keyPointsRegional: {
        en: ["Key fundamental concept covered in this module."],
        hi: ["इस मॉड्यूल में प्रमुख महत्वपूर्ण सिद्धांत सिखाया गया है।"],
        mr: ["या मॉड्युलमध्ये मुख्य संकल्पना स्पष्ट केली आहे."],
        mai: ["एहि मॉड्यूल मे मुख्य सिद्धांत सिखाओल गेल अछि।"],
        bho: ["एह मॉड्यूल में मुख्य सिद्धांत सिखावल गइल बा।"],
        pa: ["ਇਸ ਮੋਡੀਊਲ ਵਿੱਚ ਮੁੱਖ ਧਾਰਨਾ ਸਿਖਾਈ ਗਈ ਹੈ।"],
        ta: ["இந்த தொகுதியில் முக்கிய கருத்து கற்பிக்கப்படுகிறது."],
        te: ["ఈ మాడ్యూల్లో కీలకమైన అంశం వివరించబడింది."],
        bn: ["এই মডিউলে মূল ধারণাটি শেখানো হয়েছে।"],
        es: ["Concepto fundamental clave cubierto en este módulo."],
        vi: ["Khái niệm cơ bản chính trong bài học này."],
        sw: ["Dhana kuu ya msingi iliyofundishwa katika somo hili."]
      },
      safetyNotesEn: newSafetyEn || "Follow strict sanitation and biosecurity precautions.",
      safetyNotesRegional: {
        en: newSafetyEn || "Follow strict sanitation and biosecurity precautions.",
        hi: newSafetyHi || "सख्त स्वच्छता और जैव सुरक्षा नियमों का पालन करें।",
        mr: newSafetyHi || "कडक स्वच्छता आणि जैवसुरक्षा नियमांचे पालन करा.",
        mai: newSafetyHi || "सख्त स्वच्छता आ जैव सुरक्षा नियमक पालन करू।",
        bho: newSafetyHi || "सख्त सफाई आ जैव सुरक्षा के नियम मानीं।",
        pa: newSafetyEn || "ਸਖ਼ਤ ਸਫਾਈ ਅਤੇ ਬਾਇਓਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।",
        ta: newSafetyEn || "கடுமையான சுகாதாரம் மற்றும் உயிர் பாதுகாப்பு முன்னெச்சரிக்கைகளைப் பின்பற்றவும்.",
        te: newSafetyEn || "కఠినమైన పరిశుభ్రత మరియు బయోసెక్యూరిటీ నిబంధనలను పాటించండి.",
        bn: newSafetyEn || "কঠোর পরিচ্ছন্নতা ও জৈব নিরাপত্তা মেনে চলুন।",
        es: newSafetyEn || "Siga estrictas precauciones de saneamiento y bioseguridad.",
        vi: newSafetyEn || "Tuân thủ nghiêm ngặt các biện pháp vệ sinh và an toàn sinh học.",
        sw: newSafetyEn || "Fuata tahadhari kali za usafi na usalama wa kibiolojia."
      },
      video: {
        id: `vid-${Date.now()}`,
        lessonId: `lsn-${selectedCat}-${Date.now().toString().slice(-4)}`,
        videoUrl: newVideoUrl,
        durationSeconds: newDuration * 60,
        isConfigurable: true
      },
      isPublished: true
    };

    setLessonsList((prev) => [...prev, newLesson]);
    setIsAddingNew(false);
    setNewTitleEn("");
    setNewTitleHi("");
    setNewDescEn("");
    setNewDescHi("");
    setNewSafetyEn("");
    setNewSafetyHi("");
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Settings className="w-5 h-5 text-emerald-600" />
            <Bi en="Admin Content Management Architecture" sub="एडमिन सामग्री प्रबंधन वास्तुकला (CMS)" />
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            <Bi 
              en="Manage category lessons, bilingual translations (EN/HI/MR/MAI/BHO), configurable video endpoints, and publish states." 
              sub="श्रेणीवार पाठ, बहुभाषी अनुवाद, वीडियो लिंक और प्रकाशन स्थिति प्रबंधित करें।" 
            />
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <Bi en="Add New Lesson" sub="नया पाठ जोड़ें" />
        </button>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LIVESTOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.code}
            onClick={() => handleCategorySwitch(cat.code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCat === cat.code
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Bi en={cat.nameEn} sub={cat.nameRegional.hi} />
          </button>
        ))}
      </div>

      {/* Add New Lesson Form */}
      {isAddingNew && (
        <form onSubmit={handleCreateLesson} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <Bi en="Create New Lesson with Bilingual Content" sub="द्विभाषी सामग्री के साथ नया पाठ बनाएं" />
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                English Title (Base) *
              </label>
              <input
                type="text"
                required
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                placeholder="e.g. Calf Care & Colostrum Feeding"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Hindi / Regional Translation (हिंदी शीर्षक) *
              </label>
              <input
                type="text"
                required
                value={newTitleHi}
                onChange={(e) => setNewTitleHi(e.target.value)}
                placeholder="उदा. बछड़े की देखभाल एवं खीस (Colostrum) पिलाना"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                English Description
              </label>
              <textarea
                rows={2}
                value={newDescEn}
                onChange={(e) => setNewDescEn(e.target.value)}
                placeholder="Overview of lesson..."
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Regional Description (विवरण)
              </label>
              <textarea
                rows={2}
                value={newDescHi}
                onChange={(e) => setNewDescHi(e.target.value)}
                placeholder="पाठ का संक्षिप्त विवरण..."
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Configurable Video Stream URL
              </label>
              <input
                type="url"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <Bi en="Save & Publish Lesson" sub="पाठ सहेजें एवं प्रकाशित करें" />
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs px-4 py-2 rounded-xl transition-all"
            >
              <Bi en="Cancel" sub="रद्द करें" />
            </button>
          </div>
        </form>
      )}

      {/* Lesson List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
          <thead className="bg-stone-100/80 text-stone-700 font-semibold uppercase tracking-wider border-b border-stone-200">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3"><Bi en="Lesson Title" sub="पाठ का शीर्षक" /></th>
              <th className="p-3"><Bi en="Duration" sub="अवधि" /></th>
              <th className="p-3"><Bi en="Video URL" sub="वीडियो लिंक" /></th>
              <th className="p-3"><Bi en="Status" sub="स्थिति" /></th>
              <th className="p-3 text-right"><Bi en="Actions" sub="क्रियाएं" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {lessonsList.map((lesson, idx) => (
              <tr key={lesson.id} className="hover:bg-stone-50/80 transition-all">
                <td className="p-3 font-mono text-stone-500">{idx + 1}</td>
                <td className="p-3">
                  <div className="font-bold text-stone-900">{lesson.titleEn}</div>
                  <div className="text-[11px] text-emerald-800">
                    {lesson.titleRegional[language] || lesson.titleRegional.hi}
                  </div>
                </td>
                <td className="p-3 text-stone-600 whitespace-nowrap">
                  {lesson.durationMinutes} min
                </td>
                <td className="p-3 text-stone-500 font-mono text-[11px] max-w-[200px] truncate">
                  {lesson.video?.videoUrl || "Configurable"}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    lesson.isPublished 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-stone-200 text-stone-600"
                  }`}>
                    {lesson.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleTogglePublish(lesson.id)}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 mr-1"
                    title={lesson.isPublished ? "Unpublish" : "Publish"}
                  >
                    {lesson.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
