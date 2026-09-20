import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLanguage } from "../types";
import { TranslationSchema } from "../locales/schema";
import { SUPPORTED_LANGUAGES, LanguageOption, getTranslations } from "../locales";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationSchema;
  /**
   * Helper to retrieve nested keys by dot notation with fallback
   * e.g. tf("weather.temperature", "Temperature")
   */
  tf: (path: string, fallback?: string) => string;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "krishi_language";

export const LanguageProvider: React.FC<{
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}> = ({ children, initialLanguage, onLanguageChange }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (initialLanguage) return initialLanguage;
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // localStorage may fail in some sandboxed environments
    }
    return "en";
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore localStorage errors
    }
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Sync if initialLanguage changes from outside (e.g. user profile loaded)
  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguageState(initialLanguage);
      try {
        localStorage.setItem(STORAGE_KEY, initialLanguage);
      } catch {
        // Ignore
      }
    }
  }, [initialLanguage]);

  const currentTranslations = getTranslations(language);

  const tf = (path: string, fallback = ""): string => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let curr: any = currentTranslations;
    for (const part of parts) {
      if (curr && typeof curr === "object" && part in curr) {
        curr = curr[part];
      } else {
        // Fallback to English
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let enCurr: any = getTranslations("en");
        for (const p of parts) {
          if (enCurr && typeof enCurr === "object" && p in enCurr) {
            enCurr = enCurr[p];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurr === "string" ? enCurr : fallback || path;
      }
    }
    return typeof curr === "string" ? curr : fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        tf,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
