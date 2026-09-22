import { CriticalFieldGuide, DEFAULT_CRITICAL_FIELD_GUIDES } from "../data/criticalFieldGuidesData.ts";

const STORAGE_KEY_GUIDES = "krishi_offline_guides_v1";
const STORAGE_KEY_CONFIG = "krishi_offline_config_v1";

export interface OfflineCacheStats {
  isEnabled: boolean;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  totalCached: number;
  lastSynced: string | null;
  storageSizeKb: number;
}

export interface OfflineCacheConfig {
  enabled: boolean;
  simulatedOffline: boolean;
  lastSyncTime: string;
}

// Read config safely
export function getOfflineConfig(): OfflineCacheConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read offline cache config:", err);
  }
  return {
    enabled: true, // Default to true so critical guides are ready for remote farmers
    simulatedOffline: false,
    lastSyncTime: new Date().toISOString()
  };
}

// Save config
export function saveOfflineConfig(config: Partial<OfflineCacheConfig>): void {
  try {
    const current = getOfflineConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
    dispatchCacheUpdateEvent();
  } catch (err) {
    console.error("Failed to save offline cache config:", err);
  }
}

// Check effective online status (considers simulated offline)
export function getEffectiveOnlineStatus(): boolean {
  if (typeof window === "undefined") return true;
  const config = getOfflineConfig();
  if (config.simulatedOffline) return false;
  return window.navigator ? window.navigator.onLine : true;
}

// Toggle or set simulated offline mode (ideal for demo/field test)
export function setSimulatedOffline(simulated: boolean): void {
  saveOfflineConfig({ simulatedOffline: simulated });
  window.dispatchEvent(new CustomEvent("krishi-network-status-changed", {
    detail: { isOnline: getEffectiveOnlineStatus(), isSimulated: simulated }
  }));
}

// Read cached guides from localStorage, seeding default critical guides if empty
export function getCachedFieldGuides(): CriticalFieldGuide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GUIDES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed defaults into local cache automatically so farmer has immediate offline safety net
    const seeded = DEFAULT_CRITICAL_FIELD_GUIDES.map(g => ({
      ...g,
      cachedAt: new Date().toISOString()
    }));
    localStorage.setItem(STORAGE_KEY_GUIDES, JSON.stringify(seeded));
    return seeded;
  } catch (err) {
    console.error("Failed to read cached field guides:", err);
    return DEFAULT_CRITICAL_FIELD_GUIDES;
  }
}

// Cache all critical guides now (force sync)
export function cacheAllCriticalGuides(): { success: boolean; count: number } {
  try {
    const existing = getCachedFieldGuides();
    const customGuides = existing.filter(g => g.isCustom);
    
    // Combine defaults with existing user custom scans
    const nowIso = new Date().toISOString();
    const updatedDefaults = DEFAULT_CRITICAL_FIELD_GUIDES.map(g => ({
      ...g,
      cachedAt: nowIso
    }));
    
    const combined = [...updatedDefaults, ...customGuides];
    localStorage.setItem(STORAGE_KEY_GUIDES, JSON.stringify(combined));
    saveOfflineConfig({ enabled: true, lastSyncTime: nowIso });
    dispatchCacheUpdateEvent();
    return { success: true, count: combined.length };
  } catch (err) {
    console.error("Error caching critical guides:", err);
    return { success: false, count: 0 };
  }
}

// Add a custom scanned plant identification result to offline guides
export function cacheCustomScannedPlant(data: {
  commonName: string;
  scientificName: string;
  family: string;
  summary: string;
  soilCompatibility?: string;
  fertilizer?: string;
  diseases?: string;
  localName?: string;
}): CriticalFieldGuide {
  const existing = getCachedFieldGuides();
  const newGuide: CriticalFieldGuide = {
    id: `custom-scan-${Date.now()}`,
    category: "custom_scan",
    titleEn: `${data.commonName} (${data.scientificName}) Field Guide`,
    titleHi: `${data.localName || data.commonName} फील्ड गाइड`,
    cropOrSubject: data.commonName,
    seasonOrStage: "Identified in Field",
    urgency: "high",
    summaryEn: data.summary || `${data.commonName} - Botanical family: ${data.family}`,
    summaryHi: data.localName ? `${data.localName} - बॉटनिकल कुल: ${data.family}` : data.summary,
    symptomsOrKeyIndicators: [
      { en: `Botanical Family: ${data.family}`, hi: `वानस्पतिक कुल: ${data.family}` },
      { en: `Scientific Name: ${data.scientificName}`, hi: `वैज्ञानिक नाम: ${data.scientificName}` }
    ],
    immediateSteps: [
      { 
        stepEn: data.fertilizer ? `Recommended nutrition: ${data.fertilizer}` : "Monitor plant canopy and soil moisture regularly.",
        stepHi: data.fertilizer ? `अनुशंसित पोषण: ${data.fertilizer}` : "पौधे की पत्तियों और मिट्टी की नमी का नियमित निरीक्षण करें।"
      },
      {
        stepEn: data.soilCompatibility ? `Soil match: ${data.soilCompatibility}` : "Ensure balanced drainage and organic amendments.",
        stepHi: data.soilCompatibility ? `मिट्टी अनुकूलता: ${data.soilCompatibility}` : "संतुलित जल निकासी और जैविक खाद सुनिश्चित करें।"
      }
    ],
    dosageOrSchedule: [
      { itemEn: "Target Soil Match", itemHi: "अनुकूल मिट्टी", dose: data.soilCompatibility?.slice(0, 50) || "Loamy / Organic Well Drained" },
      { itemEn: "Primary Disease Watch", itemHi: "मुख्य रोग निगरानी", dose: data.diseases?.slice(0, 50) || "Monitor for fungal leaf spots & wilting" }
    ],
    organicRemedyEn: "Apply fermented neem oil 1500ppm + Jeevamrit soil drench every 14 days.",
    organicRemedyHi: "1500 पीपीएम नीम तेल और जीवामृत का 14 दिन पर छिड़काव करें।",
    emergencyContact: "Kisan Call Centre: 1800-180-1551",
    cachedAt: new Date().toISOString(),
    isCustom: true
  };

  const updated = [newGuide, ...existing.filter(g => g.id !== newGuide.id)];
  localStorage.setItem(STORAGE_KEY_GUIDES, JSON.stringify(updated));
  dispatchCacheUpdateEvent();
  return newGuide;
}

// Calculate storage stats
export function getOfflineCacheStats(): OfflineCacheStats {
  const config = getOfflineConfig();
  const guides = getCachedFieldGuides();
  const rawGuides = localStorage.getItem(STORAGE_KEY_GUIDES) || "";
  const sizeBytes = new Blob([rawGuides]).size;
  const sizeKb = Math.round((sizeBytes / 1024) * 10) / 10;

  return {
    isEnabled: config.enabled,
    isOnline: getEffectiveOnlineStatus(),
    isSimulatedOffline: config.simulatedOffline,
    totalCached: guides.length,
    lastSynced: config.lastSyncTime,
    storageSizeKb: sizeKb
  };
}

// Dispatch event for UI reactivity
function dispatchCacheUpdateEvent(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("krishi-offline-cache-updated", {
      detail: getOfflineCacheStats()
    }));
  }
}
