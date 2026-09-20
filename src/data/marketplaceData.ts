import type { AgriculturalProduct } from "../types.js";

export interface MarketplaceCategoryItem {
  id: string;
  name: string;
  image: string;
  badge: string;
  description: string;
}

export const AGRICULTURE_FALLBACK_IMAGE = 
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600";

export const MARKETPLACE_CATEGORIES: MarketplaceCategoryItem[] = [
  {
    id: "seeds",
    name: "Seeds",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=400",
    badge: "Certified Hybrids",
    description: "High-germination vegetable, grain, and cash crop seeds"
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400",
    badge: "NPK & Organic",
    description: "Balanced soil nutrition, organic vermicompost & micro-nutrients"
  },
  {
    id: "pesticides",
    name: "Pesticides",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400",
    badge: "Bio & Systemic",
    description: "Crop protection sprays, neem bio-repellents & fungicides"
  },
  {
    id: "tractors",
    name: "Tractors",
    image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=400",
    badge: "24 HP - 50 HP",
    description: "Modern agricultural tractors and orchard machinery"
  },
  {
    id: "pumps",
    name: "Water Pumps",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
    badge: "Electric & Diesel",
    description: "Centrifugal monobloc, submersible and portable farm pumps"
  },
  {
    id: "sprayers",
    name: "Sprayers",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
    badge: "Battery & Manual",
    description: "Knapsack sprayers, dual battery units & misting lances"
  },
  {
    id: "irrigation_equipment",
    name: "Irrigation",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400",
    badge: "Micro Drip & Pipes",
    description: "Drip kits, rotary impact sprinklers & HDPE delivery pipes"
  },
  {
    id: "farm_tools",
    name: "Farm Tools",
    image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80&w=400",
    badge: "Forged Steel",
    description: "Harvesting sickles, weeding hoes & ergonomic pruners"
  }
];

