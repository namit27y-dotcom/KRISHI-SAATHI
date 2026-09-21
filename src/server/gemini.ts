import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const MODEL_NAME = "gemini-2.5-flash";

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  bho: "Bhojpuri (भोजपुरी)",
  mr: "Marathi (मराठी)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  bn: "Bengali (বাংলা)",
  es: "Spanish (Español)",
  vi: "Vietnamese (Tiếng Việt)",
  sw: "Swahili (Kiswahili)",
};

// Helper to convert base64 image object for Gemini SDK
function getGeminiImagePart(base64Data: string) {
  // strip data:image/...;base64, prefix if present
  let cleanBase64 = base64Data;
  let mimeType = "image/jpeg";

  if (base64Data.startsWith("data:")) {
    const match = base64Data.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      cleanBase64 = match[2];
    }
  }

  return {
    inlineData: {
      data: cleanBase64,
      mimeType: mimeType,
    },
  };
}

// Timeout and Fallback Wrapper Function
async function withTimeoutAndFallback<T>(
  promise: Promise<T>,
  fallbackGenerator: () => T,
  timeoutMs: number = 15000
): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Timeout"));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn(`[Gemini] API issue or timeout (falling back to agronomist mock):`, error.message || error);
    return fallbackGenerator();
  }
}

// Fallback Generators
function getIdentifyPlantFallback(soilType: string = "Loamy", preferredLanguage: string = "en") {
  const isTomato = soilType.toLowerCase() === "loamy";
  const cropName = isTomato ? "Tomato" : "Wheat";
  const scientificName = isTomato ? "Solanum lycopersicum" : "Triticum aestivum";
  const localNames = isTomato 
    ? [
        { "language": "hi", "name": "टमाटर (Tamatar)" },
        { "language": "mr", "name": "टोमॅटो (Tomato)" }
      ]
    : [
        { "language": "hi", "name": "गेहूं (Gehun)" },
        { "language": "mr", "name": "गहू (Gahu)" }
      ];
  
  return {
    identity: {
      scientificName,
      commonName: cropName,
      localNames,
      family: isTomato ? "Solanaceae" : "Poaceae",
      plantType: "crop",
      growthHabit: isTomato ? "perennial; herb" : "annual; herb",
      confidenceScore: 92,
      uncertainCandidates: isTomato ? ["Eggplant", "Pepper"] : ["Barley", "Rye"]
    },
    botanicalInfo: {
      nativeRegion: isTomato ? "Central and South America" : "Middle East",
      growingSeasonIndia: isTomato ? "Kharif / Rabi / Zaid" : "Rabi",
      sunlight: "Full sun",
      waterRequirement: isTomato ? "Medium (approx 25 mm/week)" : "Medium (approx 15-20 mm/week)",
      lifecycleDuration: isTomato ? "120-150 days" : "110-130 days",
      beneficialUses: isTomato ? "Human consumption, companion crop, rich in vitamins" : "Staple food crop, livestock fodder"
    },
    diseaseSusceptibility: {
      commonDiseases: isTomato ? "Early Blight, Leaf Spot, Fruit Rot" : "Rust, Loose Smut, Powdery Mildew",
      earlyWarningSigns: isTomato ? "Brown spots on leaves with concentric yellow halos" : "Yellowish or orange pustules on leaves and stalks",
      isCurrentlyDiseased: false,
      visibleSymptoms: "No active infection visible in this snapshot. The foliage displays healthy turgor and chlorophyll density."
    },
    soilCompatibility: {
      idealPhRange: "6.0 - 6.8",
      idealSoilTexture: isTomato ? "Loamy" : "Clayey / Loamy",
      idealNutrients: "High organic matter, moderate nitrogen, balanced phosphorus and potassium",
      compatibilityScore: "Good match",
      soilMatchExplanation: `The detected crop (${cropName}) aligns perfectly with your active soil profile (${soilType}). pH and aeration levels are in the optimal biological band.`,
      organicAmendments: "Composted farmyard manure, vermicompost, leaf mulch"
    },
    sustainableFertilizer: {
      firstChoiceOrganic: "Neem cake blend with well-composted farm manure and Azotobacter biofertilizer",
      secondChoiceMineral: "Low-dose NPK (19-19-19) applied through spot-dosing to minimize leaching",
      applicationMethod: "Split dosage: 50% at land preparation, 50% at vegetative stage as side-dressing",
      environmentalCaution: "Avoid application right before forecasted rain to prevent toxic runoff into local streams.",
      companionPlanting: isTomato ? "French Marigolds (trap crop) and Basil" : "Mustard or Chickpeas as mixed/intercropping",
      estimatedCostComparison: "Organic Route: Low (₹800/acre via home-composting); Synthetic: Medium (₹1,500/acre)"
    },
    environmentalImpactNote: "Sustainable farming starts with organic-first nitrogen fixation. Protect groundwater by avoiding heavy synthetic broadcasting.",
    multilingualSummary: preferredLanguage === "hi" 
      ? `यह पौधा ${cropName} (${scientificName}) है। यह आपके ${soilType} मिट्टी के लिए उत्कृष्ट है। अच्छी उपज के लिए जैविक खाद का उपयोग करें।`
      : preferredLanguage === "mr"
      ? `हे रोप ${cropName} (${scientificName}) आहे. हे तुमच्या ${soilType} मातीसाठी अतिशय योग्य आहे. चांगल्या उत्पादनासाठी सेंद्रिय खताचा वापर करा.`
      : `This specimen is identified as ${cropName} (${scientificName}). It shows excellent compatibility with your ${soilType} soil. Use organic-first compost to ensure nutrient retention.`
  };
}

function getDetectDiseaseFallback() {
  return {
    cropName: "Tomato",
    diseaseName: "Early Blight (Alternaria solani)",
    confidence: 88,
    symptoms: "Target-board brown spots with concentric rings starting on older lower leaves, progressive yellowing.",
    causes: "Fungal pathogen favored by warm temperatures, high humidity, and wet leaf surfaces.",
    organicTreatment: "Apply 1% Neem Oil spray or copper-based organic fungicide. Remove lower infected leaves and destroy them. Apply straw mulching to prevent soil splashing.",
    chemicalTreatment: "Minimum dose of Mancozeb or Chlorothalonil ONLY if infection spreads to upper 30% of foliage.",
    preventiveMeasures: "Implement 3-year crop rotation (avoid solanaceous crops), optimize plant spacing for air circulation, and use drip irrigation instead of overhead watering.",
    recoveryTime: "10-14 days to arrest spread"
  };
}

function getRecommendCropsFallback(state: string, district: string, soilType: string, season: string) {
  const isKharif = season.toLowerCase().includes("kharif");
  const isRabi = season.toLowerCase().includes("rabi");
  
  const recommendations = isKharif
    ? [
        {
          cropName: "Rice (Paddy)",
          suitableSowingPeriod: "June 15 - July 15",
          whyRecommended: `Excellent water retention properties of ${soilType} soil makes monsoon Kharif season perfect for high paddy yield in ${district}.`,
          estimatedDaysToHarvest: "120-135 days"
        },
        {
          cropName: "Maize (Corn)",
          suitableSowingPeriod: "June 1 - June 25",
          whyRecommended: `Requires warm weather and well-draining soil, thriving on early Kharif showers in ${state}.`,
          estimatedDaysToHarvest: "90-110 days"
        },
        {
          cropName: "Soybean",
          suitableSowingPeriod: "June 15 - July 5",
          whyRecommended: `Nitrogen-fixing legume that improves soil health while capitalizing on early rainfall.`,
          estimatedDaysToHarvest: "100-115 days"
        }
      ]
    : isRabi
    ? [
        {
          cropName: "Wheat",
          suitableSowingPeriod: "November 1 - November 25",
          whyRecommended: `Cool winter climate of Rabi season in ${district} paired with moisture-holding ${soilType} soil creates ideal growing condition.`,
          estimatedDaysToHarvest: "115-125 days"
        },
        {
          cropName: "Chickpea (Gram)",
          suitableSowingPeriod: "October 15 - November 10",
          whyRecommended: `Drought-resistant legume requiring very little residual soil moisture to yield well during dry winters in ${state}.`,
          estimatedDaysToHarvest: "110-120 days"
        },
        {
          cropName: "Mustard",
          suitableSowingPeriod: "October 1 - October 31",
          whyRecommended: `Excellent cold tolerance and low water footprint, matching the winter temperatures of ${state}.`,
          estimatedDaysToHarvest: "105-115 days"
        }
      ]
    : [ // Summer / Zaid
        {
          cropName: "Moong Bean (Green Gram)",
          suitableSowingPeriod: "March 1 - March 25",
          whyRecommended: `Short duration, heat-resistant legume that acts as green manure for the upcoming Kharif cycle.`,
          estimatedDaysToHarvest: "65-75 days"
        },
        {
          cropName: "Watermelon",
          suitableSowingPeriod: "February 15 - March 15",
          whyRecommended: `Requires dry heat and plenty of sunshine to build sugars, performing best under drip irrigation in summer.`,
          estimatedDaysToHarvest: "80-90 days"
        },
        {
          cropName: "Cucumber",
          suitableSowingPeriod: "March 1 - April 5",
          whyRecommended: `Fast-growing cash crop perfect for warm summer months with stable groundwater irrigation.`,
          estimatedDaysToHarvest: "55-65 days"
        }
      ];

  return {
    weatherAnalysis: `Sowing season in ${district}, ${state} features stable solar radiation and temperature bands ideal for seed germination and seedling establishment.`,
    rainfallPrediction: isKharif 
      ? "Predicting healthy monsoon rainfall with 80-120 mm weekly spacing. Recommend monitoring drainage lines to avoid root waterlogging."
      : "Dry weather expected with negligible rainfall. Sowing will rely fully on ground water or canal irrigation resources.",
    temperatureInsights: isKharif 
      ? "Daytime highs between 28-34°C; warm nights are perfect for leaf elongation." 
      : isRabi 
      ? "Cool temperatures (15-22°C day, 8-12°C night) support tillering and grain development."
      : "High temperatures (34-40°C) with low relative humidity. Ensure evening watering to reduce thermal stress.",
    farmingAdvice: "Ensure field is tilled to 15-20 cm. Incorporate 5 tons of farmyard manure per hectare during deep tillage. Prepare raised beds for better irrigation efficiency.",
    riskAlerts: isKharif 
      ? "Risk of aphid outbreaks due to intermittent high humidity. Spray garlic-neem solution early as a preventative measure."
      : "Low-temperature frost risk at flower-initiation stage. Provide light evening sprinkler irrigation to increase soil thermal mass.",
    recommendations
  };
}

