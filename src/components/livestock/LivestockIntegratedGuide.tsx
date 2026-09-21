import React, { useState } from "react";
import { Bi } from "../Bilingual";
import { useLanguage } from "../../contexts/LanguageContext";
import { 
  Repeat, 
  Layers, 
  Leaf, 
  Droplets, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface IntegratedModel {
  id: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  synergiesEn: string[];
  synergiesHi: string[];
  residueReuseEn: string;
  residueReuseHi: string;
  manureReuseEn: string;
  manureReuseHi: string;
  riskNoteEn: string;
  riskNoteHi: string;
}

const INTEGRATED_MODELS: IntegratedModel[] = [
  {
    id: "crop-dairy",
    titleEn: "Crop + Dairy (फसल + डेयरी)",
    titleHi: "फसल एवं डेयरी का चक्रीय संगम",
    summaryEn: "The foundation of Indian agrarian economy: crop straw feeds cattle; cow dung generates biogas and nutrient-dense farmyard slurry.",
    summaryHi: "भारतीय कृषि की रीढ़: फसल का भूसा पशुओं का पेट भरता है और गोबर से बायोगैस ईंधन व उच्च जैविक खाद प्राप्त होती है।",
    synergiesEn: [
      "Wheat, paddy, and maize stalks are enriched with urea or molasses into high-digestibility silage.",
      "Cow dung and wash water feed a 2-3 cubic meter household biogas plant, saving 80% cooking fuel.",
      "Bio-slurry application restores soil carbon, boosting wheat and vegetable yields by 15-20%."
    ],
    synergiesHi: [
      "गेहूं, धान और मक्का के डंठल को साइलेज बनाकर पौष्टिक पशु आहार में बदला जाता है।",
      "गोबर और शेड का धुलाई जल बायोगैस संयंत्र में जाता है, जिससे रसोई गैस की 80% बचत होती है।",
      "बायोगैस की स्लरी जमीन में जीवांश कार्बन (Organic Carbon) बढ़ाकर फसल पैदावार 15-20% बढ़ाती है।"
    ],
    residueReuseEn: "Straw, pulse husks, and corn stovers are used as daily dry roughage, reducing commercial fodder purchase.",
    residueReuseHi: "पुआल, दालों की चूनी और मक्के के भुट्टे का छिलका दैनिक सूखे चारे के रूप में प्रयुक्त होता है।",
    manureReuseEn: "Slurry applied directly through flood irrigation or dried into organic enriched vermicompost.",
    manureReuseHi: "स्लरी को सीधे नाली के पानी के साथ बहाया जाता है या सुखाकर केंचुआ खाद बनाई जाती है।",
    riskNoteEn: "Requires dedicated daily labour for milking, shed washing, and fodder cutting. High upfront investment for cattle purchase.",
    riskNoteHi: "दुग्ध दोहन, शेड सफाई और चारा काटने के लिए रोजाना नियमित श्रम आवश्यक है। पशु खरीद में शुरुआती पूंजी लगती है।"
  },
  {
    id: "crop-poultry",
    titleEn: "Crop + Poultry (फसल + पोल्ट्री)",
    titleHi: "फसल एवं कुक्कुट पालन एकीकरण",
    summaryEn: "Poultry litter provides high-potassium & nitrogen organic manure for fruit orchards, maize, and cash crops.",
    summaryHi: "मुर्गी की बीट (Poultry Litter) में पोटाश और नाइट्रोजन प्रचुर मात्रा में होता है, जो बागवानी और मक्का के लिए वरदान है।",
    synergiesEn: [
      "Broiler litter composted over 60 days provides 3% Nitrogen, 2% Phosphorus, and 1.5% Potassium.",
      "Backyard Desi poultry free-ranges in orchards to scavenge pests, grasshoppers, and weed seeds.",
      "Maize and broken grains produced on-farm are ground into cost-effective poultry mash."
    ],
    synergiesHi: [
      "60 दिन सड़ी हुई मुर्गी की खाद में 3% नाइट्रोजन, 2% फास्फोरस और 1.5% पोटाश मिलता है।",
      "बागों में देसी मुर्गियां हानिकारक कीटों, टिड्डों और खरपतवार के बीजों को खाकर प्राकृतिक नियंत्रण करती हैं।",
      "खेत की मक्का और टूटे अनाज को पीसकर सस्ता व पौष्टिक पोल्ट्री दाना तैयार होता है।"
    ],
    residueReuseEn: "Husk from paddy milling is utilized directly as moisture-absorbent coop bedding (deep litter).",
    residueReuseHi: "धान की भूसी को पोल्ट्री शेड में फर्श पर आरामदायक बिछावन के रूप में उपयोग किया जाता है।",
    manureReuseEn: "Deep litter removed after each broiler batch makes potent top-dressing for sugarcane and vegetables.",
    manureReuseHi: "हर बैच के बाद शेड से निकली पुरानी खाद गन्ना, मक्का और सब्जियों में टॉप ड्रेसिंग के रूप में डाली जाती है।",
    riskNoteEn: "Strict biosecurity is mandatory to prevent wild bird diseases like avian flu from jumping to farm birds.",
    riskNoteHi: "जंगली पक्षियों से बर्ड फ्लू या रानीखेत जैसी बीमारियों से बचाव हेतु सख्त जैव सुरक्षा आवश्यक है।"
  },
  {
    id: "crop-goat-sheep",
    titleEn: "Crop + Goat / Sheep (फसल + बकरी/भेड़)",
    titleHi: "फसल एवं बकरी/भेड़ पालन संगम",
    summaryEn: "Small ruminants utilize marginal bund vegetation, stubble grazing, and generate slow-release dung pellets.",
    summaryHi: "छोटे जुगाली करने वाले पशु मेड़ों की झाड़ियों और फसल कटाई के बाद के अवशेषों को खाकर उच्च मूल्य जैविक खाद देते हैं।",
    synergiesEn: [
      "Flock grazing on post-harvest stubble clears weeds and deposits valuable droppings directly onto fields.",
      "Subabul, Sesbania (Dhaincha), and hedge leaves serve as free high-protein goat feed.",
      "Goat manure pellets do not burn crops and release micronutrients gradually throughout the growing season."
    ],
    synergiesHi: [
      "कटाई के बाद खेतों में भेड़ों/बकरियों को बैठाने (Sheep Folding) से खेत में सीधा प्राकृतिक खाद पड़ता है।",
      "सुबबूल, ढैंचा और मेड़ों की झाड़ियों की पत्तियां बकरियों को मुफ्त 18-20% प्रोटीन प्रदान करती हैं।",
      "बकरी की लेंडी खाद फसलों को जलाती नहीं है और पूरे मौसम धीरे-धीरे पोषक तत्व छोड़ती है।"
    ],
    residueReuseEn: "Paddy and pulse stubble left in field is grazed down naturally, preparing the soil for minimal tillage.",
    residueReuseHi: "खेत में बचे ठूंठ को पशु चरकर साफ कर देते हैं, जिससे अगली जुताई आसान हो जाती है।",
    manureReuseEn: "Collected droppings are rich in organic phosphorus and ideal for drip fertigation tea brews.",
    manureReuseHi: "लेंडी खाद को पानी में घोलकर जीवामृत जैसा तरल खाद बनाकर ड्रिप या नालियों में चलाया जाता है।",
    riskNoteEn: "Must manage browsing strictly; uncontrolled goats can destroy young saplings and adjoining neighbor crops.",
    riskNoteHi: "बकरियों को खुले में छोड़ते समय निगरानी जरूरी है, वरना वे नए रोपे गए पेड़ और पड़ोसियों की फसल चर सकती हैं।"
  },
  {
    id: "crop-fisheries",
    titleEn: "Crop + Fisheries (फसल + मत्स्य पालन)",
    titleHi: "फसल एवं मत्स्य पालन (खेत तलाई)",
    summaryEn: "Farm pond water irrigates horticultural orchards; pond bottom silt serves as superior nutrient-rich topsoil.",
    summaryHi: "खेत तलाई का पानी बागवानी की सिंचाई करता है और तली की गाद (Silt) खेतों में डालने से रासायनिक खाद की बचत होती है।",
    synergiesEn: [
      "Pond water enriched with fish excreta contains dissolved nitrogen and phosphorus, acting as liquid fertilizer.",
      "Annual de-silting of the pond deposits organic humus onto adjacent crop fields.",
      "Pond embankments (bunds) are planted with papaya, banana, and vegetables without taking extra land."
    ],
    synergiesHi: [
      "मछली के मल-मूत्र से समृद्ध तालाब का पानी फसलों के लिए प्राकृतिक लिक्विड फर्टिलाइजर का काम करता है।",
      "सालाना तालाब की तली से निकाली गई गाद खेतों की उर्वरा शक्ति को वर्षों तक बनाए रखती है।",
      "तालाब की मेड़ों पर पपीता, केला और मौसमी सब्जियां लगाकर बिना अतिरिक्त जमीन के आय ली जाती है।"
    ],
    residueReuseEn: "Decomposed cattle manure and agricultural lime are added to pond water to bloom natural plankton.",
    residueReuseHi: "सड़ा हुआ गोबर और कृषि चूना तालाब में डालकर प्राकृतिक प्लवक (मछली का भोजन) तैयार किया जाता है।",
    manureReuseEn: "Fish waste water pumped for drip irrigation drastically lowers synthetic chemical nitrogen requirements.",
    manureReuseHi: "तालाब के पानी से ड्रिप सिंचाई करने पर पौधों को घुलनशील पोषक तत्व प्राकृतिक रूप से मिलते हैं।",
    riskNoteEn: "Never let chemical pesticide runoff from crop fields enter the fish pond; organophosphates cause immediate fish mortality.",
    riskNoteHi: "खेतों में कीटनाशक छिड़काव का बहता हुआ पानी तालाब में न जाने दें; जहरीले रसायनों से मछलियां तुरंत मर जाती हैं।"
  },
  {
    id: "integrated-three",
    titleEn: "Crop + Livestock + Fisheries (फसल + पशुधन + मछली)",
    titleHi: "त्रिवेणी संगम: फसल + पशु + मत्स्य",
    summaryEn: "The ultimate closed-loop ecosystem: cattle/duck manure fertilizes fish ponds, pond silt fertilizes crops, and crops feed livestock.",
    summaryHi: "संपूर्ण चक्रीय मॉडल: पशुओं का गोबर तालाब में प्लवक बनाता है, तालाब की गाद खेत उपजाऊ बनाती है और फसल का चारा पशु खाते हैं।",
    synergiesEn: [
      "Duck-cum-fish culture: ducks feed on aquatic insects and snails while their droppings act as direct fish food.",
      "Biogas plant effluent drains safely into compost pits or dedicated aquaculture nursery ponds.",
      "Stabilizes household income across dry seasons through multiple weekly and seasonal revenue streams."
    ],
    synergiesHi: [
      "बत्तख-मछली पालन: बत्तखें पानी के कीड़े खाती हैं और उनकी बीट मछलियों के लिए सीधा पोषक आहार बनती है।",
      "बायोगैस की स्लरी को उपचारित करके तालाब में डालने से मछली का वजन तेजी से बढ़ता है।",
      "दूध की दैनिक आय, मछली की वार्षिक बिक्री और फसलों की उपज से किसान कभी कर्ज में नहीं दबता।"
    ],
    residueReuseEn: "Zero-waste circular flow where every byproduct of one module serves as the primary input for the next.",
    residueReuseHi: "शून्य-अपशिष्ट प्रणाली जहाँ एक इकाई का कचरा दूसरी इकाई के लिए कच्चा माल बन जाता है।",
    manureReuseEn: "Enzymatic decomposition in multi-chamber pits neutralizes pathogens before introduction to ponds.",
    manureReuseHi: "गड्ढों में किण्वन (Fermentation) के बाद ही खाद तालाब में दी जाती है ताकि पानी का ऑक्सीजन न घटे।",
    riskNoteEn: "Complex management requires balanced timing. Over-manuring a pond can deplete dissolved oxygen overnight.",
    riskNoteHi: "संतुलन बनाए रखना बेहद जरूरी है। यदि तालाब में जरूरत से ज्यादा गोबर चला गया तो रात में ऑक्सीजन खत्म हो जाएगी।"
  }
];

export const LivestockIntegratedGuide: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<IntegratedModel>(INTEGRATED_MODELS[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 text-emerald-300 font-semibold text-xs tracking-wider uppercase mb-1.5">
          <Repeat className="w-4 h-4" />
          <Bi en="Closed-Loop Circular Agriculture" sub="चक्रीय एकीकृत कृषि एवं पशुपालन" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          <Bi 
            en="Integrated Farming Systems: Science & Resource Reuse" 
            sub="एकीकृत कृषि प्रणालियाँ: संसाधन पुनर्चक्रण एवं वैज्ञानिक मार्गदर्शन" 
          />
        </h2>
        <p className="text-emerald-100 text-xs md:text-sm max-w-3xl leading-relaxed">
          <Bi 
            en="By linking crop residues, animal manure, biogas energy, and pond aquaculture, smallholder farmers reduce external fertilizer costs, improve soil vitality, and buffer against climate shocks." 
            sub="फसल अवशेष, गोबर, बायोगैस और तालाब मत्स्य पालन को जोड़कर किसान बाहर से खाद-दाने का खर्च कम करते हैं, जमीन की उर्वरा शक्ति बढ़ाते हैं और जलवायु जोखिम से सुरक्षित रहते हैं।" 
          />
        </p>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {INTEGRATED_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              selectedModel.id === model.id
                ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Bi en={model.titleEn} sub={model.titleHi} />
          </button>
        ))}
      </div>

      {/* Main Model Detail Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg mb-2">
            <Layers className="w-3.5 h-3.5" />
            <Bi en="System Overview" sub="प्रणाली का संक्षिप्त विवरण" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            <Bi en={selectedModel.titleEn} sub={selectedModel.titleHi} />
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            <Bi en={selectedModel.summaryEn} sub={selectedModel.summaryHi} />
          </p>
        </div>

        {/* Synergies Grid */}
        <div>
          <h4 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <Bi en="Key Biological & Economic Synergies" sub="प्रमुख जैविक एवं आर्थिक पारस्परिक लाभ" />
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedModel.synergiesEn.map((synEn, idx) => (
              <div key={idx} className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-xs flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-stone-700 leading-relaxed">
                  <Bi en={synEn} sub={selectedModel.synergiesHi[idx]} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Flow Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/70">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs mb-1.5">
              <Leaf className="w-4 h-4 text-amber-700" />
              <Bi en="Crop Residue & Fodder Recycling" sub="फसल अवशेष एवं चारा पुनर्चक्रण" />
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              <Bi en={selectedModel.residueReuseEn} sub={selectedModel.residueReuseHi} />
            </p>
          </div>

          <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-200/70">
            <div className="flex items-center gap-2 text-teal-900 font-semibold text-xs mb-1.5">
              <Droplets className="w-4 h-4 text-teal-700" />
              <Bi en="Manure & Nutrient Management" sub="गोबर एवं पोषक तत्व प्रबंधन" />
            </div>
            <p className="text-xs text-teal-950 leading-relaxed">
              <Bi en={selectedModel.manureReuseEn} sub={selectedModel.manureReuseHi} />
            </p>
          </div>
        </div>

        {/* Practical Operational Risk & Limitations */}
        <div className="bg-stone-100 rounded-xl p-4 border border-stone-200 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-800 block mb-0.5">
              <Bi en="Practical Risk Management & Realities" sub="व्यावहारिक जोखिम एवं सावधानियां" />
            </span>
            <p className="text-stone-600 leading-relaxed">
              <Bi en={selectedModel.riskNoteEn} sub={selectedModel.riskNoteHi} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
