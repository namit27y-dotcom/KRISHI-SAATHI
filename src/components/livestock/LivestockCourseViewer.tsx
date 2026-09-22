import React, { useState } from "react";
import { Bi } from "../Bilingual";
import { useLanguage } from "../../contexts/LanguageContext";
import { Lesson, LivestockCategoryCode } from "../../types";
import { LESSONS_DATABASE, LIVESTOCK_CATEGORIES } from "../../data/livestockData";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  Check, 
  X, 
  ArrowLeft,
  Video,
  Edit2,
  ExternalLink,
  BookOpen
} from "lucide-react";

interface Props {
  selectedCategory: LivestockCategoryCode;
  onBack: () => void;
  completedLessonIds: string[];
  onToggleComplete: (lessonId: string) => void;
  onOpenAIQuery?: (query: string) => void;
}

export const LivestockCourseViewer: React.FC<Props> = ({
  selectedCategory,
  onBack,
  completedLessonIds,
  onToggleComplete,
  onOpenAIQuery
}) => {
  const { language } = useLanguage();
  const lessons = LESSONS_DATABASE[selectedCategory] || [];
  const categoryMeta = LIVESTOCK_CATEGORIES.find((c) => c.code === selectedCategory);

  const [activeLessonId, setActiveLessonId] = useState<string>(
    lessons.length > 0 ? lessons[0].id : ""
  );

  // Custom configurable video URL per lesson
  const [customVideoUrls, setCustomVideoUrls] = useState<Record<string, string>>({});
  const [isEditingVideoUrl, setIsEditingVideoUrl] = useState<boolean>(false);
  const [tempVideoUrl, setTempVideoUrl] = useState<string>("");

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const handleStartEditVideo = () => {
    setTempVideoUrl(customVideoUrls[activeLesson.id] || activeLesson?.video?.videoUrl || "");
    setIsEditingVideoUrl(true);
  };

  const handleSaveVideoUrl = () => {
    setCustomVideoUrls((prev) => ({
      ...prev,
      [activeLesson.id]: tempVideoUrl.trim()
    }));
    setIsEditingVideoUrl(false);
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const currentVideoSource = 
    customVideoUrls[activeLesson?.id] || 
    activeLesson?.video?.videoUrl || 
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";

  const isCurrentCompleted = completedLessonIds.includes(activeLesson?.id);

  return (
    <div className="space-y-6">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <Bi en="Back to Categories" sub="वापस श्रेणियों पर जाएं" />
        </button>

        <div className="text-right">
          <div className="text-xs text-stone-500 font-medium">
            <Bi en="Farming Category" sub="खेती श्रेणी" />
          </div>
          <div className="text-sm font-bold text-emerald-900">
            <Bi 
              en={categoryMeta?.nameEn || "Category"} 
              sub={categoryMeta?.nameRegional[language] || categoryMeta?.nameRegional.hi} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lessons Playlist */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <Bi en="Course Syllabus" sub="पाठ्यक्रम एवं विषय" />
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {lessons.length} <Bi en="Lessons" sub="पाठ" inline />
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {lessons.map((lesson) => {
                const isActive = lesson.id === activeLesson?.id;
                const isDone = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setIsEditingVideoUrl(false);
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex items-start justify-between gap-3 ${
                      isActive 
                        ? "bg-emerald-50 border-emerald-300 shadow-sm" 
                        : "bg-white border-stone-200/80 hover:bg-stone-50"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-900 leading-snug">
                        <Bi 
                          en={lesson.titleEn} 
                          sub={lesson.titleRegional[language] || lesson.titleRegional.hi} 
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.durationMinutes} min
                        </span>
                        {lesson.quiz && (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <HelpCircle className="w-3 h-3" />
                            Quiz
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(lesson.id);
                      }}
                      title="Mark lesson complete"
                      className={`shrink-0 p-1.5 rounded-lg border transition-all ${
                        isDone 
                          ? "bg-emerald-600 text-white border-emerald-700" 
                          : "bg-white text-stone-300 border-stone-200 hover:text-stone-500"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Assistance quick jump */}
          {onOpenAIQuery && (
            <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-emerald-300 block mb-1">
                <Bi en="Have specific questions on this topic?" sub="क्या आपके पास इस विषय पर कोई सवाल है?" />
              </span>
              <p className="text-xs text-emerald-100 mb-3">
                <Bi 
                  en="Ask the Krishi Saathi AI Assistant for instant bilingual advice on feeding, health, or shed design." 
                  sub="आहार, स्वास्थ्य या शेड निर्माण पर तुरंत द्विभाषी सहायता के लिए AI सहायक से पूछें।" 
                />
              </p>
              <button
                onClick={() => onOpenAIQuery(`I have a question about ${activeLesson?.titleEn} in ${categoryMeta?.nameEn}: `)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-2 px-3 rounded-lg text-xs transition-all"
              >
                <Bi en="Ask AI Assistant on this Topic" sub="इस विषय पर AI से पूछें" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Active Lesson Video & Details */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              {/* Video Player Header / Embed */}
              <div className="bg-stone-900 relative">
                {/* Configurable Video Frame */}
                <div className="w-full aspect-video bg-black flex items-center justify-center relative">
                  {currentVideoSource.includes("youtube.com") || currentVideoSource.includes("youtu.be") ? (
                    <iframe
                      src={currentVideoSource}
                      title={activeLesson.titleEn}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-6 text-stone-400">
                      <Video className="w-12 h-12 mx-auto mb-2 text-stone-600" />
                      <p className="text-xs">
                        <Bi en="Educational Video Player" sub="शैक्षणिक वीडियो प्लेयर" />
                      </p>
                      <span className="text-[11px] text-stone-500 font-mono mt-1 block">
                        {currentVideoSource}
                      </span>
                    </div>
                  )}
                </div>

                {/* Video URL configuration panel */}
                <div className="bg-stone-800/90 text-white px-4 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Video className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-stone-300 truncate">
                      <Bi en="Configurable Video Stream" sub="कॉन्फ़िगर करने योग्य वीडियो लिंक" />
                    </span>
                  </div>

                  <button
                    onClick={handleStartEditVideo}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium ml-2 shrink-0"
                  >
                    <Edit2 className="w-3 h-3" />
                    <Bi en="Configure URL" sub="लिंक बदलें" />
                  </button>
                </div>

                {/* Edit modal inline */}
                {isEditingVideoUrl && (
                  <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-col gap-2">
                    <label className="text-xs text-stone-700 font-semibold">
                      <Bi 
                        en="Enter Embeddable Video URL (e.g. YouTube embed URL or HLS video source):" 
                        sub="वीडियो एम्बेड URL दर्ज करें (उदा. यूट्यूब एम्बेड लिंक):" 
                      />
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={tempVideoUrl}
                        onChange={(e) => setTempVideoUrl(e.target.value)}
                        placeholder="https://www.youtube-nocookie.com/embed/..."
                        className="flex-1 bg-white border border-stone-300 text-stone-900 rounded-lg px-3 py-1.5 text-xs focus:border-emerald-600 outline-none"
                      />
                      <button
                        onClick={handleSaveVideoUrl}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-lg font-semibold shadow-2xs"
                      >
                        <Bi en="Save" sub="सहेजें" />
                      </button>
                      <button
                        onClick={() => setIsEditingVideoUrl(false)}
                        className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs px-3 py-1.5 rounded-lg font-medium"
                      >
                        <Bi en="Cancel" sub="रद्द" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Text Content */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      <Bi 
                        en={activeLesson.titleEn} 
                        sub={activeLesson.titleRegional[language] || activeLesson.titleRegional.hi} 
                      />
                    </h2>
                    <p className="text-xs md:text-sm text-stone-600 mt-1">
                      <Bi 
                        en={activeLesson.descriptionEn} 
                        sub={activeLesson.descriptionRegional[language] || activeLesson.descriptionRegional.hi} 
                      />
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleComplete(activeLesson.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isCurrentCompleted
                        ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                        : "bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 border border-stone-200"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isCurrentCompleted ? (
                      <Bi en="Completed" sub="पूर्ण हुआ" />
                    ) : (
                      <Bi en="Mark as Completed" sub="पूर्ण चिह्नित करें" />
                    )}
                  </button>
                </div>

                {/* Key Points */}
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5">
                    <Bi en="Key Learning Objectives" sub="प्रमुख अध्ययन बिंदु" />
                  </h3>
                  <ul className="space-y-2">
                    {activeLesson.keyPointsEn.map((pointEn, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <Bi 
                            en={pointEn} 
                            sub={activeLesson.keyPointsRegional[language]?.[idx] || activeLesson.keyPointsRegional.hi?.[idx]} 
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safety & Biosecurity Notes */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/80 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block text-amber-900 font-bold mb-1">
                      <Bi en="Biosecurity & Safety Guidelines" sub="जैव सुरक्षा एवं स्वास्थ्य चेतावनी" />
                    </strong>
                    <span className="text-amber-950 leading-relaxed">
                      <Bi 
                        en={activeLesson.safetyNotesEn} 
                        sub={activeLesson.safetyNotesRegional[language] || activeLesson.safetyNotesRegional.hi} 
                      />
                    </span>
                  </div>
                </div>

                {/* Interactive Lesson Quiz */}
                {activeLesson.quiz && (
                  <div className="border-t border-stone-200 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-sm font-bold text-stone-900">
                          <Bi 
                            en={activeLesson.quiz.titleEn} 
                            sub={activeLesson.quiz.titleRegional[language] || activeLesson.quiz.titleRegional.hi} 
                          />
                        </h3>
                      </div>
                      <span className="text-xs text-stone-500 font-medium">
                        <Bi en="Knowledge Check" sub="ज्ञान परीक्षण" />
                      </span>
                    </div>

                    {activeLesson.quiz.questions.map((q, qIndex) => {
                      const selected = selectedAnswers[q.id];
                      const isAnswered = selected !== undefined;
                      const isCorrect = selected === q.correctOptionIndex;

                      return (
                        <div key={q.id} className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs space-y-3">
                          <p className="font-semibold text-stone-900">
                            {qIndex + 1}.{" "}
                            <Bi 
                              en={q.questionEn} 
                              sub={q.questionRegional[language] || q.questionRegional.hi} 
                            />
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.optionsEn.map((optEn, oIndex) => {
                              const isChoice = selected === oIndex;
                              const isTargetCorrect = oIndex === q.correctOptionIndex;

                              let btnClasses = "bg-white border-stone-200 hover:border-emerald-500 text-stone-800";
                              if (quizSubmitted) {
                                if (isTargetCorrect) {
                                  btnClasses = "bg-emerald-100 border-emerald-600 text-emerald-900 font-bold";
                                } else if (isChoice && !isTargetCorrect) {
                                  btnClasses = "bg-rose-100 border-rose-500 text-rose-900";
                                }
                              } else if (isChoice) {
                                btnClasses = "bg-emerald-50 border-emerald-600 text-emerald-900 font-medium";
                              }

                              return (
                                <button
                                  key={oIndex}
                                  onClick={() => handleSelectAnswer(q.id, oIndex)}
                                  className={`p-3 rounded-xl border text-left transition-all ${btnClasses}`}
                                >
                                  <Bi 
                                    en={optEn} 
                                    sub={q.optionsRegional[language]?.[oIndex] || q.optionsRegional.hi?.[oIndex]} 
                                  />
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className={`p-3 rounded-xl border text-[11px] ${
                              isCorrect 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                                : "bg-rose-50 border-rose-200 text-rose-900"
                            }`}>
                              <div className="font-bold mb-0.5 flex items-center gap-1">
                                {isCorrect ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <Bi en="Correct Answer!" sub="सही उत्तर!" />
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3.5 h-3.5 text-rose-600" />
                                    <Bi en="Incorrect." sub="गलत उत्तर।" />
                                  </>
                                )}
                              </div>
                              <Bi 
                                en={q.explanationEn} 
                                sub={q.explanationRegional[language] || q.explanationRegional.hi} 
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all"
                      >
                        <Bi en="Submit Quiz Answers" sub="उत्तर सबमिट करें" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                        }}
                        className="text-stone-600 hover:text-stone-900 text-xs font-semibold underline"
                      >
                        <Bi en="Retake Quiz" sub="प्रश्नोत्तरी दोबारा दें" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <Bi en="Select a lesson from the left playlist to start learning." sub="शुरू करने के लिए बाईं ओर से कोई पाठ चुनें।" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