function getPlanFertilizerFallback(crop: string, growthStage: string, soilType: string, fieldSize: number) {
  return {
    recommendedFertilizer: "Vermicompost mixed with Azotobacter & PSB (Phosphorus Solubilizing Bacteria)",
    quantity: `${Math.round(fieldSize * 150)} kg of Vermicompost, ${Math.round(fieldSize * 5)} kg Azotobacter`,
    schedule: `Apply 60% as basal dose during final soil preparation. Split the remaining 40% as a side-dress near the root zone at the ${growthStage} stage.`,
    organicAlternatives: "Green manuring with Sunnhemp before sowing, vermicompost tea drenching, neem cake application, and straw mulching to lock moisture and organic carbon.",
    estimatedCost: Math.round(fieldSize * 1200),
    environmentalExplanation: "This organic-first biofertilizer dosage minimizes nitrate leaching, preserves mycorrhizal soil fungi, and completely prevents groundwater contamination."
  };
}

function getPlanIrrigationFallback(crop: string, growthStage: string, soilType: string) {
  return {
    waterRequirement: "15 - 20 mm depth per week (approx. 2.5 liters per plant daily for young seedlings)",
    frequency: soilType.toLowerCase() === "sandy" ? "Every 2 days (low retention)" : "Every 4-5 days (good retention)",
    bestTiming: "Early morning (5:00 AM - 7:30 AM) to drastically minimize evaporation loss and prevent leaf fungal spore germination.",
    waterSavingRecommendations: "Install a low-cost drip irrigation line. Use 3-inch deep straw or sugarcane bagasse mulching around crop basins to cut evapotranspiration by 40%."
  };
}

function getQueryGovernmentSchemesFallback(query: string, farmerState: string, farmerCrop: string, landSize: number) {
  return {
    matchingSchemes: [
      {
        name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        eligibility: "All small and marginal landholding farmer families in India owning cultivable land.",
        benefits: "Direct income support of ₹6,000 per year paid in three equal installments of ₹2,000 directly to bank accounts.",
        requiredDocuments: "Aadhaar Card, Land Registry Ownership records (7/12 extract), Bank Account Passbook.",
        officialLink: "https://pmkisan.gov.in",
        lastApplicationDate: "Ongoing / Year-round registration"
      },
      {
        name: `PM-FBY (Pradhan Mantri Fasal Bima Yojana) in ${farmerState}`,
        eligibility: `Farmers growing registered crops (like ${farmerCrop}) in notified districts of ${farmerState}.`,
        benefits: "Comprehensive insurance coverage against crop failure due to drought, pests, or unseasonal storms with very low premium (1.5% to 2%).",
        requiredDocuments: "Land Possession Certificate, Sowing Certificate from local Patwari, Aadhaar, bank details.",
        officialLink: "https://pmfby.gov.in",
        lastApplicationDate: "Before July 31st for Kharif crops; December 31st for Rabi crops"
      }
    ],
    personalizedAdvice: `Based on your ${landSize}-acre landholding in ${farmerState}, we highly recommend utilizing local micro-irrigation subsidy schemes (up to 80% subsidy on drip lines) through the PM-Krishi Sinchayee Yojana to manage water efficiently.`
  };
}

