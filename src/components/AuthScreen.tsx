import React, { useState } from "react";
import axios from "axios";
import { Sprout, Mail, Lock, Phone, User, Map, Loader2, Sparkles } from "lucide-react";
import logoImg from "../assets/images/krishi_saathi_logo_1784057751281.jpg";
import farmBgImg from "../assets/images/farm_background_1784198819057.jpg";

interface AuthScreenProps {
  onSuccess: (user: any, token: string) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Role Selection
  const [role, setRole] = useState<"farmer" | "seller" | "buyer" | "admin">("farmer");

  // Registration States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("India");
  const [customCountry, setCustomCountry] = useState("");
  const [isOtherCountry, setIsOtherCountry] = useState(false);
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [village, setVillage] = useState("");
  const [landArea, setLandArea] = useState("1.5");
  const [unit, setUnit] = useState<"Acres" | "Bigha" | "Hectares" | "Guntha">("Acres");
  const [soilType, setSoilType] = useState("Loamy");
  const [lang, setLang] = useState<"en" | "hi" | "mr" | "pa" | "ta" | "te" | "bn" | "es" | "vi" | "sw">("en");
  
  // Custom Seller States
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  // Custom Buyer States
  const [buyerType, setBuyerType] = useState<"retailer" | "wholesaler" | "exporter" | "food_company">("wholesaler");

  const [detectingLocation, setDetectingLocation] = useState(false);

  // Heuristic-based coordinates-to-locale mapping for auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCountry = "India";
        let detectedState = "Maharashtra";
        let detectedDistrict = "Pune";
        let detectedLang: "en" | "hi" | "mr" | "pa" | "ta" | "te" | "bn" | "es" | "vi" | "sw" = "en";

        // Smart Coordinate Heuristics for States and Countries
        if (latitude >= 29.5 && latitude <= 32.5 && longitude >= 74.0 && longitude <= 77.0) {
          detectedCountry = "India";
          detectedState = "Punjab";
          detectedDistrict = "Ludhiana";
          detectedLang = "pa";
        } else if (latitude >= 8.0 && latitude <= 13.5 && longitude >= 76.0 && longitude <= 80.5) {
          detectedCountry = "India";
          detectedState = "Tamil Nadu";
          detectedDistrict = "Coimbatore";
          detectedLang = "ta";
        } else if (latitude >= 12.0 && latitude <= 19.0 && longitude >= 77.0 && longitude <= 81.0) {
          detectedCountry = "India";
          detectedState = "Andhra Pradesh";
          detectedDistrict = "Guntur";
          detectedLang = "te";
        } else if (latitude >= 21.0 && latitude <= 27.5 && longitude >= 85.5 && longitude <= 92.5) {
          detectedCountry = "India";
          detectedState = "West Bengal";
          detectedDistrict = "Howrah";
          detectedLang = "bn";
        } else if (latitude >= 15.5 && latitude <= 22.0 && longitude >= 72.5 && longitude <= 80.5) {
          detectedCountry = "India";
          detectedState = "Maharashtra";
          detectedDistrict = "Pune";
          detectedLang = "mr";
        } else if (latitude >= 20.0 && latitude <= 28.5 && longitude >= 73.0 && longitude <= 84.5) {
          detectedCountry = "India";
          detectedState = "Uttar Pradesh";
          detectedDistrict = "Lucknow";
          detectedLang = "hi";
        } else if (latitude >= 34.0 && latitude <= 49.0 && longitude >= -125.0 && longitude <= -69.0) {
          detectedCountry = "United States";
          detectedState = "California";
          detectedDistrict = "Central Valley";
          detectedLang = "en";
        } else if (latitude >= 4.0 && latitude <= 15.0 && longitude >= -75.0 && longitude <= -35.0) {
          detectedCountry = "Brazil";
          detectedState = "Sao Paulo";
          detectedDistrict = "Campinas";
          detectedLang = "es";
        } else if (latitude >= 8.0 && latitude <= 23.0 && longitude >= 102.0 && longitude <= 110.0) {
          detectedCountry = "Vietnam";
          detectedState = "Mekong Delta";
          detectedDistrict = "Can Tho";
          detectedLang = "vi";
        } else if (latitude >= -4.5 && latitude <= 4.5 && longitude >= 34.0 && longitude <= 41.5) {
          detectedCountry = "Kenya";
          detectedState = "Rift Valley";
          detectedDistrict = "Nakuru";
          detectedLang = "sw";
        } else {
          detectedCountry = "India";
          detectedState = "New Delhi";
          detectedDistrict = "Central";
          detectedLang = "hi";
        }

