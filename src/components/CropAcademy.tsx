import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Play,
  Video,
  Layers,
  X,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Globe,
  Milk,
  Feather,
  Fish,
  Sun,
  Shield,
  Circle,
  RefreshCw,
  Search,
  Maximize2,
  Minimize2
} from "lucide-react";

interface CropStep {
  title: string;
  desc: string;
}

interface LessonVideoItem {
  id: string;
  lessonId: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  title: string;
  description: string;
  language: string;
  durationSeconds: number;
  thumbnailUrl: string;
  isPrimary: boolean;
}

interface LessonItem {
  id: string;
  title: string;
  titleEn: string;
  videoUrl?: string;
  videoDuration?: string;
  content?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  steps?: CropStep[];
  videos?: LessonVideoItem[];
}

interface CourseModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

interface AcademyCardData {
  id: string;
  courseId: string;
  categoryId: string;
  categoryCode: "crops" | "dairy" | "sheep" | "goat" | "poultry" | "pig" | "beekeeping" | "fisheries" | "integrated";
  name: string;
  type: "seasonal" | "off-season" | "livestock";
  season?: string;
  image: string;
  imageAlt?: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  videoLength: string;
  description: string;
  soilType?: string;
  waterLevel?: string;
  modules: CourseModuleItem[];
  steps: CropStep[];
  translations: Record<string, {
    name: string;
    season?: string;
    description: string;
    steps?: CropStep[];
  }>;
}

