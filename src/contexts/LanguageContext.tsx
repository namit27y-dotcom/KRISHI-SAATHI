import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLanguage } from "../types";
import { TranslationSchema } from "../locales/schema";
import { SUPPORTED_LANGUAGES, LanguageOption, getTranslations, translations } from "../locales";
import { Bilingual, Bi, bString } from "../components/Bilingual";

export { Bilingual, Bi, bString };

export interface BilingualOptions {
  className?: string;
  enClassName?: string;
  subClassName?: string;
  inline?: boolean;
  variant?: "default" | "button" | "heading" | "badge";
  as?: React.ElementType;
}

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isBilingual: boolean;
  t: TranslationSchema;
  en: TranslationSchema;
  /**
   * Helper to retrieve nested keys by dot notation with fallback.
   * Never displays broken technical keys to users.
   */
  tf: (path: string, fallback?: string) => string;
  /**
   * Universal bilingual helper: renders English + Selected Language stacked.
   * If language is 'en', returns only English.
   */
  b: (en: React.ReactNode, sub?: React.ReactNode, options?: BilingualOptions) => React.ReactNode;
  /** Shorthand for b() */
  bt: (en: React.ReactNode, sub?: React.ReactNode, options?: BilingualOptions) => React.ReactNode;
  /**
   * Look up key in English & selected language and render bilingually
   */
  bKey: (path: string, fallbackEn?: string, options?: BilingualOptions) => React.ReactNode;
  /**
   * String helper for HTML input attributes (placeholder, title, aria-label)
   */
  bString: (en: string, sub?: string) => string;
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
  const englishTranslations = translations.en;
  const isBilingual = language !== "en";

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
        let enCurr: any = englishTranslations;
        for (const p of parts) {
          if (enCurr && typeof enCurr === "object" && p in enCurr) {
            enCurr = enCurr[p];
          } else {
            return fallback || "Translation unavailable";
          }
        }
        return typeof enCurr === "string" ? enCurr : fallback || "Translation unavailable";
      }
    }
    return typeof curr === "string" ? curr : fallback || "Translation unavailable";
  };

  const b = (
    enText: React.ReactNode,
    subText?: React.ReactNode,
    options?: BilingualOptions
  ): React.ReactNode => {
    return (
      <Bilingual
        en={enText}
        sub={subText}
        className={options?.className}
        enClassName={options?.enClassName}
        subClassName={options?.subClassName}
        inline={options?.inline}
        variant={options?.variant}
        as={options?.as}
      />
    );
  };

  const bt = b;

  const bKey = (
    path: string,
    fallbackEn?: string,
    options?: BilingualOptions
  ): React.ReactNode => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let enCurr: any = englishTranslations;
    for (const p of parts) {
      if (enCurr && typeof enCurr === "object" && p in enCurr) {
        enCurr = enCurr[p];
      } else {
        enCurr = fallbackEn || path.split(".").pop() || "Field";
        break;
      }
    }
    const enVal = typeof enCurr === "string" ? enCurr : fallbackEn || "Field";

    let regionalVal: string | undefined = undefined;
    if (isBilingual) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let curr: any = currentTranslations;
      for (const p of parts) {
        if (curr && typeof curr === "object" && p in curr) {
          curr = curr[p];
        } else {
          curr = undefined;
          break;
        }
      }
      if (typeof curr === "string" && curr.trim().length > 0 && curr !== enVal) {
        regionalVal = curr;
      } else {
        // Fallback to hindi if available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let hiCurr: any = translations.hi;
        for (const p of parts) {
          if (hiCurr && typeof hiCurr === "object" && p in hiCurr) {
            hiCurr = hiCurr[p];
          } else {
            hiCurr = undefined;
            break;
          }
        }
        if (typeof hiCurr === "string" && hiCurr.trim().length > 0 && hiCurr !== enVal) {
          regionalVal = hiCurr;
        }
      }
    }

    return (
      <Bilingual
        en={enVal}
        sub={regionalVal}
        className={options?.className}
        enClassName={options?.enClassName}
        subClassName={options?.subClassName}
        inline={options?.inline}
        variant={options?.variant}
        as={options?.as}
      />
    );
  };

  const bStringHelper = (enText: string, subText?: string): string => {
    return bString(enText, subText, isBilingual);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isBilingual,
        t: currentTranslations,
        en: englishTranslations,
        tf,
        b,
        bt,
        bKey,
        bString: bStringHelper,
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