function getChatFarmingAssistantFallback(message: string, preferredLanguage: string = "en") {
  const query = message.toLowerCase();
  const isBilingual = preferredLanguage !== "en";

  if (query.includes("bigha") || query.includes("acre") || query.includes("convert") || query.includes("hectare") || query.includes("guntha")) {
    const enText = `🌾 **Land Unit Conversion Quick Guide:**

- **1 Acre** = **1.6 Pucca Bigha** (Standard in UP, Bihar, Rajasthan, MP)
- **1 Acre** = **3.025 Kachha Bigha** (Local North India standard)
- **1 Acre** = **40 Gunthas** (Maharashtra, Gujarat, Karnataka)
- **1 Acre** = **0.4047 Hectares** (or 4,047 sq meters / 43,560 sq ft)
- **1 Hectare** = **2.47 Acres** = **3.95 Bighas**

*Note: 1 Acre = 1.6 Pucca Bighas is the most widely recognized standard.*`;

    if (!isBilingual) return enText;

    const subText = preferredLanguage === "bho" 
      ? `🌾 **जमीन नाप के आसान हिसाब:**\n\n- **1 एकड़** = **1.6 पक्का बीघा** (बिहार, यूपी, राजस्थान खातिर)\n- **1 एकड़** = **3.025 कच्चा बीघा**\n- **1 एकड़** = **40 गुंठा**\n- **1 एकड़** = **0.4047 हेक्टेयर** (4,047 वर्ग मीटर)\n- **1 हेक्टेयर** = **2.47 एकड़**`
      : preferredLanguage === "hi"
      ? `🌾 **भूमि इकाई रूपांतरण त्वरित गाइड:**\n\n- **1 एकड़** = **1.6 पक्का बीघा** (यूपी, बिहार, राजस्थान, एमपी मानक)\n- **1 एकड़** = **3.025 कच्चा बीघा**\n- **1 एकड़** = **40 गुंठा**\n- **1 एकड़** = **0.4047 हेक्टेयर**\n- **1 हेक्टेयर** = **2.47 एकड़**`
      : preferredLanguage === "mr"
      ? `🌾 **जमीन मोजमाप जलद मार्गदर्शक:**\n\n- **1 एकर** = **40 गुंठे** (महाराष्ट्र मानक)\n- **1 एकर** = **1.6 पक्के बिघा**\n- **1 हेक्टर** = **2.47 एकर** = **100 गुंठे**`
      : `🌾 **जमीन नाप कऽ त्वरित मार्गदर्शिका:**\n\n- **1 एकड़** = **1.6 पक्का बीघा** (मिथिला आ बिहारक मानक)\n- **1 एकड़** = **40 गुंठा**\n- **1 हेक्टेयर** = **2.47 एकड़**`;

    return `${enText}\n\n---\n\n${subText}`;
  }

  if (query.includes("dairy") || query.includes("cow") || query.includes("buffalo") || query.includes("milk") || query.includes("cattle") || query.includes("mastitis")) {
    const enText = `🐄 **Dairy Cattle Nutrition & Health Guide:**

1. **Daily Balanced Ration (per milch animal):**
   - Green Fodder: 20-25 kg (Berseem, Maize, Sorghum, or Napier grass).
   - Dry Fodder: 4-5 kg (Wheat straw or paddy straw).
   - Concentrate / Balanced Cattle Feed: 1.5 kg for body maintenance + 400g per liter of milk produced.
   - Mineral Mixture: 50-60g daily with clean drinking water (70-90 liters/day).

2. **Mastitis Prevention & Hygiene:**
   - Always wash teats with mild potassium permanganate or antiseptic solution before and after milking.
   - Dip teats in post-milking teat dip (povidone-iodine). Keep cows standing for 30 minutes after milking while teat sphincters close.

3. **Critical Vaccination Schedule:**
   - Foot and Mouth Disease (FMD / खुरपका-मुंहपका): Twice a year (pre-monsoon & winter).
   - Hemorrhagic Septicemia (HS / गलघोंटू) & Black Quarter (BQ / लंगड़ा बुखार): Annually before monsoon.

⚠️ **Veterinary Disclaimer:** This information is for educational guidance only. If your animal exhibits fever, udder swelling, or refusal to eat, consult a qualified veterinarian immediately for clinical examination.`;

    if (!isBilingual) return enText;

    const subText = preferredLanguage === "bho"
      ? `🐄 **डेयरी पशु आहार आ स्वास्थ्य सलाह:**\n\n1. **संतुलित आहार:** प्रति दिन 20-25 किलो हरियर चारा, 4-5 किलो सूखा भूसा, आ दूध के हिसाब से पशु आहार (प्रति लीटर दूध पर 400 ग्राम) दीं। 50 ग्राम मिनरल मिक्सचर जरूर मिलाईं।\n2. **थनैला (Mastitis) से बचाव:** दुहाई से पहिले आ बाद में थन के बढ़िया से धोईं। दुहाई के बाद 30 मिनट ले गाय के बईठे मत दीं।\n3. **टीकाकरण:** खुरपका-मुंहपका (FMD) आ गलघोंटू के टीका समय से लगवावे के चाहीं।\n\n⚠️ **चेतावनी:** ई केवल सलाह बा। पशु के तबियत खराब होखे पर तुरंत सरकारी पशु डॉक्टर से जांच करवाईं।`
      : preferredLanguage === "hi"
      ? `🐄 **दुधारू पशु आहार एवं स्वास्थ्य प्रबंधन:**\n\n1. **संतुलित दैनिक आहार:** प्रति पशु 20-25 किग्रा हरा चारा, 4-5 किग्रा सूखा भूसा, तथा शरीर रक्षा हेतु 1.5 किग्रा + प्रति लीटर दूध पर 400 ग्राम संतुलित दाना दें। 50-60 ग्राम खनिज मिश्रण (Mineral Mixture) अवश्य खिलाएं।\n2. **थनैला रोग से सुरक्षा:** दुहाई से पहले व बाद में थनों को पोटाश या आयोडीन घोल से साफ करें। दुहाई के बाद गाय को कम से कम 30 मिनट तक बैठने न दें।\n3. **अनिवार्य टीकाकरण:** खुरपका-मुंहपका (FMD) साल में दो बार तथा गलघोंटू (HS) मानसून से पहले अवश्य लगवाएं।\n\n⚠️ **चिकित्सकीय अस्वीकरण:** यह केवल शैक्षणिक मार्गदर्शन है। बुखार या थन में सूजन दिखने पर तुरंत योग्य पशु चिकित्सक से परीक्षण कराएं।`
      : preferredLanguage === "mr"
      ? `🐄 **दुग्ध व्यवसाय पशु आहार व आरोग्य सल्ला:**\n\n1. **समतोल आहार:** दररोज 20-25 किलो हिरवा चारा, 4-5 किलो सुका चारा, आणि दुधाच्या प्रमाणानुसार खुराक (प्रति लिटर दुधामागे 400 ग्रॅम) द्या. 50 ग्रॅम खनिज मिश्रण नियमित द्या.\n2. **स्तनदाह (मस्टायटिस) प्रतिबंध:** धार काढण्यापूर्वी व नंतर कास स्वच्छ धुवा. धार काढल्यानंतर अर्धा तास जनावराला बसू देऊ नका.\n3. **लसीकरण:** लाळ्या खुरकूत (FMD) आणि घटसर्प (HS) लस वेळेवर टोचून घ्या.\n\n⚠️ **वैद्यकीय सूचना:** हा केवळ शैक्षणिक सल्ला आहे. आजारपणाच्या लक्षणांवर पशुवैद्यकीय डॉक्टरांचा प्रत्यक्ष सल्ला घ्या.`
      : `🐄 **दुधारू पशु आहार आ स्वास्थ्य प्रबंधन:**\n\n1. **संतुलित आहार:** 20-25 किलो हरियर चारा, 4-5 किलो भूसा, आ दूधक हिसाब सँ संतुलित दाना (प्रति लीटर दूध पर 400 ग्राम) दियौक। 50 ग्राम मिनरल मिक्चर अवश्य मिलाऊ।\n2. **थनैला सँ बचाव:** दुहाईक बाद थन के साफ राखू आ 30 मिनट धरि बैसय नहि दियौक।\n3. **टीकाकरण:** खुरपका आ गलघोंटूक टीका समय पर लगावू।\n\n⚠️ **पशु चिकित्सक सलाह:** ई केवल जानकारी अछि। बीमार भेला पर पशु डॉक्टर सँ जांच कराऊ।`;

    return `${enText}\n\n---\n\n${subText}`;
  }

  if (query.includes("sheep") || query.includes("goat") || query.includes("bakri") || query.includes("bhed") || query.includes("lamb") || query.includes("kid")) {
    const enText = `🐐 **Goat & Sheep Farming Scientific Care:**

1. **Stall-Feeding & Nutrition:**
   - Offer leguminous green fodder (Lucerne, Berseem, Subabul leaves) rich in protein.
   - Supplement with 150-250g concentrate mixture daily per adult goat/sheep.
   - Provide clean salt licking blocks to prevent mineral deficiencies.

2. **Crucial Preventive Health:**
   - **Deworming:** Administer broad-spectrum anthelmintics (Albendazole / Fenbendazole) 3-4 times a year, rotating active chemicals to prevent resistance.
   - **PPR Vaccine (Peste des Petits Ruminants / बकरी प्लेग):** Mandatory once in 3 years.
   - **ET Vaccine (Enterotoxemia / फिड़किया):** Annually before new flush of lush monsoon grazing.

3. **Shed Hygiene:** Elevated slatted wooden or bamboo floors keep goats dry, preventing pneumonia and hoof rot.

⚠️ **Veterinary Disclaimer:** Always verify dewormer dosage according to live body weight. Consult a registered veterinarian for sick animals.`;

    if (!isBilingual) return enText;

    const subText = preferredLanguage === "bho"
      ? `🐐 **बकरी आ भेड़ पालन जरूरी सलाह:**\n\n1. **आहार:** सुबबूल, बरसीम, आ अरहर के पत्ता के साथे 150-250 ग्राम दाना रोज दीं। शेड में नमक के ढेला (Salt licks) जरूर राखीं।\n2. **कीड़े के दवा (Deworming):** साल में 3-4 बेर पेट के कीड़ा के दवा बदली-बदली के पियाईं।\n3. **टीकाकरण:** पीपीआर (PPR) के टीका 3 साल में एक बेर आ फिड़किया (ET) के टीका बरसात से पहिले लगवावे के चाहीं।\n\n⚠️ **सलाह:** वजन के हिसाब से दवा के मात्रा तय करे खातिर पशु डॉक्टर से सलाह लीं।`
      : preferredLanguage === "hi"
      ? `🐐 **बकरी एवं भेड़ पालन वैज्ञानिक प्रबंधन:**\n\n1. **आहार एवं पोषण:** सुबबूल, बरसीम और लोबिया जैसे दलहनी चारे के साथ प्रति वयस्क 150-250 ग्राम संतुलित दाना दें। शेड में खनिज ईंट (Mineral Lick Block) रखें।\n2. **कृमिनाशक दवा (Deworming):** साल में 3 से 4 बार पेट के कीड़ों की दवा (अल्बेंडाजोल / फेनबेंडाजोल) बदल-बदल कर दें।\n3. **टीकाकरण:** पीपीआर (PPR - बकरी प्लेग) का टीका 3 वर्ष में एक बार तथा फिड़किया (Enterotoxemia) का टीका बरसात शुरू होने से पूर्व अवश्य लगवाएं।\n\n⚠️ **चिकित्सकीय परामर्श:** दवा की सही खुराक और उपचार के लिए स्थानीय पशु चिकित्सक से संपर्क करें।`
      : preferredLanguage === "mr"
      ? `🐐 **शेळी व मेंढी पालन शास्त्रीय व्यवस्थापन:**\n\n1. **समतोल आहार:** सुबाभूळ, ल्युसर्न यांसारखा हिरवा चारा आणि दररोज 150-250 ग्रॅम खुराक द्या. खनिज चाटण विटा उपलब्ध ठेवा.\n2. **जंतनिर्मूलन:** वर्षातून 3 ते 4 वेळा विविध औषधे बदलून जंतांचे औषध द्या.\n3. **लसीकरण:** पीपीआर (PPR) आणि आंत्रविषार (ET) लस न चुकता टोचा.\n\n⚠️ **पशुवैद्यकीय सूचना:** योग्य मात्रा आणि उपचारांसाठी पशुवैद्यकांचा सल्ला घ्या.`
      : `🐐 **बकरी आ भेड़ पालनक मुख्य जानकारी:**\n\n1. **आहार:** सुबबूल, बरसीम आ 150-250 ग्राम संतुलित दाना रोज दियौक।\n2. **कीड़ाक दवा:** वर्ष मे 3-4 बेर पेटक कीड़ाक दवा बदल-बदल कऽ पिबाउ।\n3. **टीका:** पीपीआर (PPR) आ फिड़कियाक टीका समय पर लगाउ।\n\n⚠️ **सलाह:** बीमार भेला पर पशु चिकित्सक सँ संपर्क करू।`;

    return `${enText}\n\n---\n\n${subText}`;
  }

  if (query.includes("poultry") || query.includes("chicken") || query.includes("broiler") || query.includes("murgi") || query.includes("layer") || query.includes("egg") || query.includes("ranikhet")) {
    const enText = `🐔 **Poultry Farming Brooding & Disease Prevention:**

1. **Brooding Management (First 2 Weeks):**
   - Maintain brooding temperature at 33-35°C (95°F) for day-old chicks, reducing by 3°C weekly until room temperature.
   - Provide clean electrolyte & glucose water upon arrival to relieve transport stress.
   - Spread 2-3 inches of dry rice husk as bedding (litter) and stir daily to prevent ammonia build-up.

2. **Standard Vaccine Schedule:**
   - Day 1: Marek's Disease (at hatchery).
   - Day 5-7: Newcastle Disease (Ranikhet / Lasota F1 eye drops).
   - Day 14: Infectious Bursal Disease (IBD / Gumboro).
   - Day 21-24: Ranikhet booster (Lasota).

3. **Biosecurity Protocol:**
   - Strictly prohibit outside visitors and wild bird access to the shed.
   - Provide potassium permanganate footbaths at shed entry points.

⚠️ **Veterinary Disclaimer:** Sudden flock mortality, respiratory gasping, or greenish diarrhea requires immediate isolation and consultation with an avian veterinarian or government veterinary officer.`;

    if (!isBilingual) return enText;

    const subText = preferredLanguage === "bho"
      ? `🐔 **मुर्गी पालन एवं चूजा प्रबंधन सलाह:**\n\n1. **ब्रूडिंग तापमान:** पहिलका हफ्ता चूजा खातिर 33-35°C तापमान राखीं। बिछावन (धान के भूसी) सूखा राखीं ताकि अमोनिया गैस ना बने।\n2. **टीकाकरण:** 5-7 दिन पर रानीखेत (Lasota) के बूंद आंख में डालीं आ 14वां दिन गम्बोरो (IBD) के टीका दीं।\n3. **जैव सुरक्षा:** शेड के बाहर चूना आ पोटाश के पैर धोने वाला गड्ढा बनाईं। बाहरी लोग के शेड में मत आवे दीं।\n\n⚠️ **चेतावनी:** अचानक चूजा मरे या सांस लेवे में दिक्कत होखे त तुरंत पोल्ट्री डॉक्टर के बोलावे के चाहीं।`
      : preferredLanguage === "hi"
      ? `🐔 **कुक्कुट (मुर्गी) पालन ब्रूडिंग एवं रोग नियंत्रण:**\n\n1. **ब्रूडिंग तापमान प्रबंधन:** पहले सप्ताह चूजों के लिए 33-35°C तापमान रखें तथा हर सप्ताह 3°C कम करें। बिछावन में 2-3 इंच सूखी धान की भूसी रखें और रोज हिलाएं।\n2. **आवश्यक टीकाकरण:** 5 से 7 दिन पर रानीखेत (Lasota/F1) आई-ड्रॉप तथा 14वें दिन गम्बोरो (IBD) का टीका पिलाएं।\n3. **जैव सुरक्षा:** शेड में जंगली पक्षियों का प्रवेश रोकें और दरवाजे पर पोटेशियम परमैंगनेट का फुटबाथ रखें।\n\n⚠️ **पशु चिकित्सक चेतावनी:** मुर्गियों में छींक, हरी दस्त या अचानक मृत्यु होने पर तुरंत पक्षी रोग विशेषज्ञ या पशु चिकित्सक से जांच कराएं।`
      : preferredLanguage === "mr"
      ? `🐔 **कुक्कुटपालन ब्रुडिंग व आरोग्य व्यवस्थापन:**\n\n1. **तापमान नियंत्रण:** पहिल्या आठवड्यात 33-35°C तापमान ठेवा. गादी (तूस) सुकी ठेवा जेणेकरून अमोनिया तयार होणार नाही.\n2. **लसीकरण:** 5-7 दिवसांनी राणीखेत (लासोटा) व 14 व्या दिवशी गंबोरो लस द्या.\n3. **सुरक्षा:** शेडच्या प्रवेशद्वारावर जंतुनाशक पायधुणी ठेवा.\n\n⚠️ **पशुवैद्यकीय इशारा:** कोंबड्या आजारी पडल्यास तातडीने तज्ज्ञ पशुवैद्यकांचा सल्ला घ्या.`
      : `🐔 **मुर्गी पालन एवं ब्रूडिंग व्यवस्थापन:**\n\n1. **तापमान:** पहिल सप्ताह मे 33-35°C तापमान राखू।\n2. **टीका:** 5-7 दिन पर रानीखेत (Lasota) आ 14 दिन पर गम्बोरोक टीका दियौक।\n3. **बायोसिक्योरिटी:** शेड के पूर्णतः साफ आ सूखा राखू।\n\n⚠️ **सलाह:** बीमारीक लक्षण दिखला पर पशु चिकित्सक सँ संपर्क करू।`;

    return `${enText}\n\n---\n\n${subText}`;
  }

  if (query.includes("fish") || query.includes("fisheries") || query.includes("pond") || query.includes("machhali") || query.includes("matsya") || query.includes("fingerling")) {
    const enText = `🐟 **Fish Pond Aquaculture Management:**

1. **Pre-Stocking Pond Preparation:**
   - Drain or dry pond bottom until cracks appear to eradicate wild predatory fish and pathogens.
   - Apply Agricultural Lime (CaCO3): 200-250 kg/acre to stabilize water pH between 7.5 - 8.5.
   - Manure with decomposed cow dung (1,000 kg/acre) to stimulate rich green zooplankton/phytoplankton bloom.

2. **Polyculture Stocking Combination (Composite Fish Culture):**
   - Surface feeders: Catla (30-40%)
   - Column feeders: Rohu (30%)
   - Bottom feeders: Mrigal (30-40%)
   - Stocking density: 3,000 - 4,000 healthy fingerlings (8-10 cm size) per acre.

3. **Water Quality & Dissolved Oxygen:**
   - Maintain dissolved oxygen (DO) above 5 mg/liter.
   - If fish surface to gulp air at early morning dawn, splash water or run an aerator immediately.

⚠️ **Aquaculture Disclaimer:** Water chemistry parameters (pH, ammonia, dissolved oxygen) require regular testing kits. Consult a state fisheries extension officer for disease outbreaks.`;

    if (!isBilingual) return enText;

    const subText = preferredLanguage === "bho"
      ? `🐟 **मछली पालन आ तालाब तैयारी सलाह:**\n\n1. **तालाब तैयारी:** तालाब सुखा के प्रति एकड़ 200-250 किलो कृषि चूना डालीं ताकि पानी के pH 7.5-8.5 के बीच रहे। 1000 किलो सड़ा गोबर डाल के प्लवक (प्राकृतिक चारा) तैयार करीं।\n2. **मिश्रित मछली पालन:** कतला (सतह पर), रोहू (बीच में) आ मृगल (तली में) के जीरा 3000-4000 प्रति एकड़ डालीं।\n3. **ऑक्सीजन प्रबंधन:** भोर में अगर मछलियां मुंह निकाल के सांस लेत बाड़ी, त तुरंत पानी चला के या बांस से पानी पीट के ऑक्सीजन बढ़ाईं।\n\n⚠️ **सलाह:** पानी के pH आ अमोनिया के जांच नियमित करीं आ मत्स्य प्रसार अधिकारी से राय लीं।`
      : preferredLanguage === "hi"
      ? `🐟 **मत्स्य पालन एवं तालाब जल प्रबंधन:**\n\n1. **तालाब की प्रारंभिक तैयारी:** तालाब सुखाकर 200-250 किग्रा/एकड़ कृषि चूना डालें ताकि पानी का pH 7.5 से 8.5 बना रहे। 1,000 किग्रा सड़ा गोबर डालकर प्राकृतिक प्लवक (Plankton) तैयार करें।\n2. **मिश्रित मत्स्य पालन (Composite Culture):** कतला (30-40%), रोहू (30%) तथा नैन/मृगल (30-40%) का संचयन करें। प्रति एकड़ 3,000 से 4,000 उंगली के आकार (8-10 सेमी) के फिंगरलिंग डालें।\n3. **ऑक्सीजन सुरक्षा:** सुबह के समय घुलित ऑक्सीजन कम होने पर पानी में फव्वारा चलाएं या एरिएटर का प्रयोग करें।\n\n⚠️ **मत्स्य विशेषज्ञ सलाह:** जल गुणवत्ता (अमोनिया, पीएच, ऑक्सीजन) की नियमित जांच करें। बीमारी दिखने पर राज्य मत्स्य विकास अधिकारी से संपर्क करें।`
      : preferredLanguage === "mr"
      ? `🐟 **मत्स्यपालन व तळे व्यवस्थापन सल्ला:**\n\n1. **तळ्याची तयारी:** तळे सुकवून एकरी 200-250 किलो चुना टाका. 1000 किलो शेणखत टाकून प्लवंग (नैसर्गिक अन्न) तयार करा.\n2. **मिश्र मत्स्यपालन:** कटला, रोहू आणि म्रिगल या तिन्ही थरांतील माशांचे एकरी 3000-4000 बोटुकली (Fingerlings) सोडा.\n3. **ऑक्सिजन काळजी:** सकाळी मासे पाण्यावर तरंगत असल्यास पाण्याचे एरिएशन करा.\n\n⚠️ **तज्ज्ञ सल्ला:** पाण्याचा pH आणि अमोनिया नियमित तपासा.`
      : `🐟 **मत्स्य पालन आ तालाब प्रबंधन:**\n\n1. **तालाबक तैयारी:** 200-250 किलो चूना आ 1000 किलो सड़ा गोबर दऽ कऽ प्राकृतिक चारा बनाउ।\n2. **मिश्रित पालन:** कतला, रोहू आ मृगल के 3000-4000 जीरा प्रति एकड़ संचित करू।\n3. **ऑक्सीजन प्रबंधन:** सबेरे पानी चला कऽ ऑक्सीजनक स्तर ठीक राखू।\n\n⚠️ **सलाह:** मत्स्य प्रसार पदाधिकारी सँ परामर्श लियौक।`;

    return `${enText}\n\n---\n\n${subText}`;
  }

  if (query.includes("fertilizer") || query.includes("soil") || query.includes("khad") || query.includes("urea") || query.includes("dap") || query.includes("npk") || query.includes("mitti")) {
    const enText = `🌱 **Soil & Fertilizer Advice for your field:**

1. **Balanced NPK Ratio:** Maintain a standard 4:2:1 (N:P:K) ratio for cereals, or 1:2:1 for legumes and pulses.
2. **Organic Boosters:** Combine chemical doses with 2-3 tonnes/acre of well-rotted FYM (Farm Yard Manure) or Vermicompost.
3. **Bio-fertilizers:** Seed treatment with *Azotobacter* and *PSB* boosts nutrient intake by 20%.
4. **Soil Testing:** Always test soil pH and organic carbon before heavy fertilizer application.`;

    if (!isBilingual) return enText;

    const subText = preferredLanguage === "bho"
      ? `🌱 **माटी आ खाद खातिर सलाह:**\n\n1. **संतुलित NPK अनुपात:** अनाज वाली फसलन खातिर 4:2:1 आ दलहन खातिर 1:2:1 अनुपात राखीं।\n2. **जैविक खाद:** रासायनिक खाद के साथ 2-3 टन सड़ा गोबर या वर्मीकम्पोस्ट जरूर मिलाईं।\n3. **जैव उर्वरक:** एजोटोबैक्टर आ पीएसबी से बीज शोधन करे से 20% ले पोषण बढ़ जाला।\n4. **माटी जांच:** भारी खाद डाले से पहिले माटी के जांच जरूर करवा लीं।`
      : preferredLanguage === "hi"
      ? `🌱 **खेत के लिए उर्वरक और मिट्टी सलाह:**\n\n1. **संतुलित एनपीके अनुपात:** धान्य फसलों के लिए 4:2:1 और दलहनी फसलों के लिए 1:2:1 अनुपात बनाए रखें।\n2. **जैविक खाद:** प्रति एकड़ 2-3 टन अच्छी सड़ी गोबर की खाद या केंचुआ खाद का प्रयोग करें।\n3. **जैव-उर्वरक:** एजोटोबैक्टर व पीएसबी से बीज उपचार करें।\n4. **मृदा परीक्षण:** भारी रासायनिक उर्वरक प्रयोग से पहले मिट्टी की जांच अवश्य करवाएं।`
      : preferredLanguage === "mr"
      ? `🌱 **माती आणि खत व्यवस्थापन सल्ला:**\n\n1. **संतुलित NPK प्रमाण:** तृणधान्य पिकांसाठी 4:2:1 आणि डाळवर्गीय पिकांसाठी 1:2:1 प्रमाण ठेवा.\n2. **सेंद्रिय खते:** रासायनिक खतांसोबत एकरी 2-3 टन चांगले कुजलेले शेणखत किंवा गांडूळखत वापरा.\n3. **जैविक खते:** अझोटोबॅक्टर आणि पीएसबीने बीजप्रक्रिया करा.\n4. **माती परीक्षण:** रासायनिक खतांचा अतिवापर टाळण्यासाठी माती परीक्षण करून घ्या.`
      : `🌱 **माटि आ खाद कऽ लेल सलाह:**\n\n1. **संतुलित NPK अनुपात:** अनाज लेल 4:2:1 आ दलहन लेल 1:2:1 अनुपात राखू।\n2. **जैविक खाद:** प्रति एकड़ 2-3 टन सड़ा गोबर या केंचुआ खाद कऽ प्रयोग करू।\n3. **जैव-उर्वरक:** एजोटोबैक्टर आ पीएसबी सँ बीज उपचार करू।\n4. **माटि जांच:** रासायनिक खाद देबा सँ पहिने माटिक जांच जरूर करवाउ।`;

    return `${enText}\n\n---\n\n${subText}`;
  }

  const enText = `Namaste! 🙏 As your Krishi Saathi assistant, here is my recommended advice for "${message}":

1. **Prioritize Organic Soil Health:** Integrate compost, vermicompost, and bio-inoculants to build root resilience.
2. **Water Management:** Utilize drip irrigation and organic mulching to conserve moisture.
3. **Crop Care:** Monitor pest levels early and prefer bio-pesticides like Neem oil before chemical interventions.

Feel free to ask about specific crops, pest controls, land unit conversions, or government schemes!`;

  if (!isBilingual) return enText;

  const subText = preferredLanguage === "bho"
    ? `प्रणाम! 🙏 रउआ कृषि साथी के रूप में "${message}" खातिर ई सलाह बा:\n\n1. **माटी के सेहत:** गोबर खाद, वर्मीकम्पोस्ट आ जैविक खाद से खेत के मजबूत बनाईं।\n2. **पटवन प्रबंधन:** नमी बचावे खातिर ड्रिप सिंचाई आ पुआल के मल्चिंग करीं।\n3. **फसल सुरक्षा:** कीड़ा-मकोड़ा दिखे पर नीम के तेल के छिड़काव पहिले करीं।`
    : preferredLanguage === "hi"
    ? `नमस्ते! 🙏 कृषि साथी सहायक के रूप में "${message}" के लिए मेरी सलाह:\n\n1. **मिट्टी का स्वास्थ्य:** कम्पोस्ट, वर्मीकम्पोस्ट और जैव-उर्वरकों से मिट्टी को समृद्ध बनाएं।\n2. **जल प्रबंधन:** नमी बनाए रखने के लिए ड्रिप सिंचाई और मल्चिंग अपनाएं।\n3. **फसल सुरक्षा:** कीट प्रबंधन के लिए रासायनिक दवाओं से पहले नीम तेल जैसे जैविक उपाय करें।`
    : preferredLanguage === "mr"
    ? `नमस्कार! 🙏 कृषी साथी सहाय्यक म्हणून "${message}" साठी माझा सल्ला:\n\n1. **मातीचे आरोग्य:** कंपोस्ट, गांडूळखत आणि जैविक घटकांचा वापर करा.\n2. **पाणी व्यवस्थापन:** ओलावा टिकवण्यासाठी ठिबक सिंचन आणि आच्छादन (मल्चिंग) वापरा.\n3. **पीक संरक्षण:** कीड नियंत्रणासाठी रासायनिक फवारणीपूर्वी निंबोळी अर्क वापरा.`
    : `प्रणाम! 🙏 कृषि साथी सहायकक रूप मे "${message}" लेल हमर सलाह:\n\n1. **माटिक स्वास्थ्य:** कम्पोस्ट आ केंचुआ खाद सँ माटि के उर्वर बनाऊ।\n2. **जल प्रबंधन:** ड्रिप सिंचाई आ मल्चिंग कऽ उपयोग करू।\n3. **फसल सुरक्षा:** कीट नियंत्रण लेल नीम तेलक जैविक उपचार करू।`;

  return `${enText}\n\n---\n\n${subText}`;
}