        setCountry(detectedCountry);
        setIsOtherCountry(detectedCountry !== "India");
        if (detectedCountry !== "India") {
          setCustomCountry(detectedCountry);
        }
        setState(detectedState);
        setDistrict(detectedDistrict);
        setLang(detectedLang);
        setDetectingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to retrieve location. Please grant permission or specify manually.");
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    let landInAcres = parseFloat(landArea) || 1.5;
    if (unit === "Bigha") {
      landInAcres = landInAcres / 1.61;
    } else if (unit === "Hectares") {
      landInAcres = landInAcres / 0.4047;
    } else if (unit === "Guntha") {
      landInAcres = landInAcres / 40;
    }

    const payload = isLogin 
      ? { email, password }
      : {
          role,
          name,
          email,
          password,
          mobile,
          country: isOtherCountry ? customCountry : country,
          state,
          district,
          village: role === "farmer" ? village : "",
          landArea: role === "farmer" ? landInAcres : 0,
          soilType: role === "farmer" ? soilType : "",
          preferredLanguage: lang,
          companyName: role === "seller" ? companyName : "",
          gstNumber: role === "seller" ? gstNumber : "",
          buyerType: role === "buyer" ? buyerType : ""
        };

    try {
      const response = await axios.post(endpoint, payload);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      onSuccess(response.data.user, response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 relative overflow-hidden" id="auth-screen-layout">
      {/* Subtle Farm Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.11] bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${farmBgImg})` }}
      />
      {/* Decorative organic color glows */}
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-6 space-y-6 relative overflow-hidden z-10">
        
        {/* Subtle decorative banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700" />

        {/* Logo and Greeting */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-emerald-500 shadow-md">
            <img 
              src={logoImg} 
              alt="Krishi Saathi Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1">
              Krishi Saathi <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">v2</span>
            </h1>
            <p className="text-xs text-slate-400">
              {isLogin ? "Log in to monitor crop schedules & run plant ID diagnostic checks." : "Register your acreage, language, & soil profiles to start."}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-4">
              {/* Role Selector */}
              <div className="text-xs">
                <label className="block font-semibold text-slate-600 mb-1.5">Select User Role *</label>
                <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-xl">
                  {[
                    { id: "farmer", label: "Farmer 👨‍🌾" },
                    { id: "seller", label: "Seller 🏪" },
                    { id: "buyer", label: "Buyer 🌾" },
                    { id: "admin", label: "Admin 👨‍💻" }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all text-center ${
                        role === r.id
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="text-xs">
                <label className="block font-semibold text-slate-600 mb-1">
                  {role === "farmer" ? "Farmer Full Name *" : role === "seller" ? "Agent / Contact Full Name *" : role === "buyer" ? "Buyer Representative Name *" : "Administrator Full Name *"}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "farmer" ? "e.g. Ramesh Patil" : role === "seller" ? "e.g. Sunil Mehta" : "e.g. Rajesh Kumar"}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                </div>
              </div>

              {/* Mobile */}
              <div className="text-xs">
                <label className="block font-semibold text-slate-600 mb-1">Mobile Number</label>
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                </div>
              </div>

              {/* Auto-detect Location & Language Button */}
              {role === "farmer" && (
                <div className="text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingLocation}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {detectingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Detecting Coordinates & Language...</span>
                      </>
                    ) : (
                      <>
                        <Map className="w-4 h-4" />
                        <span>Auto-Detect Location & Language</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Country Selection (BEFORE State) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs">
                  <label className="block font-semibold text-slate-600 mb-1">Country</label>
                  <select
                    value={isOtherCountry ? "Other" : country}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Other") {
                        setIsOtherCountry(true);
                      } else {
                        setIsOtherCountry(false);
                        setCountry(val);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="India">India 🇮🇳</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Brazil">Brazil 🇧🇷</option>
                    <option value="Kenya">Kenya 🇰🇪</option>
                    <option value="Nigeria">Nigeria 🇳🇬</option>
                    <option value="Philippines">Philippines 🇵🇭</option>
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="Pakistan">Pakistan 🇵🇰</option>
                    <option value="Vietnam">Vietnam 🇻🇳</option>
                    <option value="Other">Other Country 🌍</option>
                  </select>
                </div>

                {isOtherCountry ? (
                  <div className="text-xs animate-in fade-in duration-200">
                    <label className="block font-semibold text-slate-600 mb-1">Specify Country</label>
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="e.g. Nepal"
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 flex flex-col justify-end pb-2">
                    <span className="leading-tight text-[10px]">Providing localized solutions for your country.</span>
                  </div>
                )}
              </div>

              {/* Regional Fields (State & District) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs">
                  <label className="block font-semibold text-slate-600 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                  />
                </div>
                <div className="text-xs">
                  <label className="block font-semibold text-slate-600 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                  />
                </div>
              </div>

              {/* Seller Specific Fields */}
              {role === "seller" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/40 border border-emerald-100 rounded-2xl animate-in slide-in-from-top duration-150">
                  <div className="text-xs col-span-2 sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Company / Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Kisan Inputs & Seeds"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                    />
                  </div>
                  <div className="text-xs col-span-2 sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">GST Number (optional)</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* Buyer Specific Fields */}
              {role === "buyer" && (
                <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-2xl animate-in slide-in-from-top duration-150 text-xs">
                  <label className="block font-bold text-slate-700 mb-1.5">Trade Buyer Profile Type *</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
                  >
                    <option value="wholesaler">Bulk Wholesaler / Commission Agent</option>
                    <option value="retailer">Local Vegetable / Grain Retailer</option>
                    <option value="exporter">Agricultural Crop Commodity Exporter</option>
                    <option value="food_company">Food Processing Corporate / FMCG Partner</option>
                  </select>
                </div>
              )}

              {/* Farmer Specific Land & Soil Fields */}
              {role === "farmer" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-xs">
                      <label className="block font-semibold text-slate-600 mb-1">Village</label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="e.g. Khed"
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                      />
                    </div>
                    <div className="text-xs">
                      <label className="block font-semibold text-slate-600 mb-1">Land Area</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={landArea}
                          onChange={(e) => setLandArea(e.target.value)}
                          className="w-[60%] p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
                        />
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value as any)}
                          className="w-[40%] p-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-bold text-slate-600 text-[10px] cursor-pointer"
                        >
                          <option value="Acres">Acres</option>
                          <option value="Bigha">Bigha</option>
                          <option value="Hectares">Hectare</option>
                          <option value="Guntha">Guntha</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-xs">
                      <label className="block font-semibold text-slate-600 mb-1">Soil Profile</label>
                      <select
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
                      >
                        <option value="Loamy">Loamy</option>
                        <option value="Clayey">Clayey</option>
                        <option value="Sandy">Sandy</option>
                        <option value="Silty">Silty</option>
                        <option value="Black Cotton Soil">Black Cotton Soil</option>
                      </select>
                    </div>

                    <div className="text-xs">
                      <label className="block font-semibold text-slate-600 mb-1">Preferred Language</label>
                      <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-semibold cursor-pointer text-slate-700"
                      >
                        <option value="en">English 🇺🇸</option>
                        <option value="hi">Hindi (हिंदी) 🇮🇳</option>
                        <option value="bho">Bhojpuri (भोजपुरी) 🇮🇳</option>
                        <option value="mr">Marathi (मराठी) 🇮🇳</option>
                        <option value="pa">Punjabi (ਪੰਜਾਬੀ) 🇮🇳</option>
                        <option value="ta">Tamil (தமிழ்) 🇮🇳</option>
                        <option value="te">Telugu (తెలుగు) 🇮🇳</option>
                        <option value="bn">Bengali (বাংলা) 🇮🇳</option>
                        <option value="es">Spanish (Español) 🇪🇸</option>
                        <option value="vi">Vietnamese (Tiếng Việt) 🇻🇳</option>
                        <option value="sw">Swahili (Kiswahili) 🇰🇪</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* General Language Option for Sellers/Buyers/Admins */}
              {role !== "farmer" && (
                <div className="text-xs">
                  <label className="block font-semibold text-slate-600 mb-1">Preferred Language</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-semibold cursor-pointer text-slate-700"
                  >
                    <option value="en">English 🇺🇸</option>
                    <option value="hi">Hindi (हिंदी) 🇮🇳</option>
                    <option value="bho">Bhojpuri (भोजपुरी) 🇮🇳</option>
                    <option value="mr">Marathi (मराठी) 🇮🇳</option>
                    <option value="pa">Punjabi (ਪੰਜਾਬੀ) 🇮🇳</option>
                    <option value="ta">Tamil (தமிழ்) 🇮🇳</option>
                    <option value="te">Telugu (తెలుగు) 🇮🇳</option>
                    <option value="bn">Bengali (বাংলা) 🇮🇳</option>
                    <option value="es">Spanish (Español) 🇪🇸</option>
                    <option value="vi">Vietnamese (Tiếng Việt) 🇻🇳</option>
                    <option value="sw">Swahili (Kiswahili) 🇰🇪</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Email */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">Email Address *</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@krishisaathi.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-700"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
            </div>
          </div>

          {/* Password */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-600 mb-1">Secure Password *</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-semibold text-slate-700"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            id="btn-auth-submit"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isLogin ? "Access Platform" : "Create My Account Profile"}
          </button>
        </form>

        {/* Toggle between login / registration */}
        <div className="text-center text-xs text-slate-400">
          <span>{isLogin ? "New to Krishi Saathi?" : "Already have an account?"}</span>{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-all"
            id="btn-toggle-auth-mode"
          >
            {isLogin ? "Register Here" : "Log In Here"}
          </button>
        </div>
      </div>
    </div>
  );
}
