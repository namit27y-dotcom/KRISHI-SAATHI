/**
 * Curated high-resolution agricultural and farming imagery from Unsplash.
 * All URLs are direct Unsplash CDN optimized images with high-efficiency formatting.
 */

export interface UnsplashImageItem {
  id: string;
  name: string;
  category: 'crop' | 'product' | 'field' | 'soil';
  url: string;
  alt: string;
}

export const UNSPLASH_CROP_IMAGES: UnsplashImageItem[] = [
  {
    id: "wheat",
    name: "Golden Wheat",
    category: "crop",
    url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    alt: "Golden ripe wheat ears in agricultural farmland"
  },
  {
    id: "rice",
    name: "Rice / Paddy",
    category: "crop",
    url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=600",
    alt: "Verdant terraced rice paddy plantation"
  },
  {
    id: "tomato",
    name: "Vine Tomatoes",
    category: "crop",
    url: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600",
    alt: "Fresh red vine-ripened farm tomatoes"
  },
  {
    id: "cotton",
    name: "Cotton Bolls",
    category: "crop",
    url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=600",
    alt: "White organic cotton bolls ready for harvest"
  },
  {
    id: "potato",
    name: "Fresh Potatoes",
    category: "crop",
    url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600",
    alt: "Harvested organic raw potatoes"
  },
  {
    id: "onion",
    name: "Red Onions",
    category: "crop",
    url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600",
    alt: "Freshly harvested red farm onions"
  },
  {
    id: "corn",
    name: "Sweet Corn",
    category: "crop",
    url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600",
    alt: "Ripe yellow maize and corn cobs"
  },
  {
    id: "chilli",
    name: "Green & Red Chillies",
    category: "crop",
    url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600",
    alt: "Fresh vibrant farm chili peppers"
  },
  {
    id: "cucumber",
    name: "Greenhouse Cucumber",
    category: "crop",
    url: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&q=80&w=600",
    alt: "Fresh green cucumbers hanging on greenhouse trellis"
  },
  {
    id: "mustard",
    name: "Mustard & Sunflower",
    category: "crop",
    url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=600",
    alt: "Vibrant yellow blossoming agricultural oilseed field"
  },
  {
    id: "vegetables",
    name: "Leafy Vegetables",
    category: "crop",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    alt: "Freshly picked organic garden greens and vegetables"
  }
];

export const UNSPLASH_PRODUCT_IMAGES: UnsplashImageItem[] = [
  {
    id: "fertilizer",
    name: "NPK Plant Fertilizer",
    category: "product",
    url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600",
    alt: "Plant nutrients and biological fertilizer granules"
  },
  {
    id: "pesticide",
    name: "Bio-Neem Spray & Repellent",
    category: "product",
    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
    alt: "Organic botanical plant protection spray bottle"
  },
  {
    id: "sprayer",
    name: "Agricultural Knapsack Sprayer",
    category: "product",
    url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
    alt: "Heavy duty manual and battery powered pressure sprayer"
  },
  {
    id: "drip",
    name: "Micro Drip Irrigation System",
    category: "product",
    url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=600",
    alt: "High-efficiency agricultural drip emitter and tubing"
  },
  {
    id: "seeds",
    name: "High-Yield Certified Seeds",
    category: "product",
    url: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600",
    alt: "Certified disease-resistant crop seeds for planting"
  },
  {
    id: "compost",
    name: "Organic Vermicompost",
    category: "product",
    url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600",
    alt: "Nutrient-rich dark organic compost manure"
  },
  {
    id: "tool",
    name: "Bio Pest Trap & Agri Tools",
    category: "product",
    url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600",
    alt: "Field monitoring device and agricultural equipment"
  }
];

export const UNSPLASH_HERO_IMAGES = {
  farmLandscape: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
  farmerField: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200",
  seedlingInSoil: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
  riceField: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=800"
};

/**
 * Returns a high-quality Unsplash image matching the crop name keywords.
 */
export function getCropImageUrl(cropName: string): string {
  const normalized = (cropName || "").toLowerCase();
  if (normalized.includes("rice") || normalized.includes("paddy") || normalized.includes("chawal")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "rice")!.url;
  }
  if (normalized.includes("tomato") || normalized.includes("tamatar")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "tomato")!.url;
  }
  if (normalized.includes("cotton") || normalized.includes("kapas")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "cotton")!.url;
  }
  if (normalized.includes("potato") || normalized.includes("aloo")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "potato")!.url;
  }
  if (normalized.includes("onion") || normalized.includes("pyaz")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "onion")!.url;
  }
  if (normalized.includes("corn") || normalized.includes("maize") || normalized.includes("makka")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "corn")!.url;
  }
  if (normalized.includes("chilli") || normalized.includes("mirch") || normalized.includes("pepper")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "chilli")!.url;
  }
  if (normalized.includes("cucumber") || normalized.includes("kakdi") || normalized.includes("kheera")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "cucumber")!.url;
  }
  if (normalized.includes("mustard") || normalized.includes("sarson") || normalized.includes("sunflower")) {
    return UNSPLASH_CROP_IMAGES.find((c) => c.id === "mustard")!.url;
  }
  // Default to golden wheat
  return UNSPLASH_CROP_IMAGES.find((c) => c.id === "wheat")!.url;
}

/**
 * Returns a high-quality Unsplash image matching the agricultural product name or category.
 */
export function getProductImageUrl(name: string, category?: string): string {
  const normalized = `${name} ${category || ""}`.toLowerCase();
  if (normalized.includes("spray") || normalized.includes("pump")) {
    return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "sprayer")!.url;
  }
  if (normalized.includes("pesticide") || normalized.includes("neem") || normalized.includes("insecticide") || normalized.includes("fungicide")) {
    return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "pesticide")!.url;
  }
  if (normalized.includes("drip") || normalized.includes("irrigat") || normalized.includes("pipe") || normalized.includes("hose")) {
    return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "drip")!.url;
  }
  if (normalized.includes("seed") || normalized.includes("hybrid") || normalized.includes("beej")) {
    return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "seeds")!.url;
  }
  if (normalized.includes("compost") || normalized.includes("vermi") || normalized.includes("manure") || normalized.includes("organic")) {
    return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "compost")!.url;
  }
  if (normalized.includes("trap") || normalized.includes("solar") || normalized.includes("tool") || normalized.includes("meter")) {
    return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "tool")!.url;
  }
  // Default to NPK fertilizer
  return UNSPLASH_PRODUCT_IMAGES.find((p) => p.id === "fertilizer")!.url;
}