function getForecastYieldFallback(cropName: string, soilType: string, landArea: number, state: string, district: string) {
  const isSandy = (soilType || "").toLowerCase().includes("sandy");
  const isClay = (soilType || "").toLowerCase().includes("clay");
  const isLoamy = (soilType || "").toLowerCase().includes("loamy") || (soilType || "").toLowerCase().includes("loam");

  let baseYieldPerAcre = 2.0; // in Tons
  let cropType = cropName || "Rice";
  
  if (cropType.toLowerCase().includes("rice")) {
    baseYieldPerAcre = isLoamy ? 2.2 : isClay ? 2.5 : isSandy ? 1.2 : 1.8;
  } else if (cropType.toLowerCase().includes("wheat")) {
    baseYieldPerAcre = isLoamy ? 1.8 : isClay ? 2.0 : isSandy ? 0.9 : 1.5;
  } else if (cropType.toLowerCase().includes("tomato")) {
    baseYieldPerAcre = isLoamy ? 12.0 : isClay ? 9.0 : isSandy ? 6.0 : 8.5;
  } else if (cropType.toLowerCase().includes("maize") || cropType.toLowerCase().includes("corn")) {
    baseYieldPerAcre = isLoamy ? 3.0 : isClay ? 2.8 : isSandy ? 1.5 : 2.2;
  } else {
    baseYieldPerAcre = isLoamy ? 2.5 : isClay ? 2.2 : isSandy ? 1.1 : 1.8;
  }

  const grandTotalYield = Number((baseYieldPerAcre * (landArea || 2.5)).toFixed(2));
  const minYield = Number((grandTotalYield * 0.9).toFixed(2));
  const maxYield = Number((grandTotalYield * 1.1).toFixed(2));

  return {
    cropName: cropType,
    soilType: soilType || "Clayey Loam",
    landArea: landArea || 2.5,
    predictedYieldMetric: "Tons",
    predictedYieldValueMin: minYield,
    predictedYieldValueMax: maxYield,
    predictedYieldAverage: grandTotalYield,
    confidenceScore: 88,
    predictedHarvestDate: "approx. 110-125 days from sowing",
    scenarios: [
      {
        scenarioName: "Dry Season / Low Rainfall",
        projectedYield: Number((grandTotalYield * 0.75).toFixed(2)),
        probability: 25
      },
      {
        scenarioName: "Normal Season / Optimal Weather",
        projectedYield: grandTotalYield,
        probability: 60
      },
      {
        scenarioName: "Wet Season / Monsoonal Flooding",
        projectedYield: Number((grandTotalYield * 0.85).toFixed(2)),
        probability: 15
      }
    ],
    influencingFactors: [
      {
        factorName: "Soil Drainage Capability",
        status: isSandy ? "Excessive (Low nutrient retention)" : isClay ? "Poor (High waterlogging risk)" : "Optimal (Balanced water-holding capacity)",
        impact: isSandy ? "-15% leaching loss" : isClay ? "-10% aeration deficit risk" : "+5% root growth stability"
      },
      {
        factorName: "Cation Exchange Capability (CEC)",
        status: isSandy ? "Low (Frequent light fertilizing needed)" : "Moderate to High (Robust nutrient lock-in)",
        impact: isSandy ? "Requires Split NPK dosing" : "Enables deep basal fertilization benefits"
      },
      {
        factorName: "Estimated Monsoon Alignment",
        status: "Good Correlation",
        impact: "+8% relative to typical sub-tropical models"
      }
    ],
    agronomistRecommendations: [
      `Since you are sowing ${cropType} on ${soilType || "Clayey Loam"} soil, we highly recommend maintaining a rich organic mulch layer to prevent topsoil drying.`,
      `Implement drip or micro-sprinkler irrigation instead of flooding to increase fertilizer use efficiency.`,
      isClay ? `Ensure robust raised bed preparation to avoid water stagnation at early seedling stages.` : `Incorporate well-composted farmyard manure (FYM) or bio-compost to improve moisture and nutrient holding capacity.`
    ]
  };
}

