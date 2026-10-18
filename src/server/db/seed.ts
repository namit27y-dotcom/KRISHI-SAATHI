import bcrypt from "bcryptjs";
import { dbConnection } from "./connection.js";

export async function runSeed(): Promise<boolean> {
  try {
    console.log("[Seed] Checking and seeding database records...");

    // Password hashes for sample accounts
    const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
    const farmerPasswordHash = await bcrypt.hash("Farmer@123", 10);
    const sellerPasswordHash = await bcrypt.hash("Seller@123", 10);
    const buyerPasswordHash = await bcrypt.hash("Buyer@123", 10);
    const rameshPasswordHash = await bcrypt.hash("Ramesh@123", 10);

    const initialUsers = [
      {
        id: "usr-admin-1",
        name: "Krishi Saathi Administrator",
        email: "admin@krishisaathi.com",
        password_hash: adminPasswordHash,
        mobile: "+919800000001",
        role: "admin",
        preferred_language: "en",
        country: "India",
        state: "Maharashtra",
        district: "Pune",
        village: "Shivajinagar",
        is_verified: true,
      },
      {
        id: "guest-1",
        name: "Ramesh Patil",
        email: "ramesh.patil@krishisaathi.com",
        password_hash: rameshPasswordHash,
        mobile: "9876543210",
        role: "farmer",
        preferred_language: "en",
        country: "India",
        state: "Maharashtra",
        district: "Pune",
        village: "Khed",
        land_area: 1.5,
        land_unit: "Acres",
        soil_type: "Loamy",
        crops_grown: JSON.stringify(["Tomato", "Wheat", "Soybean"]),
        is_verified: true,
      },
      {
        id: "usr-farmer-1",
        name: "Suresh Kumar",
        email: "farmer@krishisaathi.com",
        password_hash: farmerPasswordHash,
        mobile: "+919876543211",
        role: "farmer",
        preferred_language: "hi",
        country: "India",
        state: "Uttar Pradesh",
        district: "Varanasi",
        village: "Shivpur",
        land_area: 3.5,
        land_unit: "Acres",
        soil_type: "Alluvial Soil",
        crops_grown: JSON.stringify(["Rice", "Wheat", "Mustard"]),
        is_verified: true,
      },
      {
        id: "usr-seller-1",
        name: "Kisan Agro Supplies & Seeds",
        email: "seller@krishisaathi.com",
        password_hash: sellerPasswordHash,
        mobile: "+919876543212",
        role: "seller",
        preferred_language: "en",
        country: "India",
        state: "Maharashtra",
        district: "Pune",
        company_name: "Kisan Agro Inputs Pvt Ltd",
        gst_number: "27AABCK1234F1Z5",
        is_verified: true,
      },
      {
        id: "usr-buyer-1",
        name: "MahaFresh Organic Agro Wholesalers",
        email: "buyer@krishisaathi.com",
        password_hash: buyerPasswordHash,
        mobile: "+919876543213",
        role: "buyer",
        preferred_language: "en",
        country: "India",
        state: "Maharashtra",
        district: "Pune",
        company_name: "MahaFresh Trading Co",
        buyer_type: "wholesaler",
        is_verified: true,
      }
    ];

    // Seed Farming Categories (Crops + 8 Animal & Fish Farming Categories)
    const farmingCategories = [
      {
        id: "cat-crops",
        code: "crops",
        name_en: "Crop Farming",
        name_hi: "फसल उत्पादन",
        name_mr: "पीक लागवड",
        name_mai: "फसल खेती",
        name_bho: "फसल के खेती",
        description_en: "Agronomy, high-yield seed varieties, soil preparation, and irrigation schedules.",
        description_hi: "कृषि विज्ञान, उच्च उपज वाली किस्में, खेत की तैयारी और सिंचाई योजना।",
        description_mr: "कृषी विज्ञान, अधिक उत्पादन देणाऱ्या जाती आणि पाणी व्यवस्थापन.",
        description_mai: "कृषि विज्ञान आ उन्नत बीजक तैयारी।",
        description_bho: "खेती-किसानी, बढ़िया बीया आ पानी के प्रबंध।",
        icon: "Sprout",
        display_order: 1
      },
      {
        id: "cat-dairy",
        code: "dairy",
        name_en: "Dairy Farming",
        name_hi: "डेयरी फार्मिंग",
        name_mr: "दुग्ध व्यवसाय",
        name_mai: "डेयरी व्यवसाय",
        name_bho: "डेयरी फार्मिंग",
        description_en: "Cattle & buffalo management, high-fat feed formulation, milk quality preservation, and disease prevention.",
        description_hi: "गाय-भैंस पालन, उच्च पोषण चारा, स्वच्छ दुग्ध उत्पादन और रोग नियंत्रण।",
        description_mr: "गाय व म्हैस पालन, संतुलित आहार, स्वच्छ दूध निर्मिती व आजार नियंत्रण.",
        description_mai: "गाय-महिष पालन आ दूध उत्पादन।",
        description_bho: "गाय-भैंस पालन आ दूध के बढ़िया उत्पादन।",
        icon: "Milk",
        display_order: 2
      },
      {
        id: "cat-sheep",
        code: "sheep",
        name_en: "Sheep Farming",
        name_hi: "भेड़ पालन",
        name_mr: "मेंढी पालन",
        name_mai: "भेड़ पालन",
        name_bho: "भेड़ पालन",
        description_en: "Wool and mutton production, pasture rotational grazing, breeding cycles, and deworming protocols.",
        description_hi: "ऊन और मांस उत्पादन, चराई प्रबंधन, प्रजनन और नियमित टीकाकरण।",
        description_mr: "लोकर व मांस उत्पादन, चराई व्यवस्थापन, पैदास आणि लसीकरण.",
        description_mai: "ऊन आ मांस उत्पादनक लेल भेड़ पालन।",
        description_bho: "ऊन आ मांस खातिर भेड़ के देखभाल।",
        icon: "Layers",
        display_order: 3
      },
      {
        id: "cat-goat",
        code: "goat",
        name_en: "Goat Farming",
        name_hi: "बकरी पालन",
        name_mr: "शेळी पालन",
        name_mai: "खस्सी-बकरी पालन",
        name_bho: "बकरी पालन",
        description_en: "Stall-fed and free-range goat farming, Sirohi/Jamnapari/Barbari breeds, kidding care, and disease prevention.",
        description_hi: "सघन व खुले में बकरी पालन, सिरोही, जमनापारी, बरबरी नस्लों का चयन और रोग प्रबंधन।",
        description_mr: "बंदिस्त व अर्ध-बंदिस्त शेळीपालन, उस्मानाबादी, बोअर व सिरोही जातींचे संगोपन.",
        description_mai: "उन्नत नस्लक बकरी पालन आ प्रबंधन।",
        description_bho: "बरबरी आ सिरोही बकरी के बढ़िया देखरेख।",
        icon: "Shield",
        display_order: 4
      },
      {
        id: "cat-poultry",
        code: "poultry",
        name_en: "Poultry Farming",
        name_hi: "मुर्गी पालन",
        name_mr: "कुक्कुट पालन",
        name_mai: "मुर्गी पालन",
        name_bho: "मुर्गी पालन",
        description_en: "Broiler and layer management, Desi/Kadaknath farming, temperature control, and biosecurity sanitation.",
        description_hi: "ब्रायलर, लेयर व कड़कनाथ मुर्गी पालन, शेड का तापमान नियंत्रण और जैव-सुरक्षा।",
        description_mr: "गावरान, कडकनाथ व ब्रॉयलर कुक्कुटपालन, लसीकरण व शेड व्यवस्थापन.",
        description_mai: "अंडा आ मांस उत्पादनक लेल मुर्गी पालन।",
        description_bho: "देसी आ ब्रायलर मुर्गी के फार्मिंग।",
        icon: "Feather",
        display_order: 5
      },
      {
        id: "cat-pig",
        code: "pig",
        name_en: "Pig Farming",
        name_hi: "सूअर पालन",
        name_mr: "वराह पालन",
        name_mai: "सूकर पालन",
        name_bho: "सूअर पालन",
        description_en: "Commercial piggery, housing sanitation, balanced ration feeding, and African Swine Fever prevention.",
        description_hi: "व्यावसायिक सूअर पालन, शेड की सफाई, संतुलित आहार और संक्रमण रोकथाम।",
        description_mr: "व्यावसायिक वराह पालन, स्वच्छता, संतुलित आहार आणि रोग प्रतिबंध.",
        description_mai: "उन्नत तकनीक सँ सूकर पालन।",
        description_bho: "व्यापारिक स्तर पर सूअर फार्मिंग।",
        icon: "Circle",
        display_order: 6
      },
      {
        id: "cat-beekeeping",
        code: "beekeeping",
        name_en: "Beekeeping & Honey",
        name_hi: "मधुमक्खी पालन",
        name_mr: "मधुमक्षिका पालन",
        name_mai: "मधुमक्खी पालन",
        name_bho: "मधुमक्खी पालन",
        description_en: "Apis cerana and Apis mellifera box management, seasonal flora migration, honey extraction, and pollination boost.",
        description_hi: "मधुमक्खी बक्सों का प्रबंधन, मौसमी फूलों की ओर स्थानांतरण और शुद्ध शहद निष्कर्षण।",
        description_mr: "मधमाश्यांचे पेट्यांचे व्यवस्थापन, परागीभवन आणि दर्जेदार मध उत्पादन.",
        description_mai: "शहद उत्पादन आ परागण विस्तार।",
        description_bho: "मधुमक्खी के बक्सा आ बढ़िया शहद के काम।",
        icon: "Sun",
        display_order: 7
      },
      {
        id: "cat-fisheries",
        code: "fisheries",
        name_en: "Fisheries & Aquaculture",
        name_hi: "मत्स्य पालन एवं जलकृषि",
        name_mr: "मत्स्य पालन",
        name_mai: "मछरी पालन",
        name_bho: "मछरी पालन",
        description_en: "Pond construction, Rohu/Catla/Mrigal polyculture, Biofloc systems, water aeration, and feed conversion ratio (FCR).",
        description_hi: "तालाब निर्माण, रोहू/कतला/मृगल मिश्रित पालन, बायोफ्लॉक तकनीक और पानी की गुणवत्ता नियंत्रण।",
        description_mr: "तळे बांधकाम, रोहू, कटला, मृगळ संवर्धन, बायोफ्लॉक तंत्रज्ञान व ऑक्सिजन नियंत्रण.",
        description_mai: "पोखरि निर्माण आ उन्नत मछली पालन।",
        description_bho: "पोखरा में कतला, रोहू आ पंगासियस के फार्मिंग।",
        icon: "Fish",
        display_order: 8
      },
      {
        id: "cat-integrated",
        code: "integrated",
        name_en: "Integrated Livestock Farming",
        name_hi: "समेकित पशुपालन एवं कृषि",
        name_mr: "एकात्मिक शेती पद्धती",
        name_mai: "समेकित कृषि",
        name_bho: "समेकित किसानी",
        description_en: "Zero-waste circular agriculture combining crop residues, fish ponds, vermicompost, biogas, and poultry waste.",
        description_hi: "शून्य-अपशिष्ट चक्रीय कृषि: फसल अवशेष, मछली तालाब, केंचुआ खाद और बायोगैस का एकीकृत उपयोग।",
        description_mr: "कचरामुक्त शेती: पिके, शेळीपालन, मत्स्यव्यवसाय आणि बायोगॅसचे एकत्रित मॉडेल.",
        description_mai: "कम लागत में बेसी मुनाफा वला समेकित कृषि।",
        description_bho: "खेती, मछरी, बकरी आ खाद के एक संघे इस्तेमाल।",
        icon: "RefreshCw",
        display_order: 9
      }
    ];

    // Seed Courses (9 Categories: Crops + 8 Animal & Fish Farming)
    const courses = [
      // 1. Crops: Rice
      {
        id: "course-rice-1",
        category_id: "cat-crops",
        title_en: "Rice (Paddy) Scientific Cultivation Masterclass",
        title_hi: "धान (चावल) की उन्नत एवं वैज्ञानिक खेती",
        title_mr: "भात (धान) सुधारित लागवड तंत्रज्ञान",
        title_mai: "धान्य (चाउर) के वैज्ञानिक खेती",
        title_bho: "धान के उन्नत खेती आ ज्यादा पैदावार",
        description_en: "Comprehensive guide to nursery raising, SRI methods, puddling, transplanting, and flood-water balance.",
        description_hi: "नर्सरी की तैयारी, एसआरआई तकनीक, खेत की जुताई व रोपाई और जल प्रबंधन की संपूर्ण मार्गदर्शिका।",
        description_mr: "रोपवाटिका, एसआरआय पद्धत, चिखलणी आणि पाणी व्यवस्थापनाचे संपूर्ण मार्गदर्शन.",
        description_mai: "नर्सरी सं कटाई धरि धानक खेती।",
        description_bho: "धान के नर्सरी से कटाई ले पूरा तरीका।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 55,
        display_order: 1
      },
      // 2. Crops: Wheat
      {
        id: "course-wheat-1",
        category_id: "cat-crops",
        title_en: "High-Yield Wheat Cultivation Masterclass",
        title_hi: "अधिक उपज देने वाले गेहूं की वैज्ञानिक खेती",
        title_mr: "भरघोस उत्पादन देणारे गहू पीक तंत्रज्ञान",
        title_mai: "उन्नत गेहूंक खेती मास्टरक्लास",
        title_bho: "ज्यादा पैदावार वाला गेहूं के खेती",
        description_en: "Step-by-step masterclass covering seedbed preparation, CRI crown root irrigation, and harvest moisture control.",
        description_hi: "खेत की तैयारी, मुकुट जड़ (CRI) सिंचाई चरण और कटाई तक की संपूर्ण वैज्ञानिक जानकारी।",
        description_mr: "पेरणीपूर्व मशागत, मुकुट मुळे फुटण्याची वेळ आणि काढणीचे योग्य नियोजन.",
        description_mai: "गेहूं के बुआई सं कटाई धरि सम्पूर्ण मार्गदर्शन।",
        description_bho: "गेहूं के बोआई से लेके कटाई ले पूरा तरीका।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 45,
        display_order: 2
      },
      // 3. Crops: Cucumber Polyhouse
      {
        id: "course-cucumber-1",
        category_id: "cat-crops",
        title_en: "Off-Season Polyhouse Cucumber Farming",
        title_hi: "पॉलीहाउस में गैर-मौसमी खीरा की व्यावसायिक खेती",
        title_mr: "पॉलीहाऊसमधील बिगर-हंगामी काकडी लागवड",
        title_mai: "पॉलीहाउस में बेमौसमी खीराक खेती",
        title_bho: "पॉलीहाउस में बिना मौसम के खीरा फार्मिंग",
        description_en: "High-density vertical trellis training, drip fertigation, pruning lateral shoots, and monsoon yield protection.",
        description_hi: "लंबवत ट्रेलिस तकनीक, ड्रिप फर्टिगेशन, छंटाई और भारी बारिश में फसल सुरक्षा से बंपर मुनाफा।",
        description_mr: "उभ्या पद्धतीने वेल चढवणे, ठिबक खत व्यवस्थापन आणि छाटणी तंत्र.",
        description_mai: "ड्रिप सिंचाई आ उन्नत खीरा उत्पादन।",
        description_bho: "ड्रिप से खाद-पानी आ खीरा के देखरेख।",
        level: "intermediate",
        thumbnail_url: "https://images.unsplash.com/photo-1590378222684-d0517793b51a?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 40,
        display_order: 3
      },
      // 4. Crops: Hydroponic Tomato
      {
        id: "course-tomato-1",
        category_id: "cat-crops",
        title_en: "Hydroponic Cherry Tomato in Dutch Buckets",
        title_hi: "डच बकेट में हाइड्रोपोनिक चेरी टमाटर की खेती",
        title_mr: "डच बकेटमध्ये हायड्रोपोनिक चेरी टोमॅटो शेती",
        title_mai: "हाइड्रोपोनिक्स तकनीक सं चेरी टमाटर",
        title_bho: "बिना माटी के डच बकेट में चेरी टमाटर",
        description_en: "Soilless cultivation with perlite/coco peat, strict EC (2.0-2.5) and pH (5.8-6.2) management, and mist cooling.",
        description_hi: "बिना मिट्टी की खेती, संतुलित ईसी व पीएच घोल, ऑटोमेटेड फॉगर्स और साल भर पैदावार।",
        description_mr: "मातीविना शेती, पाण्याचा pH व खतांचे अचूक प्रमाण आणि भरपूर उत्पन्न.",
        description_mai: "वैज्ञानिक पोषण घोल आ चेरी टमाटर।",
        description_bho: "पोषण पानी आ बिना माटी के टमाटर।",
        level: "advanced",
        thumbnail_url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 50,
        display_order: 4
      },
      // 5. Dairy Farming
      {
        id: "course-dairy-1",
        category_id: "cat-dairy",
        title_en: "Profitable Commercial Dairy & Cattle Management",
        title_hi: "व्यावसायिक डेयरी एवं उन्नत पशु प्रबंधन",
        title_mr: "नफेशीर व्यावसायिक दुग्ध व्यवसाय व गोठा व्यवस्थापन",
        title_mai: "व्यावसायिक डेयरी आ दुधारू पशु प्रबंधन",
        title_bho: "फायदेमंद डेयरी आ गाय-भैंस पालन",
        description_en: "Learn high-yielding silage preparation, loose housing design, clean milk extraction, and mastitis prevention.",
        description_hi: "साइलेज बनाने की विधि, आधुनिक शेड निर्माण, स्वच्छ दुग्ध दोहन और थनैला रोग से बचाव।",
        description_mr: "मुरघास निर्मिती, मुक्त संचार गोठा, मस्टायटीस प्रतिबंध व स्वच्छ दूध उत्पादन.",
        description_mai: "दुधारू पशु के संतुलित चारा आ रोग रोकथाम।",
        description_bho: "गाय-भैंस के चारा, साइलेज आ बीमारी से बचाव।",
        level: "intermediate",
        thumbnail_url: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 60,
        display_order: 5
      },
      // 6. Sheep Farming
      {
        id: "course-sheep-1",
        category_id: "cat-sheep",
        title_en: "Commercial Sheep Farming & Pasture Management",
        title_hi: "व्यावसायिक भेड़ पालन एवं चराई प्रबंधन",
        title_mr: "व्यावसायिक मेंढी पालन व चराई नियोजन",
        title_mai: "व्यावसायिक भेड़ पालन आ ऊन-मांस उत्पादन",
        title_bho: "व्यापारिक भेड़ पालन आ चराई के प्रबंध",
        description_en: "Breeds selection, rotational grazing pastures, newborn lamb nursing, deworming calendars, and wool/meat marketing.",
        description_hi: "नस्ल चयन, चराई का वैज्ञानिक चक्र, नवजात मेमनों की देखभाल, कृमि मुक्ति और ऊन/मांस विपणन।",
        description_mr: "मेंढ्यांच्या जाती, चरण्याची जागा, पिल्लांची काळजी आणि रोग नियंत्रण.",
        description_mai: "भेड़ के उचित देखरेख आ नस्ल सुधार।",
        description_bho: "भेड़ के चराई, टीका आ मेमना के देखभाल।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 45,
        display_order: 6
      },
      // 7. Goat Farming
      {
        id: "course-goat-1",
        category_id: "cat-goat",
        title_en: "Scientific Goat Farming (Bakri Palan) & Stall Feeding",
        title_hi: "वैज्ञानिक बकरी पालन एवं स्टॉल फीडिंग तकनीक",
        title_mr: "शास्त्रीय शेळीपालन व बंदिस्त चारा पद्धत",
        title_mai: "वैज्ञानिक बकरी पालन आ शेड प्रबंधन",
        title_bho: "वैज्ञानिक बकरी पालन आ बाड़ा के प्रबंध",
        description_en: "High-profit stall-fed goat rearing: Sirohi, Barbari & Jamnapari breeds, elevated wooden slotted flooring, and kid feeding.",
        description_hi: "सघन बकरी पालन: सिरोही व बरबरी नस्लें, लकड़ी के ऊंचे मचान शेड, पोषण और रोग प्रतिरोधक टीका।",
        description_mr: "बंदिस्त शेळीपालन शेड उभारणी, उस्मानाबादी व बोअर जाती, करडांचे संगोपन.",
        description_mai: "उन्नत नस्लक बकरी आ संतुलित आहार।",
        description_bho: "बकरी के शेड, दाना-पानी आ बीमारी से बचाव।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 50,
        display_order: 7
      },
      // 8. Poultry Farming
      {
        id: "course-poultry-1",
        category_id: "cat-poultry",
        title_en: "Broiler & Layer Poultry Farm Setup & Biosecurity",
        title_hi: "ब्रायलर व लेयर मुर्गी पालन एवं जैव-सुरक्षा",
        title_mr: "ब्रॉयलर व लेयर कुक्कुटपालन आणि शेड व्यवस्थापन",
        title_mai: "मुर्गी पालन आ अंडा-मांस उत्पादन",
        title_bho: "देसी आ ब्रायलर मुर्गी के फार्मिंग",
        description_en: "Shed micro-climate temperature control, day-old chick brooding, FCR feed optimization, and Newcastle disease vaccination.",
        description_hi: "शेड का तापमान नियंत्रण, चूजों की ब्रूडिंग, संतुलित दाना (FCR) और रानीखेत रोग का टीकाकरण।",
        description_mr: "पिल्लांची ब्रुडिंग, शेडमधील तापमान नियंत्रण, संतुलित खाद्य आणि लसीकरण.",
        description_mai: "चूजा के ब्रूडिंग आ रोग रोकथाम।",
        description_bho: "चूजा के देखरेख, दाना आ टीका।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 55,
        display_order: 8
      },
      // 9. Pig Farming
      {
        id: "course-pig-1",
        category_id: "cat-pig",
        title_en: "Commercial Pig Farming & Sanitation Protocols",
        title_hi: "व्यावसायिक सूअर पालन एवं स्वच्छता प्रबंधन",
        title_mr: "व्यावसायिक वराह पालन व आरोग्य व्यवस्थापन",
        title_mai: "व्यावसायिक सूकर पालन तकनीक",
        title_bho: "व्यापारिक सूअर पालन आ शेड के सफाई",
        description_en: "Commercial piggery housing, balanced dry mash rations, piglet warmth, and African Swine Fever biosecurity.",
        description_hi: "शेड निर्माण, संतुलित दाना मिश्रण, नवजात बच्चों की गर्माहट और संक्रमण से सुरक्षा।",
        description_mr: "वराह शेडची रचना, संतुलित आहार, पिल्लांचे संगोपन आणि रोग प्रतिबंधक उपाय.",
        description_mai: "सूकरक आहार आ शेड प्रबंधन।",
        description_bho: "सूअर के दाना-पानी आ बीमारी से सुरक्षा।",
        level: "intermediate",
        thumbnail_url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 40,
        display_order: 9
      },
      // 10. Beekeeping
      {
        id: "course-beekeeping-1",
        category_id: "cat-beekeeping",
        title_en: "Scientific Beekeeping & Pure Honey Extraction",
        title_hi: "वैज्ञानिक मधुमक्खी पालन एवं शुद्ध शहद निष्कर्षण",
        title_mr: "शास्त्रीय मधुमक्षिका पालन व मध प्रक्रिया",
        title_mai: "मधुमक्खी पालन आ शुद्ध शहद उत्पादन",
        title_bho: "मधुमक्खी पालन आ शहद निकाले के तरीका",
        description_en: "Apis mellifera wooden box inspection, queen bee rearing, floral migration routes, centrifugal honey extractors, and mite control.",
        description_hi: "लकड़ी के बक्सों का निरीक्षण, रानी मक्खी का प्रबंधन, फूलों के अनुसार माइग्रेशन और शुद्ध शहद निकालना।",
        description_mr: "मधपेट्यांची मांडणी, राणी माशी व्यवस्थापन, परागीभवन आणि दर्जेदार मध काढणे.",
        description_mai: "शहदक निष्कर्षण आ बक्सा प्रबंधन।",
        description_bho: "मधुमक्खी के बक्सा, रानी मक्खी आ शहद निकालल।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 50,
        display_order: 10
      },
      // 11. Fisheries & Aquaculture
      {
        id: "course-fisheries-1",
        category_id: "cat-fisheries",
        title_en: "Freshwater Aquaculture & Biofloc Mastery",
        title_hi: "मीठे पानी में मत्स्य पालन एवं बायोफ्लॉक तकनीक",
        title_mr: "गोड्या पाण्यातील मत्स्यशेती व बायोफ्लॉक तंत्र",
        title_mai: "पोखरि में मछली पालन आ जल प्रबंधन",
        title_bho: "मीठा पानी में मछरी फार्मिंग आ बायोफ्लॉक",
        description_en: "Complete guide on pond liming, Rohu/Catla polyculture, dissolved oxygen aeration, floating pellet feed, and disease prevention.",
        description_hi: "तालाब की चूना-गोबर से तैयारी, रोहू-कतला मिश्रित पालन, पानी में ऑक्सीजन स्तर और पूरक आहार प्रबंधन।",
        description_mr: "तळे बांधकाम, रोहू-कटला संवर्धन, पाण्यात ऑक्सिजन पुरवठा आणि योग्य खाद्य व्यवस्थापन.",
        description_mai: "मछरी के रोग सँ बचाव आ तेजी सँ बढ़वार।",
        description_bho: "पानी के जांच, मछरी के दाना आ बढ़िया बढ़वार।",
        level: "beginner",
        thumbnail_url: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 50,
        display_order: 11
      },
      // 12. Integrated Farming
      {
        id: "course-integrated-1",
        category_id: "cat-integrated",
        title_en: "Integrated Livestock & Circular Farming Systems",
        title_hi: "समेकित पशुपालन एवं शून्य-अपशिष्ट चक्रीय कृषि",
        title_mr: "एकात्मिक शेती व कचरामुक्त चक्रीय मॉडेल",
        title_mai: "समेकित कृषि आ शून्य-अपशिष्ट मॉडल",
        title_bho: "समेकित खेती आ खाद-बायोगैस के संगम",
        description_en: "Zero-waste circular economy: poultry-over-fish ponds, cow dung biogas, vermicompost slurry, and crop residue animal feed.",
        description_hi: "शून्य अपशिष्ट खेती: मछली तालाब के ऊपर मुर्गी शेड, गोबर गैस, केंचुआ खाद और फसल अवशेषों का पशु आहार में उपयोग।",
        description_mr: "पिके, कुक्कुट, मत्स्य आणि बायोगॅसचे एकात्मिक मॉडेल ज्यातून खर्च कमी आणि नफा दुप्पट होतो.",
        description_mai: "कम लागत में बेसी मुनाफा वला समेकित कृषि।",
        description_bho: "खेती, मछरी, बकरी आ खाद के एक संघे इस्तेमाल।",
        level: "intermediate",
        thumbnail_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
        duration_minutes: 50,
        display_order: 12
      }
    ];

    // Course Modules
    const courseModules = [
      // Rice
      { id: "mod-rice-1", course_id: "course-rice-1", title_en: "Nursery & Field Preparation", title_hi: "नर्सरी एवं खेत की तैयारी", title_mr: "रोपवाटिका व शेताची मशागत", title_mai: "नर्सरी आ खेतक तैयारी", title_bho: "नर्सरी आ खेत के तैयारी", display_order: 1 },
      { id: "mod-rice-2", course_id: "course-rice-1", title_en: "Puddling, Sowing & Water Control", title_hi: "चिखलणी, रोपाई एवं जल प्रबंधन", title_mr: "चिखलणी, लागवड व पाणी नियंत्रण", title_mai: "रोपाई आ जल प्रबंधन", title_bho: "रोपाई आ पानी के प्रबंध", display_order: 2 },
      // Wheat
      { id: "mod-wheat-1", course_id: "course-wheat-1", title_en: "Seedbed Preparation & Sowing", title_hi: "खेत की तैयारी एवं पंक्ति बुवाई", title_mr: "पेरणीपूर्व मशागत व ओळीत पेरणी", title_mai: "खेतक तैयारी आ बुआई", title_bho: "खेत के तैयारी आ बोआई", display_order: 1 },
      { id: "mod-wheat-2", course_id: "course-wheat-1", title_en: "CRI Stage Irrigation & Harvesting", title_hi: "मुकुट जड़ (CRI) सिंचाई एवं कटाई", title_mr: "मुकुट मूळ सिंचन व काढणी", title_mai: "सिंचाई आ कटाई", title_bho: "पानी आ कटाई के समय", display_order: 2 },
      // Cucumber
      { id: "mod-cuc-1", course_id: "course-cucumber-1", title_en: "Polyhouse Setup & Drip Fertigation", title_hi: "पॉलीहाउस सेटअप एवं ड्रिप फर्टिगेशन", title_mr: "पॉलीहाऊस उभारणी व ठिबक खते", title_mai: "पॉलीहाउस आ ड्रिप सिंचाई", title_bho: "पॉलीहाउस आ ड्रिप खाद-पानी", display_order: 1 },
      // Tomato
      { id: "mod-tom-1", course_id: "course-tomato-1", title_en: "Dutch Bucket & EC/pH Hydroponics", title_hi: "डच बकेट सेटअप व EC/pH संतुलन", title_mr: "डच बकेट व हायड्रोपोनिक पोषण", title_mai: "डच बकेट आ पोषण घोल", title_bho: "डच बकेट आ पोषण पानी", display_order: 1 },
      // Dairy
      { id: "mod-dairy-1", course_id: "course-dairy-1", title_en: "Shed Design & Cattle Feeding", title_hi: "शेड निर्माण, पोषण एवं साइलेज", title_mr: "गोठा बांधणी व मुरघास नियोजन", title_mai: "शेड आ संतुलित चारा", title_bho: "शेड आ चारा के प्रबंध", display_order: 1 },
      { id: "mod-dairy-2", course_id: "course-dairy-1", title_en: "Calf Care & Disease Prevention", title_hi: "बछड़ों की देखभाल एवं रोग रोकथाम", title_mr: "वासरांची काळजी व आजार नियंत्रण", title_mai: "बछरू के देखरेख आ टीका", title_bho: "बाछा-बाछी के देखरेख आ टीका", display_order: 2 },
      // Sheep
      { id: "mod-sheep-1", course_id: "course-sheep-1", title_en: "Sheep Housing, Grazing & Health", title_hi: "भेड़ बाड़ा, चराई एवं स्वास्थ्य", title_mr: "मेंढी गोठा, चराई व आरोग्य", title_mai: "भेड़क बाड़ा आ पोषण", title_bho: "भेड़ के बाड़ा आ स्वास्थ्य", display_order: 1 },
      // Goat
      { id: "mod-goat-1", course_id: "course-goat-1", title_en: "Stall-Fed Goat Shed & Nutrition", title_hi: "बकरी बाड़ा, नस्ल चयन एवं आहार", title_mr: "बंदिस्त शेळी शेड, जाती व खाद्य", title_mai: "बकरीक शेड आ उन्नत नस्ल", title_bho: "बकरी के शेड आ दाना-पानी", display_order: 1 },
      // Poultry
      { id: "mod-poultry-1", course_id: "course-poultry-1", title_en: "Brooding & Broiler Management", title_hi: "चूजा ब्रूडिंग एवं ब्रायलर प्रबंधन", title_mr: "पिल्लांची ब्रुडिंग व कुक्कुट शेड", title_mai: "चूजा ब्रूडिंग आ आहार", title_bho: "चूजा के ब्रूडिंग आ दाना", display_order: 1 },
      // Pig
      { id: "mod-pig-1", course_id: "course-pig-1", title_en: "Piggery Sanitation & Breeding", title_hi: "सूअर शेड स्वच्छता एवं पोषण", title_mr: "वराह शेड स्वच्छता व पैदास", title_mai: "सूकरक शेड आ पोषण", title_bho: "सूअर के शेड आ दाना", display_order: 1 },
      // Beekeeping
      { id: "mod-bee-1", course_id: "course-beekeeping-1", title_en: "Hive Box Setup & Honey Harvesting", title_hi: "मधुमक्खी बक्से एवं शहद निष्कर्षण", title_mr: "मधपेट्या व्यवस्थापन व मध काढणे", title_mai: "बक्सा प्रबंधन आ शहद", title_bho: "बक्सा के प्रबंध आ शहद निकालल", display_order: 1 },
      // Fisheries
      { id: "mod-fish-1", course_id: "course-fisheries-1", title_en: "Pond Preparation & Carp Culture", title_hi: "तालाब निर्माण, रोहू-कतला संवर्धन", title_mr: "तळे निर्मिती व मत्स्य संवर्धन", title_mai: "पोखरि निर्माण आ मछली पालन", title_bho: "पोखरा के तैयारी आ मछरी पालन", display_order: 1 },
      // Integrated
      { id: "mod-int-1", course_id: "course-integrated-1", title_en: "Circular Bio-Economy Model", title_hi: "चक्रीय कृषि एवं बायोगैस एकीकरण", title_mr: "चक्रीय शेती व बायोगॅस जोड", title_mai: "चक्रीय कृषि आ बायोगैस", title_bho: "चक्रीय खेती आ बायोगैस", display_order: 1 }
    ];

    // Lessons
    const lessons = [
      // Rice Lessons
      { id: "les-rice-1", module_id: "mod-rice-1", title_en: "Paddy Nursery Preparation & Seed Treatment", title_hi: "धान की नर्सरी और बीज उपचार", video_url: "https://www.youtube.com/watch?v=-eBrAm64fpg", video_duration: "3:52", content_en: "Raise healthy paddy seedlings in raised beds with carbendazim seed treatment.", display_order: 1 },
      { id: "les-rice-2", module_id: "mod-rice-1", title_en: "Field Puddling & System of Rice Intensification (SRI)", title_hi: "खेत की जुताई एवं एसआरआई तकनीक", video_url: "https://www.youtube.com/watch?v=id5LgdTMCtE", video_duration: "8:42", content_en: "Learn scientific puddle preparation and shallow standing water maintenance.", display_order: 2 },
      { id: "les-rice-3", module_id: "mod-rice-2", title_en: "Water, Fertilizer & Pest Management in Paddy", title_hi: "धान में जल, उर्वरक और कीट प्रबंधन", video_url: "https://www.youtube.com/watch?v=4-PW4NrLNRk", video_duration: "15:10", content_en: "Maintain continuous shallow flooding and apply balanced N-P-K at panicle initiation.", display_order: 1 },
      { id: "les-rice-4", module_id: "mod-rice-2", title_en: "Paddy Harvesting & Moisture Testing", title_hi: "धान की कटाई एवं नमी नियंत्रण", video_url: "https://www.youtube.com/watch?v=-eBrAm64fpg", video_duration: "3:52", content_en: "Harvest at 18-20% grain moisture to prevent shattering losses.", display_order: 2 },
      
      // Wheat Lessons
      { id: "les-wheat-1", module_id: "mod-wheat-1", title_en: "Wheat Seedbed Preparation & Line Sowing", title_hi: "गेहूं के खेत की तैयारी एवं पंक्ति बुवाई", video_url: "https://www.youtube.com/watch?v=JN0ICendQns", video_duration: "6:37", content_en: "Fine seedbed preparation and 20-22 cm row spacing using seed drill.", display_order: 1 },
      { id: "les-wheat-2", module_id: "mod-wheat-2", title_en: "CRI Crown Root Irrigation & Nutrient Management", title_hi: "मुकुट जड़ (CRI) सिंचाई एवं पोषण", video_url: "https://www.youtube.com/watch?v=G1nL_mFLn-A", video_duration: "7:16", content_en: "Critical first irrigation at 21 days after sowing with top dressing of urea.", display_order: 1 },
      { id: "les-wheat-3", module_id: "mod-wheat-2", title_en: "Wheat Yield Optimization & Harvesting", title_hi: "गेहूं की कटाई एवं अधिकतम पैदावार", video_url: "https://www.youtube.com/watch?v=JN0ICendQns", video_duration: "6:37", content_en: "Harvest when grains are hard and dry with moisture below 14%.", display_order: 2 },

      // Cucumber Lessons
      { id: "les-cuc-1", module_id: "mod-cuc-1", title_en: "Polyhouse Cucumber Setup & Trellis Training", title_hi: "पॉलीहाउस में खीरे का सेटअप एवं ट्रेलिस", video_url: "https://www.youtube.com/watch?v=wQ5Qr_PL8eU", video_duration: "2:43", content_en: "Vertical nylon wire support and lateral pruning up to 5th node.", display_order: 1 },
      { id: "les-cuc-2", module_id: "mod-cuc-1", title_en: "Drip Fertigation & Soilless Cocopeat Growing", title_hi: "ड्रिप फर्टिगेशन एवं कोकोपीट में उत्पादन", video_url: "https://www.youtube.com/watch?v=etI-95vwdgo", video_duration: "6:02", content_en: "Soluble NPK fertigation schedule and temperature humidity maintenance.", display_order: 2 },

      // Tomato Lessons
      { id: "les-tom-1", module_id: "mod-tom-1", title_en: "Dutch Bucket Hydroponic Setup & EC/pH Control", title_hi: "डच बकेट सेटअप एवं pH/EC संतुलन", video_url: "https://www.youtube.com/watch?v=wxMIq2E6X_Q", video_duration: "5:54", content_en: "Perlite root support and closed-loop recirculated nutrient solution.", display_order: 1 },
      { id: "les-tom-2", module_id: "mod-tom-1", title_en: "Cherry Tomato Pruning, Pollination & Staggered Harvest", title_hi: "चेरी टमाटर की छंटाई एवं नियमित तुड़ाई", video_url: "https://www.youtube.com/watch?v=j4EFjxCUmN8", video_duration: "17:50", content_en: "Manual cluster agitation for pollination and bi-weekly harvest.", display_order: 2 },

      // Dairy Lessons
      { id: "les-dairy-1", module_id: "mod-dairy-1", title_en: "Modern Dairy Shed Design & Cattle Housing", title_hi: "आधुनिक डेयरी शेड डिजाइन एवं आवास", video_url: "https://www.youtube.com/watch?v=vA0A1WzinbI", video_duration: "2:54", content_en: "Loose housing system with good cross ventilation and comfortable bedding.", display_order: 1 },
      { id: "les-dairy-2", module_id: "mod-dairy-1", title_en: "High-Yield Silage Making & Fodder Nutrition", title_hi: "साइलेज बनाने की विधि एवं पशु पोषण", video_url: "https://www.youtube.com/watch?v=wDT0JmOGRw4", video_duration: "1:57", content_en: "Green fodder preservation in anaerobic silage pits with molasses.", display_order: 2 },
      { id: "les-dairy-3", module_id: "mod-dairy-2", title_en: "Calf Rearing & Mastitis Prevention Protocol", title_hi: "बछड़े की देखभाल एवं थनैला रोग से बचाव", video_url: "https://www.youtube.com/watch?v=vA0A1WzinbI", video_duration: "2:54", content_en: "Colostrum feeding within 2 hours of birth and post-milking teat dip.", display_order: 1 },

      // Sheep Lessons
      { id: "les-sheep-1", module_id: "mod-sheep-1", title_en: "Sheep Farm Setup & Pasture Rotational Grazing", title_hi: "भेड़ फार्म की स्थापना एवं चराई प्रबंधन", video_url: "https://www.youtube.com/watch?v=DMQDRAffiUw", video_duration: "3:54", content_en: "Elevated shed construction and rotational grazing for parasite prevention.", display_order: 1 },
      { id: "les-sheep-2", module_id: "mod-sheep-1", title_en: "Lamb Care, Vaccination & Wool Shearing", title_hi: "मेमनों की देखभाल, टीकाकरण एवं ऊन कटाई", video_url: "https://www.youtube.com/watch?v=4VDlIFV3qIM", video_duration: "4:59", content_en: "Deworming calendar, PPR vaccination, and clean shearing protocols.", display_order: 2 },

      // Goat Lessons
      { id: "les-goat-1", module_id: "mod-goat-1", title_en: "Scientific Goat Farm Setup & Breed Selection", title_hi: "वैज्ञानिक बकरी फार्म सेटअप एवं नस्ल चयन", video_url: "https://www.youtube.com/watch?v=DdEjvOBEnwI", video_duration: "3:40", content_en: "Selecting high-yield Sirohi, Jamnapari, and Barbari breeds for stall feeding.", display_order: 1 },
      { id: "les-goat-2", module_id: "mod-goat-1", title_en: "Stall-Fed Goat Shed Construction & Ration", title_hi: "बकरी शेड निर्माण एवं संतुलित राशन", video_url: "https://www.youtube.com/watch?v=3SxADJwDW9Y", video_duration: "3:37", content_en: "Elevated wooden slotted flooring design and dry/green fodder formulation.", display_order: 2 },
      { id: "les-goat-3", module_id: "mod-goat-1", title_en: "Goat Disease Prevention & Kid Nursing Care", title_hi: "बकरी रोग रोकथाम एवं बच्चों की देखरेख", video_url: "https://www.youtube.com/watch?v=DdEjvOBEnwI", video_duration: "3:40", content_en: "Enterotoxemia and PPR vaccination schedules with creep feeding for kids.", display_order: 3 },

      // Poultry Lessons
      { id: "les-poultry-1", module_id: "mod-poultry-1", title_en: "Broiler Poultry Shed Setup & Chick Brooding", title_hi: "ब्रायलर पोल्ट्री शेड एवं चूजा ब्रूडिंग", video_url: "https://www.youtube.com/watch?v=CHJMfkOvOGk", video_duration: "9:20", content_en: "Day-old chick temperature management (95°F) and rice husk litter preparation.", display_order: 1 },
      { id: "les-poultry-2", module_id: "mod-poultry-1", title_en: "Commercial Poultry Feed Formulation & Biosecurity", title_hi: "मुर्गी आहार निर्माण एवं जैव-सुरक्षा", video_url: "https://www.youtube.com/watch?v=_z8mg6NIJM4", video_duration: "3:31", content_en: "Pre-starter, starter, and finisher rations with strict disinfection baths.", display_order: 2 },
      { id: "les-poultry-3", module_id: "mod-poultry-1", title_en: "Layer Farming & Disease Vaccination Schedule", title_hi: "लेयर फार्मिंग एवं टीकाकरण समय सारणी", video_url: "https://www.youtube.com/watch?v=CHJMfkOvOGk", video_duration: "9:20", content_en: "Marek's, Lasota, and Gumboro vaccine administration for high egg production.", display_order: 3 },

      // Pig Lessons
      { id: "les-pig-1", module_id: "mod-pig-1", title_en: "Commercial Piggery Housing & Sanitation", title_hi: "व्यावसायिक सूअर बाड़ा एवं स्वच्छता", video_url: "https://www.youtube.com/watch?v=67x4_mLm0mo", video_duration: "3:07", content_en: "Concrete furrowed flooring with water wallows and balanced protein rations.", display_order: 1 },

      // Beekeeping Lessons
      { id: "les-bee-1", module_id: "mod-bee-1", title_en: "Apis Mellifera Wooden Box Setup & Queen Management", title_hi: "मधुमक्खी बक्से एवं रानी मक्खी प्रबंधन", video_url: "https://www.youtube.com/watch?v=dzf2a0mcCvE", video_duration: "3:46", content_en: "Langstroth hive box frames, queen excluders, and worker bee colony balancing.", display_order: 1 },
      { id: "les-bee-2", module_id: "mod-bee-1", title_en: "Centrifugal Honey Extraction & Mite Disease Control", title_hi: "शहद निष्कर्षण एवं माइट रोग नियंत्रण", video_url: "https://www.youtube.com/watch?v=tZ3DZ1Z3i0c", video_duration: "3:12", content_en: "Hygienic uncapping knife and centrifugal extraction without damaging combs.", display_order: 2 },

      // Fisheries Lessons
      { id: "les-fish-1", module_id: "mod-fish-1", title_en: "Fish Pond Preparation, Liming & Fingerling Stocking", title_hi: "मछली तालाब की तैयारी एवं बीज संचयन", video_url: "https://www.youtube.com/watch?v=RNQxV7zdoyc", video_duration: "3:14", content_en: "Pond drying, agricultural lime application (250 kg/ha), and fingerling acclimatization.", display_order: 1 },
      { id: "les-fish-2", module_id: "mod-fish-1", title_en: "Polyculture Carp Feeding & Water Quality Management", title_hi: "रोहू-कतला मिश्रित पालन एवं जल गुणवत्ता", video_url: "https://www.youtube.com/watch?v=xOLdDsCekQY", video_duration: "6:13", content_en: "Surface, column, and bottom feeder combination with dissolved oxygen aerators.", display_order: 2 },

      // Integrated Lessons
      { id: "les-int-1", module_id: "mod-int-1", title_en: "Zero-Waste Circular Farm: Crop, Poultry & Fish Integration", title_hi: "शून्य अपशिष्ट कृषि: फसल, मुर्गी और मछली एकीकरण", video_url: "https://www.youtube.com/watch?v=FCTNm27o5Ug", video_duration: "3:22", content_en: "Directing poultry droppings as pond manure and utilizing pond silt as rich crop compost.", display_order: 1 },
      { id: "les-int-2", module_id: "mod-int-1", title_en: "Biogas Slurry, Vermicompost & Farm Resilience", title_hi: "बायोगैस स्लरी एवं केंचुआ खाद एकीकरण", video_url: "https://www.youtube.com/watch?v=58Xj4PYSCSo", video_duration: "3:31", content_en: "Converting cattle dung into cooking methane gas and liquid bio-fertilizer.", display_order: 2 }
    ];

    // Lesson Videos (YouTube Video Mapping)
    const lessonVideos = [
      // Rice
      { id: "vid-rice-1", lesson_id: "les-rice-1", youtube_video_id: "-eBrAm64fpg", youtube_url: "https://www.youtube.com/watch?v=-eBrAm64fpg", title: "Paddy Nursery Management (DD Kisan)", description: "Scientific nursery bed preparation and healthy seedling cultivation.", language: "hi", duration_seconds: 232, is_primary: true },
      { id: "vid-rice-2", lesson_id: "les-rice-2", youtube_video_id: "id5LgdTMCtE", youtube_url: "https://www.youtube.com/watch?v=id5LgdTMCtE", title: "Scientific Cultivation of Paddy (Shramajeevi)", description: "Complete package of practices for maximum grain yield.", language: "en", duration_seconds: 522, is_primary: true },
      { id: "vid-rice-3", lesson_id: "les-rice-3", youtube_video_id: "4-PW4NrLNRk", youtube_url: "https://www.youtube.com/watch?v=4-PW4NrLNRk", title: "SRI Method of Rice Cultivation", description: "Water saving and root aeration techniques.", language: "en", duration_seconds: 910, is_primary: true },
      { id: "vid-rice-4", lesson_id: "les-rice-4", youtube_video_id: "-eBrAm64fpg", youtube_url: "https://www.youtube.com/watch?v=-eBrAm64fpg", title: "Paddy Varieties, Sowing & Harvest", description: "Harvest timing and grain preservation.", language: "en", duration_seconds: 232, is_primary: true },

      // Wheat
      { id: "vid-wheat-1", lesson_id: "les-wheat-1", youtube_video_id: "JN0ICendQns", youtube_url: "https://www.youtube.com/watch?v=JN0ICendQns", title: "Wheat High-Yield Cultivation (Green TV)", description: "Field preparation, seed treatment, and line sowing techniques.", language: "hi", duration_seconds: 397, is_primary: true },
      { id: "vid-wheat-2", lesson_id: "les-wheat-2", youtube_video_id: "G1nL_mFLn-A", youtube_url: "https://www.youtube.com/watch?v=G1nL_mFLn-A", title: "Wheat Crown Root Irrigation (CRI)", description: "Critical first irrigation at 21 days after sowing.", language: "hi", duration_seconds: 436, is_primary: true },
      { id: "vid-wheat-3", lesson_id: "les-wheat-3", youtube_video_id: "JN0ICendQns", youtube_url: "https://www.youtube.com/watch?v=JN0ICendQns", title: "Wheat Nutrient & Harvest Guide", description: "Fertilizer dosage and harvesting moisture control.", language: "hi", duration_seconds: 397, is_primary: true },

      // Cucumber
      { id: "vid-cuc-1", lesson_id: "les-cuc-1", youtube_video_id: "wQ5Qr_PL8eU", youtube_url: "https://www.youtube.com/watch?v=wQ5Qr_PL8eU", title: "Polyhouse Cucumber High Profit Farming", description: "Trellis training and greenhouse climate control.", language: "hi", duration_seconds: 163, is_primary: true },
      { id: "vid-cuc-2", lesson_id: "les-cuc-2", youtube_video_id: "etI-95vwdgo", youtube_url: "https://www.youtube.com/watch?v=etI-95vwdgo", title: "Greenhouse Cucumber Drip Fertigation", description: "Water soluble fertilizer dosing and shoot pruning.", language: "hi", duration_seconds: 362, is_primary: true },

      // Tomato
      { id: "vid-tom-1", lesson_id: "les-tom-1", youtube_video_id: "wxMIq2E6X_Q", youtube_url: "https://www.youtube.com/watch?v=wxMIq2E6X_Q", title: "Dutch Bucket Hydroponic Tomatoes", description: "Nutrient solution EC/pH management in Dutch buckets.", language: "en", duration_seconds: 354, is_primary: true },
      { id: "vid-tom-2", lesson_id: "les-tom-2", youtube_video_id: "j4EFjxCUmN8", youtube_url: "https://www.youtube.com/watch?v=j4EFjxCUmN8", title: "Hydroponic Tomato Pruning & Harvest", description: "Techniques for training vines and harvesting ripe clusters.", language: "en", duration_seconds: 1070, is_primary: true },

      // Dairy
      { id: "vid-dairy-1", lesson_id: "les-dairy-1", youtube_video_id: "vA0A1WzinbI", youtube_url: "https://www.youtube.com/watch?v=vA0A1WzinbI", title: "Scientific Dairy Farming & Cattle Housing (NDRI)", description: "Modern shed design, ventilation, and cow comfort.", language: "hi", duration_seconds: 174, is_primary: true },
      { id: "vid-dairy-2", lesson_id: "les-dairy-2", youtube_video_id: "wDT0JmOGRw4", youtube_url: "https://www.youtube.com/watch?v=wDT0JmOGRw4", title: "Dairy Cattle Feeding & Silage Making", description: "High-protein green fodder and silage pit fermentation.", language: "hi", duration_seconds: 117, is_primary: true },
      { id: "vid-dairy-3", lesson_id: "les-dairy-3", youtube_video_id: "vA0A1WzinbI", youtube_url: "https://www.youtube.com/watch?v=vA0A1WzinbI", title: "Scientific Calf Rearing & Disease Control", description: "Colostrum management and mastitis prevention.", language: "hi", duration_seconds: 174, is_primary: true },

      // Sheep
      { id: "vid-sheep-1", lesson_id: "les-sheep-1", youtube_video_id: "DMQDRAffiUw", youtube_url: "https://www.youtube.com/watch?v=DMQDRAffiUw", title: "Commercial Sheep Farming Practices", description: "Shed setup, pasture rotational grazing, and health care.", language: "hi", duration_seconds: 234, is_primary: true },
      { id: "vid-sheep-2", lesson_id: "les-sheep-2", youtube_video_id: "4VDlIFV3qIM", youtube_url: "https://www.youtube.com/watch?v=4VDlIFV3qIM", title: "Sheep Vaccination & Lamb Care", description: "Deworming schedules and wool shearing methods.", language: "hi", duration_seconds: 299, is_primary: true },

      // Goat
      { id: "vid-goat-1", lesson_id: "les-goat-1", youtube_video_id: "DdEjvOBEnwI", youtube_url: "https://www.youtube.com/watch?v=DdEjvOBEnwI", title: "Scientific Goat Farming (CIRG)", description: "High-yield breed selection (Sirohi, Barbari) and shed setup.", language: "hi", duration_seconds: 220, is_primary: true },
      { id: "vid-goat-2", lesson_id: "les-goat-2", youtube_video_id: "3SxADJwDW9Y", youtube_url: "https://www.youtube.com/watch?v=3SxADJwDW9Y", title: "How to Start a Goat Farm (Green TV)", description: "Shed construction, feeder design, and daily feed rations.", language: "hi", duration_seconds: 217, is_primary: true },
      { id: "vid-goat-3", lesson_id: "les-goat-3", youtube_video_id: "DdEjvOBEnwI", youtube_url: "https://www.youtube.com/watch?v=DdEjvOBEnwI", title: "Goat Disease Prevention & Kid Nursing", description: "Protecting herd from enterotoxemia and respiratory infections.", language: "hi", duration_seconds: 220, is_primary: true },

      // Poultry
      { id: "vid-poultry-1", lesson_id: "les-poultry-1", youtube_video_id: "CHJMfkOvOGk", youtube_url: "https://www.youtube.com/watch?v=CHJMfkOvOGk", title: "Broiler Poultry Shed & Brooding (DD Kisan)", description: "Temperature and humidity control during the first 14 days.", language: "hi", duration_seconds: 560, is_primary: true },
      { id: "vid-poultry-2", lesson_id: "les-poultry-2", youtube_video_id: "_z8mg6NIJM4", youtube_url: "https://www.youtube.com/watch?v=_z8mg6NIJM4", title: "Poultry Feeding & Farm Biosecurity", description: "Feed conversion ratio optimization and sanitation.", language: "hi", duration_seconds: 211, is_primary: true },
      { id: "vid-poultry-3", lesson_id: "les-poultry-3", youtube_video_id: "CHJMfkOvOGk", youtube_url: "https://www.youtube.com/watch?v=CHJMfkOvOGk", title: "Layer Farm Management & Vaccination", description: "Egg production enhancement and disease control.", language: "hi", duration_seconds: 560, is_primary: true },

      // Pig
      { id: "vid-pig-1", lesson_id: "les-pig-1", youtube_video_id: "67x4_mLm0mo", youtube_url: "https://www.youtube.com/watch?v=67x4_mLm0mo", title: "Commercial Pig Farming Protocols", description: "Piggery housing, dry rations, and disease prevention.", language: "en", duration_seconds: 187, is_primary: true },

      // Beekeeping
      { id: "vid-bee-1", lesson_id: "les-bee-1", youtube_video_id: "dzf2a0mcCvE", youtube_url: "https://www.youtube.com/watch?v=dzf2a0mcCvE", title: "Scientific Beekeeping & Hive Management", description: "Wooden box setup, colony division, and queen care.", language: "en", duration_seconds: 226, is_primary: true },
      { id: "vid-bee-2", lesson_id: "les-bee-2", youtube_video_id: "tZ3DZ1Z3i0c", youtube_url: "https://www.youtube.com/watch?v=tZ3DZ1Z3i0c", title: "Honey Extraction & Bee Health", description: "Centrifugal extractor operations and pure honey processing.", language: "en", duration_seconds: 192, is_primary: true },

      // Fisheries
      { id: "vid-fish-1", lesson_id: "les-fish-1", youtube_video_id: "RNQxV7zdoyc", youtube_url: "https://www.youtube.com/watch?v=RNQxV7zdoyc", title: "Freshwater Fish Farming & Pond Preparation (CIFA)", description: "Pond liming, fertilization, and carp fingerling stocking.", language: "hi", duration_seconds: 194, is_primary: true },
      { id: "vid-fish-2", lesson_id: "les-fish-2", youtube_video_id: "xOLdDsCekQY", youtube_url: "https://www.youtube.com/watch?v=xOLdDsCekQY", title: "Polyculture Carp Rearing in Ponds", description: "Rohu, Catla, and Mrigal feeding and aerator systems.", language: "hi", duration_seconds: 373, is_primary: true },

      // Integrated
      { id: "vid-int-1", lesson_id: "les-int-1", youtube_video_id: "FCTNm27o5Ug", youtube_url: "https://www.youtube.com/watch?v=FCTNm27o5Ug", title: "Integrated Rice, Poultry & Fish Farming", description: "Circular farming with shared nutrient cycles and zero-waste.", language: "en", duration_seconds: 202, is_primary: true },
      { id: "vid-int-2", lesson_id: "les-int-2", youtube_video_id: "58Xj4PYSCSo", youtube_url: "https://www.youtube.com/watch?v=58Xj4PYSCSo", title: "Biogas, Vermicompost & Crop Synergies", description: "Energy self-sufficiency and high quality organic compost.", language: "en", duration_seconds: 211, is_primary: true }
    ];

    // Seed Sample Crop Listings
    const cropListings = [
      {
        id: "crop-seed-1",
        farmer_id: "guest-1",
        farmer_name: "Ramesh Patil",
        crop_name: "Organic Red Tomato (Shimla)",
        crop_category: "Vegetable",
        quantity: 1200,
        unit: "kg",
        price_per_unit: 24,
        country: "India",
        state: "Maharashtra",
        district: "Pune",
        village: "Khed",
        description: "Farm-fresh ripe tomatoes harvested with zero synthetic chemical sprays. High lycopene and firm skin.",
        image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
        is_verified: true
      },
      {
        id: "crop-seed-2",
        farmer_id: "usr-farmer-1",
        farmer_name: "Suresh Kumar",
        crop_name: "Sharbati Golden Wheat (Grain)",
        crop_category: "Grain",
        quantity: 5000,
        unit: "kg",
        price_per_unit: 32,
        country: "India",
        state: "Uttar Pradesh",
        district: "Varanasi",
        village: "Shivpur",
        description: "Premium sun-dried Sharbati grade wheat with 12.5% protein and low moisture. Direct farm gate sale.",
        image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
        is_verified: true
      }
    ];

    // Seed Sample Agricultural Products
    const products = [
      {
        id: "prod-seed-1",
        seller_id: "usr-seller-1",
        seller_name: "Kisan Agro Supplies & Seeds",
        name: "Bio-Enriched Organic Neem Cake (25kg)",
        category: "fertilizers",
        description: "Pure cold-pressed neem cake fertilizer that acts as a natural soil conditioner and nematode repellant.",
        price: 850,
        unit: "bag",
        inventory: 150,
        image_url: "https://images.unsplash.com/photo-1585336261026-7f8846368d44?auto=format&fit=crop&q=80&w=600",
        is_verified: true
      },
      {
        id: "prod-seed-2",
        seller_id: "usr-seller-1",
        seller_name: "Kisan Agro Supplies & Seeds",
        name: "Solar Drip Irrigation Starter Kit (0.5 Acre)",
        category: "irrigation_equipment",
        description: "Pressure-compensating 16mm inline drip laterals with inline drippers and solar pump connectors.",
        price: 4800,
        unit: "kit",
        inventory: 40,
        image_url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=600",
        is_verified: true
      }
    ];

    // Plant Species
    const plantSpecies = [
      {
        id: "sp-1",
        scientific_name: "Solanum lycopersicum",
        common_name: "Tomato",
        family: "Solanaceae",
        growth_habit: "Herbaceous annual or short-lived perennial climber",
        native_region: "South and Central America",
        ideal_ph_min: 6.0,
        ideal_ph_max: 6.8,
        ideal_soil_texture: "Loamy, well-draining soil",
        water_requirement: "medium",
        sunlight_requirement: "Full sun",
        is_invasive: false
      },
      {
        id: "sp-2",
        scientific_name: "Oryza sativa",
        common_name: "Rice / Paddy",
        family: "Poaceae",
        growth_habit: "Semi-aquatic annual grass",
        native_region: "Tropical Asia",
        ideal_ph_min: 5.5,
        ideal_ph_max: 6.5,
        ideal_soil_texture: "Clayey or heavy clay loams that retain water",
        water_requirement: "high",
        sunlight_requirement: "Full sun",
        is_invasive: false
      },
      {
        id: "sp-3",
        scientific_name: "Triticum aestivum",
        common_name: "Wheat",
        family: "Poaceae",
        growth_habit: "Annual cereal grass",
        native_region: "Fertile Crescent (Middle East)",
        ideal_ph_min: 6.0,
        ideal_ph_max: 7.5,
        ideal_soil_texture: "Deep loamy or clay loam soil",
        water_requirement: "medium",
        sunlight_requirement: "Full sun",
        is_invasive: false
      }
    ];

    const status = dbConnection.getStatus();

    if (status.connected && dbConnection.getPool()) {
      const conn = await dbConnection.getPool()!.getConnection();
      try {
        // Seed users
        for (const u of initialUsers) {
          await conn.query(
            `INSERT INTO users (id, name, email, password_hash, mobile, role, preferred_language, country, state, district, village, land_area, land_unit, soil_type, crops_grown, company_name, gst_number, buyer_type, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), password_hash=VALUES(password_hash)`,
            [
              u.id, u.name, u.email, u.password_hash, u.mobile, u.role, u.preferred_language,
              u.country, u.state, u.district, u.village, u.land_area || 0, u.land_unit || 'Acres',
              u.soil_type || 'Loamy', u.crops_grown || null, u.company_name || '', u.gst_number || '',
              u.buyer_type || '', u.is_verified
            ]
          );
        }

        // Seed categories
        for (const c of farmingCategories) {
          await conn.query(
            `INSERT INTO farming_categories (id, code, name_en, name_hi, name_mr, name_mai, name_bho, description_en, description_hi, description_mr, description_mai, description_bho, icon, display_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name_en=VALUES(name_en), name_hi=VALUES(name_hi), name_mr=VALUES(name_mr)`,
            [
              c.id, c.code, c.name_en, c.name_hi, c.name_mr, c.name_mai, c.name_bho,
              c.description_en, c.description_hi, c.description_mr, c.description_mai, c.description_bho,
              c.icon, c.display_order, true
            ]
          );
        }

        // Seed courses
        for (const cs of courses) {
          await conn.query(
            `INSERT INTO courses (id, category_id, title_en, title_hi, title_mr, title_mai, title_bho, description_en, description_hi, description_mr, description_mai, description_bho, level, duration_minutes, is_published, display_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title_en=VALUES(title_en)`,
            [
              cs.id, cs.category_id, cs.title_en, cs.title_hi, cs.title_mr, cs.title_mai, cs.title_bho,
              cs.description_en, cs.description_hi, cs.description_mr, cs.description_mai, cs.description_bho,
              cs.level, cs.duration_minutes, true, cs.display_order
            ]
          );
        }

        // Seed course modules
        for (const cm of courseModules) {
          await conn.query(
            `INSERT INTO course_modules (id, course_id, title_en, title_hi, title_mr, title_mai, title_bho, display_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title_en=VALUES(title_en)`,
            [cm.id, cm.course_id, cm.title_en, cm.title_hi, cm.title_mr, cm.title_mai, cm.title_bho, cm.display_order]
          );
        }

        // Seed lessons
        for (const ls of lessons) {
          await conn.query(
            `INSERT INTO lessons (id, module_id, title_en, video_url, video_duration, content_en, display_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title_en=VALUES(title_en), video_url=VALUES(video_url)`,
            [ls.id, ls.module_id, ls.title_en, ls.video_url, ls.video_duration, ls.content_en, ls.display_order, true]
          );
        }

        // Seed lesson videos
        for (const lv of lessonVideos) {
          await conn.query(
            `INSERT INTO lesson_videos (id, lesson_id, youtube_video_id, youtube_url, title, description, language, duration_seconds, thumbnail_url, is_primary, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE youtube_video_id=VALUES(youtube_video_id), youtube_url=VALUES(youtube_url)`,
            [
              lv.id, lv.lesson_id, lv.youtube_video_id, lv.youtube_url, lv.title, lv.description,
              lv.language, lv.duration_seconds, `https://img.youtube.com/vi/${lv.youtube_video_id}/hqdefault.jpg`, lv.is_primary, true
            ]
          );
        }

        // Seed crop listings
        for (const cl of cropListings) {
          await conn.query(
            `INSERT INTO crop_listings (id, farmer_id, farmer_name, crop_name, crop_category, quantity, unit, price_per_unit, country, state, district, village, description, image_url, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), price_per_unit=VALUES(price_per_unit)`,
            [
              cl.id, cl.farmer_id, cl.farmer_name, cl.crop_name, cl.crop_category, cl.quantity, cl.unit,
              cl.price_per_unit, cl.country, cl.state, cl.district, cl.village, cl.description, cl.image_url, cl.is_verified
            ]
          );
        }

        // Seed products
        for (const pr of products) {
          await conn.query(
            `INSERT INTO agricultural_products (id, seller_id, seller_name, name, category, description, price, unit, inventory, image_url, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE price=VALUES(price), inventory=VALUES(inventory)`,
            [
              pr.id, pr.seller_id, pr.seller_name, pr.name, pr.category, pr.description, pr.price, pr.unit,
              pr.inventory, pr.image_url, pr.is_verified
            ]
          );
        }

        // Seed plant species
        for (const ps of plantSpecies) {
          await conn.query(
            `INSERT INTO plant_species (id, scientific_name, common_name, family, growth_habit, native_region, ideal_ph_min, ideal_ph_max, ideal_soil_texture, water_requirement, sunlight_requirement, is_invasive)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE common_name=VALUES(common_name)`,
            [
              ps.id, ps.scientific_name, ps.common_name, ps.family, ps.growth_habit, ps.native_region,
              ps.ideal_ph_min, ps.ideal_ph_max, ps.ideal_soil_texture, ps.water_requirement, ps.sunlight_requirement, ps.is_invasive
            ]
          );
        }

        console.log("[Seed] MySQL seed records successfully populated.");
      } finally {
        conn.release();
      }
    } else {
      // Offline fallback seeding
      const usersTable = dbConnection.getFallbackTable("users");
      for (const u of initialUsers) {
        const existingIdx = usersTable.findIndex(x => x.id === u.id || x.email === u.email);
        if (existingIdx >= 0) {
          usersTable[existingIdx] = { ...usersTable[existingIdx], ...u };
        } else {
          usersTable.push(u);
        }
      }

      const catTable = dbConnection.getFallbackTable("farming_categories");
      for (const c of farmingCategories) {
        const idx = catTable.findIndex(x => x.id === c.id);
        if (idx >= 0) catTable[idx] = { ...catTable[idx], ...c };
        else catTable.push(c);
      }

      const crsTable = dbConnection.getFallbackTable("courses");
      for (const cs of courses) {
        const idx = crsTable.findIndex(x => x.id === cs.id);
        if (idx >= 0) crsTable[idx] = { ...crsTable[idx], ...cs };
        else crsTable.push(cs);
      }

      const modTable = dbConnection.getFallbackTable("course_modules");
      for (const cm of courseModules) {
        const idx = modTable.findIndex(x => x.id === cm.id);
        if (idx >= 0) modTable[idx] = { ...modTable[idx], ...cm };
        else modTable.push(cm);
      }

      const lesTable = dbConnection.getFallbackTable("lessons");
      for (const ls of lessons) {
        const idx = lesTable.findIndex(x => x.id === ls.id);
        if (idx >= 0) lesTable[idx] = { ...lesTable[idx], ...ls };
        else lesTable.push(ls);
      }

      const vidTable = dbConnection.getFallbackTable("lesson_videos");
      for (const lv of lessonVideos) {
        const idx = vidTable.findIndex(x => x.id === lv.id);
        if (idx >= 0) vidTable[idx] = { ...vidTable[idx], ...lv };
        else vidTable.push(lv);
      }

      const cropsTable = dbConnection.getFallbackTable("crop_listings");
      for (const cl of cropListings) {
        const idx = cropsTable.findIndex(x => x.id === cl.id);
        if (idx >= 0) cropsTable[idx] = { ...cropsTable[idx], ...cl };
        else cropsTable.push(cl);
      }

      const prodTable = dbConnection.getFallbackTable("agricultural_products");
      for (const pr of products) {
        const idx = prodTable.findIndex(x => x.id === pr.id);
        if (idx >= 0) prodTable[idx] = { ...prodTable[idx], ...pr };
        else prodTable.push(pr);
      }

      const spTable = dbConnection.getFallbackTable("plant_species");
      for (const ps of plantSpecies) {
        const idx = spTable.findIndex(x => x.id === ps.id);
        if (idx >= 0) spTable[idx] = { ...spTable[idx], ...ps };
        else spTable.push(ps);
      }

      dbConnection.saveFallback();
      console.log("[Seed] Persistent offline fallback seed records populated.");
    }

    return true;
  } catch (err: any) {
    console.error("[Seed] Error during seeding:", err.message || err);
    return false;
  }
}
