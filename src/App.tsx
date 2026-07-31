import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sprout, 
  Camera, 
  ShieldAlert, 
  Leaf, 
  Droplets, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  LogOut, 
  User, 
  FileDown, 
  Heart, 
  PlusCircle, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Video,
  Play,
  ShoppingBag
} from "lucide-react";

import AuthScreen from "./components/AuthScreen.tsx";
import CameraCapture from "./components/CameraCapture.tsx";
import FieldGuideCard from "./components/FieldGuideCard.tsx";
import DiseaseDetector from "./components/DiseaseDetector.tsx";
import Planners from "./components/Planners.tsx";
import WeatherAdvisor from "./components/WeatherAdvisor.tsx";
import GovSchemes from "./components/GovSchemes.tsx";
import AICompanion from "./components/AICompanion.tsx";
import AnalyticsDashboard from "./components/AnalyticsDashboard.tsx";
import NotificationPanel from "./components/NotificationPanel.tsx";
import FloatingHelper from "./components/FloatingHelper.tsx";
import CropAcademy from "./components/CropAcademy.tsx";

// Marketplace, Role-Based and Direct Chat Dashboards
import MarketplaceBuy from "./components/MarketplaceBuy.tsx";
import MarketplaceSell from "./components/MarketplaceSell.tsx";
import SellerDashboard from "./components/SellerDashboard.tsx";
import BuyerDashboard from "./components/BuyerDashboard.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
import MarketplaceChats from "./components/MarketplaceChats.tsx";
import OrderHistory from "./components/OrderHistory.tsx";

import logoImg from "./assets/images/krishi_saathi_logo_1784057751281.jpg";
import farmBgImg from "./assets/images/farm_background_1784198819057.jpg";