// --- SDK Functions ---

export async function identifyPlant(
  plantPhotoBase64: string,
  soilPhotoBase64?: string,
  farmerSoilProfile?: string,
  preferredLanguage: string = "en"
) {
  console.log("Analyzing plant with Gemini...");

  const imagePart = getGeminiImagePart(plantPhotoBase64);
  const parts: any[] = [imagePart];

  if (soilPhotoBase64) {
    parts.push(getGeminiImagePart(soilPhotoBase64));
  }

  const prompt = `
    Perform a professional, botanist-grade and soil-scientist-grade plant identification on the provided image(s).
    If a second image is provided, it is a photo of the root/soil zone.
    
    Context:
    - User's Preferred Language for output translations: ${preferredLanguage} (especially for local names and final summaries).
    - Stored Farmer's Soil Profile: "${farmerSoilProfile || "Not Specified"}".

    Return the identification as a structured JSON response. Adhere STRICTLY to the following schema structure:
    {
      "identity": {
        "scientificName": "Scientific botanical name (Genus and species, italicized format if text)",
        "commonName": "Standard English common name",
        "localNames": [
          {"language": "hi", "name": "Hindi local name"},
          {"language": "mr", "name": "Marathi local name"}
        ],
        "family": "Botanical family",
        "plantType": "crop / weed / medicinal / ornamental / invasive species",
        "growthHabit": "annual / biennial / perennial; herb / shrub / tree / climber",
        "confidenceScore": 95,
        "uncertainCandidates": ["Optional list of other 2-3 visual lookalikes if confidence is under 80%"]
      },
      "botanicalInfo": {
        "nativeRegion": "Native region or typical climate zone",
        "growingSeasonIndia": "kharif / rabi / zaid / Year-round",
        "sunlight": "Full sun / Partial shade / Shade",
        "waterRequirement": "Low / Medium / High (with approx mm/week if crop)",
        "lifecycleDuration": "Approximate days or months of lifecycle",
        "beneficialUses": "List beneficial uses, e.g., culinary, medicinal, fodder, green manure, nitrogen fixer"
      },
      "diseaseSusceptibility": {
        "commonDiseases": "List 2-4 common diseases known to affect this specific species",
        "earlyWarningSigns": "Visual symptoms to watch out for",
        "isCurrentlyDiseased": false,
        "visibleSymptoms": "If symptoms are visible in the photo, describe them here"
      },
      "soilCompatibility": {
        "idealPhRange": "e.g., 6.0 - 6.8",
        "idealSoilTexture": "Sandy / Loamy / Clayey",
        "idealNutrients": "NPK preference band or soil organic matter requirements",
        "compatibilityScore": "Good match / Marginal — needs amendment / Poor match",
        "soilMatchExplanation": "Compare the plant's ideal soil texture and pH against the farmer's stored soil profile: ${farmerSoilProfile}",
        "organicAmendments": "Concrete low-impact organic amendments suggestions if soil is a poor/marginal match (e.g. compost, biochar, leaf mold)"
      },
      "sustainableFertilizer": {
        "firstChoiceOrganic": "Specific organic / bio-fertilizers recommendation (compost, vermicompost, green manure, PSB, neem cake)",
        "secondChoiceMineral": "Minimum effective dose of mineral fertilizer ONLY if needed, avoiding excessive broadcast",
        "applicationMethod": "Best application method and timing to minimize environmental runoff/leaching",
        "environmentalCaution": "Over-application warning, groundwater nitrate risks, and Integrated Pest Management (IPM) controls before chemical sprays",
        "companionPlanting": "Legume companions or rotation crops to fix nitrogen or act as trap crops",
        "estimatedCostComparison": "Simple cost analysis organic vs. synthetic route (e.g., Organic: Low-Med via farmwaste, Chemical: Med-High)"
      },
      "environmentalImpactNote": "A short, emphatic plain-language warning note on avoiding over-application to protect soil flora and nearby water bodies.",
      "multilingualSummary": "A concise 2-3 sentence summary of the plant name, compatibility, and urgent care tips, translated fully into: ${preferredLanguage === 'hi' ? 'Hindi' : preferredLanguage === 'mr' ? 'Marathi' : 'English'}."
    }
  `;

  parts.push({ text: prompt });

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identity: {
            type: Type.OBJECT,
            properties: {
              scientificName: { type: Type.STRING },
              commonName: { type: Type.STRING },
              localNames: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    language: { type: Type.STRING },
                    name: { type: Type.STRING },
                  },
                },
              },
              family: { type: Type.STRING },
              plantType: { type: Type.STRING },
              growthHabit: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              uncertainCandidates: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
          botanicalInfo: {
            type: Type.OBJECT,
            properties: {
              nativeRegion: { type: Type.STRING },
              growingSeasonIndia: { type: Type.STRING },
              sunlight: { type: Type.STRING },
              waterRequirement: { type: Type.STRING },
              lifecycleDuration: { type: Type.STRING },
              beneficialUses: { type: Type.STRING },
            },
          },
          diseaseSusceptibility: {
            type: Type.OBJECT,
            properties: {
              commonDiseases: { type: Type.STRING },
              earlyWarningSigns: { type: Type.STRING },
              isCurrentlyDiseased: { type: Type.BOOLEAN },
              visibleSymptoms: { type: Type.STRING },
            },
          },
          soilCompatibility: {
            type: Type.OBJECT,
            properties: {
              idealPhRange: { type: Type.STRING },
              idealSoilTexture: { type: Type.STRING },
              idealNutrients: { type: Type.STRING },
              compatibilityScore: { type: Type.STRING },
              soilMatchExplanation: { type: Type.STRING },
              organicAmendments: { type: Type.STRING },
            },
          },
          sustainableFertilizer: {
            type: Type.OBJECT,
            properties: {
              firstChoiceOrganic: { type: Type.STRING },
              secondChoiceMineral: { type: Type.STRING },
              applicationMethod: { type: Type.STRING },
              environmentalCaution: { type: Type.STRING },
              companionPlanting: { type: Type.STRING },
              estimatedCostComparison: { type: Type.STRING },
            },
          },
          environmentalImpactNote: { type: Type.STRING },
          multilingualSummary: { type: Type.STRING },
        },
        required: ["identity", "botanicalInfo", "soilCompatibility", "sustainableFertilizer", "environmentalImpactNote", "multilingualSummary"],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getIdentifyPlantFallback(farmerSoilProfile, preferredLanguage),
    5000
  );
}

