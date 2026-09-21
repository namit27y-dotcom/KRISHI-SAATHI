import { 
  FarmingCategory, 
  Course, 
  Lesson, 
  LivestockCategoryCode,
  LivestockCalculatorType
} from "../types";

export const LIVESTOCK_CATEGORIES: FarmingCategory[] = [
  {
    id: "cat-dairy",
    code: "dairy",
    nameEn: "Dairy Farming",
    nameRegional: {
      en: "Dairy Farming",
      hi: "डेयरी फार्मिंग",
      mr: "डेअरी फार्मिंग (दुग्धव्यवसाय)",
      mai: "डेयरी फार्मिंग (दुग्ध उत्पादन)",
      bho: "डेयरी फार्मिंग (दूध के धंधा)",
      pa: "ਡੇਅਰੀ ਫਾਰਮਿੰਗ",
      ta: "பால் பண்ணை",
      te: "పాడి పరిశ్రమ",
      bn: "দুগ্ধ খামার",
      es: "Ganadería Lechera",
      vi: "Chăn Nuôi Bò Sữa",
      sw: "Ufugaji wa Ng'ombe wa Maziwa"
    },
    descriptionEn: "High-yield cattle & buffalo management, clean milking, nutrition, and profitable milk marketing.",
    descriptionRegional: {
      en: "High-yield cattle & buffalo management, clean milking, nutrition, and profitable milk marketing.",
      hi: "उच्च दुग्ध उत्पादन, वैज्ञानिक शेड प्रबंधन, संतुलित पशु आहार एवं लाभकारी दुग्ध विपणन।",
      mr: "जास्त दूध देणाऱ्या गायी-म्हशींचे व्यवस्थापन, स्वच्छ दूध उत्पादन आणि फायदेशीर विक्री.",
      mai: "बेसी दूध देबऽ बला गाय-महिषक प्रबंधन, संतुलित आहार आ लाभकारी दूध व्यापार।",
      bho: "ढेर दूध देवे वाली गाय-भैंस के देखरेख, साफ दूध दुहना आ बढिया मुनाफा के योजना।",
      pa: "ਡੇਅਰੀ ਪ੍ਰਬੰਧਨ ਅਤੇ ਦੁੱਧ ਉਤਪਾਦਨ",
      ta: "பால் பண்ணை வழிகாட்டி",
      te: "పాడి పరిశ్రమ నిర్వహణ",
      bn: "দুগ্ধ খামার পরিকল্পনা",
      es: "Manejo lechero rentable",
      vi: "Kỹ thuật chăn nuôi bò sữa",
      sw: "Usimamizi wa maziwa bora"
    },
    iconName: "Milk",
    imageUrl: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=800&auto=format&fit=crop&q=80",
    displayOrder: 1,
    totalLessons: 14
  },
  {
    id: "cat-sheep",
    code: "sheep",
    nameEn: "Sheep Farming",
    nameRegional: {
      en: "Sheep Farming",
      hi: "भेड़ पालन",
      mr: "मेंढी पालन",
      mai: "भेड़ पालन",
      bho: "भेड़ पालन",
      pa: "ਭੇਡ ਪਾਲਣ",
      ta: "செம்மறி ஆடு வளர்ப்பு",
      te: "గొర్రెల పెంపకం",
      bn: "ভেড়া পালন",
      es: "Cría de Ovejas",
      vi: "Chăn Nuôi Cừu",
      sw: "Ufugaji wa Kondoo"
    },
    descriptionEn: "Low-maintenance grazing management, wool shearing, meat production, and dryland adaptability.",
    descriptionRegional: {
      en: "Low-maintenance grazing management, wool shearing, meat production, and dryland adaptability.",
      hi: "कम लागत में शुष्क क्षेत्रों में भेड़ पालन, ऊन उत्पादन, मांस बाजार और स्वास्थ्य सुरक्षा।",
      mr: "कमी खर्चात मेंढी पालन, लोकर उत्पादन, मांसासाठी विक्री आणि आरोग्य व्यवस्थापन.",
      mai: "कम लागत मे भेड़ पालन, ऊन आ मांस उत्पादनक उत्तम तकनीक।",
      bho: "कम खरचा में भेड़ पालन, ऊन आ मीट खातिर बढ़िया नस्ल के चुनाव आ देखरेख।",
      pa: "ਭੇਡਾਂ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਅਤੇ ਉੱਨ ਉਤਪਾਦਨ",
      ta: "செம்மறி ஆட்டு பண்ணை",
      te: "గొర్రెల సంరక్షణ",
      bn: "ভেড়া পালন গাইড",
      es: "Producción de lana y carne",
      vi: "Kỹ thuật nuôi cừu",
      sw: "Ufugaji wa kondoo kibiashara"
    },
    iconName: "Trees",
    imageUrl: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&auto=format&fit=crop&q=80",
    displayOrder: 2,
    totalLessons: 16
  },
  {
    id: "cat-goat",
    code: "goat",
    nameEn: "Goat Farming",
    nameRegional: {
      en: "Goat Farming",
      hi: "बकरी पालन",
      mr: "शेळी पालन",
      mai: "बकरी पालन",
      bho: "बकरी पालन",
      pa: "ਬੱਕਰੀ ਪਾਲਣ",
      ta: "வெள்ளாடு வளர்ப்பு",
      te: "మేకల పెంపకం",
      bn: "ছাগল পালন",
      es: "Cría de Cabras",
      vi: "Chăn Nuôi Dê",
      sw: "Ufugaji wa Mbuzi"
    },
    descriptionEn: "Small ruminant rearing, stall-feeding, kid care, prolific breeds (Sirohi, Barbari, Black Bengal), and meat marketing.",
    descriptionRegional: {
      en: "Small ruminant rearing, stall-feeding, kid care, prolific breeds, and meat marketing.",
      hi: "स्टॉल-फीडिंग (बंधक पद्धति), मेमनों की सुरक्षा, सिरोही/बरबरी नस्लें एवं उच्च लाभ का व्यापार।",
      mr: "बंदिस्त शेळीपालन, पिल्लांची निगा, उस्मानाबादी/शिरोही जाती आणि मटण मार्केट व्यवस्थापन.",
      mai: "बकरी पालन, उन्नत नस्ल चयन, आहार आ गाम मे रोजगारक सशक्त साधन।",
      bho: "कम जगह में बकरी पालन (स्टाल फीडिंग), बच्चा के सुरक्षा आ बंपर कमाई।",
      pa: "ਬੱਕਰੀ ਪਾਲਣ ਅਤੇ ਨਸਲ ਸੁਧਾਰ",
      ta: "ஆட்டுப் பண்ணை தொழில்",
      te: "మేకల వ్యాపార ప్రణాళిక",
      bn: "উন্নত ছাগল পালন",
      es: "Caprinocultura intensiva",
      vi: "Kỹ thuật nuôi dê",
      sw: "Ufugaji bora wa mbuzi"
    },
    iconName: "ShieldCheck",
    imageUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80",
    displayOrder: 3,
    totalLessons: 15
  },
  {
    id: "cat-poultry",
    code: "poultry",
    nameEn: "Poultry Farming",
    nameRegional: {
      en: "Poultry Farming",
      hi: "मुर्गी पालन",
      mr: "कुक्कुट पालन",
      mai: "मुर्गी पालन",
      bho: "मुर्गी पालन",
      pa: "ਪੋਲਟਰੀ ਫਾਰਮਿੰਗ",
      ta: "கோழி வளர்ப்பு",
      te: "కోళ్ళ పెంపకం",
      bn: "পোল্ট্রি খামার",
      es: "Avicultura Comercial",
      vi: "Chăn Nuôi Gia Cầm",
      sw: "Ufugaji wa Kuku"
    },
    descriptionEn: "Broiler meat cycles, layer egg production, and hardy Desi/backyard poultry paths.",
    descriptionRegional: {
      en: "Broiler meat cycles, layer egg production, and hardy Desi/backyard poultry paths.",
      hi: "ब्रॉयलर (मांस), लेयर (अंडा) और देसी बैकयार्ड मुर्गी पालन के आधुनिक वैज्ञानिक तरीके।",
      mr: "ब्रॉयलर (मांस), लेयर (अंडी) आणि गावरान/देसी कुक्कुटपालनाचे योग्य मार्गदर्शन.",
      mai: "ब्रायलर, लेयर आ देसी मुर्गी पालनक सम्पूर्ण वैज्ञानिक पाठ।",
      bho: "ब्रायलर, अंडा लेयर आ देसी मुर्गी फार्मिंग के पूरा गाइड आ लागत-कमाई।",
      pa: "ਬਰੌਇਲਰ ਅਤੇ ਲੇਅਰ ਪੋਲਟਰੀ",
      ta: "முட்டை மற்றும் கறிக்கோழி வளர்ப்பு",
      te: "బ్రాయిలర్ మరియు లేయర్ కోళ్లు",
      bn: "ব্রয়লার ও দেশি মুরগি পালন",
      es: "Producción de carne y huevo",
      vi: "Kỹ thuật nuôi gà",
      sw: "Kuku wa nyama na mayai"
    },
    iconName: "Egg",
    imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80",
    displayOrder: 4,
    totalLessons: 14
  },
  {
    id: "cat-pig",
    code: "pig",
    nameEn: "Pig Farming",
    nameRegional: {
      en: "Pig Farming",
      hi: "सूअर पालन",
      mr: "वराह पालन (डुक्कर पालन)",
      mai: "सूअर पालन",
      bho: "सूअर पालन",
      pa: "ਸੂਰ ਪਾਲਣ",
      ta: "பன்றி வளர்ப்பு",
      te: "పందుల పెంపకం",
      bn: "শূকর পালন",
      es: "Porcicultura",
      vi: "Chăn Nuôi Lợn",
      sw: "Ufugaji wa Nguruwe"
    },
    descriptionEn: "High feed conversion, commercial Yorkshire/Landrace breeds, biosecurity, and pork processing.",
    descriptionRegional: {
      en: "High feed conversion, commercial breeds, biosecurity, and pork processing.",
      hi: "उच्च चारा रूपांतरण दर, वैज्ञानिक आवास, संकर नस्लें, टीकाकरण एवं व्यावसायिक बिक्री।",
      mr: "उत्कृष्ट खाद्य रूपांतरण, आधुनिक गोठा, लस टोचणी आणि फायदेशीर विक्री व्यवस्थापन.",
      mai: "उन्नत नस्ल, संतुलित आहार आ व्यावसायिक सूअर पालन।",
      bho: "सस्ते दाना में तेज बढ़त, बीमारियों से बचाव आ बढ़िया मुनाफा।",
      pa: "ਵਪਾਰਕ ਸੂਰ ਪਾਲਣ",
      ta: "பன்றி பண்ணை மேலாண்மை",
      te: "పందుల పెంపకం లాభాలు",
      bn: "বাণিজ্যিক শূকর পালন",
      es: "Granja porcina intensiva",
      vi: "Nuôi lợn thịt và nái",
      sw: "Ufugaji wa nguruwe kibiashara"
    },
    iconName: "Box",
    imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=80",
    displayOrder: 5,
    totalLessons: 12
  },
  {
    id: "cat-beekeeping",
    code: "beekeeping",
    nameEn: "Beekeeping",
    nameRegional: {
      en: "Beekeeping (Apiculture)",
      hi: "मधुमक्खी पालन (मौनपालन)",
      mr: "मधमाशी पालन",
      mai: "मधुमक्खी पालन",
      bho: "मधुमक्खी पालन",
      pa: "ਮਧੂ-ਮੱਖੀ ਪਾਲਣ",
      ta: "தேனீ வளர்ப்பு",
      te: "తేనెటీగల పెంపకం",
      bn: "মৌমাছি পালন",
      es: "Apicultura",
      vi: "Nuôi Ong Lấy Mật",
      sw: "Ufugaji wa Nyuki"
    },
    descriptionEn: "Apis mellifera hive boxes, honey extraction, crop pollination boosters, and royal jelly.",
    descriptionRegional: {
      en: "Hive boxes, honey extraction, crop pollination boosters, and royal jelly.",
      hi: "इटैलियन मधुमक्खी बक्से, शुद्ध शहद निष्कर्षण, फसलों का परागण और मोम उत्पादन।",
      mr: "मध पेट्यांचे नियोजन, शुद्ध मध काढणे, पिकांचे परागीभवन वाढवणे आणि मूल्यवर्धन.",
      mai: "मधुमक्खी पेटी रख-रखाव, शहद उत्पादन आ फसलक पैदावार मे वृद्धि।",
      bho: "मधुमक्खी के बक्सा रख-रखाव, खालिस शहद निकालल आ बगइचा में फल बढ़वल।",
      pa: "ਸ਼ਹਿਦ ਉਤਪਾਦਨ ਅਤੇ ਪਰਾਗਣ",
      ta: "தேனீ பெட்டி மேலாண்மை",
      te: "తేనె ఉత్పత్తి సాంకేతికత",
      bn: "মৌমাছি ও মধু উৎপাদন",
      es: "Producción de miel y cera",
      vi: "Kỹ thuật nuôi ong mật",
      sw: "Uvunaji wa asali safi"
    },
    iconName: "Sun",
    imageUrl: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=800&auto=format&fit=crop&q=80",
    displayOrder: 6,
    totalLessons: 13
  },
  {
    id: "cat-fisheries",
    code: "fisheries",
    nameEn: "Fisheries & Aquaculture",
    nameRegional: {
      en: "Fisheries & Aquaculture",
      hi: "मत्स्य पालन (जलकृषि)",
      mr: "मत्स्य पालन (शेती तळे)",
      mai: "मत्स्य पालन",
      bho: "मछली पालन",
      pa: "ਮੱਛੀ ਪਾਲਣ",
      ta: "மீன் வளர்ப்பு",
      te: "చేపల పెంపకం",
      bn: "মৎস্য চাষ",
      es: "Piscicultura y Acuicultura",
      vi: "Nuôi Trồng Thủy Sản",
      sw: "Ufugaji wa Samaki"
    },
    descriptionEn: "Composite fish culture (Rohu, Catla, Mrigal), pond liming, water dissolved oxygen, and harvesting.",
    descriptionRegional: {
      en: "Composite fish culture, pond liming, water dissolved oxygen, and harvesting.",
      hi: "तालाब तैयारी, रोहू-कतला-मृगल मिश्रित पालन, पानी की गुणवत्ता (DO/pH) एवं शीतकालीन सुरक्षा।",
      mr: "शेतात तळे तयार करणे, रोहू, कटला, मृगळ मासे पालन, पाणी गुणवत्ता आणि काढणी.",
      mai: "पोखरि निर्माण, उन्नत जीरा संचयन, पानीक जांच आ मछलीक थोक बाजार।",
      bho: "पोखरा तैयारी, रोहू-कतला-नैनी के जीरा डालल, चारा आ बढ़िया वजन से तगड़ी कमाई।",
      pa: "ਵਪਾਰਕ ਮੱਛੀ ਪਾਲਣ",
      ta: "குளத்து மீன் வளர்ப்பு",
      te: "చేపల చెరువుల నిర్వహణ",
      bn: "মিশ্র মাছ চাষ",
      es: "Cultivo de peces en estanques",
      vi: "Nuôi cá nước ngọt",
      sw: "Bwawa la samaki kibiashara"
    },
    iconName: "Fish",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    displayOrder: 7,
    totalLessons: 14
  },
  {
    id: "cat-integrated",
    code: "integrated",
    nameEn: "Integrated Livestock Farming",
    nameRegional: {
      en: "Integrated Livestock Farming",
      hi: "एकीकृत पशुपालन एवं खेती",
      mr: "एकात्मिक शेती व पशुपालन",
      mai: "एकीकृत खेती आ पशुपालन",
      bho: "एकीकृत खेती आ पशुपालन",
      pa: "ਸੰਯੁਕਤ ਖੇਤੀ ਪ੍ਰਣਾਲੀ",
      ta: "ஒருங்கிணைந்த பண்ணை முறை",
      te: "సమగ్ర వ్యవసాయం",
      bn: "সমন্বিত খামার ব্যবস্থা",
      es: "Sistemas Agropecuarios Integrados",
      vi: "Mô Hình Nông Nghiệp Khép Kín",
      sw: "Kilimo Mseto na Mifugo"
    },
    descriptionEn: "Recycle manure into biogas and bio-fertilizer, utilize crop residues for fodder, and integrate pond ecosystems.",
    descriptionRegional: {
      en: "Recycle manure into bio-fertilizer, crop residues into fodder, and integrate pond ecosystems.",
      hi: "गोबर व फसल अवशेषों का शत-प्रतिशत सदुपयोग, शून्य अपशिष्ट (Zero Waste) मॉडल और बहु-आयामी आय।",
      mr: "शेणखत व पिकांच्या अवशेषांचा पुनर्वापर, शून्य कचरा मॉडेल आणि शाश्वत उत्पन्न.",
      mai: "फसल, पशु आ पोखरिक संगम, खादक बचत आ गाम मे आत्मनिर्भरता।",
      bho: "फसल के डांठ से पशु चारा, गोबर से खाद आ पोखरा में मछली—एगो खरचा से तिहरा फायदा।",
      pa: "ਜ਼ੀਰੋ-ਵੇਸਟ ਏਕੀਕ੍ਰਿਤ ਖੇਤੀ",
      ta: "சுழற்சி முறை ஒருங்கிணைந்த பண்ணை",
      te: "వ్యర్థాల పునర్వినియోగం",
      bn: "জিরো-ওয়েস্ট সমন্বিত চাষ",
      es: "Reciclaje integral de nutrientes",
      vi: "Mô hình VAC khép kín",
      sw: "Mfumo wa kilimo na ufugaji pamoja"
    },
    iconName: "Repeat",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
    displayOrder: 8,
    totalLessons: 6
  }
];

