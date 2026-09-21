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
  MessageSquare,
  AlertCircle,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Check,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { Bi, bString } from "./Bilingual.tsx";
import { SupportedLanguage } from "../types.ts";

export const SPEECH_LANG_OPTIONS = [
  { code: "hi-IN", id: "hi", nameEn: "Hindi", nameSub: "हिन्दी" },
  { code: "en-IN", id: "en", nameEn: "English", nameSub: "अंग्रेज़ी" },
  { code: "mr-IN", id: "mr", nameEn: "Marathi", nameSub: "मराठी" },
  { code: "pa-IN", id: "pa", nameEn: "Punjabi", nameSub: "ਪੰਜਾਬੀ" },
  { code: "bn-IN", id: "bn", nameEn: "Bengali", nameSub: "বাংলা" },
  { code: "ta-IN", id: "ta", nameEn: "Tamil", nameSub: "தமிழ்" },
  { code: "te-IN", id: "te", nameEn: "Telugu", nameSub: "తెలుగు" },
];

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
  mai: "hi-IN",
  pa: "pa-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  es: "es-ES",
  vi: "vi-VN",
  sw: "sw-KE"
};

export default function AICompanion({ userId, preferredLanguage: propLang }: AICompanionProps) {
  const { t, language: contextLang, isBilingual } = useLanguage();
  const lang = propLang || contextLang || "en";
  const companionT = t?.aiCompanion || {
    title: "Krishi Saathi Companion",
    statusActive: "Active Agronomist Bot",
    welcome: "Namaste! 🙏 I am Krishi Saathi, your dedicated farming assistant. Ask me anything about crop diseases, fertilizers, weather protection, or government schemes!",
    placeholder: "Ask any farming question or describe a symptom...",
    listening: "Listening to your voice...",
    quickTipsTitle: "Quick Inquiries",
    quickTip1: "How to prepare land for high-yield wheat?",
    quickTip2: "Best organic pesticide for tomato leaf curl?",
    quickTip3: "How to apply for PM-Kisan subsidy?",
    quickTip4: "Water-saving drip irrigation schedule for cotton",
    readAloud: "Listen",
    stopSpeaking: "Stop",
    clearChat: "Clear Chat",
    chatHistory: "History",
    newChat: "New Conversation",
    networkError: "I apologize, I experienced a network disruption. Please ask your question again."
  };

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // --- Voice-to-Text Microphone States & Audio Processing ---
  const [isListening, setIsListening] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [selectedSpeechCode, setSelectedSpeechCode] = useState<string>(SPEECH_LANG_CODES[lang] || "hi-IN");
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const textAccumulatorRef = useRef<string>("");

  useEffect(() => {
    setSelectedSpeechCode(SPEECH_LANG_CODES[lang] || "hi-IN");
  }, [lang]);

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

  // Clean up audio & voice resources on unmount
  useEffect(() => {
    return () => {
      stopVoiceCleanup();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopVoiceCleanup = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // --- Voice-to-Text Microphone Access Handler ---
  const startListening = async () => {
    setMicPermissionError(null);
    setInterimTranscript("");
    textAccumulatorRef.current = "";
    audioChunksRef.current = [];

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
    }

    // 1. Explicitly request microphone stream from user's device
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.error("Microphone permission error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermissionError(
          "Microphone permission was denied. Please allow microphone access in your browser settings (look for the lock or camera/mic icon in the address bar)."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setMicPermissionError(
          "No microphone hardware found. Please connect a working headset or microphone."
        );
      } else {
        setMicPermissionError(
          `Unable to access microphone: ${err.message || "Device unavailable"}`
        );
      }
      setIsListening(false);
      return;
    }

    // 2. Set up AudioContext & AnalyserNode for live visualizer
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const renderVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(renderVolume);
        };
        renderVolume();
      }
    } catch (e) {
      console.warn("AudioContext setup failed (visualizer only):", e);
    }

    // 3. Set up MediaRecorder for hybrid fallback
    let mimeType = "audio/webm";
    if (typeof MediaRecorder !== "undefined") {
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        mimeType = "audio/ogg";
      }

      try {
        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(250);
      } catch (recErr) {
        console.warn("MediaRecorder start notice:", recErr);
      }
    }

    // 4. Set up Web Speech API (SpeechRecognition / webkitSpeechRecognition)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = selectedSpeechCode;

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (e: any) => {
          let finalStr = "";
          let interimStr = "";
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            const trans = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
              finalStr += trans + " ";
            } else {
              interimStr += trans;
            }
          }

          const currentWords = (finalStr || interimStr).trim();
          if (currentWords) {
            textAccumulatorRef.current = (textAccumulatorRef.current + " " + currentWords).trim();
            setInterimTranscript(currentWords);
            setInput(currentWords);
          }
        };

        rec.onerror = (err: any) => {
          console.warn("Web Speech notice (will rely on recorded audio fallback):", err);
        };

        rec.onend = () => {
          // If ended unexpectedly while isListening is still true, do not crash
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (recErr) {
        console.warn("SpeechRecognition start error:", recErr);
      }
    }

    setIsListening(true);
  };

  const stopListening = async (autoSubmit: boolean = false) => {
    setIsListening(false);
    setAudioLevel(0);

    // Stop visualizer
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Stop Web Speech
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    // Stop MediaRecorder & collect recorded audio blob
    const recorder = mediaRecorderRef.current;
    let audioBlob: Blob | null = null;
    if (recorder && recorder.state !== "inactive") {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
          }
          resolve();
        };
        try {
          recorder.stop();
        } catch (e) {
          resolve();
        }
      });
    }

    // Stop microphone tracks so browser stops capturing
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    let candidateText = (input || interimTranscript || textAccumulatorRef.current).trim();

    // If Web Speech API produced nothing or was unsupported, transcribe via backend Gemini
    if (!candidateText && audioBlob && (audioBlob as Blob).size > 2000) {
      setIsTranscribingAudio(true);
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(audioBlob);
        const base64Data = await base64Promise;

        const res = await axios.post("/api/audio/transcribe", {
          audio: base64Data,
          mimeType: (audioBlob as Blob).type,
          preferredLanguage: lang
        });

        if (res.data && res.data.transcript) {
          candidateText = res.data.transcript.trim();
          setInput(candidateText);
          setInterimTranscript(candidateText);
        }
      } catch (err) {
        console.error("Server audio transcription error:", err);
      } finally {
        setIsTranscribingAudio(false);
      }
    }

    if (autoSubmit && candidateText) {
      executeSend(candidateText);
    }
  };

  const cancelListening = () => {
    stopVoiceCleanup();
    setIsListening(false);
    setAudioLevel(0);
    setInterimTranscript("");
    setIsTranscribingAudio(false);
  };

  const executeSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage = textToSend.trim();
    setInput("");
    setInterimTranscript("");
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening(true);
      return;
    }
    executeSend(input);
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
    <div className="max-w-2xl mx-auto flex flex-col h-[570px] bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden relative" id="ai-companion-chat-module">
      {/* Header */}
      <div className="px-5 py-4 bg-emerald-600 text-white flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              <Bi en={companionT.title} sub="कृषि साथी सहायक" />
              <span className="bg-emerald-500 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-emerald-100 border border-emerald-400/30">AI 2.5</span>
            </h3>
            <span className="text-[10px] text-emerald-100/95 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block" />
              <Bi en={companionT.statusActive} sub="सक्रिय कृषि सहायक" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold ${
              showHistory 
                ? "bg-white/20 text-white" 
                : "text-emerald-100 hover:bg-white/10"
            }`}
            title={companionT.chatHistory}
            id="btn-chat-history-toggle"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">
              <Bi en={companionT.chatHistory} sub="इतिहास" />
            </span>
          </button>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-1.5 text-xs text-emerald-100 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl font-medium transition-all"
            title={companionT.newChat}
            id="btn-new-chat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              <Bi en={companionT.newChat} sub="नई बातचीत" />
            </span>
          </button>
        </div>
      </div>

      {/* Microphone Permission Warning Banner */}
      {micPermissionError && (
        <div className="bg-amber-50 border-b border-amber-200/70 px-4 py-3 text-amber-900 text-xs flex items-start justify-between gap-3 shadow-xs relative z-15">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-amber-950">
                <Bi en="Microphone Access Blocked" sub="माइक्रोफोन की अनुमति अवरुद्ध है" />
              </span>
              <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                {micPermissionError}
              </p>
              <button
                type="button"
                onClick={startListening}
                className="mt-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-300/40 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <Bi en="Try Microphone Again" sub="माइक दोबारा आज़माएं" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMicPermissionError(null)}
            className="text-amber-500 hover:text-amber-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
          {/* Quick Voice Questions Inspiration when conversation is fresh */}
          {messages.length <= 1 && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-100/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-emerald-600 text-white rounded-lg">
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  <Bi en="Ask Farming Questions by Voice" sub="खेती के सवाल बोलकर पूछें" />
                </h4>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed mb-3">
                <Bi 
                  en="Tap the microphone button below to ask in your native language about crops, fertilizers, pest control, dairy, or fish farming."
                  sub="फसल, खाद, कीट नियंत्रण, डेयरी या मछली पालन के बारे में अपनी भाषा में पूछने के लिए नीचे माइक बटन दबाएं।"
                />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { en: "Urea & DAP dosage for 1 acre wheat", sub: "1 एकड़ गेहूं में यूरिया और डीएपी की मात्रा", q: "What is the recommended urea and DAP fertilizer dosage for 1 acre wheat?" },
                  { en: "Remedy for tomato leaf curl virus", sub: "टमाटर में पत्ती मुड़न रोग का जैविक उपचार", q: "How to cure tomato leaf curl virus using organic methods?" },
                  { en: "Dairy cow feed to increase milk fat", sub: "दुधारू गाय में दूध और फैट बढ़ाने का आहार", q: "What feed ration increases fat and milk yield in dairy cows?" },
                  { en: "Fish pond water color & lime dosage", sub: "मछली तालाब में चूने की मात्रा व पानी की गुणवत्ता", q: "How much agricultural lime should be applied to 1-acre fish pond?" }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setInput(sample.q);
                      executeSend(sample.q);
                    }}
                    className="text-[11px] p-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-emerald-100 rounded-xl transition-all shadow-2xs text-left cursor-pointer flex flex-col group"
                  >
                    <span className="font-semibold text-emerald-800 group-hover:text-emerald-950 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      {sample.en}
                    </span>
                    {isBilingual && <span className="text-[10px] text-slate-500 mt-0.5">{sample.sub}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

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

      {/* Voice Processing Status Bar (Transcribing) */}
      {isTranscribingAudio && (
        <div className="px-4 py-2.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-900 animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span className="font-semibold">
              <Bi en="Transcribing voice with Gemini AI..." sub="जेमिनी एआई द्वारा आवाज को पाठ में बदला जा रहा है..." />
            </span>
          </div>
          <span className="text-[10px] text-emerald-700">Audio Processing</span>
        </div>
      )}

      {/* Active Voice Listening Drawer / Live Soundwave visualizer */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-rose-100 bg-rose-50/80 px-4 py-3 relative z-10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-rose-400/40 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center relative shadow-sm">
                    <Mic className="w-5 h-5 animate-bounce" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      <Bi en="Listening to your question..." sub="आपकी आवाज सुनी जा रही है..." />
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-white text-rose-700 rounded-full border border-rose-200">
                      {SPEECH_LANG_OPTIONS.find((opt) => opt.code === selectedSpeechCode)?.nameSub || selectedSpeechCode}
                    </span>
                  </div>

                  {/* Audio Frequency Equalizer Animation */}
                  <div className="flex items-center gap-1 mt-1.5 h-3">
                    {[12, 28, 45, 75, 95, 60, 80, 40, 65, 30, 85, 50].map((baseHeight, barIdx) => {
                      const dynamicHeight = Math.max(
                        4,
                        Math.min(14, Math.round((baseHeight * (audioLevel || 25)) / 100))
                      );
                      return (
                        <div
                          key={barIdx}
                          style={{ height: `${dynamicHeight}px` }}
                          className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                        />
                      );
                    })}
                    <span className="text-[10px] text-rose-700 font-mono ml-2">
                      {audioLevel > 0 ? `${audioLevel}%` : "Ready"}
                    </span>
                  </div>

                  {/* Real-time transcript preview */}
                  {(interimTranscript || input) && (
                    <p className="text-[11px] text-rose-950 bg-white/80 p-1.5 rounded-lg border border-rose-200/60 mt-1.5 font-medium truncate max-w-md">
                      "{interimTranscript || input}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons for Active Voice Recording */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={cancelListening}
                  className="px-3 py-1.5 text-xs text-rose-700 bg-white hover:bg-rose-100/60 border border-rose-200 rounded-xl transition-all font-semibold"
                >
                  <Bi en="Cancel" sub="रद्द करें" />
                </button>
                <button
                  type="button"
                  onClick={() => stopListening(true)}
                  className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-semibold shadow-xs flex items-center gap-1.5"
                  id="btn-voice-done-submit"
                >
                  <Check className="w-3.5 h-3.5" />
                  <Bi en="Ask Question" sub="सवाल पूछें" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input controls with Speech Recognition Language selector & Mic */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2 relative">
          {/* Language Selector Dropdown for Speech Input */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1 text-[11px] font-semibold"
              title="Select Voice Language"
              id="btn-speech-lang-select"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">
                {SPEECH_LANG_OPTIONS.find((o) => o.code === selectedSpeechCode)?.nameSub || "भाषा"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-30 min-w-[170px]">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                  <Bi en="Voice Dialect" sub="बोलने की भाषा" />
                </div>
                {SPEECH_LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setSelectedSpeechCode(opt.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                      selectedSpeechCode === opt.code
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{opt.nameEn}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{opt.nameSub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={isListening ? () => stopListening(false) : startListening}
            className={`p-3 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 ${
              isListening
                ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-200 animate-pulse ring-2 ring-rose-300"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 hover:border-emerald-300"
            }`}
            title={isListening ? "Stop Speaking / बोलना रोकें" : "Speak Question (Voice-to-Text) / बोलकर सवाल पूछें"}
            id="btn-voice-input"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span className="text-[11px] font-bold hidden sm:inline">
                  <Bi en="Stop" sub="रोकें" />
                </span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-bold hidden sm:inline">
                  <Bi en="Speak" sub="बोलें" />
                </span>
              </>
            )}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? "Listening... Speak your crop, soil, or livestock question"
                : companionT.placeholder || "Type or speak your farming question..."
            }
            disabled={isListening}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            id="input-chat-query"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!input.trim() && !isListening) || loading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm disabled:opacity-40 flex items-center justify-center cursor-pointer"
            id="btn-submit-chat"
            title="Send Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Small subtitle explaining voice feature */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Mic className="w-3 h-3 text-emerald-600" />
            <Bi en="Voice-to-text active (English, Hindi, Marathi, etc.)" sub="वॉयस-टू-टेक्स्ट सक्रिय (अंग्रेज़ी, हिंदी, मराठी आदि)" />
          </span>
          <span>
            <Bi en="Press Enter to send" sub="भेजने के लिए Enter दबाएं" />
          </span>
        </div>
      </div>
    </div>
  );
}