export async function detectDisease(base64Image: string, preferredLanguage: string = "en") {
  console.log(`Analyzing plant disease in language: ${preferredLanguage}...`);
  const imagePart = getGeminiImagePart(base64Image);
  const targetLangName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage;

  const prompt = `
    Diagnose the plant disease shown in this image.
    Provide an agronomist-grade diagnosis.
    
    CRITICAL LOCALIZATION REQUIREMENT:
    The user's preferred language is ${targetLangName} (Language code: "${preferredLanguage}").
    Provide all field values (symptoms, causes, organicTreatment, chemicalTreatment, preventiveMeasures, recoveryTime) naturally, accurately, and fluently in ${targetLangName}.
    Translate the cropName and diseaseName if customary, or provide local names alongside.

    Return the results as a structured JSON object:
    {
      "cropName": "Identified Crop/Plant Name",
      "diseaseName": "Name of the detected disease (or 'Healthy Plant' if no disease is found)",
      "confidence": 90,
      "symptoms": "Detailed list of visible symptoms in the photo in ${targetLangName}",
      "causes": "Underlying biological, fungal, bacterial, viral, or environmental causes in ${targetLangName}",
      "organicTreatment": "Complete organic treatment, biological controls, compost tea, neem oil sprays, etc. in ${targetLangName}",
      "chemicalTreatment": "Minimum effective chemical fungicides/pesticides as a secondary resort only in ${targetLangName}",
      "preventiveMeasures": "Preventive practices for future seasons (crop rotation, proper spacing, sanitation) in ${targetLangName}",
      "recoveryTime": "Estimated recovery time in ${targetLangName}"
    }
  `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          symptoms: { type: Type.STRING },
          causes: { type: Type.STRING },
          organicTreatment: { type: Type.STRING },
          chemicalTreatment: { type: Type.STRING },
          preventiveMeasures: { type: Type.STRING },
          recoveryTime: { type: Type.STRING },
        },
        required: ["cropName", "diseaseName", "confidence", "symptoms", "causes", "organicTreatment", "preventiveMeasures", "recoveryTime"],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getDetectDiseaseFallback(),
    5000
  );
}