// Master Academy Data with Real Verified YouTube Lessons
const MASTER_ACADEMY_DATA: AcademyCardData[] = [
  // 1. RICE (PADDY)
  {
    id: "rice",
    courseId: "course-rice-1",
    categoryId: "cat-crops",
    categoryCode: "crops",
    name: "Rice (Paddy)",
    type: "seasonal",
    season: "Monsoon (Kharif)",
    image: "/images/academy/rice.jpg",
    imageAlt: "Flooded terraced paddy fields for rice cultivation",
    youtubeVideoId: "-eBrAm64fpg",
    youtubeUrl: "https://www.youtube.com/watch?v=-eBrAm64fpg",
    videoLength: "3:52",
    description: "Paddy is a water-intensive staple crop ideal for clayey and loamy water-retentive soils.",
    soilType: "Clayey / Silty Loam",
    waterLevel: "High (Flooding)",
    steps: [
      { title: "Nursery Sowing", desc: "Sow seeds in a raised nursery bed 25-30 days before transplanting." },
      { title: "Field Puddling", desc: "Plough and puddle the main field with 5-10cm of standing water." },
      { title: "Transplanting", desc: "Transplant 2-3 saplings per hill at a depth of 2-3 cm with spacing." },
      { title: "Water Management", desc: "Maintain continuous shallow flooding (5cm) until 15 days before harvest." }
    ],
    modules: [
      {
        id: "mod-rice-1",
        title: "Nursery & Field Preparation",
        lessons: [
          {
            id: "les-rice-1",
            title: "Paddy Nursery Preparation & Seed Treatment",
            titleEn: "Paddy Nursery Preparation & Seed Treatment",
            videoUrl: "https://www.youtube.com/watch?v=-eBrAm64fpg",
            youtubeVideoId: "-eBrAm64fpg",
            youtubeUrl: "https://www.youtube.com/watch?v=-eBrAm64fpg",
            thumbnailUrl: "https://img.youtube.com/vi/-eBrAm64fpg/maxresdefault.jpg",
            videoDuration: "3:52",
            content: "Raise healthy paddy seedlings in raised beds with carbendazim seed treatment to prevent blast.",
            steps: [
              { title: "Raised Bed Nursery", desc: "Prepare 1m wide raised beds with adequate drainage channels." },
              { title: "Fungicide Seed Treatment", desc: "Treat seed with Carbendazim 2g/kg seed before sprouting." }
            ]
          },
          {
            id: "les-rice-2",
            title: "Field Puddling & System of Rice Intensification (SRI)",
            titleEn: "Field Puddling & System of Rice Intensification (SRI)",
            videoUrl: "https://www.youtube.com/watch?v=id5LgdTMCtE",
            youtubeVideoId: "id5LgdTMCtE",
            youtubeUrl: "https://www.youtube.com/watch?v=id5LgdTMCtE",
            thumbnailUrl: "https://img.youtube.com/vi/id5LgdTMCtE/maxresdefault.jpg",
            videoDuration: "8:42",
            content: "Learn scientific puddle preparation and single-seedling SRI planting.",
            steps: [
              { title: "Puddling Main Field", desc: "Plough twice with standing water to create an impermeable soil layer." },
              { title: "SRI Square Planting", desc: "Transplant 8-12 day young seedlings with 25cm x 25cm square spacing." }
            ]
          }
        ]
      },
      {
        id: "mod-rice-2",
        title: "Water, Nutrients & Harvesting",
        lessons: [
          {
            id: "les-rice-3",
            title: "Water, Fertilizer & Pest Management in Paddy",
            titleEn: "Water, Fertilizer & Pest Management in Paddy",
            videoUrl: "https://www.youtube.com/watch?v=4-PW4NrLNRk",
            youtubeVideoId: "4-PW4NrLNRk",
            youtubeUrl: "https://www.youtube.com/watch?v=4-PW4NrLNRk",
            thumbnailUrl: "https://img.youtube.com/vi/4-PW4NrLNRk/maxresdefault.jpg",
            videoDuration: "15:10",
            content: "Maintain continuous shallow flooding and apply balanced N-P-K at panicle initiation.",
            steps: [
              { title: "Shallow Flooding", desc: "Keep 2-5cm water layer during tillering and flowering stages." },
              { title: "Split Urea Application", desc: "Apply Nitrogen in 3 splits: basal, tillering, and panicle initiation." }
            ]
          },
          {
            id: "les-rice-4",
            title: "Paddy Harvesting & Moisture Testing",
            titleEn: "Paddy Harvesting & Moisture Testing",
            videoUrl: "https://www.youtube.com/watch?v=-eBrAm64fpg",
            youtubeVideoId: "-eBrAm64fpg",
            youtubeUrl: "https://www.youtube.com/watch?v=-eBrAm64fpg",
            thumbnailUrl: "https://img.youtube.com/vi/-eBrAm64fpg/maxresdefault.jpg",
            videoDuration: "3:52",
            content: "Harvest at 18-20% grain moisture to prevent shattering losses.",
            steps: [
              { title: "Optimal Cutting Time", desc: "Harvest when 80-85% of grains in the panicle turn golden straw color." },
              { title: "Sun Drying", desc: "Dry threshed grains on clean tarpaulins to 12-14% moisture for safe storage." }
            ]
          }
        ]
      }
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
      bho: {
        name: "धान (चाउर)",
        season: "मानसून (खरीफ)",
        description: "धान पानी वाला मुख्य फसल ह, जे दोमट आ चिकनी माटी खातिर सबसे बढ़िया होला।",
        steps: [
          { title: "नर्सरी बुवाई", desc: "रोपाई से 25 दिन पहिले बीया के क्यारी में बोईं।" },
          { title: "खेत के कादो", desc: "खेत में पानी भर के बढ़िया से कादो तैयार करीं।" },
          { title: "रोपाई", desc: "2-3 पौधा एक जगह 2-3 सेमी गहराई पर रोपीं।" },
          { title: "पानी के ध्यान", desc: "कटाई से 15 दिन पहिले तक खेत में पानी बनवले रहीं।" }
        ]
      }
    }
  },

  // 2. WHEAT
  {
    id: "wheat",
    courseId: "course-wheat-1",
    categoryId: "cat-crops",
    categoryCode: "crops",
    name: "Wheat",
    type: "seasonal",
    season: "Winter (Rabi)",
    image: "/images/academy/wheat.jpg",
    imageAlt: "Golden ripe wheat crops in sunny farm field",
    youtubeVideoId: "JN0ICendQns",
    youtubeUrl: "https://www.youtube.com/watch?v=JN0ICendQns",
    videoLength: "6:37",
    description: "Wheat is a cool-season grain crop requiring dry, bright days during maturity.",
    soilType: "Clayey Loam / Sandy Loam",
    waterLevel: "Medium (4-6 irrigations)",
    steps: [
      { title: "Field Preparation", desc: "Ensure a fine, weed-free seedbed for optimal seed-to-soil contact." },
      { title: "Sowing in Rows", desc: "Sow using a seed drill at 4-5 cm depth with 20-22 cm row spacing." },
      { title: "Crown Root Irrigation", desc: "First irrigation at 21 days after sowing is the most critical (CRI stage)." },
      { title: "Harvesting", desc: "Harvest when grains are hard and dry (moisture content below 15%)." }
    ],
    modules: [
      {
        id: "mod-wheat-1",
        title: "Seedbed & Sowing",
        lessons: [
          {
            id: "les-wheat-1",
            title: "Wheat Seedbed Preparation & Line Sowing",
            titleEn: "Wheat Seedbed Preparation & Line Sowing",
            videoUrl: "https://www.youtube.com/watch?v=JN0ICendQns",
            youtubeVideoId: "JN0ICendQns",
            youtubeUrl: "https://www.youtube.com/watch?v=JN0ICendQns",
            thumbnailUrl: "https://img.youtube.com/vi/JN0ICendQns/maxresdefault.jpg",
            videoDuration: "6:37",
            content: "Fine seedbed preparation and 20-22 cm row spacing using seed drill.",
            steps: [
              { title: "Seedbed Tillage", desc: "Plough field 2-3 times followed by planking for fine tilt." },
              { title: "Line Sowing", desc: "Use seed-cum-fertilizer drill at 4-5 cm depth." }
            ]
          }
        ]
      },
      {
        id: "mod-wheat-2",
        title: "CRI Stage & Harvest",
        lessons: [
          {
            id: "les-wheat-2",
            title: "CRI Crown Root Irrigation & Nutrient Management",
            titleEn: "CRI Crown Root Irrigation & Nutrient Management",
            videoUrl: "https://www.youtube.com/watch?v=G1nL_mFLn-A",
            youtubeVideoId: "G1nL_mFLn-A",
            youtubeUrl: "https://www.youtube.com/watch?v=G1nL_mFLn-A",
            thumbnailUrl: "https://img.youtube.com/vi/G1nL_mFLn-A/maxresdefault.jpg",
            videoDuration: "7:16",
            content: "Critical first irrigation at 21 days after sowing with top dressing of urea.",
            steps: [
              { title: "Crown Root Irrigation", desc: "Irrigate at 20-25 days (CRI stage) when crown roots develop." },
              { title: "First Top Dressing", desc: "Apply remaining 50% Nitrogen after CRI irrigation." }
            ]
          },
          {
            id: "les-wheat-3",
            title: "Wheat Yield Optimization & Harvesting",
            titleEn: "Wheat Yield Optimization & Harvesting",
            videoUrl: "https://www.youtube.com/watch?v=JN0ICendQns",
            youtubeVideoId: "JN0ICendQns",
            youtubeUrl: "https://www.youtube.com/watch?v=JN0ICendQns",
            thumbnailUrl: "https://img.youtube.com/vi/JN0ICendQns/maxresdefault.jpg",
            videoDuration: "6:37",
            content: "Harvest when grains are hard and dry with moisture below 14%.",
            steps: [
              { title: "Grain Hardness Check", desc: "Cut when straw turns yellow and grain cracks between teeth." },
              { title: "Storage Aeration", desc: "Ensure moisture is below 12% before bagging to prevent weevils." }
            ]
          }
        ]
      }
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
      }
    }
  },

  // 3. OFF-SEASON CUCUMBER (POLYHOUSE)
  {
    id: "cucumber_greenhouse",
    courseId: "course-cucumber-1",
    categoryId: "cat-crops",
    categoryCode: "crops",
    name: "Off-Season Cucumber",
    type: "off-season",
    season: "Monsoon Polyhouse (Off-Season)",
    image: "/images/academy/cucumber.jpg",
    imageAlt: "Off-season hybrid cucumbers growing on vertical trellis in polyhouse",
    youtubeVideoId: "wQ5Qr_PL8eU",
    youtubeUrl: "https://www.youtube.com/watch?v=wQ5Qr_PL8eU",
    videoLength: "2:43",
    description: "Growing high-value hybrid cucumbers in polyhouses during heavy rains protects yields and earns premium rates.",
    soilType: "Sandy Loam + Coco peat",
    waterLevel: "Low (Drip system)",
    steps: [
      { title: "Polyhouse Setup", desc: "Maintain 25-30°C temperature and 60-70% humidity using shade nets." },
      { title: "Drip & Fertigation", desc: "Set up drip emitters and supply soluble N-P-K once every 3 days." },
      { title: "Trellis Training", desc: "Train cucumber vines vertically using nylon strings attached to the frame." },
      { title: "Pruning & Pollination", desc: "Remove lateral shoots up to 5th node. Use self-pollinating seed varieties." }
    ],
    modules: [
      {
        id: "mod-cuc-1",
        title: "Polyhouse & Trellis Setup",
        lessons: [
          {
            id: "les-cuc-1",
            title: "Polyhouse Cucumber Setup & Trellis Training",
            titleEn: "Polyhouse Cucumber Setup & Trellis Training",
            videoUrl: "https://www.youtube.com/watch?v=wQ5Qr_PL8eU",
            youtubeVideoId: "wQ5Qr_PL8eU",
            youtubeUrl: "https://www.youtube.com/watch?v=wQ5Qr_PL8eU",
            thumbnailUrl: "https://img.youtube.com/vi/wQ5Qr_PL8eU/maxresdefault.jpg",
            videoDuration: "2:43",
            content: "Vertical nylon wire support and lateral pruning up to 5th node.",
            steps: [
              { title: "Trellis Wire System", desc: "Support vines vertically with UV-stabilized nylon strings." },
              { title: "Bottom Pruning", desc: "Prune lower leaves and shoots up to 45cm height for airflow." }
            ]
          },
          {
            id: "les-cuc-2",
            title: "Drip Fertigation & Soilless Cocopeat Growing",
            titleEn: "Drip Fertigation & Soilless Cocopeat Growing",
            videoUrl: "https://www.youtube.com/watch?v=etI-95vwdgo",
            youtubeVideoId: "etI-95vwdgo",
            youtubeUrl: "https://www.youtube.com/watch?v=etI-95vwdgo",
            thumbnailUrl: "https://img.youtube.com/vi/etI-95vwdgo/maxresdefault.jpg",
            videoDuration: "6:02",
            content: "Soluble NPK fertigation schedule and temperature humidity maintenance.",
            steps: [
              { title: "Water-Soluble NPK", desc: "Supply 19:19:19 during vegetative and 13:0:45 during fruiting." },
              { title: "Regular Harvesting", desc: "Pick tender cucumbers every 2 days before seeds harden." }
            ]
          }
        ]
      }
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
          { title: "छंटनी", desc: "5वें नोड तक की पार्श्व शाखाओं को हटा दें। स्व-परागण वाली किस्मों का उपयोग करें।" }
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
      }
    }
  },

  // 4. HYDROPONIC CHERRY TOMATO
  {
    id: "offseason_tomato",
    courseId: "course-tomato-1",
    categoryId: "cat-crops",
    categoryCode: "crops",
    name: "Hydroponic Cherry Tomato",
    type: "off-season",
    season: "Summer Controlled Sowing (Off-Season)",
    image: "/images/academy/tomato.jpg",
    imageAlt: "Hydroponic cherry tomatoes clustering on greenhouse vine",
    youtubeVideoId: "wxMIq2E6X_Q",
    youtubeUrl: "https://www.youtube.com/watch?v=wxMIq2E6X_Q",
    videoLength: "5:54",
    description: "Soothes hot summers by raising premium cherry tomatoes inside automated misting greenhouses.",
    soilType: "Rockwool / Coco peat slabs",
    waterLevel: "Very Low (Recirculated Nutrient Film)",
    steps: [
      { title: "EC & pH Balancing", desc: "Maintain water EC at 2.0-2.5 mS/cm and pH between 5.8 to 6.2 strictly." },
      { title: "Dutch Bucket Support", desc: "Place seedlings in Dutch buckets with perlite for structural root aeration." },
      { title: "Misting Cooling", desc: "Operate overhead foggers for 30 seconds every 15 minutes during noon peaks." },
      { title: "Staggered Pickings", desc: "Harvest ripe clusters twice a week. Leaves a long shelf life." }
    ],
    modules: [
      {
        id: "mod-tom-1",
        title: "Dutch Bucket & Nutrient Automation",
        lessons: [
          {
            id: "les-tom-1",
            title: "Dutch Bucket Hydroponic Setup & EC/pH Control",
            titleEn: "Dutch Bucket Hydroponic Setup & EC/pH Control",
            videoUrl: "https://www.youtube.com/watch?v=wxMIq2E6X_Q",
            youtubeVideoId: "wxMIq2E6X_Q",
            youtubeUrl: "https://www.youtube.com/watch?v=wxMIq2E6X_Q",
            thumbnailUrl: "https://img.youtube.com/vi/wxMIq2E6X_Q/maxresdefault.jpg",
            videoDuration: "5:54",
            content: "Perlite root support and closed-loop recirculated nutrient solution.",
            steps: [
              { title: "Perlite Substrate", desc: "Fill buckets with washed horticultural perlite for air-porosity." },
              { title: "pH/EC Check", desc: "Calibrate EC sensor daily and keep pH buffer at 5.8-6.2." }
            ]
          },
          {
            id: "les-tom-2",
            title: "Cherry Tomato Pruning, Pollination & Staggered Harvest",
            titleEn: "Cherry Tomato Pruning, Pollination & Staggered Harvest",
            videoUrl: "https://www.youtube.com/watch?v=j4EFjxCUmN8",
            youtubeVideoId: "j4EFjxCUmN8",
            youtubeUrl: "https://www.youtube.com/watch?v=j4EFjxCUmN8",
            thumbnailUrl: "https://img.youtube.com/vi/j4EFjxCUmN8/maxresdefault.jpg",
            videoDuration: "17:50",
            content: "Manual cluster agitation for pollination and bi-weekly harvest.",
            steps: [
              { title: "Cluster Vibration", desc: "Gently tap flower trusses around noon to ensure complete pollination." },
              { title: "Ripe Cluster Harvest", desc: "Clip entire cherry tomato trusses when deep crimson red." }
            ]
          }
        ]
      }
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
      }
    }
  },

  // 5. DAIRY FARMING
  {
    id: "dairy_farming",
    courseId: "course-dairy-1",
    categoryId: "cat-dairy",
    categoryCode: "dairy",
    name: "Dairy Farming",
    type: "livestock",
    season: "Year-Round Livestock",
    image: "/images/academy/dairy.jpg",
    imageAlt: "Holstein dairy cows grazing in green pasture",
    youtubeVideoId: "vA0A1WzinbI",
    youtubeUrl: "https://www.youtube.com/watch?v=vA0A1WzinbI",
    videoLength: "2:54",
    description: "Cattle & buffalo management, high-fat silage nutrition, loose housing design, clean milking, and mastitis prevention.",
    soilType: "Loose Housing Bedding",
    waterLevel: "Continuous Clean Water",
    steps: [
      { title: "Farm Shed Setup", desc: "Design comfortable loose housing sheds with 80-100 sq ft open paddock per cow." },
      { title: "High-Yield Silage", desc: "Prepare green maize silage in anaerobic pits to ensure consistent year-round nutrition." },
      { title: "Clean Milking Routine", desc: "Follow pre-milking sanitation and post-milking teat dips to eliminate mastitis." },
      { title: "Calf Nursing & Colostrum", desc: "Feed 4 litres of maternal colostrum within 2 hours of calving for strong immunity." }
    ],
    modules: [
      {
        id: "mod-dairy-1",
        title: "Shed Design & Cattle Feeding",
        lessons: [
          {
            id: "les-dairy-1",
            title: "Modern Dairy Shed Design & Cattle Housing",
            titleEn: "Modern Dairy Shed Design & Cattle Housing",
            videoUrl: "https://www.youtube.com/watch?v=vA0A1WzinbI",
            youtubeVideoId: "vA0A1WzinbI",
            youtubeUrl: "https://www.youtube.com/watch?v=vA0A1WzinbI",
            thumbnailUrl: "https://img.youtube.com/vi/vA0A1WzinbI/maxresdefault.jpg",
            videoDuration: "2:54",
            content: "Loose housing system with good cross ventilation and comfortable sand bedding.",
            steps: [
              { title: "Open Housing Plan", desc: "Provide 3.5m roof clearance with longitudinal ridge ventilation." },
              { title: "Non-Slippery Flooring", desc: "Grooved concrete floor with 1:40 slope towards dung drain." }
            ]
          },
          {
            id: "les-dairy-2",
            title: "High-Yield Silage Making & Fodder Nutrition",
            titleEn: "High-Yield Silage Making & Fodder Nutrition",
            videoUrl: "https://www.youtube.com/watch?v=wDT0JmOGRw4",
            youtubeVideoId: "wDT0JmOGRw4",
            youtubeUrl: "https://www.youtube.com/watch?v=wDT0JmOGRw4",
            thumbnailUrl: "https://img.youtube.com/vi/wDT0JmOGRw4/maxresdefault.jpg",
            videoDuration: "1:57",
            content: "Green fodder preservation in anaerobic silage pits with molasses and mineral mixtures.",
            steps: [
              { title: "Chaffing Maize", desc: "Chop green maize at milk-line stage to 1.5-2 cm length." },
              { title: "Tractor Compaction", desc: "Pack silage airtight to trigger lactic acid fermentation (pH < 4.2)." }
            ]
          },
          {
            id: "les-dairy-3",
            title: "Calf Rearing & Mastitis Prevention Protocol",
            titleEn: "Calf Rearing & Mastitis Prevention Protocol",
            videoUrl: "https://www.youtube.com/watch?v=vA0A1WzinbI",
            youtubeVideoId: "vA0A1WzinbI",
            youtubeUrl: "https://www.youtube.com/watch?v=vA0A1WzinbI",
            thumbnailUrl: "https://img.youtube.com/vi/vA0A1WzinbI/maxresdefault.jpg",
            videoDuration: "2:54",
            content: "Colostrum feeding within 2 hours of birth and post-milking iodine teat dip.",
            steps: [
              { title: "Colostrum Administration", desc: "Feed 10% of calf body weight in first 24 hours." },
              { title: "Post-Dip Sanitation", desc: "Dip teats in 0.5% iodine solution to seal teat canals after milking." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "डेयरी फार्मिंग",
        season: "वर्ष भर चलने वाला व्यवसाय",
        description: "गाय-भैंस पालन, उच्च पोषण चारा, स्वच्छ दुग्ध उत्पादन और थनैला रोग से बचाव।",
        steps: [
          { title: "शेड निर्माण", desc: "हवादार खुला शेड बनाएं जिसमें प्रति गाय पर्याप्त घूमने की जगह हो।" },
          { title: "साइलेज हरा चारा", desc: "मक्के से साइलेज बनाकर साल भर संतुलित चारा सुनिश्चित करें।" },
          { title: "स्वच्छ दुग्ध दोहन", desc: "दुहने के बाद टीट डिप से थनैला रोग का खतरा समाप्त करें।" },
          { title: "बछड़े की देखभाल", desc: "जन्म के 2 घंटे में बछड़े को खीस (कोलोस्ट्रम) जरूर पिलाएं।" }
        ]
      },
      mr: {
        name: "दुग्ध व्यवसाय",
        season: "बारमाही व्यवसाय",
        description: "गाय व म्हैस पालन, संतुलित आहार, स्वच्छ दूध निर्मिती व आजार नियंत्रण.",
        steps: [
          { title: "गोठा बांधणी", desc: "मुक्त संचार पद्धतीचा हवेशीर गोठा तयार करा." },
          { title: "मुरघास निर्मिती", desc: "मक्यापासून चांगला मुरघास तयार करून बारमाही पौष्टिक चारा द्या." },
          { title: "स्वच्छ दूध दोहन", desc: "कासेची स्वच्छता ठेवून मस्टायटीस आजारापासून बचाव करा." },
          { title: "वासरांचे संगोपन", desc: "जन्मानंतर २ तासांत वासराला चीक पाजणे अत्यंत गरजेचे आहे." }
        ]
      }
    }
  },

  // 6. SHEEP FARMING
  {
    id: "sheep_farming",
    courseId: "course-sheep-1",
    categoryId: "cat-sheep",
    categoryCode: "sheep",
    name: "Sheep Farming",
    type: "livestock",
    season: "Dry & Semiarid Pastures",
    image: "/images/academy/sheep.jpg",
    imageAlt: "Flock of woolly sheep grazing in a green pasture",
    youtubeVideoId: "DMQDRAffiUw",
    youtubeUrl: "https://www.youtube.com/watch?v=DMQDRAffiUw",
    videoLength: "3:54",
    description: "Wool and mutton production, pasture rotational grazing, breeding cycles, deworming calendars, and lamb care.",
    soilType: "Well-Drained Grazing Land",
    waterLevel: "Moderate Clean Water",
    steps: [
      { title: "Sheep Farm Setup", desc: "Construct dry, elevated pens with cross-ventilation protecting from cold winds." },
      { title: "Feeding & Nutrition", desc: "Combine 6-8 hours grazing with leguminous fodder supplements and salt licks." },
      { title: "Lamb Care & Weaning", desc: "Keep lambs in warm creep areas and wean onto solid concentrates at 90 days." },
      { title: "Sheep Vaccination", desc: "Administer Enterotoxemia, Anthrax, and PPR vaccines as per ICAR calendar." },
      { title: "Breeding Management", desc: "Maintain 1 healthy active ram for every 25-30 ewes during breeding flush." }
    ],
    modules: [
      {
        id: "mod-sheep-1",
        title: "Sheep Housing & Care",
        lessons: [
          {
            id: "les-sheep-1",
            title: "Sheep Farm Setup & Pasture Rotational Grazing",
            titleEn: "Sheep Farm Setup & Pasture Rotational Grazing",
            videoUrl: "https://www.youtube.com/watch?v=DMQDRAffiUw",
            youtubeVideoId: "DMQDRAffiUw",
            youtubeUrl: "https://www.youtube.com/watch?v=DMQDRAffiUw",
            thumbnailUrl: "https://img.youtube.com/vi/DMQDRAffiUw/maxresdefault.jpg",
            videoDuration: "3:54",
            content: "Elevated shed construction and rotational grazing for parasite prevention.",
            steps: [
              { title: "Shed Orientation", desc: "Build East-West oriented shed with dry soil/slatted bedding." },
              { title: "Paddock Rotation", desc: "Rotate grazing plots every 2 weeks to break parasite cycles." }
            ]
          },
          {
            id: "les-sheep-2",
            title: "Lamb Care, Vaccination & Wool Shearing",
            titleEn: "Lamb Care, Vaccination & Wool Shearing",
            videoUrl: "https://www.youtube.com/watch?v=4VDlIFV3qIM",
            youtubeVideoId: "4VDlIFV3qIM",
            youtubeUrl: "https://www.youtube.com/watch?v=4VDlIFV3qIM",
            thumbnailUrl: "https://img.youtube.com/vi/4VDlIFV3qIM/maxresdefault.jpg",
            videoDuration: "4:59",
            content: "Deworming calendar, PPR vaccination, and clean shearing protocols.",
            steps: [
              { title: "Periodic Deworming", desc: "Deworm the flock before monsoon and post-monsoon seasons." },
              { title: "Hygienic Shearing", desc: "Shear wool twice a year on clean canvas sheets to prevent dirt contamination." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "भेड़ पालन",
        season: "शुष्क एवं अर्ध-शुष्क क्षेत्र",
        description: "ऊन और मांस उत्पादन, चराई प्रबंधन, प्रजनन और नियमित टीकाकरण।",
        steps: [
          { title: "भेड़ शेड सेटअप", desc: "ऊंचा और सूखा बाड़ा बनाएं जिससे सीलन और ठंड से बचाव हो।" },
          { title: "आहार एवं चराई", desc: "6-8 घंटे चराई के साथ खनिज लवण व दाना मिश्रण दें।" },
          { title: "मेमने की देखभाल", desc: "मेमने को गर्म स्थान पर रखें और 3 माह में अलग चारा दें।" },
          { title: "टीकाकरण", desc: "ईटी और पीपीआर का टीका समय पर अवश्य लगवाएं।" },
          { title: "प्रजनन प्रबंधन", desc: "प्रति 25-30 भेड़ों पर 1 उत्तम नस्ल का मेंढा रखें।" }
        ]
      },
      mr: {
        name: "मेंढी पालन",
        season: "कोरडवाहू व निम-कोरडवाहू",
        description: "लोकर व मांस उत्पादन, चराई व्यवस्थापन, पैदास आणि लसीकरण.",
        steps: [
          { title: "मेंढी गोठा", desc: "उंच व कोरड्या जागेवर हवेशीर गोठा तयार करा." },
          { title: "चराई व्यवस्थापन", desc: "दर १५ दिवसांनी चरण्याची जागा बदलून परजीवी नियंत्रण करा." },
          { title: "पिल्लांचे संगोपन", desc: "लहान पिल्लांना थंडीपासून वाचवा व योग्य पोषक खाद्य द्या." },
          { title: "लसीकरण", desc: "ईटी व पीपीआरचे वेळेवर लसीकरण करून आजार टाळा." },
          { title: "पैदास नियोजन", desc: "उत्तम दर्जाचा नर निवडून पैदास सुधारणा करा." }
        ]
      }
    }
  },

  // 7. GOAT FARMING
  {
    id: "goat_farming",
    courseId: "course-goat-1",
    categoryId: "cat-goat",
    categoryCode: "goat",
    name: "Goat Farming",
    type: "livestock",
    season: "Stall-Fed & Semi-Intensive",
    image: "/images/academy/goat.jpg",
    imageAlt: "Healthy goats feeding in stall-fed farm paddock",
    youtubeVideoId: "DdEjvOBEnwI",
    youtubeUrl: "https://www.youtube.com/watch?v=DdEjvOBEnwI",
    videoLength: "3:40",
    description: "Stall-fed and free-range goat farming, Sirohi/Jamnapari/Barbari breeds, kidding care, and disease prevention.",
    soilType: "Raised Slatted Floor",
    waterLevel: "Abundant Fresh Water",
    steps: [
      { title: "Farm Setup", desc: "Elevate wooden slotted floor sheds 3 feet above ground for perfect manure clearance." },
      { title: "High-Yield Breeds", desc: "Select Sirohi for meat or Barbari/Jamnapari for dual meat & milk suitability." },
      { title: "Stall-Fed Feeding", desc: "Feed cultivated green fodder (Super Napier, Subabul) with dry concentrate mash." },
      { title: "Kid Care & Nursing", desc: "Ensure colostrum feeding and provide specialized creep ration after 15 days." },
      { title: "Vaccination & Health", desc: "Strictly adhere to Enterotoxemia (ET) and Goat Pox preventive vaccine cycles." }
    ],
    modules: [
      {
        id: "mod-goat-1",
        title: "Stall-Fed Goat Farming",
        lessons: [
          {
            id: "les-goat-1",
            title: "Scientific Goat Farm Setup & Breed Selection",
            titleEn: "Scientific Goat Farm Setup & Breed Selection",
            videoUrl: "https://www.youtube.com/watch?v=DdEjvOBEnwI",
            youtubeVideoId: "DdEjvOBEnwI",
            youtubeUrl: "https://www.youtube.com/watch?v=DdEjvOBEnwI",
            thumbnailUrl: "https://img.youtube.com/vi/DdEjvOBEnwI/maxresdefault.jpg",
            videoDuration: "3:40",
            content: "Selecting high-yield Sirohi, Jamnapari, and Barbari breeds for stall feeding.",
            steps: [
              { title: "Breed Selection", desc: "Pick Sirohi/Barbari for rapid weight gain and twin kidding." },
              { title: "Health Screening", desc: "Check teeth, udder symmetry, and shiny coat before purchase." }
            ]
          },
          {
            id: "les-goat-2",
            title: "Stall-Fed Goat Shed Construction & Ration",
            titleEn: "Stall-Fed Goat Shed Construction & Ration",
            videoUrl: "https://www.youtube.com/watch?v=3SxADJwDW9Y",
            youtubeVideoId: "3SxADJwDW9Y",
            youtubeUrl: "https://www.youtube.com/watch?v=3SxADJwDW9Y",
            thumbnailUrl: "https://img.youtube.com/vi/3SxADJwDW9Y/maxresdefault.jpg",
            videoDuration: "3:37",
            content: "Elevated wooden slotted flooring design and dry/green fodder formulation.",
            steps: [
              { title: "Slatted Elevated Floor", desc: "Leave 1.5cm gap between wooden planks for dung drop." },
              { title: "Concentrate Feed", desc: "Give 250-300g crushed maize/gram husk mixture per adult goat." }
            ]
          },
          {
            id: "les-goat-3",
            title: "Goat Disease Prevention & Kid Nursing Care",
            titleEn: "Goat Disease Prevention & Kid Nursing Care",
            videoUrl: "https://www.youtube.com/watch?v=DdEjvOBEnwI",
            youtubeVideoId: "DdEjvOBEnwI",
            youtubeUrl: "https://www.youtube.com/watch?v=DdEjvOBEnwI",
            thumbnailUrl: "https://img.youtube.com/vi/DdEjvOBEnwI/maxresdefault.jpg",
            videoDuration: "3:40",
            content: "Enterotoxemia and PPR vaccination schedules with creep feeding for kids.",
            steps: [
              { title: "Vaccination Protocol", desc: "Vaccinate against ET and PPR annually." },
              { title: "Kid Nursing", desc: "Maintain warm bedding and separate feeding creep for kids." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "बकरी पालन",
        season: "सघन व खुले में",
        description: "सिरोही, जमनापारी, बरबरी नस्लों का चयन, मचान शेड और रोग प्रबंधन।",
        steps: [
          { title: "फार्म सेटअप", desc: "जमीन से 3 फीट ऊंचा मचान शेड बनाएं जिससे सफाई बनी रहे।" },
          { title: "उन्नत नस्लें", desc: "सिरोही या बरबरी जैसी अधिक बच्चे देने वाली नस्लें चुनें।" },
          { title: "संतुलित आहार", desc: "सुपर नेपियर हरा चारा और दाना मिश्रण नियमित दें।" },
          { title: "मेमने की देखरेख", desc: "जन्म के बाद खीस पिलाएं और 15 दिन बाद क्रीप दाना दें।" },
          { title: "टीकाकरण", desc: "ईटी और गोट पॉक्स का टीका अवश्य लगवाएं।" }
        ]
      },
      mr: {
        name: "शेळी पालन",
        season: "बंदिस्त व अर्ध-बंदिस्त",
        description: "उस्मानाबादी, बोअर व सिरोही जातींचे संगोपन, मचान गोठा व लसीकरण.",
        steps: [
          { title: "मचान गोठा", desc: "जमिनीपासून ३ फूट उंच मचान पद्धतीचा शेड बांधा." },
          { title: "जातींची निवड", desc: "उस्मानाबादी किंवा बोअर सारख्या जास्त वजन वाढणाऱ्या जाती निवडा." },
          { title: "संतुलित चारा", desc: "हिरवा चारा आणि खुराक देऊन वजन वाढवा." },
          { title: "करडांची काळजी", desc: "लहान करडांना सुरुवातीला भरपूर दूध व स्वतंत्र पोषण द्या." },
          { title: "आरोग्य व्यवस्थापन", desc: "ईटी आणि पीपीआर लसीकरण नियमित करा." }
        ]
      }
    }
  },

  // 8. POULTRY FARMING
  {
    id: "poultry_farming",
    courseId: "course-poultry-1",
    categoryId: "cat-poultry",
    categoryCode: "poultry",
    name: "Poultry Farming",
    type: "livestock",
    season: "Broiler & Layer Farm",
    image: "/images/academy/poultry.jpg",
    imageAlt: "Free-range poultry chickens in farm shed",
    youtubeVideoId: "CHJMfkOvOGk",
    youtubeUrl: "https://www.youtube.com/watch?v=CHJMfkOvOGk",
    videoLength: "9:20",
    description: "Broiler and layer management, Desi/Kadaknath farming, temperature control, biosecurity sanitation, and vaccination.",
    soilType: "Rice Husk Litter Bedding",
    waterLevel: "Continuous Nipple Drinkers",
    steps: [
      { title: "Shed Setup", desc: "Prepare clean environment-controlled shed with 3-inch dry rice husk bedding." },
      { title: "Chick Brooding", desc: "Maintain 95°F temperature in brooding circle with infrared bulbs for day-old chicks." },
      { title: "Feeding & FCR", desc: "Provide high protein pre-starter crumble transitioning to finisher pellets (target FCR < 1.6)." },
      { title: "Biosecurity", desc: "Install vehicle disinfection tire dip and mandatory footwear change at entry." },
      { title: "Vaccination", desc: "Administer Lasota (F1) eye drop at day 5 and Gumboro (IBD) at day 14." }
    ],
    modules: [
      {
        id: "mod-poultry-1",
        title: "Broiler & Layer Production",
        lessons: [
          {
            id: "les-poultry-1",
            title: "Broiler Poultry Shed Setup & Chick Brooding",
            titleEn: "Broiler Poultry Shed Setup & Chick Brooding",
            videoUrl: "https://www.youtube.com/watch?v=CHJMfkOvOGk",
            youtubeVideoId: "CHJMfkOvOGk",
            youtubeUrl: "https://www.youtube.com/watch?v=CHJMfkOvOGk",
            thumbnailUrl: "https://img.youtube.com/vi/CHJMfkOvOGk/maxresdefault.jpg",
            videoDuration: "9:20",
            content: "Day-old chick temperature management (95°F) and rice husk litter preparation.",
            steps: [
              { title: "Brooder Guard Circle", desc: "Set up circular chick guard with heat lamps at 95°F." },
              { title: "Electrolyte Water", desc: "Offer warm water with glucose and vitamins for first 24 hours." }
            ]
          },
          {
            id: "les-poultry-2",
            title: "Commercial Poultry Feed Formulation & Biosecurity",
            titleEn: "Commercial Poultry Feed Formulation & Biosecurity",
            videoUrl: "https://www.youtube.com/watch?v=_z8mg6NIJM4",
            youtubeVideoId: "_z8mg6NIJM4",
            youtubeUrl: "https://www.youtube.com/watch?v=_z8mg6NIJM4",
            thumbnailUrl: "https://img.youtube.com/vi/_z8mg6NIJM4/maxresdefault.jpg",
            videoDuration: "3:31",
            content: "Feed conversion ratio optimization and strict farm sanitation.",
            steps: [
              { title: "Balanced Ration", desc: "Maintain 22% crude protein in pre-starter and 19% in finisher." },
              { title: "Litter Management", desc: "Rake litter daily to prevent moisture accumulation and ammonia fumes." }
            ]
          },
          {
            id: "les-poultry-3",
            title: "Layer Farming & Disease Vaccination Schedule",
            titleEn: "Layer Farming & Disease Vaccination Schedule",
            videoUrl: "https://www.youtube.com/watch?v=CHJMfkOvOGk",
            youtubeVideoId: "CHJMfkOvOGk",
            youtubeUrl: "https://www.youtube.com/watch?v=CHJMfkOvOGk",
            thumbnailUrl: "https://img.youtube.com/vi/CHJMfkOvOGk/maxresdefault.jpg",
            videoDuration: "9:20",
            content: "Egg production enhancement and disease control.",
            steps: [
              { title: "Lasota Vaccination", desc: "Administer Ranikhet Lasota eye drop on Day 5 and Day 21." },
              { title: "Lighting Schedule", desc: "Provide 16 hours of daily light stimulation for peak egg laying." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "मुर्गी पालन",
        season: "ब्रायलर एवं लेयर",
        description: "ब्रायलर, लेयर व कड़कनाथ मुर्गी पालन, शेड का तापमान नियंत्रण और जैव-सुरक्षा।",
        steps: [
          { title: "शेड सेटअप", desc: "सूखा और हवादार शेड तैयार करें जिसमें धान की भूसी का बिछावन हो।" },
          { title: "चूजा ब्रूडिंग", desc: "शुरुआती दिनों में 95 डिग्री फॉरेनहाइट तापमान बनाए रखें।" },
          { title: "संतुलित दाना", desc: "प्री-स्टार्टर और फिनिशर दाना समय पर दें।" },
          { title: "जैव-सुरक्षा", desc: "शेड में बाहरी व्यक्तियों का प्रवेश रोकें और कीटाणुनाशक का छिड़काव करें।" },
          { title: "टीकाकरण", desc: "रानीखेत और गम्बोरो का टीका समय पर लगाएं।" }
        ]
      },
      mr: {
        name: "कुक्कुट पालन",
        season: "ब्रॉयलर व लेयर",
        description: "गावरान, कडकनाथ व ब्रॉयलर कुक्कुटपालन, लसीकरण व शेड व्यवस्थापन.",
        steps: [
          { title: "शेड उभारणी", desc: "हवेशीर शेडमध्ये भाताचा भुसा योग्य जाडीत पसरा." },
          { title: "पिल्लांची ब्रुडिंग", desc: "पिल्लांना सुरुवातीला योग्य उष्णता देऊन मरतुक टाळा." },
          { title: "खाद्य व्यवस्थापन", desc: "उत्तम दर्जाचे स्टार्टर व फिनिशर खाद्य द्या." },
          { title: "जैव-सुरक्षा", desc: "गोठ्यात जंतुनाशक फवारणी करून रोगराई टाळा." },
          { title: "लसीकरण", desc: "राणीखेत व इतर लसींचे वेळेवर डोस द्या." }
        ]
      }
    }
  },

  // 9. PIG FARMING
  {
    id: "pig_farming",
    courseId: "course-pig-1",
    categoryId: "cat-pig",
    categoryCode: "pig",
    name: "Pig Farming",
    type: "livestock",
    season: "Commercial Housing",
    image: "/images/academy/pig.jpg",
    imageAlt: "Clean commercial piggery pen",
    youtubeVideoId: "67x4_mLm0mo",
    youtubeUrl: "https://www.youtube.com/watch?v=67x4_mLm0mo",
    videoLength: "3:07",
    description: "Commercial piggery, housing sanitation, balanced ration feeding, and African Swine Fever prevention.",
    soilType: "Concrete Furrowed Pen",
    waterLevel: "Automatic Wallows",
    steps: [
      { title: "Shed Setup", desc: "Construct concrete pens with good drainage and water wallows for heat relief." },
      { title: "Breeds & Piglets", desc: "Select Large White Yorkshire or Landrace for high litter size and growth rate." },
      { title: "Balanced Ration", desc: "Supply dry mash with maize, soya meal, rice polish, and mineral mixture." },
      { title: "Biosecurity & Disease", desc: "Strictly disinfect pens to prevent Swine Fever and Foot and Mouth Disease." }
    ],
    modules: [
      {
        id: "mod-pig-1",
        title: "Piggery Management",
        lessons: [
          {
            id: "les-pig-1",
            title: "Commercial Piggery Housing & Sanitation",
            titleEn: "Commercial Piggery Housing & Sanitation",
            videoUrl: "https://www.youtube.com/watch?v=67x4_mLm0mo",
            youtubeVideoId: "67x4_mLm0mo",
            youtubeUrl: "https://www.youtube.com/watch?v=67x4_mLm0mo",
            thumbnailUrl: "https://img.youtube.com/vi/67x4_mLm0mo/maxresdefault.jpg",
            videoDuration: "3:07",
            content: "Piggery housing, dry rations, and disease prevention.",
            steps: [
              { title: "Concrete Flooring", desc: "Construct hard concrete floor with drainage for daily washing." },
              { title: "Iron Injection for Piglets", desc: "Administer iron dextran injection on 3rd day to prevent anemia." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "सूअर पालन",
        season: "व्यावसायिक शेड",
        description: "व्यावसायिक सूअर पालन, शेड की सफाई, संतुलित आहार और संक्रमण रोकथाम।",
        steps: [
          { title: "शेड निर्माण", desc: "पक्के फर्श वाला शेड बनाएं जिसमें पानी की उचित निकासी हो।" },
          { title: "नस्ल चयन", desc: "लार्ज व्हाइट यॉर्कशायर जैसी तेजी से बढ़ने वाली नस्लें चुनें।" },
          { title: "संतुलित दाना", desc: "मक्का, सोया खली और खनिज मिश्रण वाला पौष्टिक आहार दें।" },
          { title: "रोग नियंत्रण", desc: "स्वाइन फीवर से बचाव के लिए नियमित सफाई और टीका लगवाएं।" }
        ]
      },
      mr: {
        name: "वराह पालन",
        season: "व्यावसायिक पद्धत",
        description: "व्यावसायिक वराह पालन, स्वच्छता, संतुलित आहार आणि रोग प्रतिबंध.",
        steps: [
          { title: "गोठा रचना", desc: "धुता येईल असा सिमेंटचा पक्का गोठा तयार करा." },
          { title: "जातींची निवड", desc: "लार्ज व्हाईट यॉर्कशायर जात निवडून जलद वाढ मिळवा." },
          { title: "संतुलित आहार", desc: "भरड धान्य व प्रथिनयुक्त खुराक नियमित द्या." },
          { title: "रोग प्रतिबंध", desc: "स्वाइन फिव्हर प्रतिबंधक लस देऊन शेड स्वच्छ ठेवा." }
        ]
      }
    }
  },

  // 10. BEEKEEPING
  {
    id: "beekeeping",
    courseId: "course-beekeeping-1",
    categoryId: "cat-beekeeping",
    categoryCode: "beekeeping",
    name: "Beekeeping & Honey",
    type: "livestock",
    season: "Floral Blooms & Migration",
    image: "/images/academy/beekeeping.jpg",
    imageAlt: "Beekeeper inspecting wooden Langstroth hive frames",
    youtubeVideoId: "dzf2a0mcCvE",
    youtubeUrl: "https://www.youtube.com/watch?v=dzf2a0mcCvE",
    videoLength: "3:46",
    description: "Apis cerana and Apis mellifera box management, seasonal flora migration, honey extraction, and pollination boost.",
    soilType: "Shaded Tree Canopy",
    waterLevel: "Clean Water Basin Nearby",
    steps: [
      { title: "Hive Setup", desc: "Position Langstroth wooden boxes under shade facing East with ant protection wells." },
      { title: "Colony & Queen Care", desc: "Inspect brood chamber weekly, check egg laying pattern, and replace aging queens." },
      { title: "Seasonal Migration", desc: "Migrate boxes to mustard, litchi, and sunflower blooming fields during honey flow." },
      { title: "Honey Extraction", desc: "Use manual or electric centrifugal extractors without damaging comb structure." }
    ],
    modules: [
      {
        id: "mod-bee-1",
        title: "Hive Management & Extraction",
        lessons: [
          {
            id: "les-bee-1",
            title: "Apis Mellifera Wooden Box Setup & Queen Management",
            titleEn: "Apis Mellifera Wooden Box Setup & Queen Management",
            videoUrl: "https://www.youtube.com/watch?v=dzf2a0mcCvE",
            youtubeVideoId: "dzf2a0mcCvE",
            youtubeUrl: "https://www.youtube.com/watch?v=dzf2a0mcCvE",
            thumbnailUrl: "https://img.youtube.com/vi/dzf2a0mcCvE/maxresdefault.jpg",
            videoDuration: "3:46",
            content: "Langstroth hive box frames, queen excluders, and worker bee colony balancing.",
            steps: [
              { title: "Box Placement", desc: "Place boxes 1 foot above ground with ant-traps filled with oil." },
              { title: "Queen Check", desc: "Verify uniform concentric brood pattern and absence of swarm cells." }
            ]
          },
          {
            id: "les-bee-2",
            title: "Centrifugal Honey Extraction & Mite Disease Control",
            titleEn: "Centrifugal Honey Extraction & Mite Disease Control",
            videoUrl: "https://www.youtube.com/watch?v=tZ3DZ1Z3i0c",
            youtubeVideoId: "tZ3DZ1Z3i0c",
            youtubeUrl: "https://www.youtube.com/watch?v=tZ3DZ1Z3i0c",
            thumbnailUrl: "https://img.youtube.com/vi/tZ3DZ1Z3i0c/maxresdefault.jpg",
            videoDuration: "3:12",
            content: "Centrifugal extractor operations and pure honey processing.",
            steps: [
              { title: "Uncapping Knife", desc: "Gently slice wax caps of sealed honey cells with warm knife." },
              { title: "Centrifuge Extraction", desc: "Spin frames at low speed to extract pure raw honey." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "मधुमक्खी पालन",
        season: "फूलों का मौसम व प्रवास",
        description: "मधुमक्खी बक्सों का प्रबंधन, मौसमी फूलों की ओर स्थानांतरण और शुद्ध शहद निष्कर्षण।",
        steps: [
          { title: "बक्सा सेटअप", desc: "छायादार स्थान पर चींटियों से सुरक्षित लकड़ी के बक्से स्थापित करें।" },
          { title: "रानी मक्खी देखरेख", desc: "सप्ताह में एक बार बक्सा खोलकर अंडे देने की गति जांचें।" },
          { title: "प्रवास (माइग्रेशन)", desc: "सरसों और लीची के मौसम में बक्सों को खेतों के पास ले जाएं।" },
          { title: "शहद निकालना", desc: "सेंट्रीफ्यूगल मशीन से बिना छत्ते को नुकसान पहुंचाए शहद निकालें।" }
        ]
      },
      mr: {
        name: "मधुमक्षिका पालन",
        season: "फुलोरा व स्थलांतर",
        description: "मधमाश्यांचे पेट्यांचे व्यवस्थापन, परागीभवन आणि दर्जेदार मध उत्पादन.",
        steps: [
          { title: "पेटी व्यवस्थापन", desc: "झाडांच्या सावलीत मुंग्यांपासून सुरक्षित पेट्या ठेवा." },
          { title: "राणी माशी नियोजन", desc: "पेटीतील अंडी घालण्याची क्षमता नियमित तपासा." },
          { title: "स्थलांतर", desc: "मोहरी किंवा सूर्यफुलाच्या फुलोऱ्याच्या काळात पेट्या स्थलांतरित करा." },
          { title: "मध काढणे", desc: "सेंट्रीफ्युगल यंत्राद्वारे पोळ्यांना इजा न करता मध काढा." }
        ]
      }
    }
  },

  // 11. FISHERIES & AQUACULTURE
  {
    id: "fisheries",
    courseId: "course-fisheries-1",
    categoryId: "cat-fisheries",
    categoryCode: "fisheries",
    name: "Fisheries & Aquaculture",
    type: "livestock",
    season: "Pond Polyculture & Biofloc",
    image: "/images/academy/fisheries.jpg",
    imageAlt: "Aquaculture fish pond with paddle-wheel aerator",
    youtubeVideoId: "RNQxV7zdoyc",
    youtubeUrl: "https://www.youtube.com/watch?v=RNQxV7zdoyc",
    videoLength: "3:14",
    description: "Pond construction, Rohu/Catla/Mrigal polyculture, Biofloc systems, water aeration, and feed conversion ratio.",
    soilType: "Clay-Retentive Pond Bed",
    waterLevel: "5-6 Feet Depth",
    steps: [
      { title: "Pond Preparation", desc: "Dry pond bed, apply agricultural lime (250 kg/ha), and add cow dung for plankton blooms." },
      { title: "Fingerling Stocking", desc: "Stock healthy fingerlings (3-4 inch) in polyculture: Catla (surface), Rohu (column), Mrigal (bottom)." },
      { title: "Feeding Management", desc: "Feed floating pellet feed (28-32% protein) at 2-3% of total body weight daily." },
      { title: "Water Aeration & Testing", desc: "Maintain dissolved oxygen > 5 mg/L using paddle-wheel aerators during dawn hours." }
    ],
    modules: [
      {
        id: "mod-fish-1",
        title: "Pond Preparation & Polyculture",
        lessons: [
          {
            id: "les-fish-1",
            title: "Fish Pond Preparation, Liming & Fingerling Stocking",
            titleEn: "Fish Pond Preparation, Liming & Fingerling Stocking",
            videoUrl: "https://www.youtube.com/watch?v=RNQxV7zdoyc",
            youtubeVideoId: "RNQxV7zdoyc",
            youtubeUrl: "https://www.youtube.com/watch?v=RNQxV7zdoyc",
            thumbnailUrl: "https://img.youtube.com/vi/RNQxV7zdoyc/maxresdefault.jpg",
            videoDuration: "3:14",
            content: "Pond drying, agricultural lime application (250 kg/ha), and fingerling acclimatization.",
            steps: [
              { title: "Liming & Manuring", desc: "Apply agricultural lime and cow dung to produce rich natural plankton." },
              { title: "Acclimatization", desc: "Float seed bags in pond water for 30 minutes before release." }
            ]
          },
          {
            id: "les-fish-2",
            title: "Polyculture Carp Feeding & Water Quality Management",
            titleEn: "Polyculture Carp Feeding & Water Quality Management",
            videoUrl: "https://www.youtube.com/watch?v=xOLdDsCekQY",
            youtubeVideoId: "xOLdDsCekQY",
            youtubeUrl: "https://www.youtube.com/watch?v=xOLdDsCekQY",
            thumbnailUrl: "https://img.youtube.com/vi/xOLdDsCekQY/maxresdefault.jpg",
            videoDuration: "6:13",
            content: "Rohu, Catla, and Mrigal feeding and aerator systems.",
            steps: [
              { title: "Three-Tier Polyculture", desc: "Combine Catla (surface), Rohu (middle), and Mrigal (bottom)." },
              { title: "Dissolved Oxygen Control", desc: "Run aerators during early morning hours to prevent oxygen drops." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "मत्स्य पालन एवं जलकृषि",
        season: "मिश्रित तालाब एवं बायोफ्लॉक",
        description: "तालाब निर्माण, रोहू/कतला/मृगल मिश्रित पालन, बायोफ्लॉक तकनीक और पानी की गुणवत्ता नियंत्रण।",
        steps: [
          { title: "तालाब की तैयारी", desc: "तालाब सुखाकर चूना और गोबर खाद डालें जिससे प्राकृतिक भोजन बने।" },
          { title: "मछली बीज संचयन", desc: "कतला, रोहू और नैन (मृगल) का मिश्रित बीज सही अनुपात में डालें।" },
          { title: "पूरक आहार", desc: "प्रोटीनयुक्त फ्लोटिंग फीड शरीर के वजन के 2-3% के हिसाब से दें।" },
          { title: "ऑक्सीजन प्रबंधन", desc: "सुबह के समय तालाब में एरिएटर चलाकर ऑक्सीजन का स्तर बनाए रखें।" }
        ]
      },
      mr: {
        name: "मत्स्य पालन",
        season: "तळे संवर्धन व बायोफ्लॉक",
        description: "तळे बांधकाम, रोहू, कटला, मृगळ संवर्धन, बायोफ्लॉक तंत्रज्ञान व ऑक्सिजन नियंत्रण.",
        steps: [
          { title: "तळे तयारी", desc: "तळे सुकवून चुना व शेणखताचा वापर करून नैसर्गिक प्लवक तयार करा." },
          { title: "मत्स्यबीज साठा", desc: "कटला, रोहू व मृगळ या तिन्ही थरांतील माशांचे योग्य प्रमाणात संवर्धन करा." },
          { title: "पूरक खाद्य", desc: "प्रथिनयुक्त तरंगणारे खाद्य नियमित द्या." },
          { title: "ऑक्सिजन नियंत्रण", desc: "सकाळच्या वेळी पाण्यात ऑक्सिजनची पातळी टिकवण्यासाठी एरेटर चालवा." }
        ]
      }
    }
  },

  // 12. INTEGRATED LIVESTOCK FARMING
  {
    id: "integrated_farming",
    courseId: "course-integrated-1",
    categoryId: "cat-integrated",
    categoryCode: "integrated",
    name: "Integrated Livestock Farming",
    type: "livestock",
    season: "Zero-Waste Circular System",
    image: "/images/academy/integrated.jpg",
    imageAlt: "Integrated circular farm with duck-rice and fish pond",
    youtubeVideoId: "FCTNm27o5Ug",
    youtubeUrl: "https://www.youtube.com/watch?v=FCTNm27o5Ug",
    videoLength: "3:22",
    description: "Zero-waste circular agriculture combining crop residues, fish ponds, vermicompost, biogas, and poultry waste.",
    soilType: "Integrated Multi-Unit Farm",
    waterLevel: "Recirculated Farm Water",
    steps: [
      { title: "Crop-Livestock Synergy", desc: "Use crop straw as livestock feed and cattle dung to generate cooking biogas." },
      { title: "Poultry-Fish Link", desc: "Place poultry coops above fish ponds so bird droppings fertilize plankton naturally." },
      { title: "Biogas & Slurry Use", desc: "Direct digested biogas slurry to crop fields as liquid bio-fertilizer." },
      { title: "Vermicompost Production", desc: "Convert leftover organic farm waste into vermicompost for cash crop soil." }
    ],
    modules: [
      {
        id: "mod-int-1",
        title: "Circular Bio-Economy Model",
        lessons: [
          {
            id: "les-int-1",
            title: "Zero-Waste Circular Farm: Crop, Poultry & Fish Integration",
            titleEn: "Zero-Waste Circular Farm: Crop, Poultry & Fish Integration",
            videoUrl: "https://www.youtube.com/watch?v=FCTNm27o5Ug",
            youtubeVideoId: "FCTNm27o5Ug",
            youtubeUrl: "https://www.youtube.com/watch?v=FCTNm27o5Ug",
            thumbnailUrl: "https://img.youtube.com/vi/FCTNm27o5Ug/maxresdefault.jpg",
            videoDuration: "3:22",
            content: "Directing poultry droppings as pond manure and utilizing pond silt as rich crop compost.",
            steps: [
              { title: "Coop-Over-Pond", desc: "Position bird coops over ponds for natural primary fertilization." },
              { title: "Pond Silt Desilting", desc: "Apply nutrient-rich pond bottom silt to fruit orchard trees." }
            ]
          },
          {
            id: "les-int-2",
            title: "Biogas Slurry, Vermicompost & Farm Resilience",
            titleEn: "Biogas Slurry, Vermicompost & Farm Resilience",
            videoUrl: "https://www.youtube.com/watch?v=58Xj4PYSCSo",
            youtubeVideoId: "58Xj4PYSCSo",
            youtubeUrl: "https://www.youtube.com/watch?v=58Xj4PYSCSo",
            thumbnailUrl: "https://img.youtube.com/vi/58Xj4PYSCSo/maxresdefault.jpg",
            videoDuration: "3:31",
            content: "Converting cattle dung into cooking methane gas and liquid bio-fertilizer.",
            steps: [
              { title: "Biogas Digestion", desc: "Feed cattle dung into anaerobic digester to produce methane." },
              { title: "Vermicompost Beds", desc: "Use spent slurry in earthworm beds for black gold compost." }
            ]
          }
        ]
      }
    ],
    translations: {
      hi: {
        name: "समेकित पशुपालन एवं कृषि",
        season: "शून्य-अपशिष्ट चक्रीय मॉडल",
        description: "शून्य-अपशिष्ट चक्रीय कृषि: फसल अवशेष, मछली तालाब, केंचुआ खाद और बायोगैस का एकीकृत उपयोग।",
        steps: [
          { title: "फसल-पशु एकीकरण", desc: "फसल के डंठल पशु को खिलाएं और गोबर से बायोगैस बनाएं।" },
          { title: "मुर्गी-मछली तालाब", desc: "तालाब के ऊपर मुर्गी शेड बनाएं जिससे मछली को प्राकृतिक आहार मिले।" },
          { title: "बायोगैस स्लरी", desc: "गैस निकलने के बाद बची स्लरी को खेत में जैविक खाद के रूप में डालें।" },
          { title: "केंचुआ खाद", desc: "कृषि अपशिष्ट से केंचुआ खाद बनाकर मिट्टी की उर्वरता बढ़ाएं।" }
        ]
      },
      mr: {
        name: "एकात्मिक शेती पद्धती",
        season: "कचरामुक्त चक्रीय मॉडेल",
        description: "कचरामुक्त शेती: पिके, शेळीपालन, मत्स्यव्यवसाय आणि बायोगॅसचे एकत्रित मॉडेल.",
        steps: [
          { title: "पीक-पशु जोड", desc: "पिकांचे अवशेष जनावरांना चारा व शेणापासून बायोगॅस निर्मिती करा." },
          { title: "कुक्कुट-मत्स्य जोड", desc: "तळ्यावर कोंबड्यांचा गोठा उभारून माशांसाठी नैसर्गिक खाद्य तयार करा." },
          { title: "बायोगॅस स्लरी", desc: "बायोगॅस स्लरीचा शेतात उत्कृष्ट सेंद्रिय खत म्हणून वापर करा." },
          { title: "गांडूळ खत", desc: "उरलेल्या काडीकचऱ्यापासून गांडूळ खत तयार करून जमिनीचा पोत सुधारा." }
        ]
      }
    }
  }
];

interface CropAcademyProps {
  mode?: "crops" | "animals" | "all";
  preferredLanguage?: string;
  userId?: string;
}

export default function CropAcademy({
  mode = "crops",
  preferredLanguage = "en",
  userId = "guest-1"
}: CropAcademyProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Expanded lessons modal / accordion state
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Active video player state
  const [activeLesson, setActiveLesson] = useState<{
    guideName: string;
    categoryCode: string;
    lesson: LessonItem;
    categoryName: string;
  } | null>(null);

  // Theater / expanded HD view state
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // User progress map: lessonId -> boolean
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  // UI Localization Dictionary
  const translations: Record<string, Record<string, string>> = {
    hi: {
      "Farming & Livestock Academy": "कृषि एवं पशुपालन अकादमी",
      "Crop Academy": "फसल अकादमी (Crop Academy)",
      "Animal Farming & Husbandry": "पशुपालन एवं मत्स्य पालन अकादमी (Animal Farming)",
      "Grow seasonal and off-season crops with step-by-step video lessons.": "चरण-दर-चरण वीडियो पाठों के साथ मौसमी और गैर-मौसमी उच्च उपज वाली फसलें उगाएं।",
      "Practical video guides for livestock rearing, dairy, poultry, beekeeping, and sustainable aquaculture.": "पशुपालन, डेयरी, मुर्गी पालन, मधुमक्खी पालन और जलीय कृषि के व्यावहारिक वीडियो गाइड।",
      "Search crop guides...": "फसल, बुवाई चरण या वीडियो खोजें...",
      "Search crop guides, sowing steps, varieties...": "फसल, बुवाई चरण या किस्में खोजें...",
      "Search livestock guides, breeds, housing, vaccination...": "पशुपालन, नस्ल, आवास, टीकाकरण खोजें...",
      "All Guides": "सभी गाइड",
      "All Crops": "सभी फसलें",
      "All Animal Farming": "सभी पशुपालन एवं जलकृषि",
      "Seasonal Crops": "मौसमी फसलें",
      "Off-Season Crops": "गैर-मौसमी (ऑफ़-सीज़न)",
      "Off-Season & Hydroponics": "गैर-मौसमी एवं हाइड्रोपोनिक्स",
      "Livestock & Aquaculture": "पशुपालन एवं मत्स्य पालन",
      "Dairy & Ruminants": "डेयरी एवं मवेशी",
      "Poultry & Piggery": "मुर्गी व सूअर पालन",
      "Aquaculture & Eco": "मत्स्य व समेकित कृषि",
      "Soil:": "मिट्टी/आवास:",
      "Watering:": "जल/सिंचाई आवश्यकता:",
      "Watch Lesson": "पाठ देखें",
      "Open Lessons & Videos": "पाठ एवं वीडियो देखें",
      "Hide Lessons": "पाठ छुपाएं",
      "Sowing & Harvesting Steps": "महत्वपूर्ण चरण एवं तकनीक",
      "Video Tutorial Lesson": "वीडियो ट्यूटोरियल पाठ",
      "Step": "चरण",
      "Close": "बंद करें",
      "Watch on YouTube": "YouTube पर देखें",
      "Mark as Completed": "पूर्ण चिह्नित करें",
      "Completed": "पूर्ण हुआ ✓",
      "Learning Progress": "सीखने की प्रगति",
      "Modules & Lessons": "मॉड्यूल एवं पाठ",
      "Verified Educational Video": "सत्यापित शैक्षणिक वीडियो",
      "No video restrictions": "पूर्ण स्क्रीन एवं उच्च गुणवत्ता",
      "Language:": "भाषा:",
      "Duration:": "अवधि:",
      "Theater Mode": "थिएटर मोड",
      "Default": "सामान्य दृश्य",
      "Standard View": "सामान्य दृश्य",
      "Tip: Click the YouTube gear icon ⚙️ inside the player to lock quality to 1080p/720p HD.": "सुझाव: उच्चतम 1080p/720p HD गुणवत्ता के लिए प्लेयर में गियर आइकन ⚙️ पर क्लिक करें।"
    },
    mr: {
      "Farming & Livestock Academy": "कृषी व पशुसंवर्धन अकादमी",
      "Crop Academy": "पीक अकादमी (Crop Academy)",
      "Animal Farming & Husbandry": "पशुसंवर्धन व मत्स्यशेती (Animal Farming)",
      "Grow seasonal and off-season crops with step-by-step video lessons.": "मार्गदर्शक व्हिडिओंच्या साहाय्याने भरघोस उत्पादन देणारी हंगामी व बिगर-हंगामी पिके घ्या.",
      "Practical video guides for livestock rearing, dairy, poultry, beekeeping, and sustainable aquaculture.": "दुग्ध व्यवसाय, शेळी-मेंढी, कुक्कुटपालन, मधमाश्या व मत्स्यपालनाचे प्रात्यक्षिक व्हिडिओ मार्गदर्शक.",
      "Search crop guides...": "पीक, पेरणी किंवा व्हिडिओ शोधा...",
      "Search crop guides, sowing steps, varieties...": "पीक माहिती, पेरणी टप्पे, वाण शोधा...",
      "Search livestock guides, breeds, housing, vaccination...": "पशुपालन, जाती, गोठा रचना, लसीकरण शोधा...",
      "All Guides": "सर्व मार्गदर्शक",
      "All Crops": "सर्व पिके",
      "All Animal Farming": "सर्व पशुसंवर्धन",
      "Seasonal Crops": "हंगामी पिके",
      "Off-Season Crops": "बिगर-हंगामी (ऑफ-सीझन) पिके",
      "Off-Season & Hydroponics": "बिगर-हंगामी व हायड्रोपोनिक्स",
      "Livestock & Aquaculture": "पशुपालन व मत्स्यशेती",
      "Dairy & Ruminants": "दुग्ध व रवंथ करणारे प्राणी",
      "Poultry & Piggery": "कुक्कुट व वराह पालन",
      "Aquaculture & Eco": "मत्स्य व एकात्मिक शेती",
      "Soil:": "माती/गोठा प्रकार:",
      "Watering:": "पाणी गरज:",
      "Watch Lesson": "व्हिडिओ पहा",
      "Open Lessons & Videos": "धडे व व्हिडिओ उघडा",
      "Hide Lessons": "धडे बंद करा",
      "Sowing & Harvesting Steps": "महत्त्वाचे टप्पे व कृती",
      "Video Tutorial Lesson": "व्हिडिओ ट्यूटोरियल",
      "Step": "टप्पा",
      "Close": "बंद करा",
      "Watch on YouTube": "YouTube वर उघडा",
      "Mark as Completed": "पूर्ण झाले म्हणून नोंदवा",
      "Completed": "पूर्ण झाले ✓",
      "Learning Progress": "शिक्षणाची प्रगती",
      "Modules & Lessons": "मॉड्यूल व धडे",
      "Verified Educational Video": "सत्यापित शैक्षणिक व्हिडिओ",
      "Theater Mode": "थिएटर मोड",
      "Default": "मूळ दृश्य",
      "Standard View": "मूळ दृश्य",
      "Tip: Click the YouTube gear icon ⚙️ inside the player to lock quality to 1080p/720p HD.": "टीप: उच्च 1080p/720p HD गुणवत्तेसाठी प्लेयरमधील गिअर आयकॉन ⚙️ वर क्लिक करा."
    },
    mai: {
      "Farming & Livestock Academy": "कृषि आ पशुपालन अकादमी",
      "Crop Academy": "फसल अकादमी (Crop Academy)",
      "Animal Farming & Husbandry": "पशुपालन आ जलकृषि (Animal Farming)",
      "Grow seasonal and off-season crops with step-by-step video lessons.": "वीडियो पाठ सँ उन्नत फसलक सीख प्राप्त करू।",
      "Practical video guides for livestock rearing, dairy, poultry, beekeeping, and sustainable aquaculture.": "पशुपालन, डेयरी, मुर्गी, मधुमक्खी आ मत्स्य पालनक वीडियो गाइड।",
      "Search crop guides...": "फसल वा बुवाई खोजीं...",
      "Search crop guides, sowing steps, varieties...": "फसल गाइड, रोपनी चरण आ प्रभेद खोजीं...",
      "Search livestock guides, breeds, housing, vaccination...": "पशुपालन, नस्ल, गोहाल आ टीकाकरण खोजीं...",
      "All Guides": "सभ गाइड",
      "All Crops": "सभ फसल",
      "All Animal Farming": "सभ पशुपालन",
      "Seasonal Crops": "मौसमी फसल",
      "Off-Season Crops": "बेमौसमी फसल",
      "Off-Season & Hydroponics": "बेमौसमी आ हाइड्रोपोनिक्स",
      "Livestock & Aquaculture": "पशुपालन आ मछली पालन",
      "Dairy & Ruminants": "डेयरी आ मवेशी",
      "Poultry & Piggery": "मुर्गी आ सूअर पालन",
      "Aquaculture & Eco": "मछली आ एकीकृत खेती",
      "Watch Lesson": "पाठ देखीं",
      "Open Lessons & Videos": "पाठ आ वीडियो देखीं",
      "Close": "बंद करू",
      "Watch on YouTube": "YouTube पर देखीं",
      "Learning Progress": "सीखबाक प्रगति",
      "Theater Mode": "थिएटर मोड",
      "Default": "सामान्य दृश्य",
      "Standard View": "सामान्य दृश्य",
      "Tip: Click the YouTube gear icon ⚙️ inside the player to lock quality to 1080p/720p HD.": "सुझाव: उच्चतम 1080p/720p HD गुणवत्ता लेल प्लेयरक गियर आइकन ⚙️ पर क्लिक करू।"
    },
    bho: {
      "Farming & Livestock Academy": "खेती आ पशुपालन अकादमी",
      "Crop Academy": "फसल अकादमी (Crop Academy)",
      "Animal Farming & Husbandry": "पशुपालन आ मछरी पालन (Animal Farming)",
      "Grow seasonal and off-season crops with step-by-step video lessons.": "एगो-एगो कदम के वीडियो पाठ से फसल उगाईं।",
      "Practical video guides for livestock rearing, dairy, poultry, beekeeping, and sustainable aquaculture.": "डेयरी, बकरी, मुर्गी, मधुमक्खी आ मछरी पालन के वीडियो गाइड।",
      "Search crop guides...": "फसल, बोआई चाहे वीडियो खोजीं...",
      "Search crop guides, sowing steps, varieties...": "फसल के गाइड, बोआई आ किस्म खोजीं...",
      "Search livestock guides, breeds, housing, vaccination...": "पशुपालन, नस्ल, बाड़ा आ सुई-दवा खोजीं...",
      "All Guides": "सब गाइड",
      "All Crops": "सब फसल",
      "All Animal Farming": "सब पशुपालन",
      "Seasonal Crops": "मौसमी फसल",
      "Off-Season Crops": "बिना मौसम के फसल",
      "Off-Season & Hydroponics": "बिना मौसम के आ हाइड्रोपोनिक्स",
      "Livestock & Aquaculture": "पशुपालन आ मछरी पालन",
      "Dairy & Ruminants": "डेयरी आ मवेशी",
      "Poultry & Piggery": "मुर्गी आ सूअर पालन",
      "Aquaculture & Eco": "मछरी आ एकीकृत खेती",
      "Watch Lesson": "वीडियो देखीं",
      "Open Lessons & Videos": "पाठ आ वीडियो खोलीं",
      "Close": "बंद करीं",
      "Watch on YouTube": "YouTube पर देखीं",
      "Learning Progress": "सीखे के प्रगति",
      "Theater Mode": "थिएटर मोड",
      "Default": "साधारण दृश्य",
      "Standard View": "साधारण दृश्य",
      "Tip: Click the YouTube gear icon ⚙️ inside the player to lock quality to 1080p/720p HD.": "सुझाव: 1080p/720p HD क्वालिटी खातिर प्लेयर में गियर आइकन ⚙️ पर क्लिक करीं।"
    }
  };

  const localT = (key: string) => {
    return translations[preferredLanguage]?.[key] || translations["en"]?.[key] || key;
  };

  // Fetch user progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        const res = await axios.get(`/api/academy/progress?userId=${userId}`);
        if (res.data?.progress && Array.isArray(res.data.progress)) {
          const map: Record<string, boolean> = {};
          res.data.progress.forEach((p: any) => {
            if (p.isCompleted || p.is_completed) {
              map[p.lessonId || p.lesson_id] = true;
            }
          });
          setCompletedLessons(map);
        }
      } catch (err) {
        console.warn("Could not load backend progress, running in offline mode:", err);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const handleToggleComplete = async (lessonId: string) => {
    const nextState = !completedLessons[lessonId];
    setCompletedLessons(prev => ({ ...prev, [lessonId]: nextState }));

    try {
      await axios.post("/api/academy/progress", {
        userId,
        lessonId,
        isCompleted: nextState,
        lastWatchedSeconds: 300
      });
    } catch (err) {
      console.warn("Progress update saved locally:", err);
    }
  };

  const getLocalizedGuide = (guide: AcademyCardData) => {
    const local = guide.translations[preferredLanguage];
    return {
      ...guide,
      name: local?.name || guide.name,
      season: local?.season || guide.season || (guide.type === "livestock" ? "All Year" : "Seasonal"),
      description: local?.description || guide.description,
      steps: local?.steps || guide.steps
    };
  };

  // Filter and Search logic
  const filteredGuides = MASTER_ACADEMY_DATA.filter((guide) => {
    // 1. Base Section Partitioning
    if (mode === "crops" && guide.categoryCode !== "crops") return false;
    if (mode === "animals" && guide.type !== "livestock") return false;

    const loc = getLocalizedGuide(guide);

    // 2. Type & Category Sub-Filter
    let matchesType = true;
    if (mode === "crops") {
      if (filterType === "seasonal") matchesType = guide.type === "seasonal";
      else if (filterType === "off-season") matchesType = guide.type === "off-season";
    } else if (mode === "animals") {
      if (filterType === "ruminants") {
        matchesType = ["dairy", "sheep", "goat"].includes(guide.categoryCode);
      } else if (filterType === "poultry-pig") {
        matchesType = ["poultry", "pig"].includes(guide.categoryCode);
      } else if (filterType === "aqua-eco") {
        matchesType = ["fisheries", "beekeeping", "integrated"].includes(guide.categoryCode);
      }
    } else {
      // mode === "all"
      if (filterType === "seasonal") matchesType = guide.type === "seasonal";
      else if (filterType === "off-season") matchesType = guide.type === "off-season";
      else if (filterType === "livestock") matchesType = guide.type === "livestock";
    }

    // 3. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesName = loc.name.toLowerCase().includes(query);
    const matchesDesc = loc.description.toLowerCase().includes(query);
    const matchesCategory = guide.categoryCode.toLowerCase().includes(query);
    const matchesLessons = guide.modules.some(m =>
      m.title.toLowerCase().includes(query) ||
      m.lessons.some(l => l.title.toLowerCase().includes(query) || l.titleEn.toLowerCase().includes(query))
    );

    return matchesType && (matchesName || matchesDesc || matchesCategory || matchesLessons);
  });

  const calculateCourseProgress = (guide: AcademyCardData) => {
    const allLessons = guide.modules.flatMap(m => m.lessons);
    if (allLessons.length === 0) return 0;
    const completedCount = allLessons.filter(l => completedLessons[l.id]).length;
    return Math.round((completedCount / allLessons.length) * 100);
  };

  const handleOpenLessonVideo = (guide: AcademyCardData, lesson: LessonItem) => {
    const loc = getLocalizedGuide(guide);
    setActiveLesson({
      guideName: loc.name,
      categoryCode: guide.categoryCode,
      categoryName: loc.name,
      lesson
    });
  };

  const handleCloseVideo = () => {
    setActiveLesson(null);
    setIsTheaterMode(false);
  };

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case "dairy": return <Milk className="w-4 h-4 text-sky-400" />;
      case "poultry": return <Feather className="w-4 h-4 text-amber-400" />;
      case "fisheries": return <Fish className="w-4 h-4 text-cyan-400" />;
      case "beekeeping": return <Sun className="w-4 h-4 text-yellow-400" />;
      case "sheep": return <Layers className="w-4 h-4 text-emerald-400" />;
      case "goat": return <Shield className="w-4 h-4 text-lime-400" />;
      case "pig": return <Circle className="w-4 h-4 text-rose-400" />;
      case "integrated": return <RefreshCw className="w-4 h-4 text-emerald-300" />;
      default: return <Layers className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div
      className="space-y-6"
      id={mode === "crops" ? "crop-academy-section" : mode === "animals" ? "animal-farming-section" : "farming-academy-section"}
    >
      {/* Banner */}
      <div className={`text-white rounded-3xl p-6 shadow-md relative overflow-hidden ${
        mode === "animals"
          ? "bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 border border-amber-900/30"
          : "bg-gradient-to-br from-emerald-900 to-teal-950"
      }`}>
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-12 translate-y-12">
          {mode === "animals" ? (
            <Milk className="w-80 h-80 text-amber-300" />
          ) : (
            <Layers className="w-80 h-80 text-emerald-300" />
          )}
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest block w-max">
              {mode === "animals" ? "🐄 Livestock & Husbandry Academy" : "🌾 Crop Agronomy Academy"}
            </span>
            <span className="bg-amber-500/20 text-amber-200 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
              {mode === "animals" ? "Veterinary & ICAR Verified" : "ICAR & Agri-Extension Verified"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {mode === "animals" ? localT("Animal Farming & Husbandry") : mode === "crops" ? localT("Crop Academy") : localT("Farming & Livestock Academy")}
          </h2>
          <p className="text-emerald-100 text-xs mt-1.5 leading-relaxed">
            {mode === "animals"
              ? localT("Practical video guides for livestock rearing, dairy, poultry, beekeeping, and sustainable aquaculture.")
              : localT("Grow seasonal and off-season crops with step-by-step video lessons.")}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
        <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl w-full md:w-auto">
          {mode === "crops" ? (
            <>
              <button
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "all" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {localT("All Crops")}
              </button>
              <button
                onClick={() => setFilterType("seasonal")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "seasonal" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🌾 {localT("Seasonal Crops")}
              </button>
              <button
                onClick={() => setFilterType("off-season")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "off-season" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🌱 {localT("Off-Season & Hydroponics")}
              </button>
            </>
          ) : mode === "animals" ? (
            <>
              <button
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "all" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {localT("All Animal Farming")}
              </button>
              <button
                onClick={() => setFilterType("ruminants")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "ruminants" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🥛 {localT("Dairy & Ruminants")}
              </button>
              <button
                onClick={() => setFilterType("poultry-pig")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "poultry-pig" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🐔 {localT("Poultry & Piggery")}
              </button>
              <button
                onClick={() => setFilterType("aqua-eco")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "aqua-eco" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🐟 {localT("Aquaculture & Eco")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "all" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {localT("All Guides")}
              </button>
              <button
                onClick={() => setFilterType("seasonal")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "seasonal" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🌾 {localT("Seasonal Crops")}
              </button>
              <button
                onClick={() => setFilterType("off-season")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "off-season" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🌱 {localT("Off-Season Crops")}
              </button>
              <button
                onClick={() => setFilterType("livestock")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "livestock" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🐄 {localT("Livestock & Aquaculture")}
              </button>
            </>
          )}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={mode === "animals" ? localT("Search livestock guides, breeds, housing, vaccination...") : localT("Search crop guides, sowing steps, varieties...")}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs text-slate-700"
          />
        </div>
      </div>

      {/* Course & Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => {
          const loc = getLocalizedGuide(guide);
          const progressPercent = calculateCourseProgress(guide);
          const isExpanded = expandedCourseId === guide.id;
          const firstLesson = guide.modules[0]?.lessons[0];

          return (
            <div
              key={guide.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col group"
              id={`academy-card-${guide.id}`}
            >
              {/* Card Image & Play Trigger with Graceful Fallback */}
              <div className="aspect-video w-full relative overflow-hidden bg-slate-900">
                {!imageErrors[guide.id] ? (
                  <img
                    src={guide.image}
                    alt={guide.imageAlt || loc.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageErrors(prev => ({ ...prev, [guide.id]: true }))}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-4">
                    <div className="p-3 bg-white/10 rounded-2xl mb-2 backdrop-blur-xs">
                      {getCategoryIcon(guide.categoryCode)}
                    </div>
                    <span className="font-extrabold text-sm text-center">{loc.name}</span>
                    <span className="text-[10px] text-emerald-300 font-bold mt-0.5">{loc.season}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-all flex items-center justify-center">
                  <button
                    onClick={() => firstLesson && handleOpenLessonVideo(guide, firstLesson)}
                    className="p-4 bg-emerald-500/90 hover:bg-emerald-500 hover:scale-110 text-white rounded-full shadow-lg transition-all flex items-center justify-center border-4 border-white/30 backdrop-blur-xs cursor-pointer"
                    title="Watch tutorial video lesson"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>
                </div>

                {/* Labels & Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider ${
                    guide.type === "seasonal" ? "bg-emerald-600" : guide.type === "off-season" ? "bg-teal-600" : "bg-indigo-600"
                  }`}>
                    {guide.type === "seasonal" ? "Seasonal Crop" : guide.type === "off-season" ? "Off-Season Smarts" : "Livestock Masterclass"}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    ⏱ {guide.videoLength} Video Lesson
                  </span>
                </div>

                {/* Progress pill on top right */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/10">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{localT("Learning Progress")}: {progressPercent}%</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                        {getCategoryIcon(guide.categoryCode)}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800">{loc.name}</h3>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      {loc.season}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{loc.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>{localT("Learning Progress")}</span>
                    <span className="text-emerald-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Specific metrics if available */}
                {(guide.soilType || guide.waterLevel) && (
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[10px]">
                    <div>
                      <span className="text-slate-400 block">{localT("Soil:")}</span>
                      <span className="font-bold text-slate-700 truncate block">{guide.soilType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{localT("Watering:")}</span>
                      <span className="font-bold text-slate-700 truncate block">{guide.waterLevel}</span>
                    </div>
                  </div>
                )}

                {/* Steps Accordion / Details */}
                <div className="space-y-2.5 border-t border-slate-100 pt-3.5">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {localT("Sowing & Harvesting Steps")}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {loc.steps.slice(0, 3).map((step, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[9px] mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-700 block text-[11px]">{step.title}</span>
                          <span className="text-slate-400 text-[10px] leading-relaxed block">{step.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured Lessons & Video Accordion */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setExpandedCourseId(isExpanded ? null : guide.id)}
                    className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      {isExpanded ? (translations[preferredLanguage]?.["Hide Lessons"] || "Hide Lessons") : localT("Open Lessons & Videos")} ({guide.modules.flatMap(m => m.lessons).length})
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                      {guide.modules.map((mod) => (
                        <div key={mod.id} className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                          <h5 className="font-extrabold text-[11px] text-slate-700 uppercase tracking-wide">
                            📂 {mod.title}
                          </h5>
                          <div className="space-y-1.5">
                            {mod.lessons.map((lesson, lIdx) => {
                              const isDone = Boolean(completedLessons[lesson.id]);
                              return (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 shadow-2xs transition-all gap-2"
                                >
                                  <div className="flex items-start gap-2.5 min-w-0">
                                    <span className="font-mono font-bold text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                                      0{lIdx + 1}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate">{lesson.title}</p>
                                      <span className="text-[10px] text-slate-400">⏱ {lesson.videoDuration}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => handleToggleComplete(lesson.id)}
                                      className={`p-1 rounded-lg text-[10px] font-bold transition-all ${
                                        isDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400 hover:text-slate-600"
                                      }`}
                                      title={isDone ? "Completed" : "Mark as complete"}
                                    >
                                      <CheckCircle className={`w-3.5 h-3.5 ${isDone ? "fill-emerald-600 text-white" : ""}`} />
                                    </button>
                                    <button
                                      onClick={() => handleOpenLessonVideo(guide, lesson)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                    >
                                      <Play className="w-3 h-3 fill-white" />
                                      <span>{localT("Watch Lesson")}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Watch Lesson Trigger */}
                {firstLesson && (
                  <button
                    onClick={() => handleOpenLessonVideo(guide, firstLesson)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer shadow-2xs group-hover:bg-emerald-600 group-hover:text-white"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{localT("Watch Lesson")} ({guide.videoLength})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional YouTube Video Player Modal */}
      {activeLesson && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 backdrop-blur-sm">
          <div
            className={`bg-slate-900 text-white rounded-2xl sm:rounded-3xl overflow-hidden ${
              isTheaterMode ? "max-w-6xl" : "max-w-4xl xl:max-w-5xl"
            } w-full border border-slate-800 shadow-2xl relative flex flex-col max-h-[94vh] transition-all duration-300`}
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >

            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-slate-950/95 border-b border-slate-800/80 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Video className="w-5 h-5 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      {activeLesson.categoryName}
                    </span>
                    <span className="text-slate-400 text-[10px]">⏱ {activeLesson.lesson.videoDuration}</span>
                    <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-sky-400" />
                      HD / 1080p
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white truncate mt-0.5">{activeLesson.lesson.title}</h4>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => setIsTheaterMode(prev => !prev)}
                  title={isTheaterMode ? localT("Standard View") : localT("Theater Mode")}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                >
                  {isTheaterMode ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-sky-400" />}
                  <span className="text-[11px] hidden md:inline">{isTheaterMode ? localT("Default") : localT("Theater Mode")}</span>
                </button>
                <button
                  onClick={handleCloseVideo}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Responsive 16:9 YouTube Player Frame */}
            <div
              className="aspect-video w-full bg-black relative shrink-0 overflow-hidden"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              {activeLesson.lesson.youtubeVideoId && activeLesson.lesson.youtubeVideoId !== "pending" ? (
                <iframe
                  key={activeLesson.lesson.youtubeVideoId}
                  src={`https://www.youtube.com/embed/${activeLesson.lesson.youtubeVideoId}?autoplay=1&rel=0&enablejsapi=1&playsinline=1${typeof window !== "undefined" && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : ""}`}
                  title={activeLesson.lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  loading="eager"
                  className="w-full h-full border-0 block"
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "16/9",
                    border: "none",
                    display: "block"
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-400">
                  <Video className="w-12 h-12 text-amber-500 mb-2 animate-bounce" />
                  <h5 className="text-white font-bold text-sm">Educational Video Pending Verification</h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">Our agricultural agronomy team is currently vetting and curating official high-definition instructional video for this lesson.</p>
                </div>
              )}
            </div>

            {/* Modal Footer / Details (Scrollable) */}
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950 overflow-y-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
                <div className="min-w-0">
                  <h5 className="font-extrabold text-sm text-white">{activeLesson.lesson.title}</h5>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{activeLesson.lesson.content}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>💡 {localT("Tip: Click the YouTube gear icon ⚙️ inside the player to lock quality to 1080p/720p HD.")}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleComplete(activeLesson.lesson.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      completedLessons[activeLesson.lesson.id]
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{completedLessons[activeLesson.lesson.id] ? localT("Completed") : localT("Mark as Completed")}</span>
                  </button>

                  {activeLesson.lesson.youtubeVideoId && activeLesson.lesson.youtubeVideoId !== "pending" && (
                    <a
                      href={`https://www.youtube.com/watch?v=${activeLesson.lesson.youtubeVideoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>{localT("Watch on YouTube")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Lesson Key Steps / Outline */}
              {activeLesson.lesson.steps && activeLesson.lesson.steps.length > 0 && (
                <div className="space-y-2">
                  <h6 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Key Learning Steps:
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeLesson.lesson.steps.map((step, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="font-bold text-emerald-400 block text-[11px] mb-0.5">
                          {localT("Step")} {idx + 1}: {step.title}
                        </span>
                        <p className="text-slate-400 text-[10px] leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
