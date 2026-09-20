export type SupportedLanguage = "en" | "hi" | "bho" | "mr" | "pa" | "ta" | "te" | "bn" | "es" | "vi" | "sw";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "farmer" | "seller" | "buyer" | "admin";
  isVerified?: boolean;
  country?: string; // Optional country field
  state: string;
  district: string;
  village: string;
  landArea?: number; // in Acres (Farmer only)
  soilType?: string; // (Farmer only)
  cropsGrown?: string[]; // (Farmer only)
  companyName?: string; // (Seller/Buyer only)
  gstNumber?: string; // (Seller only)
  buyerType?: "retailer" | "wholesaler" | "exporter" | "food_processing"; // (Buyer only)
  preferredLanguage: SupportedLanguage; // Expanded list of supported languages
  createdAt: string;
}

export interface PlantSpecies {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  growthHabit: string;
  nativeRegion: string;
  idealPhMin: number;
  idealPhMax: number;
  idealSoilTexture: string; // e.g., "loamy", "clayey"
  waterRequirement: string; // "low" | "medium" | "high"
  sunlightRequirement: string;
  isInvasive: boolean;
}

export interface PlantLocalName {
  id: string;
  plantSpeciesId: string;
  language: "en" | "hi" | "bho" | "mr" | "pa" | "ta" | "te" | "bn" | "es" | "vi" | "sw";
  localName: string;
}

export interface PlantDiseaseReference {
  id: string;
  plantSpeciesId: string;
  diseaseName: string;
  typicalSymptoms: string;
  commonTreatment: string;
  organicTreatment: string;
}

export interface PlantIdentificationLog {
  id: string;
  userId: string;
  photoUrl: string;
  identifiedSpeciesId: string;
  confidenceScore: number;
  soilPhotoUrl?: string;
  soilCompatibilityResult: string;
  createdAt: string;
}

export interface DiseaseReport {
  id: string;
  userId: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  symptoms: string;
  causes: string;
  organicTreatment: string;
  chemicalTreatment: string;
  preventiveMeasures: string;
  recoveryTime: string;
  imageUrl?: string;
  createdAt: string;
}

export interface WeatherRecord {
  id: string;
  state: string;
  district: string;
  temp: number;
  humidity: number;
  wind: number;
  rainfallPrediction: string;
  advice: string;
  createdAt: string;
}

export interface FertilizerPlan {
  id: string;
  cropName: string;
  growthStage: string;
  soilType: string;
  fieldSize: number;
  recommendedFertilizer: string;
  quantity: string;
  schedule: string;
  organicAlternatives: string;
  estimatedCost: number;
  createdAt: string;
}

export interface IrrigationPlan {
  id: string;
  cropName: string;
  waterReq: string;
  frequency: string;
  timing: string;
  waterSavingAdvice: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success" | "reminder";
  isRead: boolean;
  createdAt: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  country: string;
  state: string;
  district: string;
  village: string;
  description?: string;
  imageUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AgriculturalProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: "seeds" | "fertilizers" | "pesticides" | "tractors" | "pumps" | "sprayers" | "irrigation_equipment" | "farm_tools";
  description: string;
  price: number;
  unit: string;
  inventory: number;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  brand?: string;
  specifications?: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface MarketplaceOrder {
  id: string;
  type: "crop" | "product";
  listingOrProductId: string;
  itemTitle: string;
  quantity: number;
  totalPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: "pending" | "accepted" | "rejected" | "paid" | "shipped" | "delivered";
  deliveryAddress?: string;
  paymentStatus: "unpaid" | "paid" | "pending_payment" | "failed";
  createdAt: string;
  taxAmount?: number;
  deliveryCharge?: number;
  discountAmount?: number;
  grandTotal?: number;
  paymentId?: string;
  paymentMethod?: string;
}

export interface MarketplaceChat {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  message: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string; // payment_id
  orderId: string;
  gateway: "razorpay" | "phonepe" | "cashfree";
  paymentMethod: "UPI";
  upiId?: string;
  transactionId: string;
  amount: number;
  paymentStatus: "initiated" | "processing" | "pending_verification" | "successful" | "failed" | "cancelled" | "expired" | "refunded";
  signature?: string;
  createdAt: string;
}

export interface TransactionRecord {
  id: string; // transaction_id
  paymentId: string;
  gatewayResponse: string; // JSON string response or parsed obj
  webhookStatus: "pending" | "processed" | "failed";
  timestamp: string;
}

