import React, { useState } from "react";
import { Bi } from "../Bilingual";
import { useLanguage } from "../../contexts/LanguageContext";
import { LivestockCalculatorType } from "../../types";
import { Calculator, AlertTriangle, ArrowRight, RotateCcw, TrendingUp, IndianRupee } from "lucide-react";

export const LivestockCalculators: React.FC = () => {
  const { language } = useLanguage();
  const [calcType, setCalcType] = useState<LivestockCalculatorType>("dairy");

  // Dairy State
  const [dairyAnimals, setDairyAnimals] = useState<number>(5);
  const [dairyFeedCostDaily, setDairyFeedCostDaily] = useState<number>(140); // per animal/day
  const [dairyMilkYield, setDairyMilkYield] = useState<number>(12); // liters/day/animal
  const [dairyMilkPrice, setDairyMilkPrice] = useState<number>(42); // per liter
  const [dairyHealthMonthly, setDairyHealthMonthly] = useState<number>(2500);
  const [dairyLabourMonthly, setDairyLabourMonthly] = useState<number>(4000);
  const [dairyOtherMonthly, setDairyOtherMonthly] = useState<number>(1500);

  // Sheep State
  const [sheepCount, setSheepCount] = useState<number>(30);
  const [sheepAnnualFeedPerHead, setSheepAnnualFeedPerHead] = useState<number>(1800);
  const [sheepHealthPerHead, setSheepHealthPerHead] = useState<number>(350);
  const [sheepLabourAnnual, setSheepLabourAnnual] = useState<number>(36000);
  const [sheepSaleCount, setSheepSaleCount] = useState<number>(20);
  const [sheepSalePrice, setSheepSalePrice] = useState<number>(7500);

  // Goat State
  const [goatCount, setGoatCount] = useState<number>(25);
  const [goatAnnualFeedPerHead, setGoatAnnualFeedPerHead] = useState<number>(2200);
  const [goatHealthPerHead, setGoatHealthPerHead] = useState<number>(400);
  const [goatLabourAnnual, setGoatLabourAnnual] = useState<number>(30000);
  const [goatKidsSaleCount, setGoatKidsSaleCount] = useState<number>(35);
  const [goatKidsSalePrice, setGoatKidsSalePrice] = useState<number>(6000);
  const [goatMilkIncomeMonthly, setGoatMilkIncomeMonthly] = useState<number>(2000);

  // Poultry (Broiler Batch) State
  const [broilerBirds, setBroilerBirds] = useState<number>(1000);
  const [broilerChickCost, setBroilerChickCost] = useState<number>(35);
  const [broilerFeedCost, setBroilerFeedCost] = useState<number>(110000); // for batch
  const [broilerMedicine, setBroilerMedicine] = useState<number>(8000);
  const [broilerElectricity, setBroilerElectricity] = useState<number>(6000);
  const [broilerMortalityPct, setBroilerMortalityPct] = useState<number>(4);
  const [broilerAvgWeightKg, setBroilerAvgWeightKg] = useState<number>(2.2);
  const [broilerSellingPricePerKg, setBroilerSellingPricePerKg] = useState<number>(115);

  // Fisheries State
  const [pondAcres, setPondAcres] = useState<number>(1);
  const [fingerlingCount, setFingerlingCount] = useState<number>(4000);
  const [fingerlingUnitCost, setFingerlingUnitCost] = useState<number>(3.5);
  const [fishFeedCycleCost, setFishFeedCycleCost] = useState<number>(120000);
  const [pondLabourCost, setPondLabourCost] = useState<number>(25000);
  const [pondOtherCost, setPondOtherCost] = useState<number>(15000);
  const [expectedHarvestKg, setExpectedHarvestKg] = useState<number>(3200);
  const [fishSellingPricePerKg, setFishSellingPricePerKg] = useState<number>(160);

  // Calculations
  const calculateResult = () => {
    switch (calcType) {
      case "dairy": {
        const monthlyFeed = dairyAnimals * dairyFeedCostDaily * 30;
        const totalCostMonthly = monthlyFeed + dairyHealthMonthly + dairyLabourMonthly + dairyOtherMonthly;
        const monthlyMilkLiters = dairyAnimals * dairyMilkYield * 30;
        const totalRevenueMonthly = monthlyMilkLiters * dairyMilkPrice;
        const profitMonthly = totalRevenueMonthly - totalCostMonthly;
        return {
          cycleLabelEn: "Monthly Projection (30 Days)",
          cycleLabelHi: "मासिक अनुमान (30 दिन)",
          cost: Math.round(totalCostMonthly),
          revenue: Math.round(totalRevenueMonthly),
          profit: Math.round(profitMonthly),
          breakdown: [
            { labelEn: "Animal Feed & Fodder", labelHi: "पशु आहार एवं चारा", val: monthlyFeed },
            { labelEn: "Veterinary & Medicine", labelHi: "दवाई एवं पशु चिकित्सक", val: dairyHealthMonthly },
            { labelEn: "Farm Labour & Upkeep", labelHi: "मजदूरी एवं शेड रखरखाव", val: dairyLabourMonthly + dairyOtherMonthly }
          ]
        };
      }
      case "sheep": {
        const feedCost = sheepCount * sheepAnnualFeedPerHead;
        const healthCost = sheepCount * sheepHealthPerHead;
        const totalCostAnnual = feedCost + healthCost + sheepLabourAnnual;
        const totalRevenueAnnual = sheepSaleCount * sheepSalePrice;
        const profitAnnual = totalRevenueAnnual - totalCostAnnual;
        return {
          cycleLabelEn: "Annual Cycle Projection (1 Year)",
          cycleLabelHi: "वार्षिक अनुमान (1 वर्ष)",
          cost: Math.round(totalCostAnnual),
          revenue: Math.round(totalRevenueAnnual),
          profit: Math.round(profitAnnual),
          breakdown: [
            { labelEn: "Supplemental Feeding", labelHi: "पूरक आहार लागत", val: feedCost },
            { labelEn: "Deworming & Vaccines", labelHi: "कीड़े की दवा व टीके", val: healthCost },
            { labelEn: "Shepherd / Grazing Labour", labelHi: "चराई एवं मजदूरी", val: sheepLabourAnnual }
          ]
        };
      }
      case "goat": {
        const feedCost = goatCount * goatAnnualFeedPerHead;
        const healthCost = goatCount * goatHealthPerHead;
        const totalCostAnnual = feedCost + healthCost + goatLabourAnnual;
        const kidRevenue = goatKidsSaleCount * goatKidsSalePrice;
        const milkRevenue = goatMilkIncomeMonthly * 12;
        const totalRevenueAnnual = kidRevenue + milkRevenue;
        const profitAnnual = totalRevenueAnnual - totalCostAnnual;
        return {
          cycleLabelEn: "Annual Stall-Feed Projection (1 Year)",
          cycleLabelHi: "वार्षिक मचान/स्टाल अनुमान (1 वर्ष)",
          cost: Math.round(totalCostAnnual),
          revenue: Math.round(totalRevenueAnnual),
          profit: Math.round(profitAnnual),
          breakdown: [
            { labelEn: "Green Fodder & Concentrate", labelHi: "दाना एवं चारा", val: feedCost },
            { labelEn: "Vaccination & Health", labelHi: "टीकाकरण व दवा", val: healthCost },
            { labelEn: "Labour & Shelter", labelHi: "मजदूरी व शेड", val: goatLabourAnnual }
          ]
        };
      }
      case "poultry": {
        const chickTotal = broilerBirds * broilerChickCost;
        const totalCostBatch = chickTotal + broilerFeedCost + broilerMedicine + broilerElectricity;
        const survivingBirds = broilerBirds * (1 - broilerMortalityPct / 100);
        const totalHarvestKg = survivingBirds * broilerAvgWeightKg;
        const totalRevenueBatch = totalHarvestKg * broilerSellingPricePerKg;
        const profitBatch = totalRevenueBatch - totalCostBatch;
        return {
          cycleLabelEn: "Broiler Batch Projection (40-45 Days)",
          cycleLabelHi: "ब्रॉयलर बैच अनुमान (40-45 दिन)",
          cost: Math.round(totalCostBatch),
          revenue: Math.round(totalRevenueBatch),
          profit: Math.round(profitBatch),
          breakdown: [
            { labelEn: "Day-Old Chicks", labelHi: "एक दिन के चूजे", val: chickTotal },
            { labelEn: "Poultry Feed (Pre-starter/Starter/Finisher)", labelHi: "दाना लागत", val: broilerFeedCost },
            { labelEn: "Medicine, Bedding & Power", labelHi: "दवा, बिछावन व बिजली", val: broilerMedicine + broilerElectricity }
          ]
        };
      }
      case "fisheries": {
        const fingerlingTotal = fingerlingCount * fingerlingUnitCost;
        const totalCostCycle = fingerlingTotal + fishFeedCycleCost + pondLabourCost + pondOtherCost;
        const totalRevenueCycle = expectedHarvestKg * fishSellingPricePerKg;
        const profitCycle = totalRevenueCycle - totalCostCycle;
        return {
          cycleLabelEn: "Pond Cycle Projection (8-10 Months)",
          cycleLabelHi: "तालाब चक्र अनुमान (8-10 महीने)",
          cost: Math.round(totalCostCycle),
          revenue: Math.round(totalRevenueCycle),
          profit: Math.round(profitCycle),
          breakdown: [
            { labelEn: "Fingerlings / Seed", labelHi: "मछली जीरा / बीज", val: fingerlingTotal },
            { labelEn: "Pellet Feed & Manure", labelHi: "मछली चारा एवं खाद", val: fishFeedCycleCost },
            { labelEn: "Harvest Labour & Pond Maintenance", labelHi: "कटाई मजदूरी व रख-रखाव", val: pondLabourCost + pondOtherCost }
          ]
        };
      }
    }
  };

  const res = calculateResult();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 md:p-6 bg-emerald-50/70 border-b border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <Bi en="Livestock & Fish Farming Economic Calculators" sub="पशुपालन एवं मत्स्य आर्थिक कैलकुलेटर" />
          </div>
          <p className="text-xs md:text-sm text-stone-600">
            <Bi 
              en="Estimate operating expenditures, yield revenues, and projected operating margins before investing." 
              sub="निवेश करने से पहले परिचालन खर्च, कुल उपज आय और अनुमानित लाभ का हिसाब लगाएं।" 
            />
          </p>
        </div>

        {/* Category switcher tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["dairy", "sheep", "goat", "poultry", "fisheries"] as LivestockCalculatorType[]).map((t) => (
            <button
              key={t}
              onClick={() => setCalcType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                calcType === t 
                  ? "bg-emerald-700 text-white shadow-sm" 
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {t === "dairy" && <Bi en="Dairy" sub="डेयरी" />}
              {t === "sheep" && <Bi en="Sheep" sub="भेड़" />}
              {t === "goat" && <Bi en="Goat" sub="बकरी" />}
              {t === "poultry" && <Bi en="Poultry" sub="पोल्ट्री" />}
              {t === "fisheries" && <Bi en="Fisheries" sub="मत्स्य" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 md:p-6">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
            <Bi en="Cost & Production Parameters" sub="लागत एवं उत्पादन पैरामीटर" />
          </h4>

          {calcType === "dairy" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Milking Animals Count" sub="दुधारू पशुओं की संख्या" />
                </label>
                <input 
                  type="number" 
                  value={dairyAnimals} 
                  onChange={(e) => setDairyAnimals(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Daily Feed Cost (₹/Animal)" sub="प्रति पशु दैनिक आहार खर्च (₹)" />
                </label>
                <input 
                  type="number" 
                  value={dairyFeedCostDaily} 
                  onChange={(e) => setDairyFeedCostDaily(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Avg Milk Yield (Liters/Day/Cow)" sub="औसत दूध (लीटर/दिन/पशु)" />
                </label>
                <input 
                  type="number" 
                  value={dairyMilkYield} 
                  onChange={(e) => setDairyMilkYield(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Milk Selling Price (₹/Liter)" sub="दूध विक्रय दर (₹/लीटर)" />
                </label>
                <input 
                  type="number" 
                  value={dairyMilkPrice} 
                  onChange={(e) => setDairyMilkPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Monthly Health / Vet (₹)" sub="मासिक दवा व डॉक्टर (₹)" />
                </label>
                <input 
                  type="number" 
                  value={dairyHealthMonthly} 
                  onChange={(e) => setDairyHealthMonthly(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Labour & Shed Maint (₹/Mo)" sub="मजदूरी व शेड (₹/माह)" />
                </label>
                <input 
                  type="number" 
                  value={dairyLabourMonthly + dairyOtherMonthly} 
                  onChange={(e) => setDairyLabourMonthly(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>
            </div>
          )}

          {calcType === "sheep" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Flock Size (Adult Ewes)" sub="भेड़ों की कुल संख्या" />
                </label>
                <input 
                  type="number" 
                  value={sheepCount} 
                  onChange={(e) => setSheepCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Annual Feed / Head (₹)" sub="वार्षिक दाना/चारा प्रति भेड़ (₹)" />
                </label>
                <input 
                  type="number" 
                  value={sheepAnnualFeedPerHead} 
                  onChange={(e) => setSheepAnnualFeedPerHead(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Lambs Sold Per Year" sub="सालाना बेचे जाने वाले मेमने" />
                </label>
                <input 
                  type="number" 
                  value={sheepSaleCount} 
                  onChange={(e) => setSheepSaleCount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Selling Price / Lamb (₹)" sub="प्रति मेमना विक्रय मूल्य (₹)" />
                </label>
                <input 
                  type="number" 
                  value={sheepSalePrice} 
                  onChange={(e) => setSheepSalePrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Health & Vaccines / Head (₹)" sub="दवा व टीका प्रति भेड़ (₹)" />
                </label>
                <input 
                  type="number" 
                  value={sheepHealthPerHead} 
                  onChange={(e) => setSheepHealthPerHead(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Annual Grazing / Labour (₹)" sub="वार्षिक चरवाहा/मजदूरी (₹)" />
                </label>
                <input 
                  type="number" 
                  value={sheepLabourAnnual} 
                  onChange={(e) => setSheepLabourAnnual(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>
            </div>
          )}

          {calcType === "goat" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Goats Herd (Female Does)" sub="बकरियों की संख्या (मादा)" />
                </label>
                <input 
                  type="number" 
                  value={goatCount} 
                  onChange={(e) => setGoatCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Annual Feed & Fodder / Goat (₹)" sub="सालाना दाना व चारा प्रति बकरी (₹)" />
                </label>
                <input 
                  type="number" 
                  value={goatAnnualFeedPerHead} 
                  onChange={(e) => setGoatAnnualFeedPerHead(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Kids Sold Annually" sub="सालाना बेचे गए बच्चे" />
                </label>
                <input 
                  type="number" 
                  value={goatKidsSaleCount} 
                  onChange={(e) => setGoatKidsSaleCount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Selling Price / Kid (₹)" sub="प्रति बच्चा बिक्री मूल्य (₹)" />
                </label>
                <input 
                  type="number" 
                  value={goatKidsSalePrice} 
                  onChange={(e) => setGoatKidsSalePrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Health & Deworming / Goat (₹)" sub="दवा व पेट के कीड़े की दवा (₹)" />
                </label>
                <input 
                  type="number" 
                  value={goatHealthPerHead} 
                  onChange={(e) => setGoatHealthPerHead(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Annual Labour / Shed (₹)" sub="वार्षिक मजदूरी व शेड (₹)" />
                </label>
                <input 
                  type="number" 
                  value={goatLabourAnnual} 
                  onChange={(e) => setGoatLabourAnnual(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>
            </div>
          )}

          {calcType === "poultry" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Batch Size (Broiler Birds)" sub="चूजों की संख्या (प्रति बैच)" />
                </label>
                <input 
                  type="number" 
                  value={broilerBirds} 
                  onChange={(e) => setBroilerBirds(Math.max(10, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Chick Cost (₹/Bird)" sub="चूजा खरीद दर (₹/चूजा)" />
                </label>
                <input 
                  type="number" 
                  value={broilerChickCost} 
                  onChange={(e) => setBroilerChickCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Feed Cost for Batch (₹)" sub="बैच का कुल दाना खर्च (₹)" />
                </label>
                <input 
                  type="number" 
                  value={broilerFeedCost} 
                  onChange={(e) => setBroilerFeedCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Selling Price (₹/Kg Live)" sub="बिक्री दर (₹/किग्रा जीवित)" />
                </label>
                <input 
                  type="number" 
                  value={broilerSellingPricePerKg} 
                  onChange={(e) => setBroilerSellingPricePerKg(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Avg Body Weight (Kg)" sub="तैयार मुर्गे का औसत वजन (किग्रा)" />
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={broilerAvgWeightKg} 
                  onChange={(e) => setBroilerAvgWeightKg(Math.max(0.5, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Mortality Allowance (%)" sub="मृत्यु दर अनुमान (%)" />
                </label>
                <input 
                  type="number" 
                  value={broilerMortalityPct} 
                  onChange={(e) => setBroilerMortalityPct(Math.max(0, Math.min(25, Number(e.target.value))))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>
            </div>
          )}

          {calcType === "fisheries" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Fingerlings Stocked (Count)" sub="तालाब में मछली जीरा की संख्या" />
                </label>
                <input 
                  type="number" 
                  value={fingerlingCount} 
                  onChange={(e) => setFingerlingCount(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Feed & Manure for Cycle (₹)" sub="साइकिल का चारा व खाद खर्च (₹)" />
                </label>
                <input 
                  type="number" 
                  value={fishFeedCycleCost} 
                  onChange={(e) => setFishFeedCycleCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Expected Harvest (Total Kg)" sub="कुल मछली उत्पादन (किग्रा)" />
                </label>
                <input 
                  type="number" 
                  value={expectedHarvestKg} 
                  onChange={(e) => setExpectedHarvestKg(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Wholesale Price (₹/Kg)" sub="थोक मछली विक्रय दर (₹/किग्रा)" />
                </label>
                <input 
                  type="number" 
                  value={fishSellingPricePerKg} 
                  onChange={(e) => setFishSellingPricePerKg(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Fingerling Unit Rate (₹)" sub="जीरा खरीद दर (₹/संख्या)" />
                </label>
                <input 
                  type="number" 
                  step="0.5"
                  value={fingerlingUnitCost} 
                  onChange={(e) => setFingerlingUnitCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="text-stone-700 font-medium block mb-1">
                  <Bi en="Netting, Labour & Diesel (₹)" sub="जाल खिंचाई, मजदूरी व डीजल (₹)" />
                </label>
                <input 
                  type="number" 
                  value={pondLabourCost + pondOtherCost} 
                  onChange={(e) => setPondLabourCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 font-semibold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Projection Outputs */}
        <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              <Bi en={res.cycleLabelEn} sub={res.cycleLabelHi} />
            </div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <Bi en="Financial Projection" sub="वित्तीय आय-व्यय अनुमान" />
            </h3>

            {/* Metrics */}
            <div className="space-y-3 mb-5">
              <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span className="text-xs font-semibold text-stone-600">
                    <Bi en="Estimated Cost" sub="अनुमानित कुल लागत" />
                  </span>
                </div>
                <span className="text-base font-bold text-stone-800 tabular-nums">
                  ₹{res.cost.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-stone-600">
                    <Bi en="Estimated Revenue" sub="अनुमानित कुल आय" />
                  </span>
                </div>
                <span className="text-base font-bold text-stone-900 tabular-nums">
                  ₹{res.revenue.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-xs text-emerald-950 font-bold block">
                    <Bi en="Estimated Operating Profit" sub="अनुमानित शुद्ध लाभ" />
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {res.cost > 0 ? `${Math.round((res.profit / res.revenue) * 100)}% profit margin` : ""}
                  </span>
                </div>
                <span className={`text-xl font-extrabold tabular-nums ${res.profit >= 0 ? "text-emerald-800" : "text-rose-700"}`}>
                  ₹{res.profit.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 border-t border-stone-200 pt-4 text-xs">
              <span className="text-stone-800 font-bold block mb-2">
                <Bi en="Cost Component Breakdown" sub="खर्च का घटकवार विवरण" />
              </span>
              <div className="divide-y divide-stone-100">
                {res.breakdown.map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 text-stone-600 text-xs">
                    <span className="font-medium"><Bi en={b.labelEn} sub={b.labelHi} /></span>
                    <span className="font-semibold text-stone-800 tabular-nums">₹{b.val.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-2.5 items-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950 font-semibold mb-0.5">
                <Bi en="Estimates Disclaimer" sub="महत्वपूर्ण अस्वीकरण (Disclaimer)" />
              </strong>
              <span className="text-[11px] text-amber-800/90 leading-relaxed block">
                <Bi 
                  en="All calculations are estimates for educational planning only. Actual market rates, local mortality, weather variations, and feed costs may differ significantly." 
                  sub="ये सभी गणनाएं केवल शैक्षणिक योजना और अनुमान के लिए हैं। स्थानीय बाजार भाव, मौसम, बीमारी और चारा लागत में अंतर आ सकता है।" 
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
