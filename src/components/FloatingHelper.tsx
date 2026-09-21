import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.tsx";

interface Message {
  role: "user" | "model";
  text: string;
}

interface FloatingHelperProps {
  userId?: string;
  preferredLanguage?: string;
}

const SPEECH_LANG_CODES: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bho: "hi-IN",
  mr: "mr-IN",
  pa: "pa-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  es: "es-ES",
  vi: "vi-VN",
  sw: "sw-KE"
};

export default function FloatingHelper({ userId, preferredLanguage: propLang }: FloatingHelperProps) {
  const { t, language: contextLang } = useLanguage();
  const language = propLang || contextLang || "en";

  const helperT = t?.floatingHelper || {
    title: "Krishi Saathi Help Bot",
    welcome: "Namaste! 🙏 I am here to help you navigate Krishi Saathi and solve your farm queries. Ask me anything!",
    placeholder: "Type a query or ask a question...",
    listening: "Listening...",
    close: "Close"
  };

  const quickTips = [
    t?.aiCompanion?.quickTip1 || "How to prepare land for high-yield wheat?",
    t?.aiCompanion?.quickTip2 || "Best organic pesticide for tomato leaf curl?",
    t?.aiCompanion?.quickTip3 || "How to apply for PM-Kisan subsidy?",
    t?.aiCompanion?.quickTip4 || "Water-saving drip irrigation schedule"
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Set default greeting on language change or mount
  useEffect(() => {
    setMessages([
      {
        role: "model",
        text: helperT.welcome || "Namaste! 🙏 How can I assist you with your farming needs today?"
      }
    ]);
  }, [language, helperT.welcome]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = SPEECH_LANG_CODES[language] || "en-IN";

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };
      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
      }
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    setLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("model" as const),
        text: msg.text
      }));

      const res = await axios.post("/api/chat", {
        message: textToSend,
        history,
        userId,
        preferredLanguage: language
      });

      setMessages((prev) => [...prev, { role: "model", text: res.data.response }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev, 
        { 
          role: "model", 
          text: t.common.error || "I apologize, I experienced a network disruption." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput("");
    handleSend(currentInput);
  };

  const readAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      if (speakingText === text) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = language.toLowerCase();
      const voice = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
      if (voice) utterance.voice = voice;

      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);

      setSpeakingText(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported on this browser.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="floating-ai-assistant">
      {/* Expanded chat panel */}
      {isOpen && (
        <div className="w-[360px] h-[500px] bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider">{helperT.title}</h3>
                <span className="text-[9px] text-emerald-100/95 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  Online Help Bot
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              }}
              className="p-1.5 hover:bg-white/15 rounded-lg transition-all"
              title={helperT.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="space-y-1">
                  <div 
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      msg.role === "user" 
                        ? "bg-emerald-600 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "model" && (
                    <button
                      onClick={() => readAloud(msg.text)}
                      className={`p-1.5 rounded-lg transition-all text-[10px] flex items-center gap-1 ${
                        speakingText === msg.text
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {speakingText === msg.text ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{speakingText === msg.text ? "Mute" : "Listen"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none text-slate-400 text-xs italic">
                  {t.common.loading || "Typing..."}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Help Tips Chips */}
          <div className="p-2 bg-slate-50 border-t border-slate-100/50 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {quickTips.map((tip, i) => (
              <button
                key={i}
                disabled={loading}
                onClick={() => handleSend(tip)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-100 rounded-full text-[10px] font-medium whitespace-nowrap transition-all shadow-xs shrink-0"
              >
                {tip}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition-all ${
                isListening 
                  ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-700"
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? helperT.listening : helperT.placeholder}
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 transition-all text-slate-700"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Circular Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative border border-emerald-500/20"
        title="Krishi Saathi AI Help Assistant"
        id="floating-helper-trigger"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in spin-in-90 duration-200" />
        ) : (
          <>
            <HelpCircle className="w-6 h-6 animate-bounce duration-1000" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse border border-white">
              AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}
