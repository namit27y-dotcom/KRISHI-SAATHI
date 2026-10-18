import { dbConnection } from "../db/connection.js";

// Regional language mapping heuristics based on Indian States
const STATE_LANGUAGE_SUGGESTIONS: Record<string, { primary: string; secondary?: string[]; labelEn: string; labelNative: string }> = {
  "maharashtra": { primary: "mr", labelEn: "Marathi", labelNative: "मराठी" },
  "bihar": { primary: "hi", secondary: ["bho", "mai"], labelEn: "Hindi / Bhojpuri / Maithili", labelNative: "हिंदी / भोजपुरी / मैथिली" },
  "uttar pradesh": { primary: "hi", secondary: ["bho"], labelEn: "Hindi / Bhojpuri", labelNative: "हिंदी / भोजपुरी" },
  "punjab": { primary: "pa", labelEn: "Punjabi", labelNative: "ਪੰਜਾਬੀ" },
  "tamil nadu": { primary: "ta", labelEn: "Tamil", labelNative: "தமிழ்" },
  "andhra pradesh": { primary: "te", labelEn: "Telugu", labelNative: "తెలుగు" },
  "telangana": { primary: "te", labelEn: "Telugu", labelNative: "తెలుగు" },
  "west bengal": { primary: "bn", labelEn: "Bengali", labelNative: "বাংলা" },
  "madhya pradesh": { primary: "hi", labelEn: "Hindi", labelNative: "हिंदी" },
  "rajasthan": { primary: "hi", labelEn: "Hindi", labelNative: "हिंदी" },
  "haryana": { primary: "hi", labelEn: "Hindi", labelNative: "हिंदी" },
  "gujarat": { primary: "gu", labelEn: "Gujarati", labelNative: "ગુજરાતી" },
  "karnataka": { primary: "kn", labelEn: "Kannada", labelNative: "ಕನ್ನಡ" },
  "kerala": { primary: "ml", labelEn: "Malayalam", labelNative: "മലയാളം" },
  "odisha": { primary: "or", labelEn: "Odia", labelNative: "ଓଡ଼ିଆ" },
};

// Bilingual Display Dictionary for Dynamic Geo Values
const GEO_TRANSLATIONS: Record<string, Record<string, string>> = {
  "india": { hi: "भारत", mr: "भारत", mai: "भारत", bho: "भारत" },
  "maharashtra": { hi: "महाराष्ट्र", mr: "महाराष्ट्र", mai: "महाराष्ट्र", bho: "महाराष्ट्र" },
  "pune": { hi: "पुणे", mr: "पुणे", mai: "पुणे", bho: "पुणे" },
  "khed": { hi: "खेड़", mr: "खेड", mai: "खेड़", bho: "खेड़" },
  "uttar pradesh": { hi: "उत्तर प्रदेश", mr: "उत्तर प्रदेश", mai: "उत्तर प्रदेश", bho: "उत्तर प्रदेश" },
  "varanasi": { hi: "वाराणसी", mr: "वाराणसी", mai: "वाराणसी", bho: "बनारस" },
  "bihar": { hi: "बिहार", mr: "बिहार", mai: "बिहार", bho: "बिहार" },
  "patna": { hi: "पटना", mr: "पटना", mai: "पटना", bho: "पटना" },
  "loamy": { hi: "दोमट", mr: "पोयटा / मध्यम काळी", mai: "दोमट", bho: "दोमट" },
  "clayey": { hi: "चिकनी मिट्टी", mr: "काळी कसदार चिकनमाती", mai: "चिकनी माटी", bho: "चिकन माटी" },
  "black cotton soil": { hi: "काली कपास मिट्टी", mr: "काळी कापसाची जमीन", mai: "कारी माटी", bho: "करिया माटी" },
};

export class LocationService {
  public static suggestLanguageFromLocation(state?: string, country: string = "India"): {
    suggestedLanguage: string;
    secondarySuggestions: string[];
    explanation: string;
  } {
    if (!state) {
      return {
        suggestedLanguage: "en",
        secondarySuggestions: ["hi"],
        explanation: "Defaulting to English base language."
      };
    }

    const cleanState = state.toLowerCase().trim();
    const match = STATE_LANGUAGE_SUGGESTIONS[cleanState];

    if (match) {
      return {
        suggestedLanguage: match.primary,
        secondarySuggestions: match.secondary || [],
        explanation: `Based on your confirmed location in ${state}, we suggest ${match.labelEn} (${match.labelNative}). You can switch to any other language at any time.`
      };
    }

    return {
      suggestedLanguage: "hi",
      secondarySuggestions: ["en"],
      explanation: `Location confirmed in ${state}. Defaulting to Hindi / English.`
    };
  }

  public static async updateConfirmedLocation(userId: string, data: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    country?: string;
    state?: string;
    district?: string;
    village?: string;
    postalCode?: string;
  }) {
    const { latitude, longitude, accuracy = 0, country = "India", state = "", district = "", village = "", postalCode = "" } = data;

    // Store CANONICAL English values in database
    await dbConnection.execute(
      `UPDATE users SET latitude = ?, longitude = ?, location_accuracy = ?, country = ?, state = ?, district = ?, village = ?, postal_code = ? WHERE id = ?`,
      [latitude, longitude, accuracy, country, state, district, village, postalCode, userId]
    );

    const languageSuggestion = this.suggestLanguageFromLocation(state, country);

    return {
      success: true,
      confirmedLocation: {
        country,
        state,
        district,
        village,
        postalCode,
        latitude,
        longitude,
        accuracy
      },
      languageSuggestion
    };
  }

  // Format canonical values with dual bilingual display
  public static formatBilingual(value: string, targetLang: string = "en"): { canonical: string; localized: string; displayString: string } {
    if (!value) return { canonical: "", localized: "", displayString: "" };
    if (targetLang === "en") return { canonical: value, localized: value, displayString: value };

    const clean = value.toLowerCase().trim();
    const localized = GEO_TRANSLATIONS[clean]?.[targetLang] || value;
    const displayString = localized !== value ? `${value} · ${localized}` : value;

    return {
      canonical: value,
      localized,
      displayString
    };
  }
}