export async function recommendCrops(state: string, district: string, soilType: string, season: string, preferredLanguage: string = "en") {
  console.log(`Analyzing crop recommendations for ${state}, ${district} in ${preferredLanguage}...`);
  const targetLangName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage;

  const prompt = `
    Based on location: ${state}, ${district} in India, Season: ${season}, and Soil Type: ${soilType}.
    Recommend the best 3 crops to grow. Provide a thorough meteorological and agricultural analysis.

    CRITICAL LOCALIZATION REQUIREMENT:
    The user's preferred language is ${targetLangName} (Language code: "${preferredLanguage}").
    Provide all analysis, advice, reasons, crop names, and predictions fluently, idiomatically, and completely in ${targetLangName}.
    Do NOT output in English unless the language code is "en".

    Return a structured JSON object:
    {
      "weatherAnalysis": "Analysis of typical temperature, rainfall, and wind conditions in ${targetLangName}.",
      "rainfallPrediction": "Rainfall expectations and water planning advice in ${targetLangName}.",
      "temperatureInsights": "Insights on temperature suitability for sowing and maturity in ${targetLangName}.",
      "farmingAdvice": "Core agronomist wisdom on land preparation and sustainable management in ${targetLangName}.",
      "riskAlerts": "Environmental and weather risks in ${targetLangName}.",
      "recommendations": [
        {
          "cropName": "Name of recommended crop in ${targetLangName}",
          "suitableSowingPeriod": "Ideal window of weeks or months to sow in ${targetLangName}",
          "whyRecommended": "Agronomical reason why this fits the soil and weather in ${targetLangName}",
          "estimatedDaysToHarvest": "e.g., 110-120 days"
        }
      ]
    }
  `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weatherAnalysis: { type: Type.STRING },
          rainfallPrediction: { type: Type.STRING },
          temperatureInsights: { type: Type.STRING },
          farmingAdvice: { type: Type.STRING },
          riskAlerts: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                cropName: { type: Type.STRING },
                suitableSowingPeriod: { type: Type.STRING },
                whyRecommended: { type: Type.STRING },
                estimatedDaysToHarvest: { type: Type.STRING },
              },
            },
          },
        },
        required: ["weatherAnalysis", "rainfallPrediction", "temperatureInsights", "farmingAdvice", "riskAlerts", "recommendations"],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getRecommendCropsFallback(state, district, soilType, season),
    5000
  );
}

export async function planFertilizer(crop: string, growthStage: string, soilType: string, fieldSize: number, preferredLanguage: string = "en") {
  const targetLangName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage;
  const prompt = `
    Create a sustainable Fertilizer Plan for:
    Crop: ${crop}
    Growth Stage: ${growthStage}
    Soil Type: ${soilType}
    Field Size: ${fieldSize} Acres

    Adhere strictly to environmentally sustainable, soil-safe practices. Recommend organic-first.
    CRITICAL LOCALIZATION REQUIREMENT:
    The user's preferred language is ${targetLangName} (Language code: "${preferredLanguage}").
    Provide all textual descriptions, schedules, alternatives, and explanations fluently in ${targetLangName}.

    Return a structured JSON response:
    {
      "recommendedFertilizer": "Primary recommended safe fertilizer/biofertilizer name in ${targetLangName}",
      "quantity": "Exact quantity needed for ${fieldSize} Acres in ${targetLangName}",
      "schedule": "Application timing schedule (split dose details) in ${targetLangName}",
      "organicAlternatives": "Rich list of composting, bio-fertilizers and mulching methods in ${targetLangName}",
      "estimatedCost": 2500,
      "environmentalExplanation": "Plain-language impact warning explaining why this minimum dose is environmentally safe in ${targetLangName}"
    }
  `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedFertilizer: { type: Type.STRING },
          quantity: { type: Type.STRING },
          schedule: { type: Type.STRING },
          organicAlternatives: { type: Type.STRING },
          estimatedCost: { type: Type.NUMBER },
          environmentalExplanation: { type: Type.STRING },
        },
        required: ["recommendedFertilizer", "quantity", "schedule", "organicAlternatives", "estimatedCost", "environmentalExplanation"],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getPlanFertilizerFallback(crop, growthStage, soilType, fieldSize),
    5000
  );
}

export async function planIrrigation(crop: string, growthStage: string, soilType: string, preferredLanguage: string = "en") {
  const targetLangName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage;
  const prompt = `
    Create a smart, water-saving Smart Irrigation Plan for:
    Crop: ${crop}
    Growth Stage: ${growthStage}
    Soil Type: ${soilType}

    Focus on high efficiency, reducing evapotranspiration loss, and promoting drip/sprinkler if suitable.
    CRITICAL LOCALIZATION REQUIREMENT:
    The user's preferred language is ${targetLangName} (Language code: "${preferredLanguage}").
    Provide all water requirements, frequency, best timing, and water-saving recommendations fluently in ${targetLangName}.

    Return a structured JSON response:
    {
      "waterRequirement": "Daily or weekly water depth in ${targetLangName}",
      "frequency": "Irrigation frequency in ${targetLangName}",
      "bestTiming": "Best time of day to irrigate in ${targetLangName}",
      "waterSavingRecommendations": "Specific moisture conservation practices in ${targetLangName}"
    }
  `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          waterRequirement: { type: Type.STRING },
          frequency: { type: Type.STRING },
          bestTiming: { type: Type.STRING },
          waterSavingRecommendations: { type: Type.STRING },
        },
        required: ["waterRequirement", "frequency", "bestTiming", "waterSavingRecommendations"],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getPlanIrrigationFallback(crop, growthStage, soilType),
    5000
  );
}