// Helper to get lessons by category code
export const LESSONS_DATABASE: Record<LivestockCategoryCode, Lesson[]> = {
  dairy: [
    {
      id: "lsn-dairy-1",
      moduleId: "mod-dairy-intro",
      categoryId: "dairy",
      orderNumber: 1,
      topicNumber: 1,
      titleEn: "1. Introduction to Modern Dairy Farming",
      titleRegional: {
        en: "1. Introduction to Modern Dairy Farming",
        hi: "1. आधुनिक डेयरी फार्मिंग का परिचय",
        mr: "1. आधुनिक डेअरी फार्मिंगची ओळख",
        mai: "1. आधुनिक डेयरी फार्मिंगक परिचय",
        bho: "1. आधुनिक डेयरी फार्मिंग के परिचय",
        pa: "1. ਆਧੁਨਿਕ ਡੇਅਰੀ ਫਾਰਮਿੰਗ ਜਾਣ-ਪਛਾਣ",
        ta: "1. நவீன பால் பண்ணை அறிமுகம்",
        te: "1. ఆధునిక పాడి పరిశ్రమ పరిచయం",
        bn: "1. আধুনিক দুগ্ধ খামার পরিচিতি",
        es: "1. Introducción a la ganadería lechera",
        vi: "1. Giới thiệu chăn nuôi bò sữa",
        sw: "1. Utangulizi wa ufugaji wa maziwa"
      },
      descriptionEn: "Understand dairy economics, daily farm cycles, milk quality benchmarks (Fat & SNF), and sustainability.",
      descriptionRegional: {
        en: "Understand dairy economics, daily farm cycles, milk quality benchmarks, and sustainability.",
        hi: "डेयरी व्यवसाय का अर्थशास्त्र, दैनिक दिनचर्या, दूध की गुणवत्ता (फैट एवं एसएनएफ) और दीर्घकालिक लाभ।",
        mr: "डेअरी व्यवसायाचे अर्थशास्त्र, दैनंदिन नियोजन आणि दुधाचे फॅट/SNF मानक.",
        mai: "डेयरी व्यवसायक मूल सिद्धान्त आ दूधक शुद्धता नापबाक नियम।",
        bho: "डेयरी बिजनेस के गणित, रोजाना के काम आ दूध के फैट-SNF के समझ।",
        pa: "ਡੇਅਰੀ ਕਾਰੋਬਾਰ ਦੀ ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ",
        ta: "பால் தர நிர்ணயம் மற்றும் லாபம்",
        te: "పాల నాణ్యత ప్రమాణాలు",
        bn: "দুগ্ধ ব্যবসার প্রাথমিক ধারণা",
        es: "Fundamentos de producción láctea",
        vi: "Cơ bản về quản lý trang trại sữa",
        sw: "Misingi ya biashara ya maziwa"
      },
      durationMinutes: 12,
      keyPointsEn: [
        "Consistent routine in feeding and milking prevents production drops.",
        "Quality milk pricing is determined by Fat % and Solid-Not-Fat (SNF) %.",
        "Clean housing reduces mastitis risk by over 60%."
      ],
      keyPointsRegional: {
        en: ["Consistent routine in feeding and milking.", "Fat & SNF determine price.", "Clean housing reduces mastitis."],
        hi: [
          "दुग्ध दोहन एवं आहार में निश्चित समय सारणी उत्पादन स्थिर रखती है।",
          "दूध की कीमत मुख्य रूप से फैट और एसएनएफ (SNF) प्रतिशत पर तय होती है।",
          "साफ-सुथरा फर्श थनैला (Mastitis) रोग के खतरे को 60% से अधिक कम करता है।"
        ],
        mr: [
          "आहार व दूध काढण्याच्या वेळेत नियमितता अत्यंत गरजेची आहे.",
          "दुधाचे भाव फॅट आणि एसएनएफ प्रमाणावर ठरतात.",
          "स्वच्छ गोठा कासदाह (थनेला) रोगापासून वाचवतो."
        ],
        mai: [
          "नियमित समय पर आहार आ दुहबा सँ उत्पादन बनल रहैत अछि।",
          "दूधक भाव फैट आ एसएनएफ पर निर्भर करैत अछि।",
          "गोहालक सफाई थनैला रोग सँ बचाबैत अछि।"
        ],
        bho: [
          "दूध दुहे आ दाना देवे के टाइम फिक्स रखला से दूध ना घटेला।",
          "दूध के रेट फैट आ SNF चेक कइके मिलेला।",
          "गोशाला के सूखा आ साफ रखला से थनैला के डर ना रहेला।"
        ],
        pa: ["ਖੁਰਾਕ ਅਤੇ ਚੋਆਈ ਦਾ ਨਿਯਮਿਤ ਸਮਾਂ", "ਫੈਟ ਅਤੇ ਐਸਐਨਐਫ ਮਾਪਦੰਡ"],
        ta: ["சரியான நேரத்தில் உணவு மற்றும் கறவை", "கொழுப்பு சத்து முக்கியத்துவம்"],
        te: ["క్రమం తప్పకుండా దాణా మరియు పాలు పిండడం", "నాణ్యత ప్రమాణాలు"],
        bn: ["নিয়মিত পরিচর্যা ও দুধ দোয়ানো", "ফ্যাট ও এসএনএফ মান"],
        es: ["Rutina estricta de ordeño", "Calidad basada en grasa y sólidos"],
        vi: ["Lịch cho ăn và vắt sữa đều đặn", "Tiêu chuẩn chất lượng sữa"],
        sw: ["Ratiba ya kila siku ya kukamua", "Kiwango cha mafuta ya maziwa"]
      },
      safetyNotesEn: "Always sanitize hands and milking clusters before handling cows. Disinfect teat tips post-milking.",
      safetyNotesRegional: {
        en: "Always sanitize hands and milking clusters. Disinfect teat tips post-milking.",
        hi: "दुहने से पहले हाथ और बर्तन धोएं। दुग्ध दोहन के तुरंत बाद थनों पर एंटीसेप्टिक टीट-डिप घोल लगाएं।",
        mr: "दूध काढण्यापूर्वी हात व भांडी स्वच्छ करा. दूध काढल्यावर कासेवर टीट-डिप औषध लावा.",
        mai: "दूध दुहबा सँ पहिले हाथ धोउ। दुहलाक बाद थन पर रोगाणुरोधक घोल लगाउ।",
        bho: "दुहे से पहिले हाथ आ बाल्टी साफ रखीं। दुहला के बाद थन पर दवा (टीट-डिप) लगाईं।",
        pa: "ਚੋਆਈ ਤੋਂ ਬਾਅਦ ਥਣਾਂ ਦੀ ਸਫਾਈ ਜ਼ਰੂਰੀ ਹੈ।",
        ta: "கறவைக்கு பின் காம்புகளை சுத்தம் செய்யவும்.",
        te: "పాలు పితికిన తర్వాత శుభ్రత తప్పనిసరి.",
        bn: "দুধ দোয়ানোর পর ওলান জীবাণুমুক্ত করুন।",
        es: "Desinfectar pezones post-ordeño.",
        vi: "Nhúng núm vú sát trùng sau vắt.",
        sw: "Safisha viwele baada ya kukamua."
      },
      video: {
        id: "vid-dairy-1",
        lessonId: "lsn-dairy-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", // Configurable placeholder
        durationSeconds: 720,
        isConfigurable: true
      },
      quiz: {
        id: "qz-dairy-1",
        lessonId: "lsn-dairy-1",
        titleEn: "Dairy Fundamentals Check",
        titleRegional: {
          en: "Dairy Fundamentals Check",
          hi: "डेयरी मूल बातें प्रश्नोत्तरी",
          mr: "डेअरी प्राथमिक चाचणी",
          mai: "डेयरी ज्ञान परीक्षा",
          bho: "डेयरी के सवाल-जवाब",
          pa: "ਡੇਅਰੀ ਟੈਸਟ",
          ta: "பால் பண்ணை வினாடி வினா",
          te: "పాడి పరీక్ష",
          bn: "দুগ্ধ খামার কুইজ",
          es: "Cuestionario lechero",
          vi: "Trắc nghiệm bò sữa",
          sw: "Jaribio la maziwa"
        },
        passingScore: 1,
        questions: [
          {
            id: "q-d1",
            quizId: "qz-dairy-1",
            questionEn: "What two metrics primarily dictate the commercial procurement price of milk?",
            questionRegional: {
              en: "What two metrics primarily dictate the commercial procurement price of milk?",
              hi: "व्यावसायिक डेयरी में दूध की खरीद दर किन दो पैमानों पर तय होती है?",
              mr: "डेअरीमध्ये दुधाचा खरेदी दर कोणत्या दोन घटकांवर ठरतो?",
              mai: "डेयरी मे दूधक दाम कोन दू टा पैमाना पर तय होइत अछि?",
              bho: "डेयरी में दूध के खरीदारी रेट कवना दू गो चीज पर तय होला?",
              pa: "ਦੁੱਧ ਦਾ ਮੁੱਲ ਕਿਨ੍ਹਾਂ ਦੋ ਚੀਜ਼ਾਂ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ?",
              ta: "பாலின் கொள்முதல் விலை எதை அடிப்படையாகக் கொண்டது?",
              te: "పాల సేకరణ ధర వేటిపై ఆధారపడుతుంది?",
              bn: "দুধের দাম কোন দুটির ওপর নির্ধারিত হয়?",
              es: "¿Qué parámetros dictan el precio de la leche?",
              vi: "Hai chỉ số nào quyết định giá thu mua sữa?",
              sw: "Vipimo vipi huamua bei ya maziwa?"
            },
            optionsEn: [
              "Color & Odor",
              "Fat % and SNF (Solids-Not-Fat) %",
              "Lactometer Reading only",
              "Volume alone"
            ],
            optionsRegional: {
              en: ["Color & Odor", "Fat % and SNF (Solids-Not-Fat) %", "Lactometer Reading only", "Volume alone"],
              hi: [
                "रंग एवं गंध",
                "फैट (वसा) % एवं एसएनएफ (SNF) %",
                "केवल लैक्टोमीटर रीडिंग",
                "केवल दूध का कुल आयतन"
              ],
              mr: [
                "रंग आणि वास",
                "फॅट % आणि एसएनएफ (SNF) %",
                "फक्त लॅक्टोमीटर वाचन",
                "केवळ प्रमाण"
              ],
              mai: [
                "रंग आ महक",
                "फैट % आ एसएनएफ %",
                "केबल लैक्टोमीटर",
                "मात्रा"
              ],
              bho: [
                "रंग आ महक",
                "फैट % आ SNF %",
                "खाली नाप",
                "खाली वजन"
              ],
              pa: ["ਰੰਗ", "ਫੈਟ ਅਤੇ ਐਸਐਨਐਫ", "ਰੀਡਿੰਗ", "ਆਇਤਨ"],
              ta: ["நிறம்", "கொழுப்பு மற்றும் SNF", "அளவு", "வாசனை"],
              te: ["రంగు", "ఫ్యాట్ మరియు SNF", "రీడింగ్", "పరిమాణం"],
              bn: ["রং", "ফ্যাট ও এসএনএফ", "ঘনত্ব", "ওজন"],
              es: ["Color y olor", "% Grasa y % Sólidos No Grasos", "Solo densidad", "Solo volumen"],
              vi: ["Màu sắc", "% Mỡ và % Chất khô không béo (SNF)", "Chỉ tỷ trọng", "Chỉ thể tích"],
              sw: ["Rangi", "% ya Mafuta na SNF", "Usomaji tu", "Kiasi pekee"]
            },
            correctOptionIndex: 1,
            explanationEn: "Dairy collection centers grade milk based on both butterfat percentage and non-fat solid minerals/proteins (SNF).",
            explanationRegional: {
              en: "Collection centers grade milk based on butterfat and non-fat solids (SNF).",
              hi: "डेयरी समितियां दूध का भुगतान मक्खन वसा (Fat) और अन्य ठोस पोषक तत्वों (SNF) के संयुक्त आधार पर करती हैं।",
              mr: "दुधाचे मूल्यांकन फॅट आणि इतर पौष्टिक घटकांच्या (SNF) प्रमाणावर होते.",
              mai: "दूधक भुगतान फैट आ एसएनएफ के आधार पर होइत अछि।",
              bho: "डेयरी पर रेट फैट आ SNF मिला के तय कइल जाला।",
              pa: "ਫੈਟ ਅਤੇ ਐਸਐਨਐਫ ਦੋਵੇਂ ਮਹੱਤਵਪੂਰਨ ਹਨ।",
              ta: "கொழுப்பு மற்றும் திடச்சத்துகளின் அடிப்படையில் விலை நிர்ணயிக்கப்படுகிறது.",
              te: "ఫ్యాట్ మరియు ఎస్ఎన్ఎఫ్ ఆధారంగా ధర చెల్లిస్తారు.",
              bn: "ফ্যাট ও এসএনএফ উভয়ের ভিত্তিতেই দর দেওয়া হয়।",
              es: "El pago se basa en el contenido de grasa y sólidos totales.",
              vi: "Giá sữa được tính theo tỷ lệ mỡ và chất khô không béo.",
              sw: "Malipo hutegemea kiwango cha mafuta na madini."
            }
          }
        ]
      },
      isPublished: true
    },
    {
      id: "lsn-dairy-2",
      moduleId: "mod-dairy-breeds",
      categoryId: "dairy",
      orderNumber: 2,
      topicNumber: 2,
      titleEn: "2. Dairy Breed Selection",
      titleRegional: {
        en: "2. Dairy Breed Selection",
        hi: "2. दुधारू नस्ल का चयन",
        mr: "2. दुभत्या जनावरांच्या जातींची निवड",
        mai: "2. दुधारू नस्लक चुनाव",
        bho: "2. दुधारू नस्ल के चुनाव",
        pa: "2. ਦੁਧਾਰੂ ਨਸਲਾਂ ਦੀ ਚੋਣ",
        ta: "2. கறவை மாடு இன தேர்வு",
        te: "2. పాడి పశువుల జాతుల ఎంపిక",
        bn: "2. উন্নত দুগ্ধ জাত নির্বাচন",
        es: "2. Selección de razas lecheras",
        vi: "2. Chọn giống bò sữa",
        sw: "2. Uchaguzi wa mbegu za ng'ombe"
      },
      descriptionEn: "Indigenous breeds (Gir, Sahiwal, Red Sindhi, Murrah buffalo) vs crossbreds (HF, Jersey Cross) based on climate resilience.",
      descriptionRegional: {
        en: "Indigenous breeds vs crossbreds based on climate resilience.",
        hi: "देसी नस्लें (गीर, साहीवाल, लाल सिंधी, मुर्रा भैंस) बनाम संकर नस्लें (HF, जर्सी क्रॉस) का जलवायु अनुकूल विश्लेषण।",
        mr: "देशी जाती (गीर, साहिवाल, मुऱ्हा म्हैस) विरुद्ध संकरित गाई (एचएफ, जर्सी) यांची हवामानानुसार निवड.",
        mai: "गीर, साहीवाल, मुर्रा आ संकर नस्लक जलवायु अनुसार चयन।",
        bho: "गीर, साहीवाल, मुर्रा भँइस भा जर्सी क्रॉस—इलाका के मौसम के अनुसार सही चुनाव।",
        pa: "ਸਾਹੀਵਾਲ, ਗੀਰ ਅਤੇ ਕਰਾਸ ਨਸਲਾਂ ਦੀ ਚੋਣ",
        ta: "நாட்டு மற்றும் கலப்பின மாடுகள் தேர்வு",
        te: "గిర్, సాహివాల్ మరియు ముర్రా గేదెల ఎంపిక",
        bn: "দেশি গির, শাহিওয়াল ও শঙ্কর জাতের সুবিধা",
        es: "Razas índicas vs cruces europeos",
        vi: "So sánh giống bò nội và bò lai",
        sw: "Kuchagua mbegu inayofaa hali ya hewa"
      },
      durationMinutes: 15,
      keyPointsEn: [
        "Indigenous Gir and Sahiwal possess high heat and tick resistance with A2 milk.",
        "Murrah buffalo yields 8-12 liters/day with high 7-8% Fat, ideal for ghee and paneer.",
        "HF Crossbreds demand strict heat alleviation (cooling fans & misting) in hot summers."
      ],
      keyPointsRegional: {
        en: ["Gir & Sahiwal have heat/tick resistance.", "Murrah buffalo gives high fat milk.", "HF Crosses need cooling."],
        hi: [
          "देसी गीर और साहीवाल में गर्मी और किलनी (ticks) सहने की अद्भुत क्षमता और A2 दूध होता है।",
          "मुर्रा भैंस 7-8% उच्च फैट के साथ 8-12 लीटर प्रतिदिन देती है, जो घी-पनीर के लिए श्रेष्ठ है।",
          "HF संकर गायों को गर्मियों में पंखे और फव्वारे (misting) की सख्त जरूरत होती है।"
        ],
        mr: [
          "गीर आणि साहिवाल गाई उष्णता आणि गोचीडांना उत्तम प्रतिकार करतात.",
          "मुऱ्हा म्हैस जास्त फॅटच्या (7-8%) दुधासाठी सर्वोत्तम आहे.",
          "संकरित गाईंना उन्हाळ्यात कुलिंग फॅन व पाण्याच्या फवाऱ्यांची गरज असते."
        ],
        mai: [
          "गीर आ साहीवाल मे गरमी सहबाक क्षमता बेसी होइत अछि।",
          "मुर्रा महिषक दूध मे फैट बेसी होइत अछि।",
          "संकर गाय के गरमी मे पंखा आ पानीक व्यवस्था चाही।"
        ],
        bho: [
          "गीर आ साहीवाल गरमी आ टिक (किलनी) आराम से सह लेली।",
          "मुर्रा भँइस के दूध में 7-8% फैट होला, खोवा-घी खातिर नम्बर वन।",
          "जर्सी/HF के गरमी में पंखा-कूलर जरूरी होला।"
        ],
        pa: ["ਸਾਹੀਵਾਲ ਗਰਮੀ ਸਹਿਣਯੋਗ ਹੈ", "ਮੁਰ੍ਹਾ ਮੱਝ ਉੱਤਮ ਹੈ"],
        ta: ["நாட்டு மாடுகள் வெப்பத்தை தாங்கும்", "முர்ரா எருமை பால் கெட்டியானது"],
        te: ["గిర్ ఆవులు వేడిని తట్టుకుంటాయి", "ముర్రా గేదెలు అధిక వెన్న శాతం"],
        bn: ["শাহিওয়াল তাপ সহনশীল", "মুররা মহিষের দুধে ফ্যাট বেশি"],
        es: ["Razas cebú toleran calor", "Búfalas Murrah alto tenor graso"],
        vi: ["Bò Zebu chịu nhiệt tốt", "Trâu Murrah cho sữa giàu béo"],
        sw: ["Ng'ombe wa kienyeji wanastahimili joto", "Nyati hutoa mafuta mengi"]
      },
      safetyNotesEn: "Never purchase cattle without verification of vaccination history (FMD, Brucellosis, HS/BQ) and test milking.",
      safetyNotesRegional: {
        en: "Always verify vaccination history and conduct test milking before purchase.",
        hi: "टीकाकरण इतिहास (खुरपका-मुंहपका, ब्रुसेलोसिस) और 3 समय का दुग्ध परीक्षण किए बिना पशु न खरीदें।",
        mr: "लाळ्या खुरकूत, ब्रुसेलोसिस लसीकरण आणि ३ वेळेचे दूध मोजल्याशिवाय जनावर खरेदी करू नका.",
        mai: "टीकाकरण प्रमाणपत्र आ लगातार तीन बेर दूध दुहि कऽ देखलाक बादे पशु खरीदू।",
        bho: "बिना सुई-टीका के कागज देखले आ 3 बेरा दुह के नापले कवनो गाय-भैंस मत बिसाहीं।",
        pa: "ਖਰੀਦਣ ਤੋਂ ਪਹਿਲਾਂ ਟੀਕਾਕਰਨ ਦੀ ਜਾਂਚ ਕਰੋ।",
        ta: "தடுப்பூசி சான்றிதழ் சரிபார்க்கவும்.",
        te: "టీకాల రికార్డు తనిఖీ చేయండి.",
        bn: "টিকার প্রমাণপত্র দেখে গরু কিনুন।",
        es: "Verificar historial sanitario antes de comprar.",
        vi: "Kiểm tra sổ tiêm phòng trước khi mua.",
        sw: "Hakikisha historia ya chanjo kabla ya kununua."
      },
      video: {
        id: "vid-dairy-2",
        lessonId: "lsn-dairy-2",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 900,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  sheep: [
    {
      id: "lsn-sheep-1",
      moduleId: "mod-sheep-breeds",
      categoryId: "sheep",
      orderNumber: 1,
      topicNumber: 1,
      titleEn: "1. Sheep Breeds & Selection",
      titleRegional: {
        en: "1. Sheep Breeds & Selection",
        hi: "1. भेड़ की नस्लें एवं चयन",
        mr: "1. मेंढ्यांच्या जाती व निवड",
        mai: "1. भेड़ की नस्ल आ चुनाव",
        bho: "1. भेड़ के नस्ल आ चुनाव",
        pa: "1. ਭੇਡਾਂ ਦੀਆਂ ਨਸਲਾਂ",
        ta: "1. செம்மறி ஆடு இனங்கள்",
        te: "1. గొర్రెల జాతులు",
        bn: "1. ভেড়ার উন্নত জাত",
        es: "1. Razas ovinas",
        vi: "1. Giống cừu",
        sw: "1. Mbegu za kondoo"
      },
      descriptionEn: "Key Indian breeds: Deccani, Nellore, Marwari, Mandya, and prolific Garole. Meat vs dual-purpose traits.",
      descriptionRegional: {
        en: "Key Indian breeds: Deccani, Nellore, Marwari, Mandya. Meat vs dual-purpose traits.",
        hi: "प्रमुख भारतीय नस्लें: दक्कनी, नेल्लोर, मारवाड़ी, मांड्या और गारोल। मांस एवं ऊन के लिए उपयुक्त चुनाव।",
        mr: "दख्खनी, नेल्लोर, मारवाडी, मांड्या जाती; मांस व लोकर उत्पादनासाठी योग्य निवड.",
        mai: "दक्कनी, नेल्लोर, मारवाड़ी नस्लक विशेषता आ चयनक तरीका।",
        bho: "दक्कनी, नेल्लोर, मांड्या नस्ल—मीट खातिर सबसे बढ़िया बढ़वार वाली भेड़।",
        pa: "ਭਾਰਤੀ ਭੇਡਾਂ ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਨਸਲਾਂ",
        ta: "இறைச்சி மற்றும் கம்பளி ஆடுகள்",
        te: "నెల్లూరు మరియు దక్కని జాతులు",
        bn: "মাংস ও পশম উপযোগী জাত",
        es: "Razas de carne vs doble propósito",
        vi: "Chọn giống cừu thịt và lông",
        sw: "Kondoo wa nyama na sufu"
      },
      durationMinutes: 12,
      keyPointsEn: [
        "Nellore is India's tallest meat breed with high daily weight gain.",
        "Deccani is exceptionally hardy and thrives on sparse pasture grazing.",
        "Select breeding rams with strong masculine characteristics and sound leg conformation."
      ],
      keyPointsRegional: {
        en: ["Nellore has high weight gain.", "Deccani is hardy.", "Select strong rams."],
        hi: [
          "नेल्लोर भारत की सबसे ऊंची मांस नस्ल है जिसकी दैनिक वजन वृद्धि तीव्र होती है।",
          "दक्कनी नस्ल अत्यंत सहनशील है और सीमित चराई में भी स्वस्थ रहती है।",
          "प्रजनन हेतु मजबूत पैर और चौड़े सीने वाले मेंढे का ही चयन करें।"
        ],
        mr: [
          "नेल्लोर ही जास्त वजन वाढवणारी प्रसिद्ध जात आहे.",
          "दख्खनी जात दुष्काळी भागातही सहज टिकून राहते.",
          "प्रजननासाठी मजबूत पायांचा नर (मेंढा) निवडावा."
        ],
        mai: [
          "नेल्लोर मांस उत्पादन लेल सर्वश्रेष्ठ अछि।",
          "दक्कनी नस्ल कोनो मौसम मे रहि सकैत अछि।",
          "प्रजनन लेल नीक मेंढा चुनू।"
        ],
        bho: [
          "नेल्लोर के वजन बहुत तेज भागेला।",
          "दक्कनी भेड़ सुखाड़ में भी चरे में माहिर होली।",
          "ब्रीडिंग खातिर मजबूत कद-काठी के मेंढा चुनीं।"
        ],
        pa: ["ਨੇਲੋਰ ਸਭ ਤੋਂ ਵੱਡੀ ਨਸਲ ਹੈ", "ਤਕੜੇ ਨਰ ਦੀ ਚੋਣ ਕਰੋ"],
        ta: ["நெல்லூர் ஆடு வேகமாக எடைகூடும்", "ஆரோக்கியமான கிடா தேர்வு"],
        te: ["నెల్లూరు గొర్రెలు త్వరగా బరువు పెరుగుతాయి", "మంచి పోతును ఎంచుకోండి"],
        bn: ["নেল্লোর দ্রুত বৃদ্ধি পায়", "সঠিক প্রজননকারী নির্বাচন"],
        es: ["Raza Nellore gran ganancia de peso", "Selección de carneros vigorosos"],
        vi: ["Giống Nellore tăng trọng nhanh", "Chọn đực giống khỏe"],
        sw: ["Kondoo wa Nellore hukua haraka", "Chagua dume mwenye nguvu"]
      },
      safetyNotesEn: "Isolate new stock for 21 days (Quarantine) and deworm prior to mixing with flock.",
      safetyNotesRegional: {
        en: "Quarantine new animals for 21 days and deworm before flock introduction.",
        hi: "नए खरीदे पशुओं को 21 दिन अलग (क्वारंटीन) रखें और पेट के कीड़े की दवा (Deworming) अवश्य दें।",
        mr: "नवीन मेंढ्यांना २१ दिवस वेगळे ठेवा व जंतनाशक औषध देऊनच कळपात मिसळा.",
        mai: "नव पशु के २१ दिन अलग राखू आ पेटक कीड़ाक दवाई दियौक।",
        bho: "नया भेड़ के 21 दिन ले झुंड से अलगा रखीं आ पेट के कीरा के दवाई जरूर दीं।",
        pa: "ਨਵੇਂ ਜਾਨਵਰਾਂ ਨੂੰ 21 ਦਿਨ ਵੱਖ ਰੱਖੋ।",
        ta: "புதிய ஆடுகளை 21 நாட்கள் தனிமைப்படுத்தவும்.",
        te: "కొత్త గొర్రెలను 21 రోజులు వేరుగా ఉంచండి.",
        bn: "নতুন ভেড়া ২১ দিন আলাদা রাখুন।",
        es: "Cuarentena obligatoria de 21 días.",
        vi: "Cách ly 21 ngày trước khi nhập đàn.",
        sw: "Tenga wanyama wapya kwa siku 21."
      },
      video: {
        id: "vid-sheep-1",
        lessonId: "lsn-sheep-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 650,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  goat: [
    {
      id: "lsn-goat-1",
      moduleId: "mod-goat-housing",
      categoryId: "goat",
      orderNumber: 1,
      topicNumber: 3,
      titleEn: "1. Goat Shed & Elevated Slatted Flooring",
      titleRegional: {
        en: "1. Goat Shed & Elevated Slatted Flooring",
        hi: "1. बकरी शेड एवं मचान (Slatted) आवास प्रबंधन",
        mr: "1. शेळी गोठा आणि मचान पद्धत (Slatted Floor)",
        mai: "1. बकरी शेड आ मचान आवास प्रबंधन",
        bho: "1. बकरी शेड आ मचान (ऊपर उठल) फार्मिंग",
        pa: "1. ਬੱਕਰੀ ਸ਼ੈੱਡ ਪ੍ਰਬੰਧਨ",
        ta: "1. பரண்மேல் ஆடு வளர்ப்பு கொட்டகை",
        te: "1. మేకల షెడ్డు మరియు మంచె విధానం",
        bn: "1. আধুনিক মাচা পদ্ধতিতে ছাগলের ঘর",
        es: "1. Alojamiento elevado para caprinos",
        vi: "1. Thiết kế chuồng dê sàn nâng",
        sw: "1. Zizi la mbuzi lililoinuliwa"
      },
      descriptionEn: "Elevated wooden or plastic slatted floors keep goats dry, prevent parasitic foot rot, and ease manure collection.",
      descriptionRegional: {
        en: "Elevated slatted floors keep goats dry, prevent foot rot, and ease manure collection.",
        hi: "जमीन से 3-4 फीट ऊपर मचान शेड बकरियों को निमोनिया और खुरपका से बचाता है तथा खाद संग्रह आसान करता है।",
        mr: "जमिनीपासून उंच मचान पद्धत शेळ्यांना कोरडे ठेवते, खुरकुजवा रोखते आणि लेंडी खत गोळा करणे सोपे करते.",
        mai: "मचान पर बकरी रखला सँ निमोनिया आ खुरक बीमारी नहि होइत अछि।",
        bho: "जमीन से ऊपर मचान बना के रखे से बकरी सूखा रहेली आ निमोनिया-खुरपका से बचली।",
        pa: "ਉੱਚਾ ਸ਼ੈੱਡ ਬਿਮਾਰੀਆਂ ਤੋਂ ਬਚਾਉਂਦਾ ਹੈ।",
        ta: "பரண் முறை கால்களை வறண்ட நிலையில் வைக்கிறது.",
        te: "మంచె విధానం రోగాలను అరికడుతుంది.",
        bn: "মাচা পদ্ধতিতে খুর ও ফুসফুসের রোগ কমে।",
        es: "Pisos ranurados previenen pietín y humedad.",
        vi: "Sàn chuồng nâng cao giúp chống ẩm và bệnh thối móng.",
        sw: "Sakafu iliyoinuliwa huzuia magonjwa ya kwato."
      },
      durationMinutes: 14,
      keyPointsEn: [
        "Floor slats spaced 1.5 cm apart allow dung pellets to drop through without trapping hooves.",
        "Adequate cross-ventilation prevents toxic ammonia gas buildup.",
        "Allocate 10-12 sq. ft. per adult doe and 15-20 sq. ft. per breeding buck."
      ],
      keyPointsRegional: {
        en: ["1.5 cm slot spacing.", "Cross-ventilation prevents ammonia.", "12 sq ft per adult doe."],
        hi: [
          "मचान की पट्टियों के बीच 1.5 सेमी का अंतर रखें ताकि मिंगणी नीचे गिरे और पैर न फंसे।",
          "शेड में शुद्ध हवा का आर-पार प्रवाह अमोनिया गैस को रोकता है।",
          "प्रति वयस्क बकरी 10-12 वर्ग फुट और बकरे के लिए 15-20 वर्ग फुट जगह दें।"
        ],
        mr: [
          "पट्ट्यांमध्ये १.५ सेमी अंतर ठेवावे जेणेकरून लेंडी खाली पडेल.",
          "हवेशीर गोठ्यामुळे अमोनिया वायूचा त्रास होत नाही.",
          "एका मोठ्या शेळीसाठी १०-१२ चौरस फूट जागा आवश्यक आहे."
        ],
        mai: [
          "पट्टिक बीच मे १.५ सेमी दूरी राखू।",
          "हवादार शेड मे अमोनिया नहि जमैत अछि।",
          "प्रति बकरी १०-१२ वर्ग फुट जगह चाही।"
        ],
        bho: [
          "मचान के पटरा में 1.5 सेमी फांक राखीं ताकि लेंडी नीचे गिर जाव।",
          "हवा आवे-जावे के पूरा इंतजाम से अमोनिया गैस ना बनी।",
          "हर बकरी खातिर 10-12 स्क्वायर फीट जगह जरूरी बा।"
        ],
        pa: ["ਸਹੀ ਹਵਾਦਾਰੀ ਰੱਖੋ", "10-12 ਵਰਗ ਫੁੱਟ ਜਗ੍ਹਾ"],
        ta: ["முறையான காற்றோட்டம் தேவை", "12 சதுர அடி இடம்"],
        te: ["గాలి వెలుతురు ముఖ్యం", "12 చదరపు అడుగుల స్థలం"],
        bn: ["সঠিক বায়ু চলাচল জরুরি", "প্রতি ছাগলে ১০-১২ বর্গফুট"],
        es: ["Espacio de 1.5 cm entre listones", "Ventilación previene acumulación de amoníaco"],
        vi: ["Khe hở sàn 1.5 cm", "Thông gió tránh khí amoniac"],
        sw: ["Nafasi ya sentimita 1.5 kwenye sakafu", "Mzunguko wa hewa huzuia gesi hatari"]
      },
      safetyNotesEn: "Keep pregnant does in lower density pens during the final month of gestation to avoid crowding injuries.",
      safetyNotesRegional: {
        en: "Isolate heavily pregnant does to avoid crowding injuries.",
        hi: "गर्भावस्था के अंतिम महीने में बकरियों को खुले और शांत बाड़े में रखें ताकि चोट न लगे।",
        mr: "गाभण शेळ्यांना गर्भावस्थेच्या शेवटच्या महिन्यात स्वतंत्र व सुरक्षित जागेत ठेवा.",
        mai: "गाभिन बकरी के चोट सँ बचाबय लेल अलग राखू।",
        bho: "गाभिन बकरी के आखिरी महीना में भीड़-भाड़ से अलग सुरक्षित कमरा में रखीं।",
        pa: "ਗੱਭਣ ਬੱਕਰੀਆਂ ਨੂੰ ਵੱਖਰਾ ਰੱਖੋ।",
        ta: "சினை ஆடுகளை தனியாக பாதுகாக்கவும்.",
        te: "చూడి మేకలను విడిగా ఉంచండి.",
        bn: "গর্ভবতী ছাগলকে আলাদা রাখুন।",
        es: "Separar hembras gestantes para evitar golpes.",
        vi: "Tách riêng dê mang thai tháng cuối.",
        sw: "Tenga mbuzi mwenye mimba peke yake."
      },
      video: {
        id: "vid-goat-1",
        lessonId: "lsn-goat-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 840,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  poultry: [
    {
      id: "lsn-poultry-1",
      moduleId: "mod-poultry-brooding",
      categoryId: "poultry",
      orderNumber: 1,
      topicNumber: 6,
      titleEn: "1. Day-Old Chick Brooding & Temperature Management",
      titleRegional: {
        en: "1. Day-Old Chick Brooding & Temperature Management",
        hi: "1. एक दिन के चूजों की ब्रूडिंग एवं तापमान प्रबंधन",
        mr: "1. एक दिवसाच्या पिल्लांचे ब्रुडिंग व तापमान नियंत्रण",
        mai: "1. नव चूजाक ब्रूडिंग आ तापमान प्रबंधन",
        bho: "1. एक दिन के चूजा के ब्रूडिंग आ तापमान कंट्रोल",
        pa: "1. ਚੂਚਿਆਂ ਦੀ ਬਰੂਡਿੰਗ ਅਤੇ ਤਾਪਮਾਨ",
        ta: "1. ஒரு நாள் குஞ்சுகள் பராமரிப்பு மற்றும் வெப்பம்",
        te: "1. డే-ఓల్డ్ చిక్స్ బ్రూడింగ్ మరియు ఉష్ణోగ్రత",
        bn: "1. একদিনের বাচ্চার ব্রুডিং ও তাপমাত্রা নিয়ন্ত্রণ",
        es: "1. Crianza inicial de pollitos y temperatura",
        vi: "1. Úm gà con 1 ngày tuổi và quản lý nhiệt độ",
        sw: "1. Malezi ya vifaranga na udhibiti wa joto"
      },
      descriptionEn: "Master the first 7 critical days: 33-35°C brooding heat, electrolyte water, rice husk bedding, and chick behavior signs.",
      descriptionRegional: {
        en: "First 7 critical days: brooding heat, electrolyte water, and behavior signs.",
        hi: "शुरुआती 7 दिन: 33-35°C तापमान, गुड़/इलेक्ट्रोलाइट पानी, धान की भूसी का बिछावन एवं चूजों के व्यवहार से तापमान पहचानना।",
        mr: "पहिले ७ दिवस: ३३-३५ अंश सेल्सिअस तापमान, गुळ पाणी/इलेक्ट्रोलाइट्स आणि भुशाचे थर.",
        mai: "शुरुआती ७ दिन मे ३५ डिग्री तापमान आ गुड़ पानीक प्रबंधन।",
        bho: "पहिला हफ्ता: 33-35°C गरमी, गुड़-इलेक्ट्रोलाइट पानी आ धान के भूसी के बिछावन।",
        pa: "ਪਹਿਲੇ ਹਫ਼ਤੇ 33-35 ਡਿਗਰੀ ਤਾਪਮਾਨ ਜ਼ਰੂਰੀ",
        ta: "முதல் 7 நாட்கள் 35 டிகிரி வெப்பம் அவசியம்",
        te: "మొదటి వారం 33-35 డిగ్రీల ఉష్ణోగ్రత",
        bn: "প্রথম সপ্তাহে তাপমাত্রা ৩৩-৩৫ ডিগ্রি বজায় রাখুন",
        es: "Primeros 7 días a 33-35°C y electrolitos",
        vi: "Úm 33-35°C trong 7 ngày đầu",
        sw: "Joto la nyuzi 33-35 wiki ya kwanza"
      },
      durationMinutes: 14,
      keyPointsEn: [
        "If chicks huddle together under the brooder lamp, they are cold; if they disperse to edges panting, they are too hot.",
        "Provide 8% jaggery/glucose water upon arrival before first mash feed.",
        "Turn rice husk bedding daily to prevent wet caking and coccidiosis."
      ],
      keyPointsRegional: {
        en: ["Huddling means cold, panting means hot.", "Provide glucose water first.", "Turn litter daily."],
        hi: [
          "यदि चूजे बल्ब के नीचे सिमट रहे हैं तो उन्हें ठंड लग रही है; यदि कोने में हांप रहे हैं तो बहुत अधिक गर्मी है।",
          "फार्म पर पहुंचते ही दाना देने से पहले 8% गुड़ या ग्लूकोज का पानी दें।",
          "धान की भूसी (Litter) को रोज पलटें ताकि गीलापन न जमे और कॉक्सिडिओसिस रोग न फैले।"
        ],
        mr: [
          "पिल्ले एकत्र गोळा झाल्यास थंडी आणि लांब पळत असल्यास जास्त उष्णता समजावी.",
          "पिल्ले आल्यावर प्रथम गूळ-पाणी किंवा ग्लुकोज द्यावे.",
          "गादी (लिटर) दररोज हलवून कोरडी ठेवावी."
        ],
        mai: [
          "चूजाक जमा होयब ठंडक आ दूर भागब गरमीक संकेत अछि।",
          "पहिले गुड़-पानी दियौक।",
          "बिछावन के रोज पलटि कऽ सुखाउ।"
        ],
        bho: [
          "चूजा सट-सट के बइठे त ठंड बा, दूर भागे त जास्ती गरमी बा।",
          "आवतही पहिले गुड़-पानी या ग्लूकोज पियाईं।",
          "बिछावन के रोज खुरपी से चलाईं ताकि सूखा रहे।"
        ],
        pa: ["ਚੂਚਿਆਂ ਦਾ ਵਿਹਾਰ ਦੇਖੋ", "ਗੁੜ ਵਾਲਾ ਪਾਣੀ ਦਿਓ"],
        ta: ["குஞ்சுகளின் நடத்தையை கவனிக்கவும்", "குளுக்கோஸ் தண்ணீர் தரவும்"],
        te: ["పిల్లల ప్రవర్తనను గమనించండి", "మొదట గ్లూకోజ్ నీరు ఇవ్వండి"],
        bn: ["বাচ্চাদের আচরণ লক্ষ্য করুন", "প্রথমে গুড় মিশ্রিত পানি দিন"],
        es: ["Si se amontonan tienen frío, si jadean tienen calor", "Agua con glucosa al recibir"],
        vi: ["Tụ lại là lạnh, tản ra thở dốc là nóng", "Cho uống nước đường gluco trước"],
        sw: ["Wakijikusanya wana baridi, wakitawanyika wana joto", "Wape maji ya sukari kwanza"]
      },
      safetyNotesEn: "Strict biosecurity: enforce foot dip disinfectant at the coop entrance to keep out Newcastle (Ranikhet) virus.",
      safetyNotesRegional: {
        en: "Enforce foot dip disinfectant at coop entrance.",
        hi: "शेड के प्रवेश द्वार पर पोटेशियम परमैंगनेट का फुट-डिप (जूते डुबोने का कुंड) अनिवार्य रूप से रखें।",
        mr: "गोठ्याच्या प्रवेशद्वारावर जंतुनाशक पाण्याचे कुंड (फूट बाथ) नेहमी कार्यरत ठेवा.",
        mai: "शेडक गेट पर कीटाणुनाशक पानी राखू।",
        bho: "फार्म के दरवाजा पर पोटैशियम के पानी के फुट-डिप बनाईं ताकि रानीखेत के बीमारी ना घुसे।",
        pa: "ਦਰਵਾਜ਼ੇ 'ਤੇ ਪੈਰ ਧੋਣ ਵਾਲੀ ਦਵਾਈ ਰੱਖੋ।",
        ta: "நுழைவு வாயிலில் கால் கழுவும் மருந்து வைக்கவும்.",
        te: "ప్రవేశద్వారం వద్ద పాదాల క్రిమిసంహారక తొట్టె ఉంచండి.",
        bn: "প্রবেশদ্বারে জীবাণুনাশক ফুটবাথ রাখুন।",
        es: "Pediluvio desinfectante en la entrada obligatorio.",
        vi: "Khử trùng hố sát trùng ở cửa chuồng.",
        sw: "Weka dawa ya kukanyaga mlangoni."
      },
      video: {
        id: "vid-poultry-1",
        lessonId: "lsn-poultry-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 780,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  pig: [
    {
      id: "lsn-pig-1",
      moduleId: "mod-pig-nutrition",
      categoryId: "pig",
      orderNumber: 1,
      topicNumber: 3,
      titleEn: "1. Balanced Swine Nutrition & Feed Formulation",
      titleRegional: {
        en: "1. Balanced Swine Nutrition & Feed Formulation",
        hi: "1. संतुलित सूअर आहार एवं दाना निर्माण",
        mr: "1. वराह संतुलित आहार आणि खाद्य निर्मिती",
        mai: "1. संतुलित सूअर आहार",
        bho: "1. सूअर के संतुलित दाना आ राशन",
        pa: "1. ਸੂਰਾਂ ਦੀ ਸੰਤੁਲਿਤ ਖੁਰਾਕ",
        ta: "1. பன்றி சரிவிகித உணவு",
        te: "1. పందుల సమతుల్య ఆహారం",
        bn: "1. সুষম শূকর খাদ্য প্রস্তুতকরণ",
        es: "1. Nutrición y formulación porcina",
        vi: "1. Dinh dưỡng và phối trộn thức ăn cho lợn",
        sw: "1. Lishe bora ya nguruwe"
      },
      descriptionEn: "Formulating creep feed for piglets, grower rations (16% protein), and finisher rations with energy grains.",
      descriptionRegional: {
        en: "Formulating creep feed, grower rations, and finisher rations.",
        hi: "पिगलेट के लिए क्रीप फीड, ग्रोवर राशन (16% प्रोटीन) और फिनिशर आहार तैयार करने का सस्ता व पौष्टिक फॉर्मूला।",
        mr: "पिल्लांसाठी क्रीप फीड, वाढीच्या वयातील १६% प्रथिनेयुक्त खाद्य आणि फिनिशर रेशन तयार करणे.",
        mai: "बच्चा लेल क्रीप फीड आ बड़का लेल १६% प्रोटीन आहारक फॉर्मूला।",
        bho: "बच्चा खातिर क्रीप फीड आ बढ़वार खातिर मकई-सोयाबीन के संतुलित दाना।",
        pa: "ਸੂਰਾਂ ਲਈ ਪ੍ਰੋਟੀਨ ਯੁਕਤ ਖੁਰਾਕ",
        ta: "பன்றிக்குட்டிகளுக்கான சிறப்பு தீவனம்",
        te: "పిల్లలకు మరియు పెద్ద పందులకు దాణా",
        bn: "বাচ্চার জন্য ক্রিপ ফিড ও গ্রোয়ার রেশন",
        es: "Alimento balanceado por etapas de desarrollo",
        vi: "Thức ăn tập ăn và thức ăn vỗ béo",
        sw: "Chakula cha watoto na nguruwe wakubwa"
      },
      durationMinutes: 13,
      keyPointsEn: [
        "Never feed unboiled kitchen waste (swill) to prevent African Swine Fever.",
        "Supply fresh ad-libitum clean drinking water through nipple drinkers.",
        "Inject iron dextran (100-200 mg) to piglets within 3-4 days of birth to prevent anemia."
      ],
      keyPointsRegional: {
        en: ["Boil all swill to stop swine fever.", "Use nipple drinkers.", "Iron injection for piglets."],
        hi: [
          "होटल या रसोई का बचा खाना (Swill) बिना अच्छी तरह उबाले कभी न दें (स्वाइन फीवर से बचाव)।",
          "निप्पल ड्रिंकर द्वारा 24 घंटे स्वच्छ पेयजल उपलब्ध कराएं।",
          "जन्म के 3-4 दिन बाद पिगलेट को एनीमिया (खून की कमी) से बचाने के लिए आयरन का इंजेक्शन जरूर लगाएं।"
        ],
        mr: [
          "हॉटेलचे खरकट अन्न उकळल्याशिवाय कधीही खाऊ घालू नका.",
          "निप्पल ड्रिंकरद्वारे स्वच्छ पाणी सतत उपलब्ध असावे.",
          "जन्मानंतर ३-४ दिवसांत पिल्लांना लोहाचे (Iron) इंजेक्शन द्यावे."
        ],
        mai: [
          "होटलक खाना बिना खौलौने नहि खियाउ।",
          "स्वच्छ पानीक व्यवस्था राखू।",
          "३ दिनक बच्चा के आयरन इंजेक्शन दियौक।"
        ],
        bho: [
          "होटल के बासी-झूठन खाना बिना खउलवले मत खिलाईं।",
          "निप्पल ड्रिंकर से 24 घंटा साफ पानी दीं।",
          "जनम के 3 दिन बाद बच्चा के आयरन के सुई जरूर लगाईं।"
        ],
        pa: ["ਜੂਠਾ ਖਾਣਾ ਉਬਾਲ ਕੇ ਦਿਓ", "ਆਇਰਨ ਟੀਕਾ ਲਗਾਓ"],
        ta: ["ஹோட்டல் கழிவுகளை கொதிக்க வைத்து தரவும்", "இரும்பு சத்து ஊசி தேவை"],
        te: ["హోటల్ వ్యర్థాలను ఉడకబెట్టి ఇవ్వండి", "ఐరన్ ఇంజెక్షన్ తప్పనిసరి"],
        bn: ["উচ্ছিষ্ট খাবার ফুটিয়ে দিন", "আয়রন ইনজেকশন দিন"],
        es: ["Hervir desperdicios para prevenir peste porcina", "Hierro inyectable en lechones"],
        vi: ["Nấu chín thức ăn thừa tránh dịch tả lợn châu Phi", "Tiêm sắt cho lợn con"],
        sw: ["Chemsha mabaki ya chakula kuzuia homa ya nguruwe", "Choma sindano ya madini ya chuma"]
      },
      safetyNotesEn: "Administer Classical Swine Fever (CSF) vaccination at 2 months of age and booster annually.",
      safetyNotesRegional: {
        en: "Vaccinate against Classical Swine Fever at 2 months.",
        hi: "2 माह की आयु में क्लासिकल स्वाइन फीवर (CSF) का टीका अवश्य लगवाएं और हर साल बूस्टर दें।",
        mr: "दोन महिन्यांच्या वयात स्वाइन फिव्हरची लस टोचून घ्यावी.",
        mai: "२ महीना पर स्वाइन फीवरक टीका लगाउ।",
        bho: "2 महीना के उमिर में स्वाइन फीवर के टीका जरूर दिलवाईं।",
        pa: "ਸਵਾਈਨ ਫੀਵਰ ਦਾ ਟੀਕਾ ਲਗਵਾਓ।",
        ta: "பன்றி காய்ச்சல் தடுப்பூசி செலுத்தவும்.",
        te: "స్వాన్ ఫీవర్ టీకా వేయించండి.",
        bn: "সোয়াইন ফিভারের টিকা দিন।",
        es: "Vacunar contra Peste Porcina Clásica a los 2 meses.",
        vi: "Tiêm phòng dịch tả lợn cổ điển lúc 2 tháng tuổi.",
        sw: "Chanja dhidi ya homa ya nguruwe miezi 2."
      },
      video: {
        id: "vid-pig-1",
        lessonId: "lsn-pig-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 710,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  beekeeping: [
    {
      id: "lsn-bee-1",
      moduleId: "mod-bee-hive",
      categoryId: "beekeeping",
      orderNumber: 1,
      topicNumber: 4,
      titleEn: "1. Langstroth Hive Setup & Colony Inspection",
      titleRegional: {
        en: "1. Langstroth Hive Setup & Colony Inspection",
        hi: "1. लैंगस्ट्रॉथ छत्ता स्थापना एवं निरीक्षण तकनीक",
        mr: "1. लँगस्ट्रॉथ मधपेटी मांडणी व नियमित तपासणी",
        mai: "1. मधुमक्खी बक्सा स्थापन आ देखभाल",
        bho: "1. मधुमक्खी के बक्सा बइठवल आ जांच",
        pa: "1. ਮਧੂ-ਮੱਖੀ ਦੇ ਡੱਬਿਆਂ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ",
        ta: "1. தேனீ பெட்டி அமைப்பு மற்றும் ஆய்வு",
        te: "1. లాంగ్‌స్ట్రాత్ తేనెపెట్టె అమరిక మరియు తనిఖీ",
        bn: "1. আধুনিক ল্যাংস্ট্রথ মৌবাক্স স্থাপন ও পরিচর্যা",
        es: "1. Instalación de colmenas Langstroth e inspección",
        vi: "1. Lắp đặt thùng ong Langstroth và kiểm tra đàn",
        sw: "1. Ufungaji wa mzinga wa Langstroth"
      },
      descriptionEn: "Learn bee smoker operation, protective gear, finding the Queen bee, and identifying healthy brood patterns.",
      descriptionRegional: {
        en: "Bee smoker, protective gear, finding Queen, and brood patterns.",
        hi: "धुआं ब्लोअर (Smoker) का उपयोग, सुरक्षा सूट, रानी मक्खी की पहचान और स्वस्थ अंडे-लार्वा (Brood) की जांच।",
        mr: "स्मोकरचा वापर, संरक्षक जाळी, राणी माशी ओळखणे आणि अंड्यांची योग्य तपासणी.",
        mai: "धुआं यंत्र, सुरक्षा सूट आ रानी मक्खी खोजबाक तरीका।",
        bho: "धुआं करे वाला स्मोकर, जाली वाला सूट, रानी मक्खी खोजल आ अंडा-बच्चा के देखरेख।",
        pa: "ਰਾਣੀ ਮੱਖੀ ਦੀ ਪਛਾਣ ਅਤੇ ਸੁਰੱਖਿਆ ਸੂਟ",
        ta: "ராணி தேனீ அடையாளம் காணுதல்",
        te: "రాణి ఈగను గుర్తించడం మరియు భద్రత",
        bn: "রানি মৌমাছি শনাক্তকরণ ও ব্রুড প্যাটার্ন",
        es: "Uso del ahumador y búsqueda de la reina",
        vi: "Dùng bình xông khói và kiểm tra ong chúa",
        sw: "Kutumia kifaa cha moshi na kumtafuta malkia"
      },
      durationMinutes: 15,
      keyPointsEn: [
        "Use calm, slow movements; aggressive vibrations trigger guard bee stings.",
        "Inspect hives only during warm sunny hours (10 AM - 3 PM) when foragers are out.",
        "A compact, uniform brood pattern without empty skipped cells indicates a vigorous Queen."
      ],
      keyPointsRegional: {
        en: ["Calm movements prevent stings.", "Inspect between 10am-3pm.", "Uniform brood shows healthy queen."],
        hi: [
          "हल्के और शांत हाथों से काम करें; तेजी से हिलने-डुलने पर पहरेदार मक्खियां डंक मारती हैं।",
          "छत्ते का निरीक्षण केवल धूप वाले समय (सुबह 10 से दोपहर 3 बजे) करें जब अधिकांश मक्खियां पराग लेने बाहर हों।",
          "बिना खाली खानों का सघन अंडा-लार्वा पैटर्न मजबूत रानी मक्खी का प्रमाण है।"
        ],
        mr: [
          "शांततेने काम करा; जास्त हालचाली केल्यास माश्या चावू शकतात.",
          "सकाळी १० ते दुपारी ३ च्या दरम्यान सूर्यप्रकाशातच पेटी उघडावी.",
          "सलग भरलेले कप्पे कार्यक्षम राणी माशीचे लक्षण आहे."
        ],
        mai: [
          "आराम सँ बक्सा खोलू।",
          "घाम के समय (१० सँ ३) मे जांच करू।",
          "सघन अंडा नीक रानीक पहचान अछि।"
        ],
        bho: [
          "हड़बड़ा के मत काम करीं, शांत हाथ से बक्सा खोलीं ना त डंक मारीहें।",
          "दिन में घाम निकले पर 10 बजे से 3 बजे के बीच चेक करीं।",
          "हर खाना में अंडा-पिल्लू रहे त समझीं कि रानी मक्खी एकदम तंदुरुस्त बिया।"
        ],
        pa: ["ਸ਼ਾਂਤ ਤਰੀਕੇ ਨਾਲ ਕੰਮ ਕਰੋ", "ਧੁੱਪ ਵਿੱਚ ਚੈੱਕ ਕਰੋ"],
        ta: ["நிதானமாக கையாளவும்", "வெயில் நேரத்தில் திறக்கவும்"],
        te: ["నిదానంగా పనిచేయండి", "ఎండ ఉన్నప్పుడు తనిఖీ చేయండి"],
        bn: ["শান্তভাবে কাজ করুন", "রোদ থাকতে থাকতে বাক্স খুলুন"],
        es: ["Movimientos lentos evitan picaduras", "Inspeccionar en horas cálidas y soleadas"],
        vi: ["Thao tác nhẹ nhàng tránh bị đốt", "Kiểm tra lúc trời nắng ấm 10h-15h"],
        sw: ["Fanya kazi kwa utulivu", "Kagua wakati wa jua"]
      },
      safetyNotesEn: "Always wear an inspected bee veil and avoid scented perfumes or dark black woolly clothing.",
      safetyNotesRegional: {
        en: "Wear bee veil and avoid perfumes or black clothing.",
        hi: "हमेशा जालीदार टोपी (Veil) पहनें और तेज इत्र/परफ्यूम या काले ऊनी कपड़े पहनकर छत्ते के पास न जाएं।",
        mr: "नेहमी जाळीदार टोपी वापरा आणि तीव्र सुगंधी द्रव्ये किंवा काळे कपडे वापरू नका.",
        mai: "जालीदार टोपी पहिरू आ परफ्यूम नहि लगाउ।",
        bho: "हमेशा जालीदार टोपी पहिनीं आ सेंट-इत्र भा काला कपड़ा पहिन के मत जाईं।",
        pa: "ਜਾਲੀਦਾਰ ਟੋਪੀ ਜ਼ਰੂਰ ਪਹਿਨੋ।",
        ta: "முகத்திரை கட்டாயம் அணியவும்.",
        te: "రక్షణ ముసుగు ధరించండి.",
        bn: "সবসময় মৌমাছির প্রতিরক্ষামূলক টুপি পরুন।",
        es: "Usar velo protector y evitar perfumes o ropa oscura.",
        vi: "Luôn đội mũ lưới và tránh xịt nước hoa.",
        sw: "Vaa kofia ya wavu na epuka manukato."
      },
      video: {
        id: "vid-bee-1",
        lessonId: "lsn-bee-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 880,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  fisheries: [
    {
      id: "lsn-fish-1",
      moduleId: "mod-fish-water",
      categoryId: "fisheries",
      orderNumber: 1,
      topicNumber: 5,
      titleEn: "1. Water Quality & Dissolved Oxygen (DO) Management",
      titleRegional: {
        en: "1. Water Quality & Dissolved Oxygen (DO) Management",
        hi: "1. पानी की गुणवत्ता एवं घुलित ऑक्सीजन (DO) प्रबंधन",
        mr: "1. पाण्याची गुणवत्ता व विरघळलेला ऑक्सिजन (DO) व्यवस्थापन",
        mai: "1. पोखरिक पानीक जांच आ ऑक्सीजन प्रबंधन",
        bho: "1. पोखरा के पानी के जांच आ ऑक्सीजन (DO) कंट्रोल",
        pa: "1. ਪਾਣੀ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਆਕਸੀਜਨ",
        ta: "1. நீரின் தரம் மற்றும் ஆக்சிஜன் மேலாண்மை",
        te: "1. నీటి నాణ్యత మరియు ఆక్సిజన్ నిర్వహణ",
        bn: "1. পানির গুণমান ও দ্রবীভূত অক্সিজেন (DO) ব্যবস্থাপনা",
        es: "1. Calidad del agua y oxígeno disuelto en estanques",
        vi: "1. Quản lý chất lượng nước và oxy hòa tan (DO)",
        sw: "1. Ubora wa maji na kiwango cha oksijeni bwawani"
      },
      descriptionEn: "Monitor pH (7.5 - 8.5), Dissolved Oxygen (>5 mg/L), Secchi transparency (30-40 cm), and emergency aerator operations.",
      descriptionRegional: {
        en: "Monitor pH, Dissolved Oxygen, Secchi transparency, and emergency aeration.",
        hi: "तालाब का pH (7.5 - 8.5), घुलित ऑक्सीजन (>5 मिलीग्राम/लीटर), पानी का हरापन (पारदर्शिता 30-40 सेमी) और एरेटर का उपयोग।",
        mr: "पाण्याचा सामू (pH ७.५ - ८.५), विरघळलेला ऑक्सिजन (>५ mg/L) आणि एरिएटरचा योग्य वापर.",
        mai: "पानीक पीएच आ ऑक्सीजन नापबाक नियम आ एरेटरक उपयोग।",
        bho: "पानी के pH (7.5-8.5), ऑक्सीजन 5 से ऊपर आ सबेरे-सबेरे मछली के ऊपर मुँह बावे के इलाज।",
        pa: "ਆਕਸੀਜਨ 5 ਤੋਂ ਵੱਧ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ",
        ta: "நீரின் காரத்தன்மை மற்றும் ஆக்சிஜன் அளவு",
        te: "ఆక్సిజన్ 5 mg/L కంటే ఎక్కువ ఉండాలి",
        bn: "পানির পিএইচ ও দ্রবীভূত অক্সিজেনের মাত্রা",
        es: "Mantener oxígeno disuelto sobre 5 ppm",
        vi: "Duy trì oxy hòa tan > 5 mg/L",
        sw: "Dumisha oksijeni zaidi ya 5 mg/L"
      },
      durationMinutes: 16,
      keyPointsEn: [
        "If fish gasp at the water surface in the pre-dawn hours, oxygen is critically depleted.",
        "Maintain water pH between 7.5 and 8.5 using agricultural lime (CaCO3) application.",
        "Plankton bloom is optimal when the palm dipped up to the elbow is barely visible."
      ],
      keyPointsRegional: {
        en: ["Gasping at dawn means low oxygen.", "Apply lime for pH 7.5-8.5.", "Check plankton with elbow dip."],
        hi: [
          "यदि सुबह-सुबह मछलियां सतह पर आकर हवा के लिए मुंह चला रही हैं, तो यह ऑक्सीजन की गंभीर कमी का संकेत है।",
          "बुझे चूने (200-250 किग्रा/एकड़) का छिड़काव कर पानी का pH 7.5 से 8.5 के बीच स्थिर रखें।",
          "तालाब में हाथ को कोहनी तक डुबोने पर हथेली धुंधली दिखे तो प्लवक (प्राकृतिक आहार) का स्तर उत्तम है।"
        ],
        mr: [
          "पहाटेच्या वेळी मासे पाण्याच्या वर येऊन तोंड उघडत असल्यास ऑक्सिजन कमी झाला आहे.",
          "चुना वापरून पाण्याचा सामू (pH) ७.५ ते ८.५ ठेवावा.",
          "कोपरापर्यंत हात पाण्यात बुडवल्यावर तळहात अंधुक दिसल्यास प्लवंग (शेवाळ) योग्य आहे."
        ],
        mai: [
          "भोर मे मछली ऊपर आबय तऽ ऑक्सीजनक कमी बुझू।",
          "चूना दऽ कऽ पानीक pH ७.५-८.५ राखू।",
          "प्राकृतिक आहार जांचू।"
        ],
        bho: [
          "सबेरे-सबेरे मछली पानी के ऊपर मुंह निकाल के सांस लेवे त तुरंते एरेटर चलावे के चाहीं।",
          "पोखरा में चूना छिड़क के pH 7.5 से 8.5 के बीच राखल जाला।",
          "केहूनी ले हाथ डुबोवे पर हथेली धूंधिला दिखे त प्लैंकटन एकदम सही बा।"
        ],
        pa: ["ਸਵੇਰੇ ਆਕਸੀਜਨ ਚੈੱਕ ਕਰੋ", "ਚੂਨਾ ਪਾ ਕੇ pH ਸਹੀ ਰੱਖੋ"],
        ta: ["அதிகாலையில் ஆக்சிஜன் குறையும்", "சுண்ணாம்பு இட்டு pH பராமரிக்கவும்"],
        te: ["తెల్లవారుజామున ఆక్సిజన్ తగ్గుతుంది", "సున్నం చల్లండి"],
        bn: ["ভোরে মাছ ভেসে উঠলে অক্সিজেন সংকট", "চুন প্রয়োগ করে পিএইচ ঠিক রাখুন"],
        es: ["Boqueo en superficie al amanecer indica hipoxia", "Encalar para estabilizar pH"],
        vi: ["Cá nổi đầu lúc rạng sáng là thiếu oxy", "Bón vôi giữ pH 7.5-8.5"],
        sw: ["Samaki wakitokea juu asubuhi oksijeni imepungua", "Weka chokaa kudhibiti pH"]
      },
      safetyNotesEn: "In sudden oxygen emergencies, turn on paddlewheel aerators immediately and avoid daytime over-feeding.",
      safetyNotesRegional: {
        en: "Turn on aerators immediately during emergencies and reduce feed.",
        hi: "ऑक्सीजन कम होने पर तुरंत एरेटर चलाएं या ताजा पानी भरें तथा उस दिन दाना देना बंद या आधा कर दें।",
        mr: "ऑक्सिजन कमी झाल्यास त्वरित एरिएटर सुरू करा व खाद्याचे प्रमाण कमी करा.",
        mai: "तुरंत एरेटर चलाउ आ दाना कम करू।",
        bho: "तुरंते एरेटर चला दीं भा पम्पिंग सेट से पानी फव्वारा नियन मारें, दाना रोक दीं।",
        pa: "ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਏਰੀਏਟਰ ਚਲਾਓ।",
        ta: "உடனடியாக ஏரேட்டர் இயக்கவும்.",
        te: "వెంటనే ఎరేటర్లను ఆన్ చేయండి.",
        bn: "জরুরি অবস্থায় এরেটর চালু করুন।",
        es: "Activar aireadores de emergencia y suspender alimentación.",
        vi: "Bật quạt nước khẩn cấp và giảm lượng thức ăn.",
        sw: "Washa vifaa vya kuingiza hewa mara moja."
      },
      video: {
        id: "vid-fish-1",
        lessonId: "lsn-fish-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 960,
        isConfigurable: true
      },
      isPublished: true
    }
  ],
  integrated: [
    {
      id: "lsn-integ-1",
      moduleId: "mod-integ-crop-dairy",
      categoryId: "integrated",
      orderNumber: 1,
      topicNumber: 1,
      titleEn: "1. Crop + Dairy + Bio-gas Circular Flow",
      titleRegional: {
        en: "1. Crop + Dairy + Bio-gas Circular Flow",
        hi: "1. फसल + डेयरी + बायोगैस चक्रीय मॉडल",
        mr: "1. पिके + डेअरी + बायोगॅस चक्रीय शेती",
        mai: "1. फसल + डेयरी + बायोगैस चक्रीय मॉडल",
        bho: "1. फसल + डेयरी + गोबर गैस चक्रीय खेती",
        pa: "1. ਫ਼ਸਲ + ਡੇਅਰੀ + ਬਾਇਓਗੈਸ ਮਾਡਲ",
        ta: "1. பயிர் + பால்பண்ணை + சாண எரிவாயு சுழற்சி",
        te: "1. పంట + పాడి + బయోగ్యాస్ సమగ్ర విధానం",
        bn: "1. শস্য + দুগ্ধ খামার + বায়োগ্যাস চক্রাকার মডেল",
        es: "1. Modelo circular Cultivo + Ganadería + Biogás",
        vi: "1. Mô hình tuần hoàn Trồng trọt + Bò sữa + Khí sinh học",
        sw: "1. Mzunguko wa Kilimo + Maziwa + Biogesi"
      },
      descriptionEn: "Convert crop straw and husk into silage, recycle animal dung into cooking gas and slurry bio-fertilizer.",
      descriptionRegional: {
        en: "Convert crop straw into silage, and dung into cooking gas and slurry fertilizer.",
        hi: "फसल के भूसे से पशु आहार (साइलेज) बनाना, तथा गोबर से बायोगैस ईंधन व खेत के लिए अमृत-जल (स्लरी) प्राप्त करना।",
        mr: "पिकांच्या अवशेषांचा जनावरांना चारा, शेणापासून बायोगॅस आणि स्लरी खताचा पिकांना वापर.",
        mai: "फसल अवशेष सँ चारा आ गोबर सँ गैस एवं जैविक खाद बनाउ।",
        bho: "खेत के डंठल से साइलेज चारा, गोबर से फ्री में गैस आ अमृत खाद—जीरो खरचा चक्र।",
        pa: "ਫ਼ਸਲ ਰਹਿੰਦ-ਖੂੰਹਦ ਤੋਂ ਖੁਰਾਕ ਅਤੇ ਗੋਬਰ ਤੋਂ ਗੈਸ",
        ta: "பயிர் கழிவு தீவனம் மற்றும் சாண எரிவாயு",
        te: "వ్యర్థాల నుంచి మేత మరియు ఎరువు",
        bn: "ফসলের অবশিষ্টাংশ ও গোবরের সমন্বিত ব্যবহার",
        es: "Aprovechamiento integral de rastrojos y estiércol",
        vi: "Tận dụng phụ phẩm rơm rạ và phân chuồng",
        sw: "Kutumia mabaki ya mazao na kinyesi cha ng'ombe"
      },
      durationMinutes: 15,
      keyPointsEn: [
        "Digested biogas slurry contains 1.8% Nitrogen, 1.0% Phosphorus, and 1.0% Potassium—higher than raw farmyard manure.",
        "Urea treatment of straw (4 kg urea per 100 kg straw) enhances crude protein content from 3% to 8%.",
        "Reduces synthetic chemical fertilizer purchases by 35% to 50% over successive seasons."
      ],
      keyPointsRegional: {
        en: ["Biogas slurry has superior NPK.", "Straw urea treatment boosts protein.", "Cuts fertilizer bills by 35-50%."],
        hi: [
          "बायोगैस से निकली स्लरी में कच्चे गोबर की तुलना में 1.8% नाइट्रोजन और बेहतर घुलनशील खनिज होते हैं।",
          "भूसे में यूरिया उपचार (100 किग्रा भूसे पर 4 किग्रा यूरिया) करने से प्रोटीन 3% से बढ़कर 8% हो जाता है।",
          "खेतों में रासायनिक खाद की जरूरत 35% से 50% तक कम हो जाती है।"
        ],
        mr: [
          "बायोगॅस स्लरीमध्ये साध्या शेणखतापेक्षा जास्त नायट्रोजन आणि खनिजे असतात.",
          "गव्हाच्या/भाताच्या पेंढ्यावर युरिया प्रक्रिया केल्याने प्रथिनांचे प्रमाण वाढते.",
          "रासायनिक खतांवरील खर्चात ३५% ते ५०% पर्यंत बचत होते."
        ],
        mai: [
          "स्लरी खाद सामान्य गोबर सँ बेसी ताकतवर होइत अछि।",
          "भूसा उपचार सँ प्रोटीन बढ़ैत अछि।",
          "रासायनिक खाद पर खरचा आधा भऽ जाइत अछि।"
        ],
        bho: [
          "बायोगैस के घोल (स्लरी) सादा गोबर से दुगना ताकतवर खाद हवे।",
          "भूसा के यूरिया से उपचारित कइला से प्रोटीन 3% से 8% हो जाला।",
          "दुकान से रासायनिक खाद खरीदे के खरचा 35 से 50% घट जाला।"
        ],
        pa: ["ਸਲਰੀ ਉੱਤਮ ਜੈਵਿਕ ਖਾਦ ਹੈ", "ਰਸਾਇਣਕ ਖਾਦ ਦਾ ਖਰਚਾ ਘਟਦਾ ਹੈ"],
        ta: ["சாண எரிவாயு கழிவு சிறந்த உரம்", "உரச்செலவு பாதியாக குறையும்"],
        te: ["బయోగ్యాస్ స్లర్రీ ఉత్తమ ఎరువు", "ఎరువుల ఖర్చు తగ్గుతుంది"],
        bn: ["বায়োগ্যাস স্লারি উচ্চমানের সার", "রাসায়নিক সারের খরচ কমে"],
        es: ["El biol de biogás supera al estiércol crudo en NPK", "Reduce compra de fertilizantes químicos"],
        vi: ["Nước thải biogas là phân bón giàu dinh dưỡng", "Tiết kiệm 35-50% chi phí phân bón"],
        sw: ["Mboji ya biogesi ina virutubisho vingi", "Hupunguza matumizi ya mbolea za dukani"]
      },
      safetyNotesEn: "Never add pesticide-contaminated plant matter or antibiotic-heavy manure into the biogas digester.",
      safetyNotesRegional: {
        en: "Do not put pesticide-sprayed plants or antibiotic manure in biogas digester.",
        hi: "तेज कीटनाशक छिड़के हुए अवशेष या भारी एंटीबायोटिक उपचार वाले पशु का गोबर तुरंत बायोगैस में न डालें (जीवाणु मर सकते हैं)।",
        mr: "कीटकनाशक फवारलेले अवशेष किंवा अँटीबायोटिक्सचे शेण बायोगॅस टाकीत टाकू नका.",
        mai: "कीटनाशक वला अवशेष बायोगैस मे नहि राखू।",
        bho: "कीटनाशक छिड़कल घास भा कड़ा एंटीबायोटिक चलल गाय के गोबर बायोगैस में मत डालीं (बैक्टीरिया मर जाई)।",
        pa: "ਕੀਟਨਾਸ਼ਕ ਵਾਲਾ ਕੂੜਾ ਬਾਇਓਗੈਸ ਵਿੱਚ ਨਾ ਪਾਓ।",
        ta: "பூச்சிக்கொல்லி எச்சங்களை சாண எரிவாயுவில் போடாதீர்கள்.",
        te: "పురుగుమందుల అవశేషాలు గ్యాస్ ప్లాంట్‌లో వేయకండి.",
        bn: "কীটনাশকযুক্ত বর্জ্য বায়োগ্যাসে দেবেন না।",
        es: "Evitar antibióticos o pesticidas que maten bacterias metanogénicas.",
        vi: "Tránh đưa tàn dư thuốc sâu vào hầm biogas.",
        sw: "Usiweke mabaki ya dawa za wadudu kwenye mtambo wa biogesi."
      },
      video: {
        id: "vid-integ-1",
        lessonId: "lsn-integ-1",
        videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        durationSeconds: 900,
        isConfigurable: true
      },
      isPublished: true
    }
  ]
};
