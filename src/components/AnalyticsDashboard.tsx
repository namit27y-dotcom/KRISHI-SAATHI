import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  TrendingUp, 
  Droplets, 
  DollarSign, 
  Sprout, 
  Activity,
  Brain,
  Loader2,
  Calendar,
  Percent,
  AlertCircle,
  Info,
  ArrowRight,
  Map as MapIcon,
  Layers,
  Compass,
  Sliders,
  Sparkles,
  Gauge,
  Download,
  Wrench,
  Battery,
  Wifi,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";

interface AnalyticsDashboardProps {
  user?: User;
}

export default function AnalyticsDashboard({ user }: AnalyticsDashboardProps) {
  // 1. Water logs consumption
  const waterData = [
    { name: "Week 1", "Optimal Water (mm)": 20, "Actual Applied (mm)": 22 },
    { name: "Week 2", "Optimal Water (mm)": 20, "Actual Applied (mm)": 18 },
    { name: "Week 3", "Optimal Water (mm)": 25, "Actual Applied (mm)": 26 },
    { name: "Week 4", "Optimal Water (mm)": 25, "Actual Applied (mm)": 28 },
    { name: "Week 5", "Optimal Water (mm)": 30, "Actual Applied (mm)": 24 },
    { name: "Week 6", "Optimal Water (mm)": 30, "Actual Applied (mm)": 31 },
  ];

  // 2. Monthly Farming expenses NPK vs Bio
  const expenseData = [
    { month: "Jan", "Synthetic Route": 3200, "Organic Route": 1800 },
    { month: "Feb", "Synthetic Route": 4100, "Organic Route": 2100 },
    { month: "Mar", "Synthetic Route": 3900, "Organic Route": 1900 },
    { month: "Apr", "Synthetic Route": 4500, "Organic Route": 2400 },
    { month: "May", "Synthetic Route": 5100, "Organic Route": 2600 },
    { month: "Jun", "Synthetic Route": 4800, "Organic Route": 2200 },
  ];

  // 3. Crop Yield distribution of past seasons
  const yieldData = [
    { name: "Rice (Kharif)", value: 45, color: "#2E7D32" },
    { name: "Wheat (Rabi)", value: 35, color: "#81C784" },
    { name: "Tomato (Zaid)", value: 20, color: "#FF9800" },
  ];

  // --- Predictive AI Yield Forecast State ---
  const defaultCrops = ["Rice", "Wheat", "Tomato", "Maize", "Cotton", "Mustard"];
  const [selectedCrop, setSelectedCrop] = useState(
    user?.cropsGrown?.[0] || "Rice"
  );
  const [soilType, setSoilType] = useState(user?.soilType || "Clayey Loam");
  const [landArea, setLandArea] = useState(user?.landArea || 2.5);
  const [historicalSummary, setHistoricalSummary] = useState(
    "Baseline regional harvest of 1.8 Tons per acre. Optimal organic fertilizers used last season."
  );

  // --- Interactive Soil Quality Map state ---
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedZoneId, setSelectedZoneId] = useState("zone-1");
  const [activeOverlay, setActiveOverlay] = useState<"general" | "nitrogen" | "phosphorus" | "potassium" | "ph" | "moisture">("general");
  const [simulationActive, setSimulationActive] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  
  const [sectors, setSectors] = useState([
    {
      id: "zone-1",
      name: "North Orchard",
      area: Number(((user?.landArea || 2.5) * 0.35).toFixed(1)),
      soilTexture: "Sandy Loam",
      nitrogen: 45, // Deficient
      phosphorus: 24, // Normal
      potassium: 190, // Normal
      ph: 5.6, // Acidic
      moisture: 32, // Dry
      organicCarbon: 0.45, // Low
      lastTested: "July 2026",
      recommendation: "Nitrogen and Organic matter are deficient. Add 45kg Vermicompost and sow Sunn hemp cover crop."
    },
    {
      id: "zone-2",
      name: "Main Sowing Flat",
      area: Number(((user?.landArea || 2.5) * 0.35).toFixed(1)),
      soilTexture: "Clayey Loam",
      nitrogen: 78, // High
      phosphorus: 28, // High
      potassium: 230, // High
      ph: 6.5, // Neutral
      moisture: 58, // Healthy
      organicCarbon: 0.85, // Rich
      lastTested: "July 2026",
      recommendation: "Soil chemical-physical profile is optimal. Maintain current moisture levels; suitable for high-yield sowing."
    },
    {
      id: "zone-3",
      name: "Western Slope",
      area: Number(((user?.landArea || 2.5) * 0.2).toFixed(1)),
      soilTexture: "Loamy Soil",
      nitrogen: 62, // Normal
      phosphorus: 12, // Deficient
      potassium: 135, // Low
      ph: 7.2, // Neutral/Slightly Alkaline
      moisture: 45, // Normal
      organicCarbon: 0.62, // Moderate
      lastTested: "July 2026",
      recommendation: "Phosphorus and Potassium are below margin. Apply Bio-fertilizers like PSBs (Phosphorus Solubilizing Bacteria) or Wood Ash."
    },
    {
      id: "zone-4",
      name: "Canal Runoff Zone",
      area: Number(((user?.landArea || 2.5) * 0.1).toFixed(1)),
      soilTexture: "Clayey Silt",
      nitrogen: 50, // Moderate
      phosphorus: 18, // Moderate
      potassium: 160, // Normal
      ph: 6.1, // Balanced
      moisture: 82, // Waterlogged risk
      organicCarbon: 0.55, // Moderate
      lastTested: "July 2026",
      recommendation: "Moisture levels are extremely high (waterlogging danger). Improve peripheral field drainage, avoid flooding."
    }
  ]);

  const handleApplyTreatment = (treatmentType: "compost" | "lime" | "drain") => {
    setSectors(prev => prev.map(zone => {
      if (zone.id !== selectedZoneId) return zone;
      
      let updated = { ...zone };
      let msg = "";
      if (treatmentType === "compost") {
        const oldN = updated.nitrogen;
        const oldC = updated.organicCarbon;
        updated.nitrogen = Math.min(100, updated.nitrogen + 25);
        updated.organicCarbon = Number(Math.min(1.5, updated.organicCarbon + 0.3).toFixed(2));
        msg = `Applied Enriched Organic Compost to ${updated.name}! Nitrogen rose from ${oldN} to ${updated.nitrogen} ppm. Organic Carbon rose from ${oldC}% to ${updated.organicCarbon}%.`;
      } else if (treatmentType === "lime") {
        const oldPh = updated.ph;
        updated.ph = Number(Math.min(7.5, updated.ph + 0.6).toFixed(1));
        msg = `Applied Agricultural Lime to ${updated.name}! Soil pH stabilized from ${oldPh} to ${updated.ph} (Neutral sweet-spot).`;
      } else if (treatmentType === "drain") {
        const oldM = updated.moisture;
        updated.moisture = 45; 
        msg = `Cleared water drainage canals in ${updated.name}! Excess water logged soil restored from ${oldM}% to optimal 45% moisture.`;
      }
      
      updated.recommendation = "Soil profiles updated via simulation. Current chemical/physical metrics are optimized!";
      setSimulationActive(msg);
      setTimeout(() => setSimulationActive(null), 6000);
      return updated;
    }));
  };

  const handleDownloadMap = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    setExporting(true);
    try {
      // 1. Clone the SVG element
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

      // 2. We need to copy computed styles to inline attributes so canvas rendering keeps the colors.
      const originalPaths = svgElement.querySelectorAll("path, text, circle, rect, g");
      const clonedPaths = clonedSvg.querySelectorAll("path, text, circle, rect, g");

      originalPaths.forEach((originalNode, index) => {
        const clonedNode = clonedPaths[index] as SVGElement;
        if (originalNode && clonedNode) {
          const computedStyle = window.getComputedStyle(originalNode);
          clonedNode.setAttribute("fill", computedStyle.fill);
          clonedNode.setAttribute("stroke", computedStyle.stroke);
          clonedNode.setAttribute("stroke-width", computedStyle.strokeWidth);
          
          if (originalNode.tagName.toLowerCase() === "text") {
            clonedNode.setAttribute("font-family", computedStyle.fontFamily || "Inter, sans-serif");
            clonedNode.setAttribute("font-size", computedStyle.fontSize || "10px");
            clonedNode.setAttribute("font-weight", computedStyle.fontWeight || "bold");
            clonedNode.setAttribute("letter-spacing", computedStyle.letterSpacing || "normal");
          }
        }
      });

      // Explicit width & height for standalone SVG rendering context
      clonedSvg.setAttribute("width", "500");
      clonedSvg.setAttribute("height", "300");

      // 3. Serialize cloned SVG to XML string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // 4. Create Blob and Object URL
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        // 5. Create canvas for PNG conversion
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 600;
        const context = canvas.getContext("2d");
        if (context) {
          // Pure white high-quality background
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Add a subtle accent border to frame the exported document
          context.strokeStyle = "#e2e8f0";
          context.lineWidth = 4;
          context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

          // Draw a title & decorative legend info on the canvas
          context.fillStyle = "#0f172a"; // slate-900
          context.font = "bold 26px sans-serif";
          const layerTitle = activeOverlay === "general" ? "General Plot View" :
                             activeOverlay === "nitrogen" ? "Nitrogen (N) Nutrient Map" :
                             activeOverlay === "phosphorus" ? "Phosphorus (P) Nutrient Map" :
                             activeOverlay === "potassium" ? "Potassium (K) Nutrient Map" :
                             activeOverlay === "ph" ? "Soil pH Levels Map" : "Moisture Levels Map";
          context.fillText(`Soil Quality Map: ${layerTitle}`, 40, 60);

          context.fillStyle = "#64748b"; // slate-500
          context.font = "14px sans-serif";
          context.fillText(`Generated on ${new Date().toLocaleDateString()} | Krishi Saathi Analytics Platform`, 40, 90);

          // Draw the SVG image centered (x=50, y=120, width=900, height=440)
          context.drawImage(image, 50, 120, 900, 440);

          // Dynamic direct download link
          const pngURL = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngURL;
          downloadLink.download = `Soil_Map_${activeOverlay}_${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        window.URL.revokeObjectURL(blobURL);
        setExporting(false);
      };
      image.onerror = (e) => {
        console.error("Image load failed, falling back to direct SVG download:", e);
        const downloadLink = document.createElement("a");
        downloadLink.href = blobURL;
        downloadLink.download = `Soil_Map_${activeOverlay}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(blobURL);
        setExporting(false);
      };
      image.src = blobURL;
    } catch (err) {
      console.error("Exporting map failed:", err);
      setExporting(false);
    }
  };

  // Calculations for average concentrations across entire land area (weighted by area)
  const totalArea = sectors.reduce((sum, s) => sum + s.area, 0);

  const getWeightedAverage = (field: "nitrogen" | "phosphorus" | "potassium" | "ph" | "moisture" | "organicCarbon") => {
    if (totalArea === 0) return 0;
    const weightedSum = sectors.reduce((sum, s) => sum + (s[field] * s.area), 0);
    return Number((weightedSum / totalArea).toFixed(1));
  };

  const getFieldForOverlay = () => {
    switch (activeOverlay) {
      case "nitrogen": return "nitrogen";
      case "phosphorus": return "phosphorus";
      case "potassium": return "potassium";
      case "ph": return "ph";
      case "moisture": return "moisture";
      case "general":
      default: return "organicCarbon";
    }
  };

  const getActiveOverlayDetails = () => {
    switch (activeOverlay) {
      case "nitrogen": {
        const avg = getWeightedAverage("nitrogen");
        const status = avg < 55 ? { label: "Deficient", color: "bg-rose-50 text-rose-700 border border-rose-100", barColor: "bg-rose-500" } : avg > 75 ? { label: "Surplus / High", color: "bg-amber-50 text-amber-700 border border-amber-100", barColor: "bg-amber-500" } : { label: "Optimal", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", barColor: "bg-emerald-500" };
        return {
          name: "Nitrogen (N)",
          avg,
          unit: "ppm",
          target: "65 ppm",
          percentOfMax: Math.min(100, (avg / 100) * 100),
          status,
          desc: `Nitrogen is vital for vegetative leaf growth, protein synthesis, and general greenness. An average concentration of ${avg} ppm indicates a generally stable vegetative foundation across your ${totalArea.toFixed(1)} acres.`,
          icon: Activity
        };
      }
      case "phosphorus": {
        const avg = getWeightedAverage("phosphorus");
        const status = avg < 20 ? { label: "Deficient", color: "bg-rose-50 text-rose-700 border border-rose-100", barColor: "bg-rose-500" } : avg > 30 ? { label: "Surplus / High", color: "bg-amber-50 text-amber-700 border border-amber-100", barColor: "bg-amber-500" } : { label: "Optimal", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", barColor: "bg-emerald-500" };
        return {
          name: "Phosphorus (P)",
          avg,
          unit: "ppm",
          target: "25 ppm",
          percentOfMax: Math.min(100, (avg / 50) * 100),
          status,
          desc: `Phosphorus coordinates robust root cell structures and active seed/flowering development. Your current overall rate is ${avg} ppm across ${totalArea.toFixed(1)} acres.`,
          icon: Sprout
        };
      }
      case "potassium": {
        const avg = getWeightedAverage("potassium");
        const status = avg < 150 ? { label: "Deficient / Low", color: "bg-rose-50 text-rose-700 border border-rose-100", barColor: "bg-rose-500" } : avg > 220 ? { label: "Surplus / High", color: "bg-amber-50 text-amber-700 border border-amber-100", barColor: "bg-amber-500" } : { label: "Optimal", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", barColor: "bg-emerald-500" };
        return {
          name: "Potassium (K)",
          avg,
          unit: "ppm",
          target: "200 ppm",
          percentOfMax: Math.min(100, (avg / 300) * 100),
          status,
          desc: `Potassium regulates stomatal activity, water retention dynamics, and cell division. At a weighted average of ${avg} ppm, cell wall density remains high.`,
          icon: Sliders
        };
      }
      case "ph": {
        const avg = getWeightedAverage("ph");
        const status = avg < 6.0 ? { label: "Moderately Acidic", color: "bg-orange-50 text-orange-700 border border-orange-100", barColor: "bg-orange-500" } : avg > 7.0 ? { label: "Slightly Alkaline", color: "bg-indigo-50 text-indigo-700 border border-indigo-100", barColor: "bg-indigo-500" } : { label: "Optimal (Neutral)", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", barColor: "bg-emerald-500" };
        return {
          name: "Soil pH Level",
          avg,
          unit: "pH",
          target: "6.0 - 7.0",
          percentOfMax: Math.min(100, (avg / 14) * 100),
          status,
          desc: `Soil pH defines chemical bioavailability. Your farm-wide average of ${avg} is sitting inside the highly biodiverse neutral/lightly-acidic sweet-spot.`,
          icon: Gauge
        };
      }
      case "moisture": {
        const avg = getWeightedAverage("moisture");
        const status = avg < 40 ? { label: "Dry / Sub-optimal", color: "bg-amber-50 text-amber-700 border border-amber-100", barColor: "bg-amber-500" } : avg > 65 ? { label: "High / Saturated", color: "bg-blue-50 text-blue-700 border border-blue-100", barColor: "bg-blue-500" } : { label: "Optimal / Moist", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", barColor: "bg-emerald-500" };
        return {
          name: "Soil Moisture",
          avg,
          unit: "%",
          target: "40% - 65%",
          percentOfMax: Math.min(100, avg),
          status,
          desc: `Active water content percentages. A weighted landscape average of ${avg}% shows good balance, but localized canal runoff zones may require drainage.`,
          icon: Droplets
        };
      }
      case "general":
      default: {
        const avg = getWeightedAverage("organicCarbon");
        const status = avg < 0.6 ? { label: "Low Organic Matter", color: "bg-rose-50 text-rose-700 border border-rose-100", barColor: "bg-rose-500" } : { label: "Healthy / Rich", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", barColor: "bg-emerald-500" };
        return {
          name: "Soil Organic Carbon (OC)",
          avg,
          unit: "%",
          target: "> 0.7%",
          percentOfMax: Math.min(100, (avg / 1.5) * 100),
          status,
          desc: `Organic carbon levels evaluate organic soil matter and biological health. Your average is ${avg}% across all plots, encouraging active carbon sinks and moisture binding.`,
          icon: Layers
        };
      }
    }
  };

  const getZoneColorClass = (zone: typeof sectors[0]) => {
    const isSelected = zone.id === selectedZoneId;
    let base = "";
    
    if (activeOverlay === "general") {
      if (zone.id === "zone-1") base = "fill-emerald-100 hover:fill-emerald-200 stroke-emerald-600";
      else if (zone.id === "zone-2") base = "fill-emerald-800 hover:fill-emerald-700 stroke-emerald-950";
      else if (zone.id === "zone-3") base = "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-700";
      else base = "fill-emerald-500 hover:fill-emerald-400 stroke-emerald-800";
    }
    else if (activeOverlay === "nitrogen") {
      if (zone.nitrogen < 50) base = "fill-rose-200 hover:fill-rose-300 stroke-rose-600";
      else if (zone.nitrogen <= 70) base = "fill-emerald-400 hover:fill-emerald-300 stroke-emerald-700";
      else base = "fill-emerald-700 hover:fill-emerald-600 stroke-emerald-900";
    }
    else if (activeOverlay === "phosphorus") {
      if (zone.phosphorus < 20) base = "fill-amber-200 hover:fill-amber-300 stroke-amber-600";
      else if (zone.phosphorus <= 30) base = "fill-emerald-400 hover:fill-emerald-300 stroke-emerald-700";
      else base = "fill-teal-600 hover:fill-teal-500 stroke-teal-800";
    }
    else if (activeOverlay === "potassium") {
      if (zone.potassium < 150) base = "fill-amber-100 hover:fill-amber-200 stroke-amber-500";
      else if (zone.potassium <= 220) base = "fill-emerald-400 hover:fill-emerald-300 stroke-emerald-700";
      else base = "fill-indigo-500 hover:fill-indigo-400 stroke-indigo-800";
    }
    else if (activeOverlay === "ph") {
      if (zone.ph < 6.0) base = "fill-orange-300 hover:fill-orange-400 stroke-orange-600";
      else if (zone.ph <= 7.0) base = "fill-emerald-500 hover:fill-emerald-400 stroke-emerald-700";
      else base = "fill-indigo-600 hover:fill-indigo-500 stroke-indigo-800";
    }
    else if (activeOverlay === "moisture") {
      if (zone.moisture < 40) base = "fill-amber-100 hover:fill-amber-200 stroke-amber-400";
      else if (zone.moisture <= 65) base = "fill-blue-400 hover:fill-blue-300 stroke-blue-700";
      else base = "fill-blue-700 hover:fill-blue-600 stroke-blue-900";
    }
    
    return `${base} ${isSelected ? "stroke-[3] filter drop-shadow-md brightness-110" : "stroke-1"}`;
  };

  const [loading, setLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing soil physical-chemical profile...",
    "Retrieving historical micro-climate averages...",
    "Correlating crop water requirements...",
    "Simulating seasonal rainfall scenarios...",
    "Running agronomical prediction matrices..."
  ];

  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  // --- Real-time IoT Soil Sensor Telemetry ---
  const sensorsData = [
    { id: "probe-1", zoneId: "zone-1", name: "Probe KS-101 (North Orchard)", x: 130, y: 110 },
    { id: "probe-2", zoneId: "zone-2", name: "Probe KS-102 (Main Sowing Flat)", x: 350, y: 120 },
    { id: "probe-3", zoneId: "zone-3", name: "Probe KS-103 (Western Slope)", x: 120, y: 245 },
    { id: "probe-4", zoneId: "zone-4", name: "Probe KS-104 (Canal Runoff)", x: 320, y: 245 },
  ];

  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setSectors(prev => prev.map(zone => {
        // Subtle real-time fluctuation: N (+-1), P (+-1), K (+-2), Moisture (+-1)
        const dN = Math.floor(Math.random() * 3) - 1;
        const dP = Math.floor(Math.random() * 3) - 1;
        const dK = Math.floor(Math.random() * 5) - 2;
        const dM = Math.floor(Math.random() * 3) - 1;
        return {
          ...zone,
          nitrogen: Math.max(10, Math.min(100, zone.nitrogen + dN)),
          phosphorus: Math.max(5, Math.min(50, zone.phosphorus + dP)),
          potassium: Math.max(50, Math.min(300, zone.potassium + dK)),
          moisture: Math.max(10, Math.min(95, zone.moisture + dM))
        };
      }));
    }, 4000);
    return () => clearInterval(sensorInterval);
  }, []);

  const handleRunForecast = async () => {
    setLoading(true);
    setError(null);
    setForecastResult(null);

    try {
      const response = await axios.post("/api/gemini/yield-forecast", {
        cropName: selectedCrop,
        soilType,
        landArea: Number(landArea),
        state: user?.state || "Maharashtra",
        district: user?.district || "Pune",
        historicalSummary,
        userId: user?.id
      });
      setForecastResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Unable to compute yield forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Scenario data transformation for Recharts
  const scenarioChartData = forecastResult?.scenarios?.map((s: any) => ({
    scenario: s.scenarioName.split(" / ")[0],
    "Projected Yield": s.projectedYield,
    "Probability (%)": s.probability
  })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="analytics-dashboard-module">
      {/* Header card introducing predictive capabilities */}
      <div className="p-6 bg-gradient-to-br from-emerald-900 to-teal-800 rounded-3xl shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-12">
          <Brain className="w-96 h-96" />
        </div>
        <div className="space-y-2 relative z-10 text-left">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Empowered by Gemini AI
          </span>
          <h2 className="text-2xl font-black tracking-tight">AI Predictive Farm Analytics</h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Simulate crop performances, estimate potential yields under varying climate scenarios, and receive agronomical instructions tailored to your exact soil type and land acreage.
          </p>
        </div>
        <div className="shrink-0 relative z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center">
            <span className="text-[10px] block uppercase font-bold text-emerald-300 tracking-wider">Active Soil Profile</span>
            <span className="text-base font-black block mt-0.5 text-white">{user?.soilType || "Clayey Loam"}</span>
            <span className="text-xs text-emerald-200 mt-1 block font-medium">{user?.landArea || 2.5} Acres in {user?.district || "Pune"}</span>
          </div>
        </div>
      </div>

      {/* 🧠 Predictive AI Forecasting Section */}
      <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6 text-left relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-600 animate-pulse" />
              Predictive AI Yield Forecaster
            </h3>
            <p className="text-xs text-slate-400">
              Run real-time agronomical forecasting based on local physical constraints and historical records.
            </p>
          </div>
          {/* Quick profile reference */}
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 self-start md:self-auto flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Profile Context: <strong>+91 {user?.mobile || "Register Mobile"}</strong></span>
          </div>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Select Crop to Forecast</label>
            <div className="grid grid-cols-3 gap-1.5">
              {defaultCrops.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setSelectedCrop(crop)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedCrop === crop
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-black"
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Soil Profile (Overridable)</label>
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                placeholder="e.g. Clayey Loam"
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Field Size (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                placeholder="Acreage"
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col justify-between">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Historical Records / Context</label>
              <textarea
                value={historicalSummary}
                onChange={(e) => setHistoricalSummary(e.target.value)}
                placeholder="Mention last year's yields or regional constraints..."
                rows={3}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700 resize-none"
              />
            </div>
            <button
              onClick={handleRunForecast}
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Calculating Model...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Crop Yield</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3"
            >
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full animate-bounce">
                <Brain className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center">
                <h4 className="text-xs font-black text-slate-700">Predictive engine running Monte Carlo projections</h4>
                <p className="text-[11px] text-emerald-600 font-mono animate-pulse">{loadingMessages[loadingStep]}</p>
              </div>
              <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                  transition={{ duration: 1.2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Forecast Result Panel */}
        <AnimatePresence>
          {forecastResult && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Average Harvest Highlight */}
                <div className="md:col-span-2 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Projected Total Harvest</span>
                    <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg"><Sprout className="w-4 h-4" /></span>
                  </div>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-800 block">
                      {forecastResult.predictedYieldAverage} <span className="text-sm font-black text-slate-500">{forecastResult.predictedYieldMetric}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Expected range: <strong>{forecastResult.predictedYieldValueMin} - {forecastResult.predictedYieldValueMax} {forecastResult.predictedYieldMetric}</strong> across {forecastResult.landArea} acres.
                    </span>
                  </div>
                  <div className="border-t border-emerald-100/50 pt-2 flex items-center gap-1.5 text-[10px] text-emerald-800">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Estimated Harvest: <strong>{forecastResult.predictedHarvestDate}</strong></span>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">AI Model Confidence</span>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-3xl font-black text-slate-800">{forecastResult.confidenceScore}%</span>
                      <Percent className="w-5 h-5 text-emerald-600 shrink-0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${forecastResult.confidenceScore}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Based on high correlation with physical soil and location properties.
                    </span>
                  </div>
                </div>

                {/* Sowing Profile Confirmation */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Optimized Soil Affinity</span>
                    <span className="text-sm font-black text-slate-700 block mt-2">{forecastResult.soilType}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block mt-1">
                      Ideal for retaining macro-nutrients (NPK) necessary for high-vigor {forecastResult.cropName}.
                    </span>
                  </div>
                  <div className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg inline-block self-start mt-2">
                    Highly Compatible
                  </div>
                </div>
              </div>

              {/* Climate Scenario & Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Scenario Bar Chart */}
                <div className="border border-slate-100 rounded-2xl p-5 space-y-3 bg-white">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-600" /> Climate Scenario Analysis
                    </h4>
                    <p className="text-[10px] text-slate-400">Total estimated harvest ({forecastResult.predictedYieldMetric}) in different weather seasons.</p>
                  </div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scenarioChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                        <XAxis dataKey="scenario" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "10px" }} />
                        <Bar dataKey="Projected Yield" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Probability (%)" fill="#64748b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Influencing factors list */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-white space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Key Yield Influencers
                    </h4>
                    <p className="text-[10px] text-slate-400">Top physiological and physical constraints affecting estimates.</p>
                  </div>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {forecastResult.influencingFactors?.map((f: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 border border-slate-100/50 rounded-xl">
                        <div className="text-left">
                          <span className="font-bold text-slate-700 block text-[11px]">{f.factorName}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Impact: <strong className="text-emerald-700">{f.impact}</strong></span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 font-bold rounded-md ${
                          f.status.toLowerCase().includes("optimal") || f.status.toLowerCase().includes("excellent")
                            ? "bg-emerald-50 text-emerald-700"
                            : f.status.toLowerCase().includes("deficit") || f.status.toLowerCase().includes("poor")
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {f.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expert Advice Row */}
              <div className="bg-emerald-50/30 border border-emerald-100/30 rounded-2xl p-5 text-left space-y-3">
                <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 animate-pulse text-emerald-600" />
                  Agronomic Expert Recommendations to Optimize Yield
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {forecastResult.agronomistRecommendations?.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 bg-white border border-emerald-100/50 rounded-xl text-[11px] text-slate-600 leading-normal flex gap-2">
                      <span className="text-emerald-600 shrink-0 mt-0.5 font-bold">{idx + 1}.</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🗺️ Interactive Soil Quality Map overlay */}
      <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6 text-left relative" id="interactive-soil-map-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-emerald-600 animate-pulse" />
              Interactive Soil Quality & Nutrient Map
            </h3>
            <p className="text-xs text-slate-400">
              Interactive schematic of your registered plots. Toggle layers to view dynamic chemical heatmaps.
            </p>
          </div>
          {/* Active indicator & actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadMap}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
              id="download-soil-map-btn"
            >
              <Download className={`w-3.5 h-3.5 ${exporting ? "animate-bounce" : ""}`} />
              <span>{exporting ? "Exporting..." : "Download Map (PNG)"}</span>
            </button>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Sandbox
            </span>
          </div>
        </div>

        {/* Layer selection controls (Radio Buttons) */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-3">Select Active Soil Nutrient/Property Layer</span>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: "general", label: "General Plot View", desc: "Zonal soil boundaries", icon: Layers, color: "text-emerald-600" },
              { id: "nitrogen", label: "Nitrogen (N)", desc: "Protein & vegetative growth", icon: Activity, color: "text-rose-600" },
              { id: "phosphorus", label: "Phosphorus (P)", desc: "Root & flower development", icon: Sprout, color: "text-amber-600" },
              { id: "potassium", label: "Potassium (K)", desc: "Cell walls & water retention", icon: Sliders, color: "text-indigo-600" },
              { id: "ph", label: "Soil pH Level", desc: "Nutrient bioavailability", icon: Gauge, color: "text-orange-600" },
              { id: "moisture", label: "Moisture (%)", desc: "Saturation & drought status", icon: Droplets, color: "text-blue-600" }
            ].map((layer) => {
              const IconComponent = layer.icon;
              const isChecked = activeOverlay === layer.id;
              return (
                <label
                  key={layer.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-white border-emerald-500 ring-2 ring-emerald-500/15 shadow-sm"
                      : "bg-white/50 border-slate-200/60 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="radio"
                      name="soil-layer"
                      value={layer.id}
                      checked={isChecked}
                      onChange={() => setActiveOverlay(layer.id as any)}
                      className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div className="text-left space-y-0.5 select-none">
                    <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <IconComponent className={`w-3.5 h-3.5 ${layer.color}`} />
                      {layer.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      {layer.desc}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Map visualization grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map Column (3/5) */}
          <div className="lg:col-span-3 border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-between relative overflow-hidden h-[340px]">
            {/* SVG Interactive Farm */}
            <div className="w-full h-full flex items-center justify-center relative">
              <svg 
                ref={svgRef}
                viewBox="0 0 500 300" 
                className="w-full max-w-[450px] drop-shadow-xl select-none"
              >
                {/* Field 1: North Orchard */}
                <path
                  d="M 20 20 Q 150 10, 240 40 L 220 150 Q 120 130, 20 140 Z"
                  className={`transition-all duration-300 ease-in-out cursor-pointer ${getZoneColorClass(sectors[0])}`}
                  onClick={() => setSelectedZoneId("zone-1")}
                />
                
                {/* Field 2: Main Sowing Flat */}
                <path
                  d="M 240 40 Q 380 15, 480 30 L 460 170 Q 350 150, 220 150 Z"
                  className={`transition-all duration-300 ease-in-out cursor-pointer ${getZoneColorClass(sectors[1])}`}
                  onClick={() => setSelectedZoneId("zone-2")}
                />
                
                {/* Field 3: Western Slope */}
                <path
                  d="M 20 140 Q 120 130, 220 150 L 190 280 Q 90 260, 20 270 Z"
                  className={`transition-all duration-300 ease-in-out cursor-pointer ${getZoneColorClass(sectors[2])}`}
                  onClick={() => setSelectedZoneId("zone-3")}
                />
                
                {/* Field 4: Canal Runoff Zone */}
                <path
                  d="M 220 150 Q 350 150, 460 170 L 430 280 Q 310 270, 190 280 Z"
                  className={`transition-all duration-300 ease-in-out cursor-pointer ${getZoneColorClass(sectors[3])}`}
                  onClick={() => setSelectedZoneId("zone-4")}
                />

                {/* Plot text overlay labels */}
                <text x="70" y="80" className="fill-slate-700 pointer-events-none text-[10px] font-black uppercase tracking-wider opacity-90">
                  {sectors[0].name}
                </text>
                <text x="310" y="90" className="fill-slate-800 pointer-events-none text-[10px] font-black uppercase tracking-wider opacity-90">
                  {sectors[1].name}
                </text>
                <text x="70" y="215" className="fill-slate-700 pointer-events-none text-[10px] font-black uppercase tracking-wider opacity-90">
                  {sectors[2].name}
                </text>
                <text x="270" y="215" className="fill-slate-800 pointer-events-none text-[10px] font-black uppercase tracking-wider opacity-90">
                  {sectors[3].name}
                </text>

                {/* Area markers on SVG */}
                <text x="90" y="98" className="fill-slate-500 pointer-events-none text-[9px] font-semibold">
                  ({sectors[0].area} Ac)
                </text>
                <text x="330" y="108" className="fill-slate-400 pointer-events-none text-[9px] font-semibold">
                  ({sectors[1].area} Ac)
                </text>
                <text x="90" y="233" className="fill-slate-500 pointer-events-none text-[9px] font-semibold">
                  ({sectors[2].area} Ac)
                </text>
                <text x="290" y="233" className="fill-slate-400 pointer-events-none text-[9px] font-semibold">
                  ({sectors[3].area} Ac)
                </text>

                {/* 🛰️ Real-time IoT Soil Sensors (NPK live markers) */}
                {sensorsData.map((sensor) => {
                  const zone = sectors.find(s => s.id === sensor.zoneId);
                  if (!zone) return null;
                  const isSelected = selectedZoneId === sensor.zoneId;
                  return (
                    <g 
                      key={sensor.id} 
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZoneId(sensor.zoneId);
                      }}
                    >
                      {/* Pulse outer circle for active live feed */}
                      <circle 
                        cx={sensor.x} 
                        cy={sensor.y} 
                        r="12" 
                        className="fill-emerald-400/25 animate-pulse pointer-events-none" 
                      />
                      
                      {/* Interactive sensor node circle */}
                      <circle 
                        cx={sensor.x} 
                        cy={sensor.y} 
                        r="5.5" 
                        className={`transition-all duration-300 ${isSelected ? 'fill-emerald-500 stroke-emerald-200 stroke-2' : 'fill-slate-900 stroke-white stroke-[1.5]'}`} 
                      />
                      
                      {/* Micro antenna dot */}
                      <circle 
                        cx={sensor.x} 
                        cy={sensor.y} 
                        r="1.5" 
                        className="fill-white pointer-events-none" 
                      />

                      {/* Floating HUD pill showing real-time NPK levels */}
                      <g 
                        transform={`translate(${sensor.x - 40}, ${sensor.y - 24})`} 
                        className="pointer-events-none select-none transition-all duration-300 group-hover:scale-105 origin-center"
                      >
                        {/* Pill container */}
                        <rect 
                          x="0" 
                          y="0" 
                          width="80" 
                          height="14" 
                          rx="7" 
                          className="fill-slate-900/95 stroke-slate-800" 
                          strokeWidth="0.5" 
                        />
                        {/* Live flashing green status light */}
                        <circle cx="7" cy="7" r="1.8" className="fill-emerald-400 animate-pulse" />
                        {/* NPK Text */}
                        <text 
                          x="43" 
                          y="10" 
                          textAnchor="middle" 
                          className="fill-emerald-300 font-mono text-[7px] font-black tracking-wider"
                        >
                          N:{zone.nitrogen} P:{zone.phosphorus} K:{zone.potassium}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Compass Rose Ornament */}
              <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full p-2 flex items-center justify-center gap-1 text-slate-400">
                <Compass className="w-5 h-5 text-emerald-600" />
                <span className="text-[9px] font-black tracking-widest uppercase">N</span>
              </div>

              {/* Scale bar ornament */}
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg px-2 py-1 text-slate-500 text-[8px] font-bold flex flex-col items-center">
                <span className="mb-0.5 font-black uppercase tracking-wider">Scale Bar</span>
                <div className="w-12 h-1 bg-slate-300 flex">
                  <div className="w-1/2 h-full bg-emerald-600" />
                </div>
                <span className="mt-0.5">approx. 50m</span>
              </div>
            </div>

            {/* Heatmap color guide legend */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Heatmap Overlay Range</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-slate-400 font-bold">Deficient</span>
                  <div className="w-24 h-2 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-700 rounded-full border border-slate-100" />
                  <span className="text-[9px] text-emerald-700 font-bold">Optimal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Column (2/5) */}
          <div className="lg:col-span-2">
            {/* Selected Plot details Panel */}
            {(() => {
              const activePlot = sectors.find(s => s.id === selectedZoneId) || sectors[0];
              return (
                <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Selected Zonal Sector</span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-wide animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                            Live Telemetry
                          </span>
                        </div>
                        <h4 className="font-black text-slate-800 text-sm mt-0.5">{activePlot.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-700 block">{activePlot.area} Acres</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{activePlot.soilTexture}</span>
                      </div>
                    </div>

                    {/* Chemical/Physical Metrics List */}
                    <div className="space-y-3">
                      {/* Nitrogen */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Nitrogen (N)
                          </span>
                          <span className={`font-bold ${activePlot.nitrogen < 50 ? "text-rose-600" : "text-emerald-700"}`}>
                            {activePlot.nitrogen} ppm <span className="text-[10px] font-medium text-slate-400">(Target: 65)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${activePlot.nitrogen < 50 ? "bg-rose-400" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (activePlot.nitrogen / 100) * 100)}%` }} />
                        </div>
                      </div>

                      {/* Phosphorus */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Phosphorus (P)
                          </span>
                          <span className={`font-bold ${activePlot.phosphorus < 20 ? "text-amber-600" : "text-emerald-700"}`}>
                            {activePlot.phosphorus} ppm <span className="text-[10px] font-medium text-slate-400">(Target: 25)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${activePlot.phosphorus < 20 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (activePlot.phosphorus / 50) * 100)}%` }} />
                        </div>
                      </div>

                      {/* Potassium */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Potassium (K)
                          </span>
                          <span className={`font-bold ${activePlot.potassium < 150 ? "text-amber-600" : "text-emerald-700"}`}>
                            {activePlot.potassium} ppm <span className="text-[10px] font-medium text-slate-400">(Target: 200)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${activePlot.potassium < 150 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (activePlot.potassium / 300) * 100)}%` }} />
                        </div>
                      </div>

                      {/* Organic Carbon */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Organic Carbon (OC)
                          </span>
                          <span className="font-bold text-slate-700">
                            {activePlot.organicCarbon}% <span className="text-[10px] font-medium text-slate-400">(Target: &gt;0.7%)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (activePlot.organicCarbon / 1.5) * 100)}%` }} />
                        </div>
                      </div>

                      {/* pH Meter */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Soil pH Level
                          </span>
                          <span className={`font-bold ${activePlot.ph < 6.0 ? "text-orange-600" : "text-emerald-700"}`}>
                            {activePlot.ph} <span className="text-[10px] font-medium text-slate-400">({activePlot.ph < 6.0 ? "Acidic" : activePlot.ph > 7.0 ? "Alkaline" : "Neutral"})</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${activePlot.ph < 6.0 ? "bg-orange-400" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (activePlot.ph / 14) * 100)}%` }} />
                        </div>
                      </div>

                      {/* Moisture level */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Zone Moisture Status
                          </span>
                          <span className={`font-bold ${activePlot.moisture > 70 ? "text-blue-700 animate-pulse" : "text-slate-700"}`}>
                            {activePlot.moisture}% <span className="text-[10px] font-medium text-slate-400">({activePlot.moisture > 70 ? "Saturated" : "Optimal"})</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${activePlot.moisture > 70 ? "bg-blue-600" : "bg-blue-400"}`} style={{ width: `${activePlot.moisture}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Specific dynamic advice */}
                    <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 leading-normal flex gap-2 border border-slate-100">
                      <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{activePlot.recommendation}</span>
                    </div>
                  </div>

                  {/* Compost/Lime/Drainage Treatment Simulator actions */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Plot Treatment Simulation</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleApplyTreatment("compost")}
                        disabled={activePlot.nitrogen >= 95}
                        className="py-1.5 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+Compost</span>
                      </button>

                      <button
                        onClick={() => handleApplyTreatment("lime")}
                        disabled={activePlot.ph >= 7.0}
                        className="py-1.5 px-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-100 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>+Lime</span>
                      </button>

                      <button
                        onClick={() => handleApplyTreatment("drain")}
                        disabled={activePlot.moisture <= 45}
                        className="py-1.5 px-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-100 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer disabled:opacity-50"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Drain Field</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Dynamic Simulation Notification log */}
        <AnimatePresence>
          {simulationActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 animate-spin" />
                <span>{simulationActive}</span>
              </div>
              <button 
                type="button"
                onClick={() => setSimulationActive(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] block text-slate-400 uppercase tracking-wider font-bold">Estimated Yield Index</span>
            <span className="text-xl font-black text-slate-800">88.5% <span className="text-xs text-emerald-600 font-bold">(+4.2%)</span></span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
            <Droplets className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] block text-slate-400 uppercase tracking-wider font-bold">Irrigation Efficiency</span>
            <span className="text-xl font-black text-slate-800">92% <span className="text-xs text-blue-600 font-bold">(Water Saved)</span></span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] block text-slate-400 uppercase tracking-wider font-bold">Fertilizer cost saved</span>
            <span className="text-xl font-black text-slate-800">₹4,200 <span className="text-xs text-amber-600 font-bold">(Via Bio Alternatives)</span></span>
          </div>
        </div>
      </div>

      {/* Expense tracker & Moisture graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense comparisons */}
        <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Fertilizer Budget Tracker (Monthly)
            </h4>
            <p className="text-[11px] text-slate-400">Comparing financial budgets: Chemical inputs vs low-cost Organic/Bio-compost alternatives.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" dataKey="Synthetic Route" stroke="#e11d48" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Organic Route" stroke="#16a34a" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water consumptions */}
        <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" /> Smart Irrigation Water Log
            </h4>
            <p className="text-[11px] text-slate-400">Comparing actual moisture applied per week against agronomical guidelines.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="Optimal Water (mm)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual Applied (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yield layout */}
      <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 space-y-2 text-left">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" /> Farm Sowing Yield Allocation
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Breakdown of cash crops harvested in the last 12 months across your acreage.
          </p>
          <div className="space-y-1.5 pt-2">
            {yieldData.map((y, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: y.color }} />
                  {y.name}
                </span>
                <span className="font-bold text-slate-700">{y.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 h-56 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px" }} />
              <Pie
                data={yieldData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {yieldData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