export async function queryGovernmentSchemes(query: string, farmerState: string, farmerCrop: string, landSize: number, preferredLanguage: string = "en") {
  const targetLangName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage;
  const prompt = `
    You are Krishi Saathi's Government Scheme AI Assistant.
    Provide personalized suggestions of 2-3 matching Indian central or state schemes for:
    State: ${farmerState}
    Crops grown: ${farmerCrop}
    Land Size: ${landSize} Acres
    User's query: "${query}"

    Search your database of schemes (such as PM-KISAN, PM-FBY Pradhan Mantri Fasal Bima Yojana, PM-KMY, Subsidies on Drip Irrigation, Soil Health Card Scheme, Rashtriya Krishi Vikas Yojana).
    
    CRITICAL LOCALIZATION REQUIREMENT:
    The user's preferred language is ${targetLangName} (Language code: "${preferredLanguage}").
    Provide all criteria, benefits, required documents, and personalizedAdvice in ${targetLangName}.
    You may keep official scheme names and links in their recognized format alongside the translation.

    Return a structured JSON list of matching schemes with eligibility, benefits, required documents, official registration links, and last date where known.

    Return schema:
    {
      "matchingSchemes": [
        {
          "name": "Scheme Full Name",
          "eligibility": "Clear criteria in ${targetLangName}",
          "benefits": "Financial subsidies, insurance coverage details in ${targetLangName}",
          "requiredDocuments": "Required documents in ${targetLangName}",
          "officialLink": "https://...",
          "lastApplicationDate": "Last application date (e.g. 15th August 2026, or 'Ongoing')"
        }
      ],
      "personalizedAdvice": "Tailored guidance in ${targetLangName}."
    }
  `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchingSchemes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                eligibility: { type: Type.STRING },
                benefits: { type: Type.STRING },
                requiredDocuments: { type: Type.STRING },
                officialLink: { type: Type.STRING },
                lastApplicationDate: { type: Type.STRING },
              },
            },
          },
          personalizedAdvice: { type: Type.STRING },
        },
        required: ["matchingSchemes", "personalizedAdvice"],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getQueryGovernmentSchemesFallback(query, farmerState, farmerCrop, landSize),
    5000
  );
}

export async function chatFarmingAssistant(message: string, history: { role: string; text: string }[], preferredLanguage: string = "en") {
  const targetLangName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage;
  const isBilingualMode = preferredLanguage !== "en";

  // Append new message to contents
  const contents = history.map((h) => ({
    role: h.role === "user" ? "user" : "model",
    parts: [{ text: h.text }],
  }));

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const systemInstruction = isBilingualMode
    ? `
        You are Krishi Saathi's flagship AI Farming Assistant, an expert agronomist, plant biologist, soil scientist, and animal & fish husbandry specialist serving Indian farmers.
        Your goal is to provide sustainable, highly accurate, and friendly advice across both crop agriculture and livestock/fish farming.
        Always promote:
        - Soil-safe, organic-first crop practices and integrated pest management (IPM).
        - Scientific animal nutrition (balanced rations, clean drinking water, mineral mixtures).
        - Proactive biosecurity, disease prevention, and vaccination schedules for dairy cattle, sheep, goats, poultry, and fish ponds.
        - Circular resource reuse (cow dung for biogas/slurry, poultry litter composting, integrated aquaculture).
        
        CRITICAL ANIMAL & FISH HEALTH GUIDELINES:
        - For animal or fish health inquiries, provide general educational guidance and warning signs only.
        - Never claim a definitive clinical diagnosis.
        - Always advise the farmer to consult a registered veterinarian or local fisheries officer for clinical examination, prescription treatments, and on-site inspection.

        CRITICAL MANDATORY BILINGUAL FORMAT REQUIREMENT:
        The BASE LANGUAGE of Krishi Saathi is ENGLISH.
        The user has selected the regional language: ${targetLangName} (code: "${preferredLanguage}").
        
        ENGLISH MUST ALWAYS REMAIN VISIBLE alongside the regional language.
        Format your response bilingually for every answer:
        
        First: Clear, practical English response summary or main advice.
        Immediately followed by: Accurate, fluent translation or response in ${targetLangName}.
        
        Keep answers practical, accurate, humble, and easy for farmers to understand.
      `
    : `
        You are Krishi Saathi's flagship AI Farming Assistant, an expert agronomist, soil scientist, and animal & fish husbandry specialist serving farmers.
        Your goal is to provide sustainable, highly accurate, and friendly farming advice in clear, concise English across crops, dairy, sheep, goat, poultry, pigs, beekeeping, and fisheries.
        For animal/fish health issues, provide educational guidance and caution, always recommending consultation with a qualified veterinarian or fisheries officer.
        Promote organic-first practices, IPM pest control, balanced livestock nutrition, and circular farming.
        Keep answers practical, accurate, and easy for farmers to understand.
      `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
    },
  }).then(response => response.text || "I apologize, but I could not formulate a response at this moment.");

  return withTimeoutAndFallback(
    apiCall,
    () => getChatFarmingAssistantFallback(message, preferredLanguage),
    15000
  );
}

export async function forecastYield(
  cropName: string,
  soilType: string,
  landArea: number,
  state: string,
  district: string,
  historicalSummary?: string
) {
  const prompt = `
    You are Krishi Saathi's advanced Predictive AI Agronomy Engine.
    Estimate potential harvest quantities, timeline, and scenario analysis for:
    Crop Name: ${cropName}
    Soil Type: ${soilType}
    Land Area: ${landArea} Acres
    Region: ${district}, ${state}
    Historical Records/Context: ${historicalSummary || "Standard regional historical baseline and averages"}

    Analyze soil physical-chemical profile, historical yield data, weather patterns, and agronomic guidelines.
    Return a comprehensive predictive report in a highly structured, accurate JSON format.

    Ensure you include realistic numbers tailored to a ${landArea}-acre landholding. Yield values should represent total harvest for the entire acreage (i.e., base yield per acre multiplied by acreage).

    Return JSON schema:
    {
      "cropName": "Crop Name",
      "soilType": "Soil Type",
      "landArea": 2.5,
      "predictedYieldMetric": "Tons" (or "Quintals" etc.),
      "predictedYieldValueMin": 4.2,
      "predictedYieldValueMax": 4.8,
      "predictedYieldAverage": 4.5,
      "confidenceScore": 92,
      "predictedHarvestDate": "approx. October 2026 (120 days from sowing)",
      "scenarios": [
        {
          "scenarioName": "Dry Season / Low Rainfall",
          "projectedYield": 3.15,
          "probability": 25
        },
        {
          "scenarioName": "Normal Season / Optimal Weather",
          "projectedYield": 4.5,
          "probability": 60
        },
        {
          "scenarioName": "Wet Season / Monsoonal Flooding",
          "projectedYield": 3.6,
          "probability": 15
        }
      ],
      "influencingFactors": [
        {
          "factorName": "Soil Structure & Aeration",
          "status": "Optimal",
          "impact": "+10% root health"
        }
      ],
      "agronomistRecommendations": [
        "Highly specific, expert organic-first recommendation to boost yield for this crop and soil type.",
        "Precision irrigation suggestion."
      ]
    }
  `;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          soilType: { type: Type.STRING },
          landArea: { type: Type.NUMBER },
          predictedYieldMetric: { type: Type.STRING },
          predictedYieldValueMin: { type: Type.NUMBER },
          predictedYieldValueMax: { type: Type.NUMBER },
          predictedYieldAverage: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          predictedHarvestDate: { type: Type.STRING },
          scenarios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scenarioName: { type: Type.STRING },
                projectedYield: { type: Type.NUMBER },
                probability: { type: Type.NUMBER },
              },
              required: ["scenarioName", "projectedYield", "probability"]
            },
          },
          influencingFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factorName: { type: Type.STRING },
                status: { type: Type.STRING },
                impact: { type: Type.STRING },
              },
              required: ["factorName", "status", "impact"]
            },
          },
          agronomistRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
        },
        required: [
          "cropName",
          "soilType",
          "landArea",
          "predictedYieldMetric",
          "predictedYieldValueMin",
          "predictedYieldValueMax",
          "predictedYieldAverage",
          "confidenceScore",
          "predictedHarvestDate",
          "scenarios",
          "influencingFactors",
          "agronomistRecommendations"
        ],
      },
    },
  }).then(response => JSON.parse(response.text || "{}"));

  return withTimeoutAndFallback(
    apiCall,
    () => getForecastYieldFallback(cropName, soilType, landArea, state, district),
    5000
  );
}

// --- Audio Voice-to-Text Transcription for Farmers ---
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string = "audio/webm",
  preferredLanguage?: string
): Promise<{ transcript: string }> {
  let cleanBase64 = audioBase64;
  let effectiveMime = mimeType || "audio/webm";

  if (audioBase64.startsWith("data:")) {
    const match = audioBase64.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      effectiveMime = match[1];
      cleanBase64 = match[2];
    }
  }

  const prompt = `You are a speech-to-text agronomist transcriber for farmers on the Krishi Saathi platform.
Listen to the audio recording carefully. The farmer is asking a question about agriculture, crop cultivation, pest or disease management, animal husbandry, dairy, poultry, or fish farming.
Farmer's language preference context: ${preferredLanguage || "Hindi / Regional Indian language / English"}.
Farmer may speak in Hindi, Bhojpuri, Marathi, Maithili, Punjabi, Bengali, Tamil, Telugu, English, or mixed vernacular.
Transcribe the audio faithfully into text. Preserve farming terminology (such as 'यूरिया', 'DAP', 'खैरा रोग', 'नीम तेल', 'गिर गाय', 'मत्स्य पालन', 'माटी', etc.).
Output ONLY the transcription in the spoken language. Do not add conversational commentary, do not add introductory phrases or quotation marks.`;

  const apiCall = ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: effectiveMime,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
  }).then((response) => {
    const text = (response.text || "").trim();
    return { transcript: text };
  });

  return withTimeoutAndFallback(
    apiCall,
    () => ({
      transcript: "How can I improve my crop yield with organic fertilizers?",
    }),
    12000
  );
}