// Mock Guest Farmer Profile for instant interactive state if not registered
const GUEST_FARMER = {
  id: "guest-1",
  name: "Ramesh Patil",
  email: "ramesh.patil@krishisaathi.com",
  role: "farmer" as const,
  mobile: "9876543210",
  country: "India",
  state: "Maharashtra",
  district: "Pune",
  village: "Khed",
  landArea: 1.5,
  soilType: "Loamy",
  preferredLanguage: "en" as const,
  createdAt: new Date().toISOString()
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentUnit, setCurrentUnit] = useState<"Acres" | "Bigha" | "Hectares" | "Guntha">("Acres");

  const convertLandArea = (acres: number, unit: "Acres" | "Bigha" | "Hectares" | "Guntha"): number => {
    switch (unit) {
      case "Bigha":
        return acres * 1.61; // 1 Acre = 1.61 Bigha (standard India average)
      case "Hectares":
        return acres * 0.4047; // 1 Acre = 0.4047 Hectare
      case "Guntha":
        return acres * 40; // 1 Acre = 40 Guntha
      case "Acres":
      default:
        return acres;
    }
  };

  const currentUnitLabel = (unit: "Acres" | "Bigha" | "Hectares" | "Guntha", lang: "en" | "hi" | "mr") => {
    const unitLabels = {
      en: { Acres: "Acres", Bigha: "Bigha", Hectares: "Hectares", Guntha: "Guntha" },
      hi: { Acres: "एकड़", Bigha: "बीघा", Hectares: "हेक्टेयर", Guntha: "गुंठा" },
      mr: { Acres: "एकर", Bigha: "बिघा", Hectares: "हेक्टर", Guntha: "गुंठा" },
    };
    return unitLabels[lang]?.[unit] || unitLabels.en[unit];
  };

  const formatLandArea = (acres: number, unit: "Acres" | "Bigha" | "Hectares" | "Guntha") => {
    const converted = convertLandArea(acres, unit);
    const formatted = converted.toFixed(2);
    const lang = user?.preferredLanguage || "en";
    return `${formatted} ${currentUnitLabel(unit, lang)}`;
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      hi: {
        "Your Farm Metrics": "आपके खेत की जानकारी",
        "Total Land:": "कुल भूमि:",
        "Country:": "देश:",
        "Soil Profile:": "मिट्टी का प्रकार:",
        "Village:": "गाँव:",
        "District/State:": "जिला/राज्य:",
        "Dashboard Hub": "डैशबोर्ड हब",
        "Snap & Know ID": "फोटो लें और जानें",
        "Disease Diagnose": "रोग निदान",
        "Fertilizer & Water": "उर्वरक और सिंचाई",
        "Govt Schemes": "सरकारी योजनाएं",
        "Crop Academy 🎥": "फसल अकादमी 🎥",
        "Featured Sowing Lessons": "विशेष बुवाई पाठ",
        "View All Academy": "सभी अकादमी देखें",
        "Winter Rabi": "सर्दियों की रबी",
        "High-Yield Wheat Guide": "उच्च उपज गेहूं गाइड",
        "Learn spacing & CRI watering stages": "दूरी और CRI सिंचाई चरणों को जानें",
        "mins lesson": "मिनट का पाठ",
        "Off-Season": "गैर-मौसमी (ऑफ़-सीज़न)",
        "Cucumber Polyhouse": "खीरा पॉलीहाउस",
        "Maximize yield during heavy monsoon": "भारी मानसून के दौरान उपज अधिकतम करें",
        "AI Companion": "एआई साथी",
        "Analytics Yield": "उपज विश्लेषण",
        "Smart Sustainable Farming": "स्मार्ट टिकाऊ खेती",
        "Guest Mode Active": "अतिथि मोड सक्रिय",
        "Create Real Profile Now": "वास्तविक प्रोफ़ाइल अभी बनाएं",
        "Your Active Farm Guide": "आपका सक्रिय कृषि गाइड",
        "Active Agronomist Bot": "सक्रिय कृषि वैज्ञानिक बॉट",
        "Schedules & Alerts": "शेड्यूल और अलर्ट",
        "Logout": "लॉगआउट",
        "Database Export": "डेटाबेस निर्यात",
        "Database Export Description": "कृषि साथी स्कीमा के लिए पूरी तरह से सामान्यीकृत MySQL DDL स्क्रिप्ट और सीड का निरीक्षण/डाउनलोड करें।"
      },
      bho: {
        "Your Farm Metrics": "रउआ खेत के जानकारी",
        "Total Land:": "कुल जमीन:",
        "Country:": "देश:",
        "Soil Profile:": "मिट्टी के प्रकार:",
        "Village:": "गाँव:",
        "District/State:": "जिला/राज्य:",
        "Dashboard Hub": "डैशबोर्ड हब",
        "Snap & Know ID": "फोटो खींचीं अउर जानीं",
        "Disease Diagnose": "रोग निदान",
        "Fertilizer & Water": "खाद अउर सिंचाई",
        "Govt Schemes": "सरकारी योजना",
        "Crop Academy 🎥": "फसल अकादमी 🎥",
        "Featured Sowing Lessons": "विशेष बोआई पाठ",
        "View All Academy": "सब अकादमी देखीं",
        "Winter Rabi": "जाड़ा के रबी",
        "High-Yield Wheat Guide": "अधिक पैदावार गेहूं गाइड",
        "Learn spacing & CRI watering stages": "दूरी अउर CRI सिंचाई के तरीका सीखीं",
        "mins lesson": "मिनट के पाठ",
        "Off-Season": "बिना-मौसम (ऑफ़-सीज़न)",
        "Cucumber Polyhouse": "खीरा पॉलीहाउस",
        "Maximize yield during heavy monsoon": "भारी बरसात में पैदावार बढ़ाईं",
        "AI Companion": "एआई साथी",
        "Analytics Yield": "पैदावार विश्लेषण",
        "Smart Sustainable Farming": "स्मार्ट टिकाऊ खेती",
        "Guest Mode Active": "अतिथि मोड सक्रिय",
        "Create Real Profile Now": "असली प्रोफ़ाइल अभी बनाईं",
        "Your Active Farm Guide": "रउआ सक्रिय कृषि गाइड",
        "Active Agronomist Bot": "सक्रिय कृषि वैज्ञानिक बॉट",
        "Schedules & Alerts": "शेड्यूल अउर अलर्ट",
        "Logout": "लॉगआउट",
        "Database Export": "डेटाबेस निर्यात",
        "Database Export Description": "कृषि साथी स्कीमा खातिर MySQL DDL स्क्रिप्ट अउर सीड डाउनलोड करीं।"
      },
      mr: {
        "Your Farm Metrics": "तुमच्या शेतीची माहिती",
        "Total Land:": "एकूण जमीन:",
        "Country:": "देश:",
        "Soil Profile:": "मातीचा प्रकार:",
        "Village:": "गाव:",
        "District/State:": "जिल्हा/राज्य:",
        "Dashboard Hub": "डॅशबोर्ड हब",
        "Snap & Know ID": "फोटो काढा आणि ओळखा",
        "Disease Diagnose": "रोग निदान",
        "Fertilizer & Water": "खत आणि पाणी",
        "Govt Schemes": "शासकीय योजना",
        "Crop Academy 🎥": "पीक अकादमी 🎥",
        "Featured Sowing Lessons": "निवडक लागवड धडे",
        "View All Academy": "सर्व अकादमी पहा",
        "Winter Rabi": "हिवाळी रब्बी पीक",
        "High-Yield Wheat Guide": "अधिक उत्पन्न देणारे गहू मार्गदर्शक",
        "Learn spacing & CRI watering stages": "योग्य अंतर व पाण्याचे टप्पे शिका",
        "mins lesson": "मिनिटांचा धडा",
        "Off-Season": "बिगर-हंगामी शेती",
        "Cucumber Polyhouse": "काकडी पॉलीहाऊस तंत्र",
        "Maximize yield during heavy monsoon": "मुसळधार पावसातही अधिक उत्पादन घ्या",
        "AI Companion": "एआय सोबती",
        "Analytics Yield": "उत्पादन विश्लेषण",
        "Smart Sustainable Farming": "स्मार्ट शाश्वत शेती",
        "Guest Mode Active": "अतिथी मोड सक्रिय",
        "Create Real Profile Now": "वास्तविक प्रोफाइल आता तयार करा",
        "Your Active Farm Guide": "तुमचे सक्रिय शेती मार्गदर्शक",
        "Active Agronomist Bot": "सक्रिय कृषी तज्ज्ञ बॉट",
        "Schedules & Alerts": "शेड्यूल आणि अलर्ट",
        "Logout": "लॉगआउट",
        "Database Export": "डेटाबेस निर्यात",
        "Database Export Description": "कृषि साथी स्कीमासाठी पूर्णपणे सामान्यीकृत MySQL DDL स्क्रिप्ट आणि सीडचे निरीक्षण/डाउनलोड करा।"
      }
    };

    const currentLang = user?.preferredLanguage || "en";
    return translations[currentLang]?.[key] || key;
  };

  // Feature 9 Plant ID Specific States
  const [plantPhoto, setPlantPhoto] = useState<string | null>(null);
  const [soilPhoto, setSoilPhoto] = useState<string | null>(null);
  const [isCapturingSoil, setIsCapturingSoil] = useState(false);
  const [plantIdLoading, setPlantIdLoading] = useState(false);
  const [plantIdResult, setPlantIdResult] = useState<any>(null);
  const [plantIdError, setPlantIdError] = useState<string | null>(null);
  const [idLogs, setIdLogs] = useState<any[]>([]);

  // Notifications Floating State
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Chat Navigation States for Role-based Direct Messenger Integration
  const [chatPartnerId, setChatPartnerId] = useState<string | null>(null);
  const [chatPartnerName, setChatPartnerName] = useState<string | null>(null);

  // Real-time weather alert check states
  const [activeWeatherAlert, setActiveWeatherAlert] = useState<{
    title: string;
    message: string;
    district: string;
    state: string;
    severity: "warning" | "danger" | "info";
    saved?: boolean;
  } | null>(null);
  const [showWeatherToast, setShowWeatherToast] = useState(false);

  const checkRealtimeWeatherAlert = async (districtName: string, stateName: string) => {
    try {
      const res = await axios.get(`/api/weather/current?district=${districtName}&state=${stateName}`);
      const weatherData = res.data;
      if (weatherData && weatherData.alert && !weatherData.alert.toLowerCase().includes("no immediate climate alerts")) {
        setActiveWeatherAlert({
          title: weatherData.rainfallPrediction || "Severe Weather Forecasted",
          message: weatherData.alert,
          district: districtName,
          state: stateName,
          severity: "warning",
          saved: false
        });
        setShowWeatherToast(true);
      }
    } catch (err) {
      console.error("Error running weather alert check:", err);
    }
  };

  // Helper to save simulated or real alert to notifications list
  const saveWeatherAlertToDb = async () => {
    if (!activeWeatherAlert || !user) return;
    try {
      await axios.post("/api/notifications", {
        userId: user.id,
        title: `⚠️ ${activeWeatherAlert.title} in ${activeWeatherAlert.district}`,
        message: activeWeatherAlert.message,
        type: "warning"
      });
      setActiveWeatherAlert(prev => prev ? { ...prev, saved: true } : null);
    } catch (err) {
      console.error("Failed to save weather alert notification:", err);
    }
  };

  const handleChatNavigate = (partnerId: string, partnerName: string) => {
    setChatPartnerId(partnerId);
    setChatPartnerName(partnerName);
    setActiveTab("chats");
  };

  // Check for severe weather when user is logged in or changed
  useEffect(() => {
    if (user && user.district && user.state) {
      checkRealtimeWeatherAlert(user.district, user.state);
    }
  }, [user]);

  // Load guest session or stored token on startup
  useEffect(() => {
    // Default to Guest Farmer to guarantee an immediate, highly functional zero-friction experience!
    setUser(GUEST_FARMER);
    setToken(`mock-jwt-token-guest-1`);
    fetchPlantIdLogs("guest-1");
  }, []);

  const handleAuthSuccess = (authUser: any, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    if (authUser.role === "seller") {
      setActiveTab("seller-dashboard");
    } else if (authUser.role === "buyer") {
      setActiveTab("buyer-dashboard");
    } else if (authUser.role === "admin") {
      setActiveTab("admin-dashboard");
    } else {
      setActiveTab("dashboard");
    }
    fetchPlantIdLogs(authUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPlantIdResult(null);
    setPlantPhoto(null);
    setSoilPhoto(null);
    setActiveTab("dashboard");
  };

  const fetchPlantIdLogs = async (uid: string) => {
    try {
      const res = await axios.get(`/api/plant-id/logs?userId=${uid}`);
      setIdLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
  };

  // Flagship Feature 9: Snap & Know analysis submission
  const runPlantIdAnalysis = async () => {
    if (!plantPhoto) return;
    setPlantIdLoading(true);
    setPlantIdError(null);
    setPlantIdResult(null);

    try {
      const response = await axios.post("/api/plant-id/analyze", {
        plantPhoto,
        soilPhoto: soilPhoto || undefined,
        userId: user?.id,
        preferredLanguage: user?.preferredLanguage || "en"
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setPlantIdResult(response.data.result);
      if (user?.id) {
        fetchPlantIdLogs(user.id);
      }
    } catch (err: any) {
      console.error(err);
      setPlantIdError(err.response?.data?.error || err.message || "Failed to analyze plant photos.");
    } finally {
      setPlantIdLoading(false);
    }
  };

  // Section 9.4: Save Identified Plant to Farm Records (Auto Populator)
  const saveIdentifiedCrop = () => {
    if (!plantIdResult) return;
    
    // Auto-fill crop name and switch tab directly to Planners to preview suggested schedules!
    alert(`Successfully synced "${plantIdResult.identity.commonName}" into your active farming record! Swapping to Planners.`);
    setActiveTab("planners");
  };

  const resetPlantIdState = () => {
    setPlantPhoto(null);
    setSoilPhoto(null);
    setIsCapturingSoil(false);
    setPlantIdResult(null);
    setPlantIdError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden" id="applet-main-body">
      {/* Subtle Farm Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.09] bg-cover bg-center bg-no-repeat bg-fixed -z-10"
        style={{ backgroundImage: `url(${farmBgImg})` }}
      />
      {/* Decorative organic color glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 md:px-8 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500 shadow-sm shrink-0">
            <img 
              src={logoImg} 
              alt="Krishi Saathi Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-800 tracking-tight leading-none">
              Krishi Saathi
            </h1>
            <span className="text-[9px] font-bold text-emerald-600 block uppercase tracking-wider mt-0.5">
              Smart Sustainable Farming
            </span>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            {/* Display language selector choice */}
            <div className="relative">
              <select
                value={user.preferredLanguage}
                onChange={(e) => {
                  const newLang = e.target.value as any;
                  setUser((prev: any) => ({ ...prev, preferredLanguage: newLang }));
                }}
                className="text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer outline-none transition-all shadow-xs"
                id="language-selector-dropdown"
              >
                <option value="en">English 🇺🇸</option>
                <option value="hi">हिंदी (Hindi) 🇮🇳</option>
                <option value="bho">भोजपुरी (Bhojpuri) 🇮🇳</option>
                <option value="mr">मराठी (Marathi) 🇮🇳</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ) 🇮🇳</option>
                <option value="ta">Tamil (தமிழ்) 🇮🇳</option>
                <option value="te">Telugu (తెలుగు) 🇮🇳</option>
                <option value="bn">Bengali (বাংলা) 🇮🇳</option>
                <option value="es">Spanish (Español) 🇪🇸</option>
                <option value="vi">Vietnamese (Tiếng Việt) 🇻🇳</option>
                <option value="sw">Swahili (Kiswahili) 🇰🇪</option>
              </select>
            </div>

            {/* Display profile stats summary */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-none">{user.name}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {user.village ? `${user.village}, ` : ""}{user.district}
              </span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-slate-600 transition-all relative"
                title="Schedules & Alerts"
                id="btn-trigger-notif"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-ping" />
              </button>

              {showNotifPanel && (
                <NotificationPanel 
                  userId={user.id} 
                  onClose={() => setShowNotifPanel(false)} 
                />
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-100 text-slate-600 hover:text-rose-600 transition-all"
              title="Logout"
              id="btn-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-20 lg:pb-6">
        
        {/* Left Sidebar Menu / Guest Notice */}
        <div className="col-span-1 space-y-4">
          {/* Guest Notice Badge if using guest */}
          {user?.id === "guest-1" && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Guest Mode Active
              </span>
              <p className="text-[11px] leading-relaxed opacity-95">
                You are playing with a sample pre-loaded farm profile. Register your own custom village location, soil metrics, and languages below.
              </p>
              <button
                onClick={handleLogout}
                className="text-[10px] font-bold underline text-emerald-700 hover:text-emerald-800 mt-1 block"
                id="btn-register-from-guest"
              >
                Create Real Profile Now
              </button>
            </div>
          )}

          {/* User profile details block */}
          {user && (
            <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-xs space-y-3" id="profile-details-sidebar">
              {user.role === "farmer" && (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t("Your Farm Metrics")}</h4>
                  </div>

                  <div className="text-xs space-y-2.5 text-slate-600 pt-1">
                    <div className="border-b border-slate-50 pb-2.5 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{t("Total Land:")}</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded-lg text-xs">
                          {formatLandArea(user.landArea, currentUnit)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-slate-400 italic">Convert Unit:</span>
                        <select
                          value={currentUnit}
                          onChange={(e) => setCurrentUnit(e.target.value as any)}
                          className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 px-2 py-1 rounded-lg outline-none cursor-pointer transition-all font-bold"
                          id="land-unit-selector"
                        >
                          <option value="Acres">{currentUnitLabel("Acres", user.preferredLanguage)}</option>
                          <option value="Bigha">{currentUnitLabel("Bigha", user.preferredLanguage)}</option>
                          <option value="Hectares">{currentUnitLabel("Hectares", user.preferredLanguage)}</option>
                          <option value="Guntha">{currentUnitLabel("Guntha", user.preferredLanguage)}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">{t("Country:")}</span>
                      <span className="font-semibold text-slate-800">{user.country || "India"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">{t("Soil Profile:")}</span>
                      <span className="font-semibold text-slate-800">{user.soilType}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">{t("Village:")}</span>
                      <span className="font-semibold text-slate-800">{user.village || "Khed"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t("District/State:")}</span>
                      <span className="font-semibold text-slate-800">{user.district}, {user.state}</span>
                    </div>
                  </div>
                </>
              )}

              {user.role === "seller" && (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Seller Profile</h4>
                  </div>

                  <div className="text-xs space-y-2.5 text-slate-600 pt-1">
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">Company:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px] block text-right">{user.companyName || "My Store"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">GST:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[120px] block text-right">{user.gstNumber || "Not Provided"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">Country:</span>
                      <span className="font-semibold text-slate-800">{user.country || "India"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">State:</span>
                      <span className="font-semibold text-slate-800">{user.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${user.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {user.isVerified ? "Verified Dealership" : "Awaiting Verification"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {user.role === "buyer" && (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Buyer Profile</h4>
                  </div>

                  <div className="text-xs space-y-2.5 text-slate-600 pt-1">
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">Representative:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px] block text-right">{user.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">Buyer Type:</span>
                      <span className="font-semibold text-slate-800 uppercase text-[9px]">{user.buyerType || "wholesaler"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">Country:</span>
                      <span className="font-semibold text-slate-800">{user.country || "India"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">State:</span>
                      <span className="font-semibold text-slate-800">{user.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${user.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {user.isVerified ? "Verified Trader" : "Awaiting Verification"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-indigo-800 text-xs uppercase tracking-wider">Admin Center</h4>
                  </div>

                  <div className="text-xs space-y-2.5 text-slate-600 pt-1">
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-slate-400">Role:</span>
                      <span className="font-black text-indigo-600 uppercase text-[10px]">Root Administrator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Workspace Status:</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">Secured 🛡️</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick Nav Panel */}
          {user && (
            <nav className="bg-white border border-gray-100 rounded-3xl p-3 shadow-xs flex flex-row lg:flex-col gap-1 overflow-x-auto shrink-0 scrollbar-none">
              {(user.role === "farmer" ? [
                { id: "dashboard", label: "Dashboard Hub", icon: Sprout },
                { id: "farmer-buy", label: "Buy Fertilizers & Equipment 🏪", icon: ShoppingBag, highlight: true },
                { id: "farmer-sell", label: "Sell Crops 🌾", icon: Sprout, highlight: true },
                { id: "order-history", label: "Order History 🧾", icon: FileText },
                { id: "chats", label: "Direct Trade Chats 💬", icon: MessageSquare },
                { id: "snap", label: "Snap & Know ID", icon: Camera },
                { id: "academy", label: "Crop Academy 🎥", icon: Video },
                { id: "disease", label: "Disease Diagnose", icon: ShieldAlert },
                { id: "planners", label: "Fertilizer & Water", icon: Leaf },
                { id: "schemes", label: "Govt Schemes", icon: FileText },
                { id: "chat", label: "AI Companion", icon: MessageSquare },
                { id: "charts", label: "Analytics Yield", icon: BarChart3 }
              ] : user.role === "seller" ? [
                { id: "seller-dashboard", label: "My Dealer Store 🏪", icon: ShoppingBag, highlight: true },
                { id: "order-history", label: "Order History 🧾", icon: FileText },
                { id: "chats", label: "Direct Trade Chats 💬", icon: MessageSquare },
                { id: "weather", label: "Regional Weather 🌦️", icon: Droplets },
                { id: "schemes", label: "Govt Schemes 📄", icon: FileText }
              ] : user.role === "buyer" ? [
                { id: "buyer-dashboard", label: "Browse & Buy Crops 🌾", icon: Sprout, highlight: true },
                { id: "order-history", label: "Order History 🧾", icon: FileText },
                { id: "chats", label: "Direct Trade Chats 💬", icon: MessageSquare },
                { id: "weather", label: "Weather & Market 🌦️", icon: Droplets }
              ] : [
                { id: "admin-dashboard", label: "Admin Workspace ⚙️", icon: ShieldAlert, highlight: true },
                { id: "order-history", label: "Order History 🧾", icon: FileText },
                { id: "chats", label: "Direct Trade Chats 💬", icon: MessageSquare }
              ]).map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); if (item.id === "snap") resetPlantIdState(); }}
                    className={`px-4 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2.5 shrink-0 w-auto lg:w-full ${
                      activeTab === item.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : item.highlight
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                    id={`sidebar-nav-${item.id}`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{t(item.label)}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* SQL Seed Downloader Banner */}
          {user && (
            <div className="hidden lg:block p-4 bg-slate-50 border rounded-2xl text-xs space-y-1">
              <span className="font-bold text-slate-700 block">{t("Database Export")}</span>
              <p className="text-[10px] text-slate-400 leading-normal">
                {t("Database Export Description")}
              </p>
              <a
                href="/api/db/create-script"
                target="_blank"
                className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 mt-1.5"
              >
                Download SQL Script <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Center / Right Content Panel */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {!user ? (
            <AuthScreen onSuccess={handleAuthSuccess} />
          ) : (
            <>
              {/* Tab: Dashboard Hub */}
              {activeTab === "dashboard" && (
                <div className="space-y-6" id="dashboard-hub">
                  {/* Weather widget quick preview */}
                  <WeatherAdvisor 
                    userId={user.id} 
                    defaultState={user.state} 
                    defaultDistrict={user.district} 
                    defaultSoilType={user.soilType} 
                  />

                  {/* Real-time Weather Alert Control Station */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="weather-alert-control-station">
                    <div className="absolute top-0 left-0 w-1.5 bg-rose-500 h-full" />
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl mt-0.5 animate-pulse shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Real-Time Climate Sentinel</h4>
                          <span className="text-[9px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE MONITOR</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-800 mt-1">Severe Weather Forecaster & Alerts</h3>
                        <p className="text-xs text-slate-500 max-w-xl leading-relaxed mt-0.5">
                          Monitors atmospheric parameters in <span className="font-semibold text-emerald-600">{user.district}, {user.state}</span>. Trigger a simulated extreme climate forecast to preview live emergency recommendations and toast broadcasts.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        onClick={async () => {
                          await checkRealtimeWeatherAlert(user.district, user.state);
                        }}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
                        id="btn-trigger-realtime-check"
                      >
                        Check Now
                      </button>
                      <button
                        onClick={() => {
                          const alerts = [
                            {
                              title: "Severe Hailstorm Warning ⛈️",
                              message: `Large hail and violent winds forecasted for ${user.district} district. Cover delicate cash crops immediately and move cattle to sturdy shelters.`,
                              severity: "danger" as const
                            },
                            {
                              title: "Flash Flood Warning 🌊",
                              message: `Torrential rainfall exceeding 120mm forecasted in ${user.district} area. Clear all channel blockages, elevate stored grains, and stay away from low-lying streams.`,
                              severity: "danger" as const
                            },
                            {
                              title: "Excessive Heatwave Alert 🥵",
                              message: `Temperatures predicted to breach 44°C. Apply dense organic mulch to prevent root scorch and deploy micro-sprinklers in early mornings.`,
                              severity: "warning" as const
                            },
                            {
                              title: "Cyclone Advisory 🌀",
                              message: `Strong cyclonic wind bands expected. Prune unstable overhanging branches, secure polyhouse tarpaulins, and avoid heavy field operations.`,
                              severity: "danger" as const
                            }
                          ];
                          const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
                          setActiveWeatherAlert({
                            ...randomAlert,
                            district: user.district,
                            state: user.state,
                            saved: false
                          });
                          setShowWeatherToast(true);
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-rose-100 flex items-center gap-1.5 shadow-xs cursor-pointer"
                        id="btn-simulate-severe-forecast"
                      >
                        ⚡ Simulate Severe Forecast
                      </button>
                    </div>
                  </div>

                  {/* Feature 9 Shortcut Capture Row */}
                  <div className="bg-emerald-50 border border-emerald-100/50 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-emerald-950">"Snap & Know": Botanist-Grade Plant ID</h4>
                        <p className="text-xs text-emerald-800 leading-relaxed max-w-md mt-0.5">
                          Taps into a field botanist & agronomist in your pocket. Capture any plant, weed or sapling, evaluate companion planting and soil compatibility.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setActiveTab("snap"); resetPlantIdState(); }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
                      id="btn-shortcut-snap-know"
                    >
                      <Camera className="w-4 h-4" /> Start Snap & Know
                    </button>
                  </div>

                  {/* Featured Crop Lessons Front & Center */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-emerald-600 animate-pulse" /> {t("Featured Sowing Lessons")}
                      </h4>
                      <button
                        onClick={() => setActiveTab("academy")}
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {t("View All Academy")} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setActiveTab("academy")}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex gap-3.5 p-3.5"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                          <img 
                            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200" 
                            alt="Wheat Cultivation" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{t("Winter Rabi")}</span>
                            <h5 className="font-extrabold text-slate-800 text-xs mt-1.5 truncate">{t("High-Yield Wheat Guide")}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t("Learn spacing & CRI watering stages")}</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">⏱ 5:10 {t("mins lesson")}</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => setActiveTab("academy")}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex gap-3.5 p-3.5"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                          <img 
                            src="https://images.unsplash.com/photo-1449339044510-aab182404a0a?auto=format&fit=crop&q=80&w=200" 
                            alt="Cucumber Greenhouse" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{t("Off-Season")}</span>
                            <h5 className="font-extrabold text-slate-800 text-xs mt-1.5 truncate">{t("Cucumber Polyhouse")}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t("Maximize yield during heavy monsoon")}</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">⏱ 3:45 {t("mins lesson")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid showing recent ID logs, active plans, alert alerts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Irrigation Reminders */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-blue-500 animate-pulse" /> Active Water & Fertilizer Plans
                      </h4>
                      <p className="text-xs text-slate-400">Automatically syncs with recommendations from your "Snap & Know" save logs.</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-800">Tomato Sowing Base Dose</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">Weekly Irrigation: 15-20 mm</span>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">Active</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center opacity-65">
                          <div>
                            <span className="font-bold text-slate-800">Rice / Paddy vegetative stage</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">Watering schedule: Flooded (Wet/Dry cycle)</span>
                          </div>
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">Archived</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Plant Identification Logs list */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-600" /> Recent Plant ID Specimens
                      </h4>
                      <p className="text-xs text-slate-400">Captured by you in the field. Tap to preview previous botanical reports.</p>

                      <div className="space-y-2">
                        {idLogs.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No specimens identified yet. Try Feature 9!
                          </div>
                        ) : (
                          idLogs.slice(0, 3).map((log, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-3 border">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border bg-slate-300">
                                <img src={log.photoUrl} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 text-xs">
                                <span className="font-bold text-slate-800 block">{log.identifiedSpeciesId}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  Soil Matching: {log.soilCompatibilityResult} | Conf: {log.confidenceScore}%
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Snap & Know Plant ID SPECIFIC MODULE */}
              {activeTab === "snap" && (
                <div className="space-y-6" id="snap-know-module">
                  {!plantIdResult && !plantIdLoading && (
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                          <Camera className="w-6 h-6 text-emerald-600" /> Snap & Know: Botanist Plant ID
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Center a single leaf or the whole plant in the natural sunlight frame. Optionally capture a second photo of the soil/root zone for precise companion-suitability.
                        </p>
                      </div>

                      {/* Main plant capture */}
                      {!plantPhoto ? (
                        <CameraCapture
                          onCapture={(base64) => setPlantPhoto(base64)}
                          title="Step 1: Capture Plant Leaf / Body"
                          overlayText="Center a single leaf or the whole plant in frame, in natural light"
                        />
                      ) : (
                        <div className="space-y-4 max-w-lg mx-auto">
                          <span className="text-xs font-bold text-slate-700 block">✓ Step 1: Plant Image Registered</span>
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border">
                            <img src={plantPhoto} className="w-full h-full object-cover" />
                          </div>

                          {/* Soil capturing options */}
                          {!soilPhoto ? (
                            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                              <h5 className="font-bold text-slate-800 text-xs mb-1">Step 2: Add Soil Photo Context (Optional but Recommended)</h5>
                              <p className="text-[11px] text-slate-400 mb-3">Snap your field's soil context for N-P-K & texture compatibility checks.</p>
                              
                              {!isCapturingSoil ? (
                                <button
                                  type="button"
                                  onClick={() => setIsCapturingSoil(true)}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                                >
                                  Add Soil Image
                                </button>
                              ) : (
                                <CameraCapture
                                  onCapture={(base64) => { setSoilPhoto(base64); setIsCapturingSoil(false); }}
                                  title="Soil/Root Zone Capture"
                                  overlayText="Align soil under natural daylight"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-slate-700 block">✓ Step 2: Soil Context Image Registered</span>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="aspect-video rounded-xl overflow-hidden border"><img src={plantPhoto} className="w-full h-full object-cover" /></div>
                                <div className="aspect-video rounded-xl overflow-hidden border"><img src={soilPhoto} className="w-full h-full object-cover" /></div>
                              </div>
                            </div>
                          )}

                          {/* Submit Identification action */}
                          <div className="pt-4 flex justify-between gap-3">
                            <button
                              onClick={resetPlantIdState}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all"
                            >
                              Reset
                            </button>
                            
                            <button
                              onClick={runPlantIdAnalysis}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                              id="btn-identify-specimen"
                            >
                              <Sprout className="w-4 h-4" /> Identify Specimen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {plantIdLoading && (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                      <p className="text-sm font-semibold animate-pulse">Running botanical vision matches...</p>
                      <p className="text-xs text-slate-400 mt-1">Extracting vein patterns, matching soil metrics against stored pH grids...</p>
                    </div>
                  )}

                  {plantIdError && (
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center space-y-4">
                      <div className="p-4 bg-rose-50 text-rose-800 text-xs border border-rose-100 rounded-2xl">{plantIdError}</div>
                      <button onClick={resetPlantIdState} className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl">Try Again</button>
                    </div>
                  )}

                  {plantIdResult && !plantIdLoading && (
                    <div className="space-y-6">
                      <FieldGuideCard 
                        data={plantIdResult} 
                        photoUrl={plantPhoto || ""} 
                        soilPhotoUrl={soilPhoto || undefined} 
                        language={user?.preferredLanguage}
                      />

                      {/* Saving options */}
                      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Save identified specimen to active records?</h4>
                          <p className="text-xs text-slate-400">Syncs botanical pH needs directly with planners for fertilizer cost estimates.</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={resetPlantIdState}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all"
                          >
                            Scan New Plant
                          </button>
                          <button
                            onClick={saveIdentifiedCrop}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md"
                            id="btn-save-crop-record"
                          >
                            Save to Farm Record
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Crop Academy & Seasonal Video Lessons */}
              {activeTab === "academy" && (
                <CropAcademy preferredLanguage={user.preferredLanguage} />
              )}

              {/* Tab: Crop Disease Diagnose */}
              {activeTab === "disease" && (
                <DiseaseDetector userId={user.id} preferredLanguage={user.preferredLanguage} />
              )}

              {/* Tab: Fertilizer & Water Planners */}
              {activeTab === "planners" && (
                <Planners userId={user.id} defaultSoilType={user.soilType} />
              )}

              {/* Tab: Government Scheme Assistant */}
              {activeTab === "schemes" && (
                <GovSchemes 
                  userId={user.id} 
                  userState={user.state} 
                  userCrop={user.crop || "Tomato"} 
                  userLandArea={user.landArea} 
                />
              )}

              {/* Tab: AI Chat Farming Assistant */}
              {activeTab === "chat" && (
                <AICompanion userId={user.id} preferredLanguage={user.preferredLanguage} />
              )}

              {/* Tab: Interactive Yield Charts */}
              {activeTab === "charts" && (
                <AnalyticsDashboard user={user} />
              )}

              {/* Tab: Marketplace Buy (Farmer buy from Sellers) */}
              {activeTab === "farmer-buy" && (
                <MarketplaceBuy user={user} onChatNavigate={handleChatNavigate} />
              )}

              {/* Tab: Marketplace Sell (Farmer list crops) */}
              {activeTab === "farmer-sell" && (
                <MarketplaceSell user={user} onChatNavigate={handleChatNavigate} />
              )}

              {/* Tab: Seller Dashboard */}
              {activeTab === "seller-dashboard" && (
                <SellerDashboard user={user} onChatNavigate={handleChatNavigate} />
              )}

              {/* Tab: Buyer Dashboard */}
              {activeTab === "buyer-dashboard" && (
                <BuyerDashboard user={user} onChatNavigate={handleChatNavigate} />
              )}

              {/* Tab: Admin Dashboard */}
              {activeTab === "admin-dashboard" && (
                <AdminDashboard user={user} />
              )}

              {/* Tab: Order History */}
              {activeTab === "order-history" && (
                <OrderHistory user={user} onChatNavigate={handleChatNavigate} />
              )}

              {/* Tab: Unified Messenger Direct Chats */}
              {activeTab === "chats" && (
                <MarketplaceChats 
                  user={user} 
                  preSelectedPartnerId={chatPartnerId}
                  preSelectedPartnerName={chatPartnerName}
                  onBack={() => {
                    setChatPartnerId(null);
                    setChatPartnerName(null);
                  }}
                />
              )}

              {/* Tab: Weather Reference (Dealer/Buyer/Farmer alternative tab) */}
              {activeTab === "weather" && (
                <WeatherAdvisor 
                  userId={user.id} 
                  defaultState={user.state} 
                  defaultDistrict={user.district} 
                  defaultSoilType={user.soilType || "Loamy"} 
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Camera Button (Section 9 Shortcut) - ALWAYS visible if authenticated */}
      {user && activeTab !== "snap" && (
        <button
          onClick={() => { setActiveTab("snap"); resetPlantIdState(); }}
          className="fixed bottom-24 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4.5 rounded-full shadow-2xl transition-all scale-110 z-30 border-4 border-white flex items-center justify-center cursor-pointer hover:scale-120 hover:rotate-6 active:scale-95 group"
          title="Identify specimens instantly"
          id="btn-floating-snap-shortcut"
        >
          <Camera className="w-6.5 h-6.5" />
          <span className="absolute right-14 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
            Snap & Know ID Specimen
          </span>
        </button>
      )}

      {/* Floating AI Helper Bot */}
      {user && (
        <FloatingHelper userId={user.id} preferredLanguage={user.preferredLanguage} />
      )}

      {/* Real-time Weather Alert Toast Notification */}
      <AnimatePresence>
        {showWeatherToast && activeWeatherAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] bg-slate-900 text-white rounded-3xl p-5 shadow-2xl z-50 border border-slate-800 flex flex-col gap-3.5"
            id="realtime-weather-toast"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-2xl animate-pulse shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-extrabold text-rose-400 tracking-wider uppercase bg-rose-500/10 px-2 py-0.5 rounded-full">
                    Severe Forecast Alert
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {activeWeatherAlert.district}, {activeWeatherAlert.state}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mt-1.5 leading-snug">
                  {activeWeatherAlert.title}
                </h4>
                <p className="text-xs text-slate-300 leading-normal mt-1.5">
                  {activeWeatherAlert.message}
                </p>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-end gap-2.5 pt-1.5 border-t border-slate-800">
              <button
                onClick={() => setShowWeatherToast(false)}
                className="text-[11px] font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-all cursor-pointer"
                id="btn-weather-toast-dismiss"
              >
                Dismiss
              </button>
              
              {!activeWeatherAlert.saved ? (
                <button
                  onClick={saveWeatherAlertToDb}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  id="btn-weather-toast-save"
                >
                  <Bell className="w-3.5 h-3.5" /> Save to My Alerts Panel
                </button>
              ) : (
                <span className="text-emerald-400 text-[11px] font-extrabold flex items-center gap-1 px-3 py-2 bg-emerald-500/10 rounded-xl" id="weather-saved-indicator">
                  <CheckCircle className="w-3.5 h-3.5" /> Saved & Logged
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-[11px] text-slate-400 shrink-0">
        <p>© 2026 Krishi Saathi Platform. Promoting environmentally-sustainable, high-yield soil-safe agriculture.</p>
        <p className="mt-1 text-emerald-600/60 font-medium">Crafted with Google AI Studio & Gemini Intelligence Models</p>
      </footer>
    </div>
  );
}
