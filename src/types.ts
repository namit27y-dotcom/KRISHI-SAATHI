export type SupportedLanguage = "en" | "hi" | "mr" | "mai" | "bho" | "pa" | "ta" | "te" | "bn" | "es" | "vi" | "sw";

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
  language: "en" | "hi" | "mr" | "mai" | "bho" | "pa" | "ta" | "te" | "bn" | "es" | "vi" | "sw";
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

// ==========================================
// ANIMAL & FISH FARMING DATA MODELS
// Future MySQL Tables: farming_categories, farming_subcategories, courses,
// course_modules, lessons, lesson_translations, videos, quizzes, quiz_questions,
// quiz_attempts, user_farming_interests, user_lesson_progress, calculator_types, calculator_history
// ==========================================

export type LivestockCategoryCode = 
  | "dairy"
  | "sheep"
  | "goat"
  | "poultry"
  | "pig"
  | "beekeeping"
  | "fisheries"
  | "integrated";

export interface FarmingCategory {
  id: string;
  code: LivestockCategoryCode;
  nameEn: string;
  nameRegional: Record<SupportedLanguage, string>;
  descriptionEn: string;
  descriptionRegional: Record<SupportedLanguage, string>;
  iconName: string;
  imageUrl?: string;
  displayOrder: number;
  totalLessons: number;
}

export interface FarmingSubcategory {
  id: string;
  categoryId: string;
  code: string;
  nameEn: string;
  nameRegional: Record<SupportedLanguage, string>;
  descriptionEn: string;
  descriptionRegional: Record<SupportedLanguage, string>;
  displayOrder: number;
}

export interface Course {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  titleEn: string;
  titleRegional: Record<SupportedLanguage, string>;
  summaryEn: string;
  summaryRegional: Record<SupportedLanguage, string>;
  level: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  totalModules: number;
  isPublished: boolean;
}

export interface CourseModule {
  id: string;
  courseId: string;
  orderNumber: number;
  titleEn: string;
  titleRegional: Record<SupportedLanguage, string>;
  descriptionEn: string;
  descriptionRegional: Record<SupportedLanguage, string>;
}

export interface EducationalVideo {
  id: string;
  lessonId: string;
  videoUrl?: string; // Configurable video URL (e.g. YouTube embed or HLS stream)
  durationSeconds: number;
  thumbnailUrl?: string;
  aspectRatio?: string;
  isConfigurable: boolean;
}

export interface LessonTranslation {
  id: string;
  lessonId: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  keyPoints: string[];
  safetyNotes: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionEn: string;
  questionRegional: Record<SupportedLanguage, string>;
  optionsEn: string[];
  optionsRegional: Record<SupportedLanguage, string[]>;
  correctOptionIndex: number;
  explanationEn: string;
  explanationRegional: Record<SupportedLanguage, string>;
}

export interface Quiz {
  id: string;
  lessonId: string;
  titleEn: string;
  titleRegional: Record<SupportedLanguage, string>;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  categoryId: LivestockCategoryCode;
  orderNumber: number;
  topicNumber?: number;
  titleEn: string;
  titleRegional: Record<SupportedLanguage, string>;
  descriptionEn: string;
  descriptionRegional: Record<SupportedLanguage, string>;
  durationMinutes: number;
  keyPointsEn: string[];
  keyPointsRegional: Record<SupportedLanguage, string[]>;
  safetyNotesEn: string;
  safetyNotesRegional: Record<SupportedLanguage, string>;
  video?: EducationalVideo;
  quiz?: Quiz;
  isPublished: boolean;
}

export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  categoryId: LivestockCategoryCode;
  isCompleted: boolean;
  videoWatched: boolean;
  videoSecondsWatched: number;
  completedAt?: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  isPassed: boolean;
  attemptedAt: string;
}

export interface UserFarmingInterest {
  id: string;
  userId: string;
  categoryCodes: LivestockCategoryCode[];
  updatedAt: string;
}

export type LivestockCalculatorType = "dairy" | "sheep" | "goat" | "poultry" | "fisheries";

export interface LivestockCalculatorInput {
  type: LivestockCalculatorType;
  // Dairy params
  animalCount?: number;
  dailyFeedCostPerAnimal?: number;
  dailyMilkYieldLiters?: number;
  milkPricePerLiter?: number;
  monthlyHealthCost?: number;
  monthlyLabourCost?: number;
  otherMonthlyExpenses?: number;
  
  // Sheep / Goat params
  flockSize?: number;
  annualFeedCostPerHead?: number;
  healthCostPerHead?: number;
  labourAnnualCost?: number;
  expectedSalePricePerHead?: number;
  sellingCount?: number;
  milkIncomeMonthly?: number;

  // Poultry params
  birdCount?: number;
  chickCostPerBird?: number;
  feedCostPerBatch?: number;
  medicineCostPerBatch?: number;
  electricityCostPerBatch?: number;
  mortalityRatePercent?: number;
  averageWeightKg?: number;
  sellingPricePerKg?: number;

  // Fisheries params
  pondSizeAcres?: number;
  fingerlingsCount?: number;
  fingerlingUnitCost?: number;
  fishFeedCostPerCycle?: number;
  pondLabourCost?: number;
  otherCycleExpenses?: number;
  expectedHarvestKg?: number;
  sellingPricePerKgFish?: number;
}

export interface LivestockCalculatorResult {
  type: LivestockCalculatorType;
  estimatedCost: number;
  estimatedRevenue: number;
  estimatedProfit: number;
  profitMarginPercent: number;
  breakdown: {
    labelEn: string;
    labelRegional: Record<SupportedLanguage, string>;
    amount: number;
  }[];
  calculatedAt: string;
}

