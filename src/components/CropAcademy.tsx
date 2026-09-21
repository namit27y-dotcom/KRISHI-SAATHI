import React, { useState } from "react";
import { 
  Play, 
  Video, 
  Calendar, 
  Layers, 
  ArrowRight, 
  X, 
  Clock, 
  Info, 
  CheckCircle,
  Volume2,
  Maximize2,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { Bi, bString } from "./Bilingual.tsx";

interface CropStep {
  title: string;
  desc: string;
}

interface CropGuide {
  id: string;
  name: string;
  type: "seasonal" | "off-season";
  season: string;
  image: string;
  videoUrl: string;
  videoLength: string;
  description: string;
  steps: CropStep[];
  soilType: string;
  waterLevel: string;
  translations: Record<string, {
    name: string;
    season: string;
    description: string;
    steps: CropStep[];
  }>;
}

const CROP_GUIDES_DATA: CropGuide[] = [
  {
    id: "rice",
    name: "Rice (Paddy)",
    type: "seasonal",
    season: "Monsoon (Kharif)",
    image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-in-a-rice-field-41551-large.mp4",
    videoLength: "4:32",
    description: "Paddy is a water-intensive staple crop ideal for clayey and loamy water-retentive soils.",
    soilType: "Clayey / Silty Loam",
    waterLevel: "High (Flooding)",
    steps: [
      { title: "Nursery Sowing", desc: "Sow seeds in a raised nursery bed 25-30 days before transplanting." },
      { title: "Field Puddling", desc: "Plough and puddle the main field with 5-10cm of standing water." },
      { title: "Transplanting", desc: "Transplant 2-3 saplings per hill at a depth of 2-3 cm with spacing." },
      { title: "Water Management", desc: "Maintain continuous shallow flooding (5cm) until 15 days before harvest." }
    ],
    translations: {
      hi: {
        name: "धान (चावल)",
        season: "मानसून (खरीफ)",
        description: "धान पानी-गहन मुख्य फसल है जो मिट्टी और दोमट जल-प्रतिधारक मिट्टी के लिए आदर्श है।",
        steps: [
          { title: "नर्सरी बुवाई", desc: "रोपाई से 25-30 दिन पहले बीजों को क्यारी में बोएं।" },
          { title: "खेत की तैयारी", desc: "खेत की जुताई कर के 5-10 सेमी खड़े पानी के साथ तैयार करें।" },
          { title: "रोपाई", desc: "2-3 पौधे प्रति पहाड़ी 2-3 सेमी की गहराई पर निश्चित दूरी पर रोपें।" },
          { title: "जल प्रबंधन", desc: "कटाई से 15 दिन पहले तक लगातार उथला पानी (5 सेमी) बनाए रखें।" }
        ]
      },
      mr: {
        name: "भात (धान)",
        season: "पावसाळा (खरीप)",
        description: "भात हे पाणी-सघन पीक असून ते चिकणमाती आणि पाण्याचा निचरा न होणाऱ्या उत्तम जमिनीसाठी आदर्श आहे.",
        steps: [
          { title: "रोपवाटिका पेरणी", desc: "पुनर्लागवडीच्या २५-३० दिवस आधी बियाणे गादीवाफ्यावर पेरावे." },
          { title: "चिखलणी", desc: "मुख्य शेतात ५-१० सेमी साठलेल्या पाण्यासह चिखलणी करून घ्या." },
          { title: "पुनर्लागवड", desc: "२-३ रोपे प्रति ठिकाणी २-३ सेमी खोलीवर योग्य अंतरावर लावावीत." },
          { title: "पाणी व्यवस्थापन", desc: "काढणीच्या १५ दिवस आधीपर्यंत शेतात ५ सेमी पाणी साठवून ठेवावे." }
        ]
      },
      pa: {
        name: "ਝੋਨਾ (ਚੌਲ)",
        season: "ਮਾਨਸੂਨ (ਖਰੀਫ)",
        description: "ਝੋਨਾ ਪਾਣੀ ਦੀ ਵੱਧ ਖਪਤ ਵਾਲੀ ਮੁੱਖ ਫਸਲ ਹੈ ਜੋ ਚੀਕਣੀ ਮਿੱਟੀ ਲਈ ਸਭ ਤੋਂ ਵਧਦੀ ਹੈ।",
        steps: [
          { title: "ਪਨੀਰੀ ਦੀ ਬਿਜਾਈ", desc: "ਖੇਤ ਵਿੱਚ ਲਾਉਣ ਤੋਂ 25-30 ਦਿਨ ਪਹਿਲਾਂ ਪਨੀਰੀ ਤਿਆਰ ਕਰੋ।" },
          { title: "ਕੱਦੂ ਕਰਨਾ", desc: "ਖੇਤ ਨੂੰ ਵਾਹ ਕੇ 5-10 ਸੈਂਟੀਮੀਟਰ ਖੜ੍ਹੇ ਪਾਣੀ ਨਾਲ ਕੱਦੂ ਕਰੋ।" },
          { title: "ਲਵਾਈ (ਟ੍ਰਾਂਸਪਲਾਂਟਿੰਗ)", desc: "ਇੱਕ ਜਗ੍ਹਾ 'ਤੇ 2-3 ਬੂਟੇ ਲਗਾਓ, 2-3 ਸੈਂਟੀਮੀਟਰ ਡੂੰਗੇ ਅਤੇ ਫਾਸਲੇ 'ਤੇ।" },
          { title: "ਪਾਣੀ ਪ੍ਰਬੰਧਨ", desc: "ਕਟਾਈ ਤੋਂ 15 ਦਿਨ ਪਹਿਲਾਂ ਤੱਕ ਹਲਕਾ ਖੜ੍ਹਾ ਪਾਣੀ (5 ਸੈਂਟੀਮੀਟਰ) ਬਣਾਈ ਰੱਖੋ।" }
        ]
      }
    }
  },
  {
    id: "wheat",
    name: "Wheat",
    type: "seasonal",
    season: "Winter (Rabi)",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wheat-field-under-a-blue-sky-41552-large.mp4",
    videoLength: "5:10",
    description: "Wheat is a cool-season grain crop requiring dry, bright days during maturity.",
    soilType: "Clayey Loam / Sandy Loam",
    waterLevel: "Medium (4-6 irrigations)",
    steps: [
      { title: "Field Preparation", desc: "Ensure a fine, weed-free seedbed for optimal seed-to-soil contact." },
      { title: "Sowing in Rows", desc: "Sow using a seed drill at 4-5 cm depth with 20-22 cm row spacing." },
      { title: "Crown Root Irrigation", desc: "First irrigation at 21 days after sowing is the most critical (CRI stage)." },
      { title: "Harvesting", desc: "Harvest when grains are hard and dry (moisture content below 15%)." }
    ],
    translations: {
      hi: {
        name: "गेहूं",
        season: "सर्दियों (रबी)",
        description: "गेहूं एक ठंडे मौसम की अनाज की फसल है जिसे पकने के दौरान सूखे, चमकीले दिनों की आवश्यकता होती है।",
        steps: [
          { title: "खेत की तैयारी", desc: "इष्टतम संपर्क के लिए एक महीन, खरपतवार मुक्त क्यारी सुनिश्चित करें।" },
          { title: "पंक्ति बुवाई", desc: "सीड ड्रिल का उपयोग करके 4-5 सेमी गहराई पर 20-22 सेमी पंक्ति दूरी पर बोएं।" },
          { title: "मुकुट जड़ सिंचाई", desc: "बुवाई के 21 दिन बाद सबसे महत्वपूर्ण पानी का समय है (CRI चरण)।" },
          { title: "कटाई", desc: "जब दाने कड़े और सूखे हों (नमी 15% से कम) तो कटाई करें।" }
        ]
      },
      mr: {
        name: "गहू",
        season: "हिवाळा (रब्बी)",
        description: "गहू हे थंड हवामानातील पीक असून दाणे भरताना भरपूर सूर्यप्रकाशाची गरज असते.",
        steps: [
          { title: "पेरणीपूर्व मशागत", desc: "चांगल्या उगवणीसाठी शेत भुसभुशीत आणि तणमुक्त करून घ्या." },
          { title: "ओळीत पेरणी", desc: "सीड ड्रिलने २२.५ सेमी अंतरावर आणि ४-५ सेमी खोलीवर पेरणी करा." },
          { title: "मुकुट मूळ अवस्था", desc: "पेरणीनंतर २१ दिवसांनी पहिली महत्त्वाची सिंचनाची पाळी द्या." },
          { title: "काढणी", desc: "दाणे कडक व सुकल्यावर (ओलावा १५% पेक्षा कमी असताना) कापणी करा." }
        ]
      },
      pa: {
        name: "ਕਣਕ",
        season: "ਸਰਦੀ (ਹਾੜ੍ਹੀ)",
        description: "ਕਣਕ ਸਰਦੀ ਰੁੱਤ ਦੀ ਅਨਾਜ ਫਸਲ ਹੈ ਜਿਸ ਨੂੰ ਪੱਕਣ ਸਮੇਂ ਖੁਸ਼ਕ ਅਤੇ ਤੇਜ਼ ਧੁੱਪ ਵਾਲੇ ਦਿਨਾਂ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।",
        steps: [
          { title: "ਖੇਤ ਤਿਆਰ ਕਰਨਾ", desc: "ਬੀਜ ਦੀ ਚੰਗੀ ਉਗਣ ਸ਼ਕਤੀ ਲਈ ਖੇਤ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਵਾਹ ਕੇ ਤਿਆਰ ਕਰੋ।" },
          { title: "ਲਾਈਨਾਂ ਵਿੱਚ ਬਿਜਾਈ", desc: "ਸੀਡ ਡਰਿੱਲ ਰਾਹੀਂ 4-5 ਸੈਂਟੀਮੀਟਰ ਡੂੰਘਾ ਅਤੇ 20-22 ਸੈਂਟੀਮੀਟਰ ਦੀ ਦੂਰੀ 'ਤੇ ਬੀਜੋ।" },
          { title: "ਪਹਿਲਾ ਪਾਣੀ (ਕੋਰ ਪਾਣੀ)", desc: "ਬਿਜਾਈ ਤੋਂ 21 ਦਿਨਾਂ ਬਾਅਦ ਪਹਿਲਾ ਪਾਣੀ ਦੇਣਾ ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਹੁੰਦਾ ਹੈ।" },
          { title: "ਕਟਾਈ", desc: "ਜਦੋਂ ਦਾਣਾ ਸਖਤ ਅਤੇ ਸੁੱਕ ਜਾਵੇ (ਨਮੀ 15% ਤੋਂ ਘੱਟ ਹੋਵੇ) ਤਾਂ ਕਟਾਈ ਕਰੋ।" }
        ]
      }
    }
  },
  {
    id: "cucumber_greenhouse",
    name: "Off-Season Cucumber",
    type: "off-season",
    season: "Monsoon Polyhouse (Off-Season)",
    image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetable-plantation-in-greenhouse-38891-large.mp4",
    videoLength: "3:45",
    description: "Growing high-value hybrid cucumbers in polyhouses during heavy rains protects yields and earns premium rates.",
    soilType: "Sandy Loam + Coco peat",
    waterLevel: "Low (Drip system)",
    steps: [
      { title: "Polyhouse Setup", desc: "Maintain 25-30°C temperature and 60-70% humidity using shade nets." },
      { title: "Drip & Fertigation", desc: "Set up drip emitters and supply soluble N-P-K once every 3 days." },
      { title: "Trellis Training", desc: "Train cucumber vines vertically using nylon strings attached to the frame." },
      { title: "Pruning & Pollination", desc: "Remove lateral shoots up to 5th node. Use self-pollinating seed varieties." }
    ],
    translations: {
      hi: {
        name: "गैर-मौसमी खीरा (पॉलीहाउस)",
        season: "मानसून पॉलीहाउस (गैर-मौसमी)",
        description: "भारी बारिश के दौरान पॉलीहाउस में हाइब्रिड खीरा उगाने से फसल सुरक्षित रहती है और बाजार में अधिक दाम मिलते हैं।",
        steps: [
          { title: "पॉलीहाउस सेटअप", desc: "शेड नेट का उपयोग करके 25-30 डिग्री सेल्सियस तापमान बनाए रखें।" },
          { title: "ड्रिप और फर्टिगेशन", desc: "ड्रिप उत्सर्जक स्थापित करें और हर 3 दिन में घुलनशील खाद पानी दें।" },
          { title: "ट्रेली ट्रेंनिंग", desc: "नायलॉन के धागों का उपयोग करके खीरे की बेलों को लंबवत रूप से प्रशिक्षित करें।" },
          { title: "छंतनी", desc: "5वें नोड तक की पार्श्व शाखाओं को हटा दें। स्व-परागण वाली किस्मों का उपयोग करें।" }
        ]
      },
      mr: {
        name: "बिगर-हंगामी काकडी (पॉलीहाऊस)",
        season: "पावसाळा पॉलीहाऊस (ऑफ-सीझन)",
        description: "मुसळधार पावसात पॉलीहाऊसमध्ये संकरित काकडी घेतल्यास अधिक उत्पादन मिळते व बाजारात मोठा दर मिळतो.",
        steps: [
          { title: "पॉलीहाऊस उभारणी", desc: "शेडनेट वापरून २५-३० अंश सेल्सिअस तापमान आणि ६०-७०% आर्द्रता राखा." },
          { title: "ठिबक व विद्रव्य खते", desc: "ठिबक संच जोडून दर ३ दिवसांनी विद्रव्य खते (फर्टिगेशन) द्यावीत." },
          { title: "वेल वर चढवणे", desc: "नायलॉन दोऱ्यांच्या सहाय्याने काकडीचा वेल सरळ उभ्या पद्धतीने वर चढवा." },
          { title: "छाटणी", desc: "५ व्या पानापर्यंतच्या फुटव्यांची छाटणी करा. स्व-परागकण वाणांचा वापर करा." }
        ]
      },
      pa: {
        name: "ਬੇਮੌਸਮੀ ਖੀਰਾ (ਪੌਲੀਹਾਊਸ)",
        season: "ਮਾਨਸੂਨ ਪੌਲੀਹਾਊਸ (ਬੇਮੌਸਮੀ)",
        description: "ਭਾਰੀ ਮੀਂਹ ਦੌਰਾਨ ਪੌਲੀਹਾਊਸ ਵਿੱਚ ਹਾਈਬ੍ਰਿਡ ਖੀਰਾ ਉਗਾਉਣ ਨਾਲ ਫਸਲ ਸੁਰੱਖਇਤ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਚੰਗੇ ਭਾਅ ਮਿਲਦੇ ਹਨ।",
        steps: [
          { title: "ਪੌਲੀਹਾਊਸ ਸੈੱਟਅੱਪ", desc: "ਸ਼ੇਡ ਨੈੱਟ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਤਾਪਮਾਨ 25-30 ਡਿਗਰੀ ਅਤੇ ਨਮੀ 60-70% ਰੱਖੋ।" },
          { title: "ਡ੍ਰਿਪ ਤੇ ਫਰਟੀਗੇਸ਼ਨ", desc: "ਡ੍ਰਿਪ ਸਿਸਟਮ ਲਗਾਓ ਅਤੇ ਹਰ 3 ਦਿਨਾਂ ਬਾਅਦ ਘੁਲਣਸ਼ੀਲ ਖਾਦ ਪਾਣੀ ਦਿਓ।" },
          { title: "ਵੇਲਾਂ ਚੜ੍ਹਾਉਣਾ", desc: "ਖੀਰੇ ਦੀਆਂ ਵੇਲਾਂ ਨੂੰ ਨਾਈਲੋਨ ਦੀਆਂ ਰੱਸੀਆਂ ਨਾਲ ਉੱਪਰ ਵੱਲ ਚੜ੍ਹਾਓ।" },
          { title: "ਛਾਂਟੀ", desc: "5ਵੇਂ ਪੱਤੇ ਤੱਕ ਦੇ ਵਾਧੂ ਫੁਟਾਰੇ ਕੱਟ ਦਿਓ। ਸਵੈ-ਪਰਾਗਣ ਵਾਲੀ ਕਿਸਮ ਦੀ ਵਰਤੋਂ ਕਰੋ।" }
        ]
      }
    }
  },
  {
    id: "offseason_tomato",
    name: "Hydroponic Cherry Tomato",
    type: "off-season",
    season: "Summer Controlled Sowing (Off-Season)",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ripe-tomatoes-growing-in-a-greenhouse-38890-large.mp4",
    videoLength: "6:15",
    description: "Soothes hot summers by raising premium cherry tomatoes inside automated misting greenhouses.",
    soilType: "Rockwool / Coco peat slabs",
    waterLevel: "Very Low (Recirculated Nutrient Film)",
    steps: [
      { title: "EC & pH Balancing", desc: "Maintain water EC at 2.0-2.5 mS/cm and pH between 5.8 to 6.2 strictly." },
      { title: "Dutch Bucket Support", desc: "Place seedlings in Dutch buckets with perlite for structural root aeration." },
      { title: "Misting Cooling", desc: "Operate overhead foggers for 30 seconds every 15 minutes during noon peaks." },
      { title: "Staggered Pickings", desc: "Harvest ripe clusters twice a week. Leaves a long shelf life." }
    ],
    translations: {
      hi: {
        name: "हाइड्रोपोनिक चेरी टमाटर",
        season: "गर्मियों में नियंत्रित बुवाई (गैर-मौसमी)",
        description: "स्वचालित मिस्टिंग ग्रीनहाउस के अंदर प्रीमियम चेरी टमाटर उगाकर अत्यधिक गर्मी में भी बड़ा मुनाफा कमाएं।",
        steps: [
          { title: "pH और EC संतुलन", desc: "पानी का pH 5.8-6.2 और EC 2.0-2.5 के बीच सख्ती से बनाए रखें।" },
          { title: "डच बकेट सेटअप", desc: "जड़ों के वायु संचार के लिए पौधों को पर्लाइट से भरे डच बकेट में रखें।" },
          { title: "फॉगिंग कूलिंग", desc: "दोपहर की गर्मी में हर 15 मिनट में 30 सेकंड के लिए फॉगर्स चलाएं।" },
          { title: "नियमित तुड़ाई", desc: "सप्ताह में दो बार पके चेरी टमाटर के गुच्छों की तुड़ाई करें।" }
        ]
      },
      mr: {
        name: "हायड्रोपोनिक चेरी टोमॅटो",
        season: "उन्हाळी नियंत्रित शेती (ऑफ-सीझन)",
        description: "उन्हाळ्यात नियंत्रित तापमानात चेरी टोमॅटोची हायड्रोपोनिक शेती करून शाश्वत व प्रचंड नफा मिळवा.",
        steps: [
          { title: "pH आणि EC व्यवस्थापन", desc: "पाण्याचा pH ५.८ ते ६.२ आणि खताचे प्रमाण (EC) २.० ते २.५ पर्यंत संतुलित ठेवा." },
          { title: "डच बकेट रचना", desc: "पर्लाइट भरलेल्या डच बकेटमध्ये रोपे लावून मुळांना ऑक्सिजन पुरवा." },
          { title: "मिस्टिंग फॉगर्स", desc: "दुपारी कडक उन्हात दर १५ मिनिटांनी ३० सेकंदांसाठी फॉगर्स सुरू ठेवा." },
          { title: "टप्प्याटप्प्याने काढणी", desc: "आठवड्यातून दोनदा पिकलेले घोस काढून बाजारात पाठवा." }
        ]
      },
      pa: {
        name: "ਹਾਈਡ੍ਰੋਪੋਨਿਕ ਚੈਰੀ ਟਮਾਟਰ",
        season: "ਗਰਮੀਆਂ ਨਿਯੰਤਰਿਤ ਬਿਜਾਈ (ਬੇਮੌਸਮੀ)",
        description: "ਖਾਸ ਤੌਰ 'ਤੇ ਤਿਆਰ ਕੀਤੇ ਗਏ ਗ੍ਰੀਨਹਾਊਸ ਵਿੱਚ ਹਾਈਡ੍ਰੋਪੋਨਿਕਸ ਰਾਹੀਂ ਚੈਰੀ ਟਮਾਟਰ ਉਗਾ ਕੇ ਗਰਮੀਆਂ ਵਿੱਚ ਵੀ ਭਰਪੂਰ ਲਾਭ ਕਮਾਓ।",
        steps: [
          { title: "EC ਤੇ pH ਸੰਤੁਲਨ", desc: "ਪਾਣੀ ਦਾ pH 5.8-6.2 ਅਤੇ EC 2.0-2.5 ਦੇ ਵਿਚਕਾਰ ਸਖਤੀ ਨਾਲ ਬਣਾਈ ਰੱਖੋ।" },
          { title: "ਡੱਚ ਬਾਲਟੀ ਸੈੱਟਅੱਪ", desc: "ਜੜ੍ਹਾਂ ਦੇ ਵਧੀਆ ਵਾਧੇ ਲਈ ਪੌਦਿਆਂ ਨੂੰ ਪਰਲਾਈਟ ਨਾਲ ਭਰੀਆਂ ਡੱਚ ਬਾਲਟੀਆਂ ਵਿੱਚ ਰੱਖੋ।" },
          { title: "ਫੌਗਿੰਗ ਕੂਲਿੰਗ", desc: "ਦੁਪਹਿਰ ਦੀ ਗਰਮੀ ਵਿੱਚ ਹਰ 15 ਮਿੰਟ ਵਿੱਚ 30 ਸੈਕਿੰਡ ਲਈ ਫੌਗਰ ਚਲਾਓ।" },
          { title: "ਨਿਯਮਤ ਤੁੜਾਈ", desc: "ਹਫ਼ਤੇ ਵਿੱਚ ਦੋ ਵਾਰ ਪੱਕੇ ਹੋਏ ਚੈਰੀ ਟਮਾਟਰਾਂ ਦੇ ਗੁੱਛੇ ਤੋੜੋ।" }
        ]
      }
    }
  },
  {
    id: "cotton",
    name: "Organic Cotton",
    type: "seasonal",
    season: "Monsoon (Kharif)",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-in-a-rice-field-41551-large.mp4",
    videoLength: "4:50",
    description: "Cotton thrives in warm climates with black soil, requiring monitored square formation and pest trapping.",
    soilType: "Deep Black Cotton Soil",
    waterLevel: "Medium (Drip / Furrow)",
    steps: [
      { title: "Deep Tillage", desc: "Plough deeply in summer to expose dormant insect pupae to sun." },
      { title: "Spacing & Sowing", desc: "Sow dibbled seeds at 90x60 cm or 120x45 cm spacing on ridges." },
      { title: "Pest Scouting", desc: "Install pheromone traps to scout for pink bollworm and sucking pests." },
      { title: "Defoliation & Picking", desc: "Pick fully opened, dry bolls in clean cotton bags during dry afternoons." }
    ],
    translations: {
      hi: {
        name: "कपास (कपास की खेती)",
        season: "मानसून (खरीफ)",
        description: "काली मिट्टी और गर्म जलवायु में कपास की फसल बंपर मुनाफा देती है।",
        steps: [
          { title: "गहरी जुताई", desc: "गर्मियों में गहरी जुताई करें ताकि कीटों के प्यूपा नष्ट हो जाएं।" },
          { title: "दूरी और बुवाई", desc: "मेड़ों पर 90x60 सेमी की दूरी पर बीजों की बुवाई करें।" },
          { title: "कीट नियंत्रण", desc: "गुलाबी सुंडी के लिए फेरोमोन ट्रैप स्थापित करें।" },
          { title: "चुनाई", desc: "दोपहर में सूखे समय पर पूरी तरह खिले हुए टिंडों की चुनाई करें।" }
        ]
      },
      mr: {
        name: "कापूस शेती",
        season: "पावसाळा (खरीप)",
        description: "काळ्या कसदार जमिनीत योग्य व्यवस्थापनाने दर्जेदार कापूस उत्पादन घेता येते.",
        steps: [
          { title: "उन्हाळी नांगरणी", desc: "उन्हाळ्यात खोल नांगरट करून किडींचे कोष नष्ट करा." },
          { title: "पेरणी अंतर", desc: "९०x६० किंवा १२०x४५ सेमी अंतरावर सरी-वरंब्यावर टोकण पद्धतीने बियाणे लावा." },
          { title: "कामगंध सापळे", desc: "बोंडअळीच्या नियंत्रणासाठी हेक्टरी ५ कामगंध सापळे लावा." },
          { title: "वेचणी", desc: "दुपारच्या कोरड्या हवेत पूर्ण उमललेल्या बोंडांची स्वच्छ वेचणी करा." }
        ]
      },
      pa: {
        name: "ਨਰਮਾ / ਕਪਾਹ",
        season: "ਮਾਨਸੂਨ (ਖਰੀਫ)",
        description: "ਕਪਾਹ ਗਰਮ ਜਲਵਾਯੂ ਵਿੱਚ ਕਾਲੀ ਤੇ ਦੋਮਟ ਮਿੱਟੀ ਵਿੱਚ ਉੱਤਮ ਝਾੜ ਦਿੰਦੀ ਹੈ।",
        steps: [
          { title: "ਡੂੰਘੀ ਵਾਹੀ", desc: "ਗਰਮੀਆਂ ਵਿੱਚ ਡੂੰਘੀ ਵਾਹੀ ਕਰੋ ਤਾਂ ਜੋ ਕੀੜੇ ਖਤਮ ਹੋ ਜਾਣ।" },
          { title: "ਬਿਜਾਈ ਦੂਰੀ", desc: "90x60 ਸੈਂਟੀਮੀਟਰ ਦੀ ਦੂਰੀ 'ਤੇ ਕਤਾਰਾਂ ਵਿੱਚ ਬੀਜੋ।" },
          { title: "ਸੁੰਡੀ ਦੀ ਰੋਕਥਾਮ", desc: "ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਨਿਗਰਾਨੀ ਲਈ ਫੇਰੋਮੋਨ ਟਰੈਪ ਲਗਾਓ।" },
          { title: "ਚੁਗਾਈ", desc: "ਖਿੜੇ ਹੋਏ ਟੀਂਡਿਆਂ ਦੀ ਚੁਗਾਈ ਦੁਪਹਿਰ ਸਮੇਂ ਸੁੱਕੇ ਮੌਸਮ ਵਿੱਚ ਕਰੋ।" }
        ]
      }
    }
  },
  {
    id: "sweet_corn",
    name: "Golden Sweet Corn",
    type: "seasonal",
    season: "Round-the-year / Summer",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wheat-field-under-a-blue-sky-41552-large.mp4",
    videoLength: "4:10",
    description: "Short duration, high-demand cash crop fetching swift returns in urban fresh vegetable markets.",
    soilType: "Well-drained Loamy Soil",
    waterLevel: "Moderate (Knee-high to tasseling)",
    steps: [
      { title: "Bed Preparation", desc: "Add generous compost or FYM to ensure friable, moist soil." },
      { title: "Line Sowing", desc: "Maintain 60 cm between rows and 20 cm plant-to-plant." },
      { title: "Critical Irrigation", desc: "Ensure steady moisture during silking and cob filling stages." },
      { title: "Morning Harvest", desc: "Harvest cobs when silks turn brown and kernels burst with milky sap." }
    ],
    translations: {
      hi: {
        name: "स्वीट कॉर्न (मीठा भुट्टा)",
        season: "वर्षभर / ग्रीष्मकालीन",
        description: "कम समय में तैयार होने वाली नकदी फसल जो शहरी बाजारों में हाथों-हाथ बिकती है।",
        steps: [
          { title: "खेत की तैयारी", desc: "मिट्टी में अच्छी सड़ी हुई गोबर की खाद मिलाएं।" },
          { title: "पंक्ति में बुवाई", desc: "पंक्तियों के बीच 60 सेमी और पौधों के बीच 20 सेमी की दूरी रखें।" },
          { title: "समय पर पानी", desc: "सिल्किंग और दाना भरने की अवस्था में पानी की कमी न होने दें।" },
          { title: "ताजी तुड़ाई", desc: "सुबह के समय जब बालियां दूधिया रस से भरी हों, तब तुड़ाई करें।" }
        ]
      },
      mr: {
        name: "गोड मका (स्वीट कॉर्न)",
        season: "बारमाही / उन्हाळी",
        description: "कमी कालावधीत भरघोस नफा देणारे आणि शहरांमध्ये भरपूर मागणी असलेले पीक.",
        steps: [
          { title: "जमीन मशागत", desc: "चांगले कुजलेले शेणखत मिसळून जमीन भुसभुशीत करा." },
          { title: "ओळीत टोकण", desc: "दोन ओळीत ६० सेमी आणि दोन रोपांत २० सेमी अंतर ठेवून बियाणे टोका." },
          { title: "तुरा येताना पाणी", desc: "कणसात दाणे भरण्याच्या आणि तुरा येण्याच्या नाजूक टप्प्यावर पाण्याचा ताण पडू देऊ नका." },
          { title: "पहाटे काढणी", desc: "कणीस दुधाळ अवस्थेत असताना पहाटेच्या वेळी तोडणी करा." }
        ]
      },
      pa: {
        name: "ਸਵੀਟ ਕੌਰਨ (ਮਿੱਠੀ ਛੱਲੀ)",
        season: "ਸਾਰਾ ਸਾਲ / ਗਰਮੀਆਂ",
        description: "ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਤਿਆਰ ਹੋਣ ਵਾਲੀ ਫਸਲ ਜੋ ਬਾਜ਼ਾਰ ਵਿੱਚ ਵਧੀਆ ਮੁਨਾਫਾ ਦਿੰਦੀ ਹੈ।",
        steps: [
          { title: "ਜ਼ਮੀਨ ਤਿਆਰੀ", desc: "ਖੇਤ ਵਿੱਚ ਚੰਗੀ ਤਰ੍ਹਾਂ ਰੂੜੀ ਦੀ ਖਾਦ ਪਾ ਕੇ ਜ਼ਮੀਨ ਤਿਆਰ ਕਰੋ।" },
          { title: "ਕਤਾਰ ਬਿਜਾਈ", desc: "ਕਤਾਰਾਂ ਵਿੱਚ 60 ਸੈਂਟੀਮੀਟਰ ਅਤੇ ਬੂਟਿਆਂ ਵਿੱਚ 20 ਸੈਂਟੀਮੀਟਰ ਫਾਸਲਾ ਰੱਖੋ।" },
          { title: "ਸਹੀ ਸਮੇਂ ਸਿੰਚਾਈ", desc: "ਛੱਲੀ ਵਿੱਚ ਦਾਣੇ ਭਰਨ ਸਮੇਂ ਪਾਣੀ ਦੀ ਘਾਟ ਨਾ ਆਉਣ ਦਿਓ।" },
          { title: "ਸਵੇਰੇ ਤੁੜਾਈ", desc: "ਜਦੋਂ ਦਾਣਿਆਂ ਵਿੱਚ ਦੁੱਧ ਭਰ ਜਾਵੇ ਤਾਂ ਸਵੇਰੇ ਤਾਜ਼ੀਆਂ ਛੱਲੀਆਂ ਤੋੜੋ।" }
        ]
      }
    }
  }
];

interface CropAcademyProps {
  preferredLanguage?: string;
}

export default function CropAcademy({ preferredLanguage: propLang }: CropAcademyProps) {
  const { t, language: contextLang, isBilingual, b } = useLanguage();
  const currentLang = propLang || contextLang || "en";
  const ac = t.academy;

  const [filterType, setFilterType] = useState<"all" | "seasonal" | "off-season">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideoGuide, setActiveVideoGuide] = useState<CropGuide | null>(null);
  const [playingState, setPlayingState] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const localT = (key: string): string => {
    switch (key) {
      case "Crop Academy": return ac.title;
      case "Grow seasonal and off-season crops with step-by-step video lessons.": return ac.subtitle;
      case "Search crop guides...": return ac.searchPlaceholder;
      case "All Guides": return ac.allGuides;
      case "Seasonal Crops": return ac.seasonalCrops;
      case "Off-Season Crops": return ac.offSeasonCrops;
      case "Soil:": return ac.soil;
      case "Watering:": return ac.watering;
      case "View Sowing Steps": return ac.viewSteps;
      case "Watch Lesson": return ac.watchLesson;
      case "Sowing & Harvesting Steps": return ac.sowingSteps;
      case "Video Tutorial Lesson": return ac.videoTutorial;
      case "Step": return ac.step;
      case "Close": return t.common.close;
      case "Soil Context:": return ac.soil;
      case "Irrigation:": return ac.watering;
      default: return key;
    }
  };

  const getLocalizedCrop = (guide: CropGuide) => {
    const local = guide.translations[currentLang] || (currentLang === "bho" ? guide.translations["hi"] : undefined);
    return {
      ...guide,
      name: local?.name || guide.name,
      season: local?.season || guide.season,
      description: local?.description || guide.description,
      steps: local?.steps || guide.steps
    };
  };

  const filteredGuides = CROP_GUIDES_DATA.filter((guide) => {
    const loc = getLocalizedCrop(guide);
    const matchesType = filterType === "all" || guide.type === filterType;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenVideo = (guide: CropGuide) => {
    setActiveVideoGuide(guide);
    setPlayingState(true);
    setPlaybackTime(10); // Start at 10 seconds simulation
  };

  const handleCloseVideo = () => {
    setActiveVideoGuide(null);
    setPlayingState(false);
  };

  return (
    <div className="space-y-6" id="crop-academy-module">
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        {/* Decorative crop design */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-12 translate-y-12">
          <Layers className="w-80 h-80 text-emerald-300" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest block w-max mb-2">
            Seasonal smarts & training
          </span>
          <h2 className="text-2xl font-black tracking-tight">{b("Crop Academy", ac.title)}</h2>
          <div className="text-emerald-100 text-xs mt-1.5 leading-relaxed">
            {b("Grow seasonal and off-season crops with step-by-step video lessons.", ac.subtitle)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white border rounded-2xl p-3.5 shadow-xs">
        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterType === "all" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {b("All Guides", ac.allGuides)}
          </button>
          <button
            onClick={() => setFilterType("seasonal")}
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterType === "seasonal" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {b("Seasonal Crops", ac.seasonalCrops)}
          </button>
          <button
            onClick={() => setFilterType("off-season")}
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterType === "off-season" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {b("Off-Season Crops", ac.offSeasonCrops)}
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={bString("Search crop guides...", ac.searchPlaceholder, isBilingual)}
          className="w-full md:w-64 p-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 text-xs text-slate-700"
        />
      </div>

      {/* Crop Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => {
          const loc = getLocalizedCrop(guide);
          return (
            <div 
              key={guide.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col group"
              id={`crop-academy-card-${guide.id}`}
            >
              {/* Crop Image & Play Trigger */}
              <div className="aspect-video w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={guide.image} 
                  alt={loc.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/25 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleOpenVideo(guide)}
                    className="p-4 bg-emerald-500/90 hover:bg-emerald-500 hover:scale-110 text-white rounded-full shadow-lg transition-all flex items-center justify-center border-4 border-white/30 backdrop-blur-xs cursor-pointer"
                    title="Watch tutorial video lesson"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>
                </div>
                {/* Labels */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider ${
                    guide.type === "seasonal" ? "bg-emerald-600" : "bg-teal-600"
                  }`}>
                    {guide.type === "seasonal" ? "Seasonal" : "Off-Season Smarts"}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
                    ⏱ {guide.videoLength} Video Lesson
                  </span>
                </div>
              </div>

              {/* Crop Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-extrabold text-slate-800">
                      <Bi en={guide.name} sub={loc.name} />
                    </h3>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      <Bi en={guide.season} sub={loc.season} />
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <Bi en={guide.description} sub={loc.description} />
                  </div>
                </div>

                {/* Specific metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[10px]">
                  <div>
                    <span className="text-slate-400 block">{b("Soil:", ac.soil)}</span>
                    <span className="font-bold text-slate-700">{guide.soilType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{b("Watering:", ac.watering)}</span>
                    <span className="font-bold text-slate-700">{guide.waterLevel}</span>
                  </div>
                </div>

                {/* Steps Accordion / Details */}
                <div className="space-y-2.5 border-t pt-3.5">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {b("Sowing & Harvesting Steps", ac.sowingSteps)}
                  </h4>
                  
                  <div className="space-y-2">
                    {loc.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[9px] mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-700 block text-[11px]">
                            <Bi en={guide.steps[idx]?.title || step.title} sub={step.title} />
                          </span>
                          <span className="text-slate-500 text-[10px] leading-relaxed block">
                            <Bi en={guide.steps[idx]?.desc || step.desc} sub={step.desc} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lesson Link */}
                <button
                  onClick={() => handleOpenVideo(guide)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 rounded-xl transition-all cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{b("Watch Lesson", ac.watchLesson)} ({guide.videoLength})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Overlay Modal */}
      {activeVideoGuide && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-800 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Video className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-widest">{localT("Video Tutorial Lesson")}</h4>
                  <p className="text-xs text-white font-extrabold">{getLocalizedCrop(activeVideoGuide).name} Lessons</p>
                </div>
              </div>
              <button
                onClick={handleCloseVideo}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Interactive Video Frame */}
            <div className="aspect-video w-full bg-black relative group overflow-hidden">
              <video 
                src={activeVideoGuide.videoUrl} 
                autoPlay 
                loop 
                muted 
                controls={false}
                className="w-full h-full object-cover"
              />
              
              {/* Playback Simulation HUD */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-1 rounded-full font-bold">
                    🔴 LOCALIZED SUBTITLES AUTO-ON
                  </span>
                  <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-1 rounded font-bold">
                    HD 1080p
                  </span>
                </div>

                {/* Subtitles Overlay */}
                <div className="self-center bg-black/75 px-4 py-2 rounded-xl text-center text-xs text-emerald-300 font-medium max-w-md border border-emerald-500/10 leading-relaxed shadow-lg">
                  🚜 "{getLocalizedCrop(activeVideoGuide).steps[0]?.title}: {getLocalizedCrop(activeVideoGuide).steps[0]?.desc}"
                </div>

                {/* Custom Video Controls bar */}
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xs p-2.5 rounded-xl border border-white/5">
                  <button className="p-1 bg-emerald-500 text-white rounded-md">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </button>
                  
                  {/* Progress track */}
                  <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-[35%] h-full bg-emerald-500 rounded-full" />
                  </div>

                  <span className="text-[10px] font-mono text-slate-300">01:15 / {activeVideoGuide.videoLength}</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Steps sidebar within modal */}
            <div className="p-5 space-y-3.5 bg-slate-950">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Info className="w-4 h-4 text-emerald-400" />
                Lesson Outline & steps:
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {getLocalizedCrop(activeVideoGuide).steps.map((step, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-400 block text-[11px] mb-0.5">
                      {localT("Step")} {idx + 1}: {step.title}
                    </span>
                    <p className="text-slate-400 text-[10px] leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
