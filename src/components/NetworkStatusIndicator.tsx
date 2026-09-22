import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  WifiOff, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  X, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { 
  getEffectiveOnlineStatus, 
  getOfflineConfig, 
  saveOfflineConfig, 
  cacheAllCriticalGuides, 
  getOfflineCacheStats, 
  setSimulatedOffline,
  OfflineCacheStats
} from "../utils/offlineCacheManager.ts";
import { Bi } from "./Bilingual.tsx";

interface NetworkStatusProps {
  onOpenOfflineGuides: (category?: string) => void;
}

/**
 * Prominent Banner rendered at the very top of the header when the user loses connection.
 * Prompts them to enable offline cache mode for critical field guides.
 */
export function NetworkStatusBanner({ onOpenOfflineGuides }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState<boolean>(getEffectiveOnlineStatus());
  const [stats, setStats] = useState<OfflineCacheStats>(getOfflineCacheStats());
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(false);
  const [justEnabledCacheToast, setJustEnabledCacheToast] = useState<string | null>(null);

  const checkStatus = () => {
    const currentOnline = getEffectiveOnlineStatus();
    setIsOnline(currentOnline);
    setStats(getOfflineCacheStats());
    if (currentOnline) {
      setIsPromptDismissed(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => checkStatus();
    const handleOffline = () => {
      checkStatus();
      setIsPromptDismissed(false); // Prompt appears immediately when connectivity drops!
    };
    const handleCustomChange = () => checkStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("krishi-network-status-changed", handleCustomChange);
    window.addEventListener("krishi-offline-cache-updated", handleCustomChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("krishi-network-status-changed", handleCustomChange);
      window.removeEventListener("krishi-offline-cache-updated", handleCustomChange);
    };
  }, []);

  const handleEnableCacheNow = () => {
    saveOfflineConfig({ enabled: true });
    const res = cacheAllCriticalGuides();
    setJustEnabledCacheToast(`Offline Cache Active! ${res.count} critical field guides saved to device memory.`);
    setTimeout(() => setJustEnabledCacheToast(null), 4000);
    checkStatus();
  };

  return (
    <>
      {/* Offline Alert Banner at the very top of header */}
      {!isOnline && !isPromptDismissed && (
        <div 
          className="w-full bg-gradient-to-r from-amber-700 via-amber-800 to-rose-900 text-white px-3 md:px-6 py-2.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 border-b border-amber-600/50 animate-fadeIn"
          id="offline-connection-lost-banner"
        >
          <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="font-bold flex items-center gap-2 leading-tight">
                <span>
                  <Bi en="No Internet Connection Detected" sub="इंटरनेट कनेक्शन कट गया है (ऑफ़लाइन)" />
                </span>
                {stats.isSimulatedOffline && (
                  <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded font-bold">
                    Field Simulation
                  </span>
                )}
              </div>
              <p className="text-[11px] md:text-xs text-amber-100/90 mt-0.5 leading-tight">
                <Bi 
                  en="You are currently offline. Enable Offline Cache Mode to access critical field guides in the field." 
                  sub="आप ऑफ़लाइन हैं। खेत में बिना इंटरनेट के महत्वपूर्ण कृषि फील्ड गाइड्स देखने के लिए ऑफ़लाइन कैश मोड सक्षम करें।" 
                />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {!stats.isEnabled ? (
              <button
                onClick={handleEnableCacheNow}
                className="bg-white hover:bg-amber-50 text-amber-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                id="btn-enable-offline-cache-prompt"
              >
                <HardDrive className="w-3.5 h-3.5 text-amber-800" />
                <Bi en="Enable Offline Cache" sub="कैश मोड सक्षम करें" />
              </button>
            ) : (
              <button
                onClick={() => onOpenOfflineGuides()}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                id="btn-open-cached-guides-prompt"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-950" />
                <Bi en={`View Offline Guides (${stats.totalCached})`} sub={`ऑफ़लाइन गाइड्स देखें (${stats.totalCached})`} />
              </button>
            )}

            <button
              onClick={() => onOpenOfflineGuides()}
              className="bg-black/25 hover:bg-black/40 text-white text-xs px-2.5 py-1.5 rounded-xl transition-all font-medium hidden sm:inline-flex items-center gap-1"
            >
              <Bi en="Browse" sub="खोलें" />
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPromptDismissed(true)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors ml-1"
              title="Dismiss notification"
              id="btn-dismiss-offline-banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Toast if cache was just enabled */}
      {justEnabledCacheToast && (
        <div className="w-full bg-emerald-800 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-emerald-700 animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{justEnabledCacheToast}</span>
          </div>
          <button 
            onClick={() => onOpenOfflineGuides()}
            className="text-emerald-200 hover:text-white underline font-bold text-xs"
          >
            Open Guides Now
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Compact Status Indicator Pill in the top header navigation row.
 * Displays Online/Offline status and quick access to offline field guides.
 */
export function NetworkStatusPill({ onOpenOfflineGuides }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState<boolean>(getEffectiveOnlineStatus());
  const [stats, setStats] = useState<OfflineCacheStats>(getOfflineCacheStats());
  const [showStatusPopover, setShowStatusPopover] = useState<boolean>(false);

  const checkStatus = () => {
    setIsOnline(getEffectiveOnlineStatus());
    setStats(getOfflineCacheStats());
  };

  useEffect(() => {
    const handleOnline = () => checkStatus();
    const handleOffline = () => checkStatus();
    const handleCustomChange = () => checkStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("krishi-network-status-changed", handleCustomChange);
    window.addEventListener("krishi-offline-cache-updated", handleCustomChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("krishi-network-status-changed", handleCustomChange);
      window.removeEventListener("krishi-offline-cache-updated", handleCustomChange);
    };
  }, []);

  const handleToggleSimulate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !stats.isSimulatedOffline;
    setSimulatedOffline(next);
    checkStatus();
  };

  return (
    <div className="relative inline-block" id="header-network-pill-wrapper">
      <button
        onClick={() => setShowStatusPopover(!showStatusPopover)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          isOnline
            ? "bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border-emerald-200 shadow-2xs"
            : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-200/50"
        }`}
        title={isOnline ? "Network: Online. Click for Offline Cache details." : "Network: Disconnected. Click to browse cached field guides."}
        id="btn-network-status-indicator"
      >
        {isOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-stone-800 hidden sm:inline">
              <Bi en="Online" sub="ऑनलाइन" />
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="text-[11px] font-bold text-rose-800">
              <Bi en="Offline" sub="ऑफ़लाइन" />
            </span>
          </>
        )}

        <span className="inline-flex items-center gap-1 text-[10px] bg-white/90 text-stone-700 font-bold px-1.5 py-0.2 rounded-md border border-stone-200/60 ml-0.5">
          <BookOpen className="w-2.5 h-2.5 text-emerald-700" />
          {stats.totalCached}
        </span>
      </button>

      {/* Popover Menu */}
      {showStatusPopover && (
        <div 
          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl p-3.5 z-50 text-xs space-y-2.5 animate-fadeIn"
          id="network-status-popover"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-rose-600" />
              )}
              <span className="font-bold text-stone-800">
                {isOnline ? "Network Connected" : "Connection Disconnected"}
              </span>
            </div>
            <button 
              onClick={() => setShowStatusPopover(false)}
              className="text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-stone-50 rounded-xl p-2.5 space-y-1.5 text-stone-600 border border-stone-100">
            <div className="flex justify-between items-center text-[11px]">
              <span><Bi en="Offline Mode:" sub="ऑफ़लाइन मोड:" /></span>
              <span className={`font-bold ${stats.isEnabled ? "text-emerald-700" : "text-stone-500"}`}>
                {stats.isEnabled ? "ENABLED (सक्रिय)" : "DISABLED (बंद)"}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span><Bi en="Cached Field Guides:" sub="सुरक्षित गाइड्स:" /></span>
              <span className="font-bold text-stone-900">{stats.totalCached} critical manuals</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span><Bi en="Storage Footprint:" sub="मेमोरी आकार:" /></span>
              <span className="font-mono text-stone-700">{stats.storageSizeKb} KB</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => {
                setShowStatusPopover(false);
                onOpenOfflineGuides();
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              id="btn-popover-open-guides"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <Bi en="Open Offline Field Guides" sub="ऑफ़लाइन गाइड्स खोलें" />
            </button>

            <button
              onClick={handleToggleSimulate}
              className={`w-full py-1.5 px-3 rounded-xl font-semibold text-[11px] border transition-all flex items-center justify-center gap-1.5 ${
                stats.isSimulatedOffline
                  ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200"
                  : "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
              }`}
              id="btn-popover-toggle-simulate"
            >
              {stats.isSimulatedOffline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Restore Online (ऑनलाइन मोड रीसेट करें)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-stone-500" />
                  <span>Simulate Disconnected Field (ऑफ़लाइन टेस्ट करें)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NetworkStatusIndicator({ onOpenOfflineGuides }: NetworkStatusProps) {
  return (
    <div>
      <NetworkStatusBanner onOpenOfflineGuides={onOpenOfflineGuides} />
    </div>
  );
}
