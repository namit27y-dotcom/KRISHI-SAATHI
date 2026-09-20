import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Sprout, 
  User, 
  History, 
  Plus, 
  Trash2, 
  X, 
  MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { SupportedLanguage } from "../types.ts";

interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

interface AICompanionProps {
  userId?: string;
  preferredLanguage?: SupportedLanguage;
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

export default function AICompanion({ userId, preferredLanguage: propLang }: AICompanionProps) {
  const { t, language: contextLang } = useLanguage();
  const lang = propLang || contextLang || "en";
  const companionT = t.aiCompanion;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load sessions from localStorage on mount or when userId changes
  useEffect(() => {
    try {
      const storageKey = `krishi_saathi_chat_sessions_${userId || "guest"}`;
      const storedSessions = localStorage.getItem(storageKey);
      
      const defaultMsg: Message = {
        role: "model",
        text: companionT.welcome
      };
      
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions) as ChatSession[];
        if (parsed.length > 0) {
          setSessions(parsed);
          const activeIdKey = `krishi_saathi_active_session_id_${userId || "guest"}`;
          const storedActiveId = localStorage.getItem(activeIdKey);
          if (storedActiveId && parsed.some(s => s.id === storedActiveId)) {
            setActiveSessionId(storedActiveId);
            const activeSession = parsed.find(s => s.id === storedActiveId);
            setMessages(activeSession ? activeSession.messages : [defaultMsg]);
          } else {
            setActiveSessionId(parsed[0].id);
            setMessages(parsed[0].messages);
          }
          return;
        }
      }
      
      // If no stored sessions, create initial one
      const initialSessionId = `session-${Date.now()}`;
      const initialSession: ChatSession = {
        id: initialSessionId,
        title: companionT.title || "Welcome Chat",
        timestamp: new Date().toLocaleString("en-IN", { hour: "numeric", minute: "numeric", day: "numeric", month: "short" }),
        messages: [defaultMsg]
      };
      setSessions([initialSession]);
      setActiveSessionId(initialSessionId);
      setMessages([defaultMsg]);
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
    }
  }, [userId, companionT.welcome, companionT.title]);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length === 0 || !activeSessionId) return;
    try {
      const storageKey = `krishi_saathi_chat_sessions_${userId || "guest"}`;
      localStorage.setItem(storageKey, JSON.stringify(sessions));
      
      const activeIdKey = `krishi_saathi_active_session_id_${userId || "guest"}`;
      localStorage.setItem(activeIdKey, activeSessionId);
    } catch (e) {
      console.error("Failed to save sessions to localStorage", e);
    }
  }, [sessions, activeSessionId, userId]);

  // Update the active session's messages and potential title when messages change
  useEffect(() => {
    if (!activeSessionId || messages.length === 0) return;
    
    setSessions(prev => {
      return prev.map(session => {
        if (session.id === activeSessionId) {
          let title = session.title;
          if (title === "Welcome Chat" || title === "New Conversation" || title === companionT.title) {
            const firstUserMessage = messages.find(m => m.role === "user");
            if (firstUserMessage) {
              title = firstUserMessage.text.length > 28 
                ? firstUserMessage.text.substring(0, 25) + "..." 
                : firstUserMessage.text;
            }
          }
          return {
            ...session,
            title,
            messages
          };
        }
        return session;
      });
    });
  }, [messages, activeSessionId, companionT.title]);

  const startNewChat = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
    }
    
    const newId = `session-${Date.now()}`;
    const defaultMsg: Message = {
      role: "model",
      text: companionT.welcome
    };
    const newSession: ChatSession = {
      id: newId,
      title: companionT.newChat || "New Chat",
      timestamp: new Date().toLocaleString("en-IN", { hour: "numeric", minute: "numeric", day: "numeric", month: "short" }),
      messages: [defaultMsg]
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages([defaultMsg]);
    setShowHistory(false);
  };

  const selectSession = (sessionId: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
    }
    
    const targetSession = sessions.find(s => s.id === sessionId);
    if (targetSession) {
      setActiveSessionId(sessionId);
      setMessages(targetSession.messages);
      setShowHistory(false);
    }
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    const remaining = sessions.filter(s => s.id !== sessionId);
    
    if (remaining.length === 0) {
      const defaultMsg: Message = {
        role: "model",
        text: companionT.welcome
      };
      const newId = `session-${Date.now()}`;
      const defaultSession: ChatSession = {
        id: newId,
        title: companionT.title || "Welcome Chat",
        timestamp: new Date().toLocaleString("en-IN", { hour: "numeric", minute: "numeric", day: "numeric", month: "short" }),
        messages: [defaultMsg]
      };
      setSessions([defaultSession]);
      setActiveSessionId(newId);
      setMessages([defaultMsg]);
    } else {
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
        setMessages(remaining[0].messages);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = SPEECH_LANG_CODES[lang] || "en-IN";

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
  }, [lang]);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.slice(1).map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("model" as const),
        text: msg.text
      }));

      const res = await axios.post("/api/chat", {
        message: userMessage,
        history,
        userId,
        preferredLanguage: lang
      });

      setMessages((prev) => [...prev, { role: "model", text: res.data.response }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev, 
        { 
          role: "model", 
          text: companionT.networkError || "I apologize, I experienced a network disruption. Please try asking again." 
        }
      ]);
    } finally {
      setLoading(false);
    }
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
      const targetPrefix = lang.toLowerCase();
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
    <div className="max-w-2xl mx-auto flex flex-col h-[550px] bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden relative" id="ai-companion-chat-module">
      {/* Header */}
      <div className="px-5 py-4 bg-emerald-600 text-white flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <Sprout className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{companionT.title}</h3>
            <span className="text-[10px] text-emerald-100/95 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse inline-block" /> {companionT.statusActive}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all ${
              showHistory 
                ? "bg-white/20 text-white" 
                : "text-emerald-100 hover:bg-white/10"
            }`}
            title={companionT.chatHistory}
          >
            <History className="w-4 h-4" />
          </button>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-1.5 text-xs text-emerald-100 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl font-medium transition-all"
            title={companionT.newChat}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{companionT.newChat}</span>
          </button>
        </div>
      </div>

      {/* Main chat body with absolute overlay drawer for history */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-50/50">
        
        {/* History Slide-out Panel */}
        <AnimatePresence>
          {showHistory && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="absolute inset-0 bg-slate-900/40 z-10"
              />
              
              {/* Drawer content */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-100 z-10 flex flex-col shadow-xl"
              >
                {/* Drawer Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-600" />
                    {companionT.chatHistory}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Scrollable List */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {sessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div
                        key={session.id}
                        onClick={() => selectSession(session.id)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                          isActive
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-100"
                            : "hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate leading-tight">{session.title}</p>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{session.timestamp}</span>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => deleteSession(e, session.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all shrink-0 ml-1"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Drawer Footer with global clear */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
                        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                        setSpeakingText(null);
                        
                        const defaultMsg: Message = {
                          role: "model",
                          text: companionT.welcome
                        };
                        const newId = `session-${Date.now()}`;
                        const defaultSession: ChatSession = {
                          id: newId,
                          title: companionT.title || "Welcome Chat",
                          timestamp: new Date().toLocaleString("en-IN", { hour: "numeric", minute: "numeric", day: "numeric", month: "short" }),
                          messages: [defaultMsg]
                        };
                        setSessions([defaultSession]);
                        setActiveSessionId(newId);
                        setMessages([defaultMsg]);
                        setShowHistory(false);
                      }
                    }}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-all border border-rose-100/60"
                  >
                    {companionT.clearChat}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-1">
                    <Sprout className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] text-xs leading-relaxed p-3.5 rounded-2xl shadow-sm ${
                  isUser 
                    ? "bg-emerald-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Audio controls for AI message */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-50 flex justify-end">
                      <button
                        onClick={() => readAloud(msg.text)}
                        className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-semibold ${
                          speakingText === msg.text
                            ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-100"
                        }`}
                        title={speakingText === msg.text ? companionT.stopSpeaking : companionT.readAloud}
                      >
                        {speakingText === msg.text ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{speakingText === msg.text ? companionT.stopSpeaking : companionT.readAloud}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="p-1.5 bg-slate-200 text-slate-700 rounded-lg shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-1">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-400">{t.common.loading || "Typing..."}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input controls */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl border transition-all shrink-0 ${
            isListening
              ? "bg-rose-500 text-white border-rose-400 animate-pulse"
              : "bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-100"
          }`}
          title={isListening ? companionT.listening : "Speak Question"}
          id="btn-voice-input"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? companionT.listening : companionT.placeholder}
          disabled={isListening}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-emerald-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm disabled:opacity-40"
          id="btn-submit-chat"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