export const SEEDED_AGRICULTURAL_PRODUCTS: AgriculturalProduct[] = [
  // 1. SEEDS
  {
    id: "prod-seed-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Namdhari Hybrid Tomato Seeds (NS-501)",
    category: "seeds",
    brand: "Namdhari Seeds",
    description: "Tolerant to Tomato Leaf Curl Virus (ToLCV). Semi-determinate vigorous vines with firm, glossy round red fruits with high transportability.",
    specifications: [
      "Germination Rate: 98% guaranteed",
      "Maturity: 65 - 70 days from transplanting",
      "Seed Count: ~3,000 seeds (10g pack)",
      "Purity: 99% certified"
    ],
    price: 650,
    unit: "pack (10g)",
    inventory: 40,
    rating: 4.8,
    reviewsCount: 112,
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-seed-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Certified High-Yield Sharbati Wheat Seeds (PBW-550)",
    category: "seeds",
    brand: "Punjab Agro Seeds",
    description: "Certified disease-resistant foundation wheat seed. Thick golden grains with outstanding lodging resistance and optimal chapati aroma.",
    specifications: [
      "Target Season: Winter / Rabi Sowing",
      "Yield Potential: 22 - 25 Quintals / Acre",
      "Moisture Content: Less than 12%",
      "Bag Weight: 40 kg certified packaging"
    ],
    price: 1150,
    unit: "bag (40 kg)",
    inventory: 55,
    rating: 4.9,
    reviewsCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-seed-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Golden Hybrid Sweet Corn Seeds (Sugar-75)",
    category: "seeds",
    brand: "Syngenta Agro",
    description: "High brix sweetness content (14-16%). Uniform long golden cobs packed with tender kernels. High disease tolerance in Indian humid conditions.",
    specifications: [
      "Germination: 95% minimum",
      "Cob Length: 8 - 9 inches with 16-18 kernel rows",
      "Harvest Period: 75 - 80 days",
      "Weight: 250 grams sealed foil pack"
    ],
    price: 480,
    unit: "pack (250g)",
    inventory: 30,
    rating: 4.7,
    reviewsCount: 64,
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-seed-4",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "G4 Pungent Green & Red Chilli Hybrid Seeds",
    category: "seeds",
    brand: "VNR Seeds",
    description: "Prolific bearing hybrid chilli producing deep-green pungent fruits that turn glossy bright red on drying. High resistance to leaf thrips.",
    specifications: [
      "Fruit Length: 9 - 11 cm slender straight",
      "Pungency: High (SHU 45,000+)",
      "First Picking: 55 days after transplant",
      "Packaging: 20 grams moisture-proof packet"
    ],
    price: 540,
    unit: "pack (20g)",
    inventory: 25,
    rating: 4.6,
    reviewsCount: 47,
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 2. FERTILIZERS
  {
    id: "prod-fert-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "IFFCO Premium NPK 19-19-19 Soluble Fertilizer",
    category: "fertilizers",
    brand: "IFFCO",
    description: "100% water-soluble balanced NPK fertilizer with trace micronutrients. Speeds up vegetative shoots, stimulates flowering, and boosts root depth.",
    specifications: [
      "Composition: 19% N, 19% P2O5, 19% K2O",
      "Solubility: 100% water soluble for fertigation & foliar",
      "Bag Weight: 25 kg multi-layered moisture-barrier sack",
      "Application: Drip irrigation & foliar spray"
    ],
    price: 520,
    unit: "bag (25 kg)",
    inventory: 60,
    rating: 4.9,
    reviewsCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-fert-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Certified Organic Earthworm Vermicompost",
    category: "fertilizers",
    brand: "Kisan Bio-Org",
    description: "Rich black gold biological compost enriched with beneficial soil microbes and humic acid. Enhances water retention and softens compact clay soils.",
    specifications: [
      "Organic Carbon: > 16%",
      "Total Nitrogen: 1.5 - 2.0%",
      "Odor: Fresh earthy scent, 100% weed-seed free",
      "Bag Weight: 50 kg heavy-duty woven bag"
    ],
    price: 320,
    unit: "bag (50 kg)",
    inventory: 45,
    rating: 4.8,
    reviewsCount: 92,
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-fert-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Bio-Potash & Micronutrient Soil Booster",
    category: "fertilizers",
    brand: "Krishi Rasayan",
    description: "Derived from molasses and organic biomass. Fortifies crops with potash, zinc, boron, and sulfur to boost grain weight and fruit shine.",
    specifications: [
      "Form: Granular slow-release formula",
      "Dosage: 10 kg per acre baseline application",
      "Packaging: 10 kg tamper-proof bucket",
      "Target Crops: Cereals, sugarcane, fruits, vegetables"
    ],
    price: 680,
    unit: "bucket (10 kg)",
    inventory: 35,
    rating: 4.7,
    reviewsCount: 53,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 3. PESTICIDES
  {
    id: "prod-pest-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Pure Cold-Pressed Bio Neem Oil (10,000 PPM)",
    category: "pesticides",
    brand: "NeemAgro Organic",
    description: "100% natural Azadirachtin organic repellent. Destroys sucking pests, whiteflies, aphids, mites, and thrips without harming honeybees.",
    specifications: [
      "Active Ingredient: Azadirachtin 10,000 PPM",
      "Dosage: 3-5 ml per liter of water",
      "Residue: Zero chemical residues, organic certified",
      "Bottle Volume: 1 Liter sealed HDPE container"
    ],
    price: 340,
    unit: "bottle (1 Liter)",
    inventory: 50,
    rating: 4.8,
    reviewsCount: 134,
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-pest-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Bio-Fungicide Trichoderma Viride Liquid Culture",
    category: "pesticides",
    brand: "Bio-Defense Tech",
    description: "Protective biological fungicide against soil-borne pathogens: root rot, collar rot, damping-off, and Fusarium wilt in all crops.",
    specifications: [
      "CFU Count: 2 x 10^8 CFU/ml guaranteed",
      "Shelf Life: 12 months at room temperature",
      "Target Disease: Damping off, Root rot, Powdery mildew",
      "Packaging: 1 Liter leak-proof agro bottle"
    ],
    price: 280,
    unit: "bottle (1 Liter)",
    inventory: 40,
    rating: 4.7,
    reviewsCount: 78,
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-pest-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Systemic Broad-Spectrum Crop Protector",
    category: "pesticides",
    brand: "CropShield International",
    description: "Fast-acting systemic foliar suspension for severe caterpillar, stem borer, and bollworm outbreaks with swift rain-fastness.",
    specifications: [
      "Action: Systemic & translaminar protection",
      "Rain Fastness: Within 2 hours of spraying",
      "Volume: 500 ml container with graduated dosage cap",
      "Safety: Green triangle eco-safety compliant"
    ],
    price: 590,
    unit: "bottle (500 ml)",
    inventory: 28,
    rating: 4.6,
    reviewsCount: 65,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 4. TRACTORS
  {
    id: "prod-trac-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Mahindra 575 DI Sarpanch 47 HP Tractor",
    category: "tractors",
    brand: "Mahindra Tractors",
    description: "India's premier 47 HP 4-cylinder DI diesel farm tractor. Advanced hydraulics with high pulling torque for heavy multi-bottom plowing, rotavator, and haulage.",
    specifications: [
      "Engine: 47 HP, 4-Cylinder Water-Cooled Diesel",
      "Hydraulic Lift Capacity: 1,600 kg",
      "Transmission: 8 Forward + 2 Reverse Partial Constant Mesh",
      "Brakes: Oil-immersed multi-disc brakes"
    ],
    price: 725000,
    unit: "unit",
    inventory: 3,
    rating: 4.9,
    reviewsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-trac-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Swaraj 744 FE 48 HP Agricultural Workhorse",
    category: "tractors",
    brand: "Swaraj",
    description: "Rugged heavy-duty tractor engineered for tough Indian agricultural soils. High fuel efficiency, dual clutch, and multi-speed reverse PTO.",
    specifications: [
      "Engine: 48 HP 3-Cylinder Fuel-Efficient Engine",
      "PTO Power: 41.8 HP with 540 & Multi-speed reverse PTO",
      "Steering: Smooth Power Steering",
      "Warranty: 2 Years comprehensive manufacturer warranty"
    ],
    price: 690000,
    unit: "unit",
    inventory: 4,
    rating: 4.8,
    reviewsCount: 38,
    imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-trac-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Compact 24 HP 4WD Mini Orchard & Inter-Cultivation Tractor",
    category: "tractors",
    brand: "Captain Mini Agri",
    description: "Narrow-track compact 4-wheel drive tractor specially designed for vineyards, sugarcane inter-row weeding, pomegranate orchards, and polyhouses.",
    specifications: [
      "Drive: 4 Wheel Drive (4WD)",
      "Engine: 24 HP Japanese technology diesel engine",
      "Width: Narrow 3.2 ft turning track",
      "Lift Capacity: 750 kg"
    ],
    price: 360000,
    unit: "unit",
    inventory: 5,
    rating: 4.7,
    reviewsCount: 29,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 5. WATER PUMPS
  {
    id: "prod-pump-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Kirloskar 5 HP Centrifugal Monobloc Farm Water Pump",
    category: "pumps",
    brand: "Kirloskar",
    description: "High-discharge cast iron monobloc pump engineered for canal, open well, and river farm irrigation. Designed to handle wide voltage fluctuations.",
    specifications: [
      "Power Rating: 5.0 HP / 3.7 kW, 3-Phase 415V",
      "Discharge: Up to 1,200 Liters / Minute",
      "Head Range: 18 - 32 meters",
      "Casing: Heavy-duty graded cast iron with copper winding"
    ],
    price: 14500,
    unit: "unit",
    inventory: 14,
    rating: 4.9,
    reviewsCount: 71,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-pump-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Crompton 3 HP Openwell Submersible Irrigation Pump",
    category: "pumps",
    brand: "Crompton",
    description: "Submerged water-cooled pump suitable for deep farm wells, sumps, and farm ponds. Operates smoothly under water without requiring priming.",
    specifications: [
      "Motor: 3.0 HP Water-Filled Submersible Motor",
      "Impeller: Non-corrosive bronze impeller",
      "Operating Head: 22 - 38 meters",
      "Protection: IP68 waterproof enclosure"
    ],
    price: 11800,
    unit: "unit",
    inventory: 18,
    rating: 4.8,
    reviewsCount: 56,
    imageUrl: "https://images.unsplash.com/photo-1574689049868-e94ed5301745?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-pump-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Portable 2-Stroke Petrol-Kerosene Irrigation Water Pump",
    category: "pumps",
    brand: "Honda Power",
    description: "Lightweight, highly portable self-priming pump ideal for transferring water across remote field corners where electric power is unavailable.",
    specifications: [
      "Fuel: Dual fuel Petrol-Kerosene engine",
      "Suction x Delivery: 2 x 2 inches (50 mm)",
      "Total Head: 28 meters, Suction lift: 7 meters",
      "Weight: 14 kg easily carried by one person"
    ],
    price: 8200,
    unit: "unit",
    inventory: 12,
    rating: 4.7,
    reviewsCount: 44,
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 6. SPRAYERS
  {
    id: "prod-spray-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Aspee 16L 12V Battery-Operated Knapsack Sprayer",
    category: "sprayers",
    brand: "Aspee",
    description: "Continuous high pressure motorized spray for pesticides, bio-fertilizers, and fungicides. Telescopic stainless steel lance with 4 distinct nozzle attachments.",
    specifications: [
      "Tank Capacity: 16 Liters chemical-resistant polypropylene",
      "Battery: 12V 12Ah Sealed Lead-Acid (8 hours spraying per charge)",
      "Pressure: 0.2 - 0.45 MPa adjustable regulator",
      "Nozzles: Fan, cone, double-head, and shower nozzles included"
    ],
    price: 2650,
    unit: "piece",
    inventory: 22,
    rating: 4.8,
    reviewsCount: 118,
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-spray-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Heavy-Duty 2-in-1 Dual Manual & Battery Backpack Sprayer",
    category: "sprayers",
    brand: "Neptune Farming",
    description: "Switch seamlessly between electric battery mode and manual hand pump mode if battery drains in the field. Padded shoulder straps for all-day comfort.",
    specifications: [
      "Mode: Hybrid Battery + Manual Hand Lever",
      "Tank Volume: 18 Liters with built-in chemical strainer",
      "Charger: Fast auto-cutoff 1.7A smart wall charger",
      "Lance: Heavy brass trigger and extendable rod"
    ],
    price: 3150,
    unit: "piece",
    inventory: 15,
    rating: 4.7,
    reviewsCount: 62,
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 7. IRRIGATION
  {
    id: "prod-irrig-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Jain 16mm Inline Micro Drip Irrigation Kit (1 Acre)",
    category: "irrigation_equipment",
    brand: "Jain Irrigation",
    description: "Complete water-saving kit with 16mm inline lateral dripline, pressure-compensating drippers (2 LPH), screen disc filter, flush valves, and connectors.",
    specifications: [
      "Coverage: Complete 1 Acre field layout",
      "Lateral Tube: 16mm Class-2 UV-stabilized virgin polymer",
      "Dripper Spacing: 40 cm inline emitters (2 LPH discharge)",
      "Filter: 2-inch T-type disc filter included"
    ],
    price: 5499,
    unit: "complete kit",
    inventory: 16,
    rating: 4.9,
    reviewsCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-irrig-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Brass 360° Impact Rotary Farm Sprinkler Set (Pack of 5)",
    category: "irrigation_equipment",
    brand: "Finolex Plastro",
    description: "Heavy brass full/part circle agricultural sprinklers with dual brass nozzles. Outstanding uniform spray radius for wheat, pulses, groundnuts, and pastures.",
    specifications: [
      "Material: Heavy duty forged brass with stainless steel springs",
      "Spraying Radius: 12 - 15 meters per sprinkler head",
      "Working Pressure: 2.0 to 4.5 kg/cm²",
      "Inlet: 3/4-inch male threaded base"
    ],
    price: 1850,
    unit: "set (5 pieces)",
    inventory: 24,
    rating: 4.8,
    reviewsCount: 52,
    imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-irrig-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Heavy-Duty UV-Stabilized Flexible Delivery Hose (100m)",
    category: "irrigation_equipment",
    brand: "Captain Pipes",
    description: "Reinforced 2.5-inch flat delivery water pipe for agricultural pump outlets. Handles high burst pressures without kinking or cracking under direct sun.",
    specifications: [
      "Diameter: 2.5 inches (63 mm)",
      "Length: 100 meters continuous seamless roll",
      "Burst Pressure: 6 Bar rated",
      "Feature: Lay-flat flexible roll for quick storage"
    ],
    price: 2100,
    unit: "roll (100m)",
    inventory: 30,
    rating: 4.7,
    reviewsCount: 68,
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },

  // 8. FARM TOOLS
  {
    id: "prod-tool-1",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "High-Carbon Steel Curved Harvesting Sickle (Vaula / Darat)",
    category: "farm_tools",
    brand: "Tata Agrico",
    description: "Forged high-carbon steel serrated blade designed for effortless cutting of mature wheat, paddy, fodder, and grass stalks without wrist fatigue.",
    specifications: [
      "Blade: Forged alloy steel with micro-serrated edge",
      "Handle: Ergonomic seasoned hardwood handle with metal ferrule",
      "Edge Retention: Hardened to 52 HRC for long-lasting sharpness",
      "Length: 14 inches overall"
    ],
    price: 220,
    unit: "piece",
    inventory: 60,
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-tool-2",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Heavy Forged Steel Agricultural Khurpa & Weeding Hoe",
    category: "farm_tools",
    brand: "Kisan Tools Co",
    description: "Indispensable Indian farming hand tool for inter-row weeding, soil loosening, and seedling bed preparation. Extremely durable one-piece forged shank.",
    specifications: [
      "Blade Width: 3.5 inches sharp cutting edge",
      "Blade Material: Tempered spring steel",
      "Grip: Non-slip wooden contoured grip",
      "Application: Manual weed extraction & root aeration"
    ],
    price: 310,
    unit: "piece",
    inventory: 50,
    rating: 4.8,
    reviewsCount: 85,
    imageUrl: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-tool-3",
    sellerId: "u-seller-1",
    sellerName: "Agri-Grow Fertilisers & Tools Ltd",
    name: "Professional Ergonomic Bypass Pruning Shears & Secateurs",
    category: "farm_tools",
    brand: "Falcon Garden Tools",
    description: "Precision branch cutter with razor-sharp SK5 Japanese carbon steel blade and rubber cushion shock absorber. Clean cuts heal plants faster.",
    specifications: [
      "Cutting Capacity: Up to 22 mm branch diameter",
      "Blade: SK-5 High Carbon Teflon-coated anti-rust blade",
      "Spring: Heavy-duty volute return spring with safety thumb lock",
      "Handles: Lightweight forged aluminum with PVC grip"
    ],
    price: 490,
    unit: "piece",
    inventory: 35,
    rating: 4.8,
    reviewsCount: 96,
    imageUrl: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    createdAt: new Date().toISOString()
  }
];
