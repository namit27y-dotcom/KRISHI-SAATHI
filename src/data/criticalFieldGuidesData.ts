export interface CriticalFieldGuide {
  id: string;
  category: "crops" | "disease_pest" | "bio_inputs" | "livestock" | "custom_scan";
  titleEn: string;
  titleHi: string;
  cropOrSubject: string;
  seasonOrStage: string;
  urgency: "critical" | "high" | "moderate";
  summaryEn: string;
  summaryHi: string;
  symptomsOrKeyIndicators: { en: string; hi: string }[];
  immediateSteps: { stepEn: string; stepHi?: string; hi?: string }[];
  dosageOrSchedule: { itemEn: string; itemHi: string; dose: string }[];
  organicRemedyEn: string;
  organicRemedyHi: string;
  emergencyContact: string;
  cachedAt?: string;
  isCustom?: boolean;
}

export const DEFAULT_CRITICAL_FIELD_GUIDES: CriticalFieldGuide[] = [
  {
    id: "guide-wheat-rust-cri",
    category: "crops",
    titleEn: "Wheat: CRI Stage Irrigation & Yellow Rust Management",
    titleHi: "गेहूं: सीआरआई (CRI) सिंचाई चरण एवं पीला रतुआ रोकथाम",
    cropOrSubject: "Wheat (Triticum aestivum)",
    seasonOrStage: "Rabi (20–25 DAS & Heading Stage)",
    urgency: "critical",
    summaryEn: "Crown Root Initiation (CRI) at 21 days after sowing is the most yield-critical irrigation stage. Yellow stripe rust can cause up to 70% yield loss if untreated during cool dewy weather.",
    summaryHi: "बुवाई के 20-25 दिन बाद सीआरआई (Crown Root) चरण सबसे महत्वपूर्ण है। नम व ठंडे मौसम में पीला रतुआ 70% तक उपज घटा सकता है।",
    symptomsOrKeyIndicators: [
      { en: "Powdery yellow pustules arranged in parallel stripes on leaf surface", hi: "पत्तियों पर पीले रंग की धारियों के रूप में फफूंद के पाउडरनुमा दाने" },
      { en: "Stunted tillering and drying of lower leaves due to moisture stress at CRI", hi: "सीआरआई अवस्था पर पानी की कमी से कल्लों का कम फूटना और सूखना" },
      { en: "Yellow dust rubs off easily onto white cloth or fingers", hi: "पत्तियों को छूने पर अंगुली या कपड़े पर पीला पाउडर लग जाना" }
    ],
    immediateSteps: [
      { stepEn: "Apply first irrigation strictly between 20-25 days after sowing (CRI stage).", hi: "बुवाई के ठीक 20 से 25 दिनों के भीतर पहली सिंचाई अवश्य करें।" },
      { stepEn: "Inspect fields in morning for stripe rust focal patches; rogue severely infested plants.", hi: "सुबह के समय खेत का निरीक्षण कर पीले रतुआ ग्रसित पौधों को चिन्हित करें।" },
      { stepEn: "Avoid excess nitrogen (urea) top-dressing if weather is overcast and humid.", hi: "बादल छाए रहने पर अधिक यूरिया डालने से बचें क्योंकि इससे फफूंद तेजी से बढ़ती है।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Propiconazole 25% EC (Tilt)", itemHi: "प्रोपिकोनाजोल 25% ईसी", dose: "1 ml / Liter water (200 ml/acre in 200L water)" },
      { itemEn: "Urea Top Dressing (1st Split)", itemHi: "यूरिया प्रथम छिड़काव", dose: "30-35 kg/acre immediately post-CRI irrigation" },
      { itemEn: "Zinc Sulphate 21% Foliar", itemHi: "जिंक सल्फेट 21%", dose: "1 kg Zinc + 2.5 kg Urea in 200L water for chlorosis" }
    ],
    organicRemedyEn: "Spray sour buttermilk (10-12 days fermented) @ 50 ml/L water or 5% Neem Seed Kernel Extract (NSKE) at early onset as a protective bio-fungicide.",
    organicRemedyHi: "10-12 दिन पुरानी खट्टी छाछ (50 मिली प्रति लीटर) या 5% नीम अर्क का छिड़काव प्राथमिक सुरक्षा के रूप में करें।",
    emergencyContact: "Kisan Call Centre: 1800-180-1551 (Toll-Free, 6 AM - 10 PM)"
  },
  {
    id: "guide-paddy-blast-bph",
    category: "crops",
    titleEn: "Paddy (Rice): Blast Disease & Brown Planthopper (BPH) Protocol",
    titleHi: "धान: झुलसा रोग (Blast) एवं भूरा फुदका (BPH) आपातकालीन गाइड",
    cropOrSubject: "Paddy / Rice (Oryza sativa)",
    seasonOrStage: "Kharif (Tillering to Panicle Initiation)",
    urgency: "critical",
    summaryEn: "Rice blast fungus attacks leaf spindles, nodes, and neck, turning grains chaffy. BPH causes severe 'hopper burn' circular patches requiring rapid de-watering.",
    summaryHi: "धान का ब्लास्ट रोग पत्तियों और बालियों की गर्दन पर हमला करता है। बीपीएच (भूरा फुदका) कुछ ही दिनों में 'हॉपर बर्न' करके फसल सुखा देता है।",
    symptomsOrKeyIndicators: [
      { en: "Spindle-shaped spots with gray/ash-colored centers and brown borders on leaves", hi: "पत्तियों पर आंख या नाव के आकार के धब्बे जिनका केंद्र भूरा-धुंधला और किनारा कत्थई हो" },
      { en: "Neck rot: blackening of panicle base causing empty, upright chaffy ears", hi: "गर्दन तोड़: बाली के आधार का काला पड़ना जिससे दाने नहीं भरते" },
      { en: "Hopper burn: circular dried patches of plants starting from dense canopy base", hi: "हॉपर बर्न: खेत में गोल घेरों में नीचे से पौधे सूखकर जले हुए जैसे दिखना" }
    ],
    immediateSteps: [
      { stepEn: "Immediately drain standing field water for 48 hours to expose BPH to natural ventilation and predators.", hi: "बीपीएच दिखने पर खेत का पानी तुरंत 48 घंटे के लिए निकाल दें ताकि नीचे हवा लगे।" },
      { stepEn: "Provide alleyways (passage gaps) every 2.5 meters to reduce micro-climate humidity.", hi: "खेत में हवा के संचरण के लिए हर 2.5 मीटर पर 30 सेमी की गलियां बनाएं।" },
      { stepEn: "Direct insecticide spray strictly at the base of the plant clumps, not over the leaves.", hi: "कीटनाशक का छिड़काव पत्तियों के ऊपर नहीं, बल्कि पौधों की जड़ व तने के निचले हिस्से पर करें।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Tricyclazole 75% WP (Blast Control)", itemHi: "ट्राइसाइक्लाजोल 75% डब्लूपी", dose: "120 g / acre in 200 Liters water" },
      { itemEn: "Trifloxystrobin + Tebuconazole", itemHi: "ट्रिफ्लोक्सीस्ट्रोबिन + टेबुकोनाजोल (Nativo)", dose: "80 g / acre at early heading stage" },
      { itemEn: "Pymetrozine 50% WDG (BPH Control)", itemHi: "पाइमेट्रोजिन 50% डब्ल्यूडीजी", dose: "120 g / acre directed at plant base" }
    ],
    organicRemedyEn: "Spray Pseudomonas fluorescens liquid formulation @ 5 ml/L water or Trichoderma harzianum at first symptom appearance.",
    organicRemedyHi: "स्यूडोमोनास फ्लोरोसेंस (5 मिली प्रति लीटर) या ट्राइकोडर्मा हरजिएनम का घोल बनाकर छिड़काव करें।",
    emergencyContact: "ICAR Rice Research Directorate: 040-24591218"
  },
  {
    id: "guide-tomato-blight",
    category: "disease_pest",
    titleEn: "Tomato: Early Blight & Late Blight Emergency Action",
    titleHi: "टमाटर: अगेती एवं पछेती झुलसा (Blight) त्वरित नियंत्रण",
    cropOrSubject: "Tomato (Solanum lycopersicum)",
    seasonOrStage: "Vegetative to Fruiting (Cloudy / Foggy Periods)",
    urgency: "critical",
    summaryEn: "Late blight (Phytophthora infestans) spreads explosively in cool (12–22°C) humid or foggy conditions, destroying entire tomato plots within 72 hours if uncontrolled.",
    summaryHi: "पछेती झुलसा ठंडे और कोहरे वाले मौसम में 72 घंटों के भीतर पूरे टमाटर के खेत को तबाह कर सकता है। समय पर दवा का छिड़काव जीवनरक्षक है।",
    symptomsOrKeyIndicators: [
      { en: "Water-soaked dark lesions on leaf tips turning purplish-black with white mildew underside in morning", hi: "पत्तियों के किनारों पर पानी से भीगे भूरे-काले धब्बे और सुबह नीचे सफेद फफूंद" },
      { en: "Concentric target-board rings on lower leaves (Early Blight / Alternaria)", hi: "निचली पत्तियों पर गोल छल्लेदार (Target board) धब्बे (अगेती झुलसा)" },
      { en: "Firm, greasy dark brown blotches on green fruits making them unmarketable", hi: "हरे फलों पर कड़े, तैलीय गहरे भूरे रंग के धब्बे" }
    ],
    immediateSteps: [
      { stepEn: "Immediately remove and deeply bury severely blighted bottom leaves and dropped fruits.", hi: "रोगग्रस्त निचली पत्तियों और गिरे हुए फलों को तुरंत तोड़कर खेत से दूर मिट्टी में दबाएं।" },
      { stepEn: "Switch strictly to drip irrigation; suspend overhead sprinkler watering completely.", hi: "छिड़काव या फव्वारा सिंचाई तुरंत रोक दें, केवल ड्रिप या नाली द्वारा तने से दूर पानी दें।" },
      { stepEn: "Ensure plants are staked upright with bamboo or trellising to keep foliage dry.", hi: "पौधों को बांस या तार के सहारे बांधकर ऊपर रखें ताकि पत्ते जमीन की नमी से दूर रहें।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Mancozeb 75% WP (Contact Protectant)", itemHi: "मैंकोजेब 75% डब्लूपी", dose: "2 to 2.5 g / Liter water (500g/acre)" },
      { itemEn: "Metalaxyl 8% + Mancozeb 64% (Ridomil)", itemHi: "मेटालेक्सिल + मैंकोजेब (रिडोमिल)", dose: "2.5 g / Liter water when late blight confirmed" },
      { itemEn: "Copper Oxychloride 50% WP", itemHi: "कॉपर ऑक्सीक्लोराइड 50%", dose: "3 g / Liter water as protective barrier" }
    ],
    organicRemedyEn: "Foliar application of Trichoderma viride @ 5 g/L with 2 ml sticker/spreader + Garlic-Chilli 10% extract spray.",
    organicRemedyHi: "ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) में 2 मिली स्टिकर मिलाकर छिड़कें। साथ ही लहसुन-मिर्च का काढ़ा उपयोग करें।",
    emergencyContact: "National Horticulture Board Helpdesk: 0124-2342992"
  },
  {
    id: "guide-cotton-pink-bollworm",
    category: "disease_pest",
    titleEn: "Cotton: Pink Bollworm Integrated Pest Management (IPM)",
    titleHi: "कपास: गुलाबी सुंडी (Pink Bollworm) समन्वित कीट प्रबंधन",
    cropOrSubject: "Cotton (Gossypium hirsutum)",
    seasonOrStage: "Flowering to Boll Formation (60–120 DAS)",
    urgency: "high",
    summaryEn: "Pink bollworm larvae enter bolls within 24 hours of hatching, sealing their entrance hole and destroying lint from inside. Scouting and pheromone trapping are essential.",
    summaryHi: "गुलाबी सुंडी के अंडे फूटते ही लार्वा 24 घंटे में टिंडे में घुसकर छेद बंद कर लेता है। फेरोमोन ट्रैप से निगरानी ही एकमात्र अचूक तरीका है।",
    symptomsOrKeyIndicators: [
      { en: "Rosetted flowers: petals twisted together like a rosette due to larval web", hi: "गुलाब जैसे मुड़े हुए फूल (Rosette flower) जिनमें सुंडी ने जाला बनाया हो" },
      { en: "Tiny pinhole entry on green bolls that dries up with light brown frass", hi: "हरे टिंडों पर बारीक सुई जैसा छेद जिसके पास भूरा बुरादा दिखता है" },
      { en: "Locule damage and premature boll opening with stained, discolored fiber", hi: "टिंडों का समय से पहले खिलना और अंदर की रुई का पीला व बदरंग होना" }
    ],
    immediateSteps: [
      { stepEn: "Install 5 Pheromone Traps (Pectino-lure) per acre at crop canopy height for daily monitoring.", hi: "फसल की ऊंचाई पर प्रति एकड़ 5 फेरोमोन ट्रैप (गुलाबी सुंडी ल्यूर) लगाएं।" },
      { stepEn: "Trigger spray when trap catch exceeds 8 moths/trap/night for 3 consecutive days.", hi: "यदि 3 दिन तक लगातार प्रति ट्रैप 8 या अधिक पतंगे पकड़े जाएं, तो तुरंत छिड़काव करें।" },
      { stepEn: "Hand-pick and destroy all rosetted flowers and dropped small bolls twice weekly.", hi: "हफ्ते में दो बार मुड़े हुए फूलों और गिरे हुए टिंडों को इकट्ठा करके नष्ट कर दें।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Neem Oil 1500 ppm (Initial Prevention)", itemHi: "नीम तेल 1500 पीपीएम", dose: "5 ml / Liter water at 45-60 DAS" },
      { itemEn: "Chlorantraniliprole 18.5% SC (Coragen)", itemHi: "क्लोरेंट्रानिलीप्रोल (कोराजन)", dose: "60 ml / acre in 200 Liters water" },
      { itemEn: "Emamectin Benzoate 5% SG (Proclaim)", itemHi: "इमामेक्टिन बेंजोएट 5% एसजी", dose: "80 g / acre for targeted larval suppression" }
    ],
    organicRemedyEn: "Release Trichogramma bactrae egg parasitoids @ 60,000 eggs (3 Tricho-cards)/acre at weekly intervals, starting 45 days after sowing.",
    organicRemedyHi: "बुवाई के 45 दिन बाद हर हफ्ते प्रति एकड़ 3 ट्राइको-कार्ड (60,000 अंडे) ट्राइकोग्रामा परजीवी मित्र कीट छोड़ें।",
    emergencyContact: "Central Institute for Cotton Research (CICR): 07103-275536"
  },
  {
    id: "guide-organic-panchagavya-nske",
    category: "bio_inputs",
    titleEn: "On-Farm Bio-Inputs: Panchagavya & Neem Kernel Extract (NSKE 5%)",
    titleHi: "घर पर जैविक खाद व कीटनाशक: पंचगव्य एवं 5% नीम अर्क (NSKE)",
    cropOrSubject: "All Field & Horticultural Crops",
    seasonOrStage: "Universal Growth Promoter & Natural Pest Repellent",
    urgency: "moderate",
    summaryEn: "Self-prepared organic formulations dramatically reduce chemical input costs while boosting natural plant immunity, beneficial soil microbes, and repelling sucking pests.",
    summaryHi: "घर पर तैयार पंचगव्य और नीम अर्क रासायनिक खर्च 60% तक घटाते हैं, मिट्टी के जीवाणु बढ़ाते हैं और रसचूसक कीटों को दूर रखते हैं।",
    symptomsOrKeyIndicators: [
      { en: "High input costs eating into crop profit margins", hi: "रासायनिक खाद और कीटनाशकों पर अत्यधिक खर्च" },
      { en: "Early infestation of aphids, jassids, thrips, and whiteflies", hi: "माहू, तेला, थ्रिप्स और सफेद मक्खी का शुरुआती प्रकोप" },
      { en: "Poor flowering or flower dropping due to micronutrient deficiency", hi: "फूलों का कम आना या पोषक तत्वों की कमी से असमय गिरना" }
    ],
    immediateSteps: [
      { stepEn: "Panchagavya: Mix 5 kg cow dung + 500g ghee in barrel, stir twice daily for 3 days.", hi: "पंचगव्य: 5 किग्रा गाय का गोबर + 500 ग्राम देसी घी मटके में मिलाकर 3 दिन रोज हिलाएं।" },
      { stepEn: "On day 4, add 3L cow urine + 2L cow milk + 2L curd + 3L tender coconut water + 100g jaggery. Ferment 15 days.", hi: "चौथे दिन 3L गोमूत्र, 2L दूध, 2L छाछ, 3L नारियल पानी व 100g गुड़ डालकर 15 दिन सड़ने दें।" },
      { stepEn: "NSKE 5%: Pound 5 kg dried neem seeds, soak in 10L water overnight, filter through muslin cloth with 10g soap.", hi: "नीम अर्क: 5 किग्रा नीम की निंबोली कूटकर 10L पानी में रात भर भिगोएं, खादी कपड़े से छानकर साबुन का घोल मिलाएं।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Panchagavya Foliar Spray", itemHi: "पंचगव्य पर्णीय छिड़काव", dose: "30 ml / Liter water (3% solution) every 15 days" },
      { itemEn: "Panchagavya Soil Drench / Flood Irrigation", itemHi: "पंचगव्य ड्रिप या सिंचाई के साथ", dose: "20 Liters / acre mixed with irrigation water" },
      { itemEn: "NSKE 5% Insecticide Spray", itemHi: "5% नीम बीज अर्क छिड़काव", dose: "50 ml / Liter water (dilute 10L stock to 100L spray)" }
    ],
    organicRemedyEn: "Use fresh cow urine + asafoetida (hing) @ 10g in 100L water as an instant antifungal barrier against damping-off.",
    organicRemedyHi: "100 लीटर पानी में 5 लीटर ताजा गोमूत्र और 10 ग्राम हींग मिलाकर छिड़कने से फफूंद व रोग तुरंत रुकते हैं।",
    emergencyContact: "National Centre for Organic & Natural Farming (NCONF): 0120-2764906"
  },
  {
    id: "guide-dairy-mastitis-heatstroke",
    category: "livestock",
    titleEn: "Dairy Cattle: Acute Mastitis & Heat Prostration Emergency Protocol",
    titleHi: "दुधारू पशु: तीव्र थनैला (Mastitis) एवं लू/गर्मी आपातकालीन उपचार",
    cropOrSubject: "Cows & Buffaloes (Crossbred HF/Jersey & Murrah)",
    seasonOrStage: "Lactation & Peak Summer / Humid Monsoons",
    urgency: "critical",
    summaryEn: "Clinical mastitis damages milk secretory tissues within 12 hours. Severe heat stroke in high-yield crossbred cows can cause respiratory collapse and sudden death.",
    summaryHi: "तीव्र थनैला 12 घंटों के भीतर थन को हमेशा के लिए खराब कर सकता है। वहीं 40°C से अधिक गर्मी में संकर गायों की जान को तुरंत खतरा होता है।",
    symptomsOrKeyIndicators: [
      { en: "Swollen, hot, stony hard udder quarter; cow refuses to let calf suckle or milker touch", hi: "थन का एक हिस्सा सूजा, अत्यधिक गर्म व पत्थर जैसा कड़ा होना; छूने पर दर्द" },
      { en: "Abnormal milk secretions: watery, bloody, yellowish with thick cheesy clots/flakes", hi: "दूध में बदलाव: पानी जैसा पतला, खून या पीले रंग के थक्के (छेना जैसे) आना" },
      { en: "Heat stroke: open-mouth panting, tongue protruding, heavy frothy salivation, rectal temp > 105°F", hi: "लू/गर्मी: मुंह खोलकर जीभ बाहर निकाल हांफना, मुंह से झाग और 105°F से अधिक बुखार" }
    ],
    immediateSteps: [
      { stepEn: "Heat Stroke First Aid: Immediately move cow to shaded breezeway; continuously splash cold water on head and neck.", hi: "लू लगने पर तुरंत ठंडी छाया में ले जाएं और सिर व गर्दन पर लगातार ठंडा पानी डालें।" },
      { stepEn: "Mastitis First Aid: Strip out the infected quarter milk completely into a separate container every 2 hours.", hi: "थनैला होने पर संक्रमित थन का सारा खराब दूध हर 2 घंटे पर अलग बर्तन में पूरी तरह निकालें।" },
      { stepEn: "Do NOT discard infected milk onto bedding or barn floor to prevent contagious spread to other cattle.", hi: "संक्रमित दूध को फर्श या चारे पर न फेंकें, इसे गड्ढा खोदकर फिनाइल डालकर दबाएं।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Oral Electrolyte & Jaggery Drink", itemHi: "ओआरएस व गुड़ का ठंडा घोल", dose: "100g jaggery + 50g salt + 50g soda in 15L water (Heat Stroke)" },
      { itemEn: "Post-Milking Teat Dip (Povidone Iodine 0.5%)", itemHi: "दूध निकालने के बाद पोविडोन आयोडीन डिप", dose: "Dip teats for 15 seconds after every milking to seal canal" },
      { itemEn: "Intramammary Infusion Tube", itemHi: "थन में चढ़ाने वाली एंटीबायोटिक ट्यूब", dose: "Administer 1 sterile tube per quarter after vet consultation" }
    ],
    organicRemedyEn: "Grind 250g aloe vera pulp + 50g turmeric powder + 15g slaked lime (chuna) with water into a paste. Apply over the affected quarter 4 times daily.",
    organicRemedyHi: "250 ग्राम घृतकुमारी (एलोवेरा) गूदा + 50 ग्राम हल्दी + 15 ग्राम खाने का चूना पीसकर लेप बनाएं और थन पर दिन में 4 बार लगाएं।",
    emergencyContact: "National Veterinary Emergency Helpline: 1962 (Toll-Free, 24/7)"
  },
  {
    id: "guide-goat-bloat-et",
    category: "livestock",
    titleEn: "Goats & Sheep: Acute Ruminal Bloat (Afra) & Enterotoxaemia (ET)",
    titleHi: "बकरी एवं भेड़: तीव्र पेट फूलना (अफरा/Bloat) व ईटी (ET) त्वरित उपचार",
    cropOrSubject: "Goats & Sheep (All Breeds)",
    seasonOrStage: "Sudden Pasture Change / Post-Monsoon Lush Grazing",
    urgency: "critical",
    summaryEn: "Frothy bloat builds gas pressure against the diaphragm, causing asphyxiation within 1–2 hours. Enterotoxaemia ('pulpy kidney') causes sudden death in healthy feeding animals.",
    summaryHi: "अफरा में पेट में गैस भरने से फेफड़े दब जाते हैं और 1-2 घंटे में दम घुट सकता है। ईटी (फड़किया) रोग में स्वस्थ जानवर अचानक गिरकर मर जाते हैं।",
    symptomsOrKeyIndicators: [
      { en: "Left flank severely distended like an inflated drum; resonant hollow sound on tapping", hi: "बाईं कोख (Left Flank) ढोलक की तरह फूली होना; थपथपाने पर खोखली आवाज" },
      { en: "Severe distress, teeth grinding, kicking at belly, inability to walk or lie down", hi: "बेचैनी, दांत किटकिटाना, पेट पर पैर मारना और बार-बार उठना-बैठना" },
      { en: "Enterotoxaemia: sudden green diarrhea, backward arching of neck (opisthotonos), convulsions", hi: "ईटी (फड़किया): हरा दस्त, गर्दन पीछे मुड़ना और पैरों को झटके मारना" }
    ],
    immediateSteps: [
      { stepEn: "Immediately elevate goat's forelegs higher than hind legs on a mound to ease lung breathing pressure.", hi: "बकरी के आगे के दोनों पैरों को ऊंचे टीले पर खड़ा करें ताकि फेफड़ों पर दबाव कम हो।" },
      { stepEn: "Insert a clean wooden gag or stick horizontally in the mouth tied behind ears to stimulate belching.", hi: "मुंह में आड़ी लकड़ी बांधें ताकि बकरी मुंह चलाती रहे और डकार के जरिए गैस बाहर निकले।" },
      { stepEn: "Do NOT force water or feed if the animal is choking or gasping.", hi: "हांफने या सांस अटकने की स्थिति में जानवर को जबरन पानी या चारा कतई न पिलाएं।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Bloat Relieving Mixture (Vegetable / Mustard Oil)", itemHi: "सरसों या मीठा तेल", dose: "50–80 ml oral drench with 5 ml turpentine oil" },
      { itemEn: "Simethicone / Bloatosil Oral Suspension", itemHi: "ब्लोटोसिल या टिम्पोल पाउडर", dose: "15–20 ml directly into mouth using a syringe without needle" },
      { itemEn: "Annual Enterotoxaemia (ET) Vaccine", itemHi: "ईटी (फड़किया) टीका", dose: "2 ml subcutaneous annually before monsoon onset" }
    ],
    organicRemedyEn: "Mix 50g ginger paste + 10g hing (asafoetida) + 20g ajwain (carom seeds) + 50 ml warm mustard oil. Administer slowly as an oral carminative drench.",
    organicRemedyHi: "50g सोंठ/अदरक + 10g हींग + 20g अजवाइन को 50 मिली गुनगुने सरसों के तेल में मिलाकर धीरे-धीरे पिलाएं।",
    emergencyContact: "Central Institute for Research on Goats (CIRG): 0565-2763320"
  },
  {
    id: "guide-aquaculture-oxygen-stress",
    category: "livestock",
    titleEn: "Fish Pond: Dissolved Oxygen (DO) Depletion & Toxicity Protocol",
    titleHi: "मछली तालाब: ऑक्सीजन की कमी एवं अमोनिया विषाक्तता आपातकालीन प्रोटोकॉल",
    cropOrSubject: "Carp & Catfish Aquaculture (Rohu, Katla, Mrigal, Pangasius)",
    seasonOrStage: "Cloudy Weather, Early Dawn Hours (3 AM - 7 AM), Heavy Rain",
    urgency: "critical",
    summaryEn: "Dissolved oxygen drops dangerously low (< 2.0 mg/L) just before sunrise after consecutive cloudy days, leading to mass fish mortality within hours if emergency aeration is delayed.",
    summaryHi: "लगातार बादल रहने के बाद सुबह 4 से 6 बजे के बीच तालाब में ऑक्सीजन 2 मिलीग्राम से कम हो जाती है, जिससे सारी मछलियां सतह पर आकर दम तोड़ सकती हैं।",
    symptomsOrKeyIndicators: [
      { en: "Fish clustering at pond surface gasping for atmospheric air (piping behavior)", hi: "मछलियां तालाब की सतह पर झुंड बनाकर मुंह खोलकर हवा लेने की कोशिश करना" },
      { en: "Foul swampy odor and murky brown/blackish discoloration of pond surface layer", hi: "तालाब के पानी से सड़ांध भरी बदबू आना और पानी का रंग मटमैला काला पड़ना" },
      { en: "Complete cessation of feed intake and sluggish lethargic movements", hi: "मछलियों द्वारा चारा खाना पूरी तरह बंद कर देना और सुस्त होकर तैरना" }
    ],
    immediateSteps: [
      { stepEn: "Immediately activate emergency aerators or pump fresh tubewell water into the pond at a high spray angle.", hi: "तुरंत एरेटर चालू करें या बोरवेल का ताजा पानी ऊंचाई से फव्वारे के रूप में तालाब में गिराएं।" },
      { stepEn: "Run a motorized boat or beat pond water vigorously with bamboo poles to induce surface oxygen absorption.", hi: "नाव चलाकर या बांस के डंडों से पानी को तेजी से हिलाएं/मथें ताकि हवा की ऑक्सीजन पानी में घुले।" },
      { stepEn: "Completely halt all fish feeding and manuring until normal oxygen levels (> 4 mg/L) are restored.", hi: "तालाब में चारा (फीड) और गोबर/खाद डालना तुरंत पूरी तरह बंद कर दें।" }
    ],
    dosageOrSchedule: [
      { itemEn: "Emergency Oxygen Tablets (Sodium Percarbonate)", itemHi: "ऑक्सीजन गोलियां (Oxy-Tab)", dose: "1 to 2 kg / acre broadcast evenly across pond water" },
      { itemEn: "Potassium Permanganate (KMnO4 / Lal Dawa)", itemHi: "पोटेशियम परमैंगनेट (लाल दवा)", dose: "1 to 2 kg / acre to oxidize decaying organic waste" },
      { itemEn: "Agricultural Quicklime (CaO)", itemHi: "बिना बुझा चूना (कली चूना)", dose: "50 kg / acre to neutralize acidity and precipitate suspended mud" }
    ],
    organicRemedyEn: "Add 100 kg crushed dry agricultural gypsum or Zeolite per acre to absorb toxic dissolved unionized ammonia (NH3) from pond bottom.",
    organicRemedyHi: "प्रति एकड़ 100 किग्रा प्राकृतिक जियोलाइट या जिप्सम पाउडर छिड़कें जो तली की जहरीली गैसों को सोख लेता है।",
    emergencyContact: "Central Institute of Freshwater Aquaculture (CIFA): 0674-2465421"
  }
];
