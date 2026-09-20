import { SupportedLanguage } from "../types";
import { TranslationSchema } from "./schema";
import { en } from "./en";
import { hi } from "./hi";
import { bho } from "./bho";
import { mr } from "./mr";
import { pa } from "./pa";
import { ta } from "./ta";
import { te } from "./te";
import { bn } from "./bn";
import { es } from "./es";
import { vi } from "./vi";
import { sw } from "./sw";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "bho", label: "Bhojpuri", nativeLabel: "भोजपुरी", flag: "🌾" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🚩" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", flag: "👳" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🏛️" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", flag: "🌿" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🐅" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", flag: "🌍" },
];

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en,
  hi,
  bho,
  mr,
  pa,
  ta,
  te,
  bn,
  es,
  vi,
  sw,
};

/**
 * Get translations for the specified language with automatic fallback to English
 */
export function getTranslations(lang: SupportedLanguage): TranslationSchema {
  return translations[lang] || translations.en;
}
