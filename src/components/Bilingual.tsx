import React from "react";
import { useLanguage } from "../contexts/LanguageContext.tsx";

export interface BilingualProps {
  /** The primary, base English text (ALWAYS shown) */
  en: React.ReactNode;
  /** The translated regional text in selected language (shown below English when not in English mode) */
  sub?: React.ReactNode;
  /** Optional dot-separated translation key path to lookup automatically */
  tKey?: string;
  /** Additional container classes */
  className?: string;
  /** Classes applied specifically to the English text line */
  enClassName?: string;
  /** Classes applied specifically to the regional text line below English */
  subClassName?: string;
  /** Whether to render as inline-flex instead of flex */
  inline?: boolean;
  /** Semantic HTML tag or component to render as (default: span) */
  as?: React.ElementType;
  /** Visual variant: 'default' | 'button' | 'heading' | 'badge' */
  variant?: "default" | "button" | "heading" | "badge";
}

/**
 * Universal Bilingual UI Component for Krishi Saathi
 * 
 * Enforces the core mandate:
 * - English is the base language and ALWAYS remains visible.
 * - When a non-English language (Hindi, Marathi, Maithili, Bhojpuri, etc.) is selected,
 *   renders:
 *     ENGLISH
 *     Selected Language
 * - When English is selected, only English is shown.
 */
export const Bilingual: React.FC<BilingualProps> = ({
  en,
  sub,
  tKey,
  className = "",
  enClassName = "",
  subClassName = "",
  inline = false,
  as: Component = "span",
  variant = "default",
}) => {
  const { language, isBilingual, tf } = useLanguage();

  let regionalText = sub;
  if (!regionalText && tKey) {
    const lookedUp = tf(tKey);
    if (lookedUp && lookedUp !== en && lookedUp !== tKey) {
      regionalText = lookedUp;
    }
  }

  // If user selected English or no regional translation exists or it equals English: show only English
  if (!isBilingual || !regionalText || regionalText === en) {
    return (
      <Component className={className}>
        <span className={enClassName}>{en}</span>
      </Component>
    );
  }

  // Layout styling variants
  let containerStyles = inline ? "inline-flex flex-col" : "flex flex-col";
  let defaultSubStyles = "text-[0.8em] leading-tight font-normal opacity-90 mt-0.5";

  if (variant === "button") {
    containerStyles = "inline-flex flex-col items-center justify-center text-center leading-none";
    defaultSubStyles = "text-[0.76em] leading-tight font-medium opacity-90 mt-0.5 tracking-normal";
  } else if (variant === "heading") {
    defaultSubStyles = "text-[0.75em] leading-tight font-medium text-emerald-800/80 mt-0.5 tracking-normal";
  } else if (variant === "badge") {
    containerStyles = "inline-flex flex-col items-center leading-none";
    defaultSubStyles = "text-[0.72em] leading-tight font-normal opacity-85 mt-0.25";
  }

  return (
    <Component className={`${containerStyles} ${className}`}>
      <span className={`leading-tight ${enClassName}`}>{en}</span>
      <span className={`${defaultSubStyles} ${subClassName}`} lang={language}>
        {regionalText}
      </span>
    </Component>
  );
};

export const Bi = Bilingual;

/**
 * String formatter for attributes (placeholder, title, alt) that cannot take JSX elements.
 * Example: "Search products... (उत्पाद खोजें...)"
 */
export function bString(enText: string, subText?: string, isBilingual: boolean = false): string {
  if (!isBilingual || !subText || subText === enText) {
    return enText;
  }
  return `${enText} (${subText})`;
}
