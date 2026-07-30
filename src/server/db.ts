import fs from "fs";
import path from "path";
import { 
  User, 
  PlantSpecies, 
  PlantLocalName, 
  PlantDiseaseReference, 
  PlantIdentificationLog, 
  DiseaseReport, 
  WeatherRecord, 
  FertilizerPlan, 
  IrrigationPlan, 
  ChatMessage, 
  Notification,
  CropListing,
  AgriculturalProduct,
  MarketplaceOrder,
  MarketplaceChat,
  PaymentRecord,
  TransactionRecord
} from "../types.js";
import { syncToSupabase, deleteFromSupabase } from "./supabase.js";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DatabaseSchema {
  users: Record<string, User & { passwordHash: string }>;
  plantSpecies: Record<string, PlantSpecies>;
  plantLocalNames: Record<string, PlantLocalName>;
  plantDiseasesReference: Record<string, PlantDiseaseReference>;
  plantIdentificationLogs: Record<string, PlantIdentificationLog>;
  diseaseReports: Record<string, DiseaseReport>;
  weatherRecords: Record<string, WeatherRecord>;
  fertilizerPlans: Record<string, FertilizerPlan>;
  irrigationPlans: Record<string, IrrigationPlan>;
  chatHistory: Record<string, ChatMessage>;
  notifications: Record<string, Notification>;
  cropListings: Record<string, CropListing>;
  agriculturalProducts: Record<string, AgriculturalProduct>;
  marketplaceOrders: Record<string, MarketplaceOrder>;
  marketplaceChats: Record<string, MarketplaceChat>;
  payments: Record<string, PaymentRecord>;
  transactions: Record<string, TransactionRecord>;
}

const defaultDatabase: DatabaseSchema = {
  users: {},
  plantSpecies: {},
  plantLocalNames: {},
  plantDiseasesReference: {},
  plantIdentificationLogs: {},
  diseaseReports: {},
  weatherRecords: {},
  fertilizerPlans: {},
  irrigationPlans: {},
  chatHistory: {},
  notifications: {},
  cropListings: {},
  agriculturalProducts: {},
  marketplaceOrders: {},
  marketplaceChats: {},
  payments: {},
  transactions: {},
};

export class Database {
  private static instance: Database;
  private data: DatabaseSchema = defaultDatabase;

  private constructor() {
    this.init();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        
        let changed = false;
        if (!this.data.cropListings || Object.keys(this.data.cropListings).length === 0) {
          this.data.cropListings = {};
          changed = true;
        }
        if (!this.data.agriculturalProducts || Object.keys(this.data.agriculturalProducts).length === 0) {
          this.data.agriculturalProducts = {};
          changed = true;
        }
        if (!this.data.marketplaceOrders) {
          this.data.marketplaceOrders = {};
          changed = true;
        }
        if (!this.data.marketplaceChats) {
          this.data.marketplaceChats = {};
          changed = true;
        }
        if (!this.data.payments) {
          this.data.payments = {};
          changed = true;
        }
        if (!this.data.transactions) {
          this.data.transactions = {};
          changed = true;
        }
        
        if (changed) {
          this.seedData();
          this.save();
        }
        console.log("Database loaded from", DB_FILE);
      } catch (err) {
        console.error("Error reading database file, resetting to empty", err);
        this.data = { ...defaultDatabase };
        this.save();
      }
    } else {
      this.data = { ...defaultDatabase };
      this.seedData();
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database file", err);
    }
  }

  private seedData() {
    console.log("Seeding database with sample rows...");

    // 1. Seed Plant Species (at least 5 common Indian crops)
    const species: PlantSpecies[] = [
      {
        id: "sp-1",
        scientificName: "Solanum lycopersicum",
        commonName: "Tomato",
        family: "Solanaceae",
        growthHabit: "Herbaceous annual or short-lived perennial climber",
        nativeRegion: "South and Central America",
        idealPhMin: 6.0,
        idealPhMax: 6.8,
        idealSoilTexture: "Loamy, well-draining soil",
        waterRequirement: "medium",
        sunlightRequirement: "Full sun",
        isInvasive: false
      },
      {
        id: "sp-2",
        scientificName: "Oryza sativa",
        commonName: "Rice / Paddy",
        family: "Poaceae",
        growthHabit: "Semi-aquatic annual grass",
        nativeRegion: "Tropical Asia",
        idealPhMin: 5.5,
        idealPhMax: 6.5,
        idealSoilTexture: "Clayey or heavy clay loams that retain water",
        waterRequirement: "high",
        sunlightRequirement: "Full sun",
        isInvasive: false
      },
      {
        id: "sp-3",
        scientificName: "Gossypium hirsutum",
        commonName: "Cotton",
        family: "Malvaceae",
        growthHabit: "Shrubby perennial (cultivated as annual)",
        nativeRegion: "Central America / Mexico",
        idealPhMin: 5.8,
        idealPhMax: 8.0,
        idealSoilTexture: "Deep loamy, alluvial, or black cotton soil with good drainage",
        waterRequirement: "medium",
        sunlightRequirement: "Full sun",
        isInvasive: false
      },
      {
        id: "sp-4",
        scientificName: "Saccharum officinarum",
        commonName: "Sugarcane",
        family: "Poaceae",
        growthHabit: "Tall perennial bunchgrass",
        nativeRegion: "Southeast Asia / New Guinea",
        idealPhMin: 6.0,
        idealPhMax: 7.5,
        idealSoilTexture: "Rich loamy or clayey loam soils",
        waterRequirement: "high",
        sunlightRequirement: "Full sun",
        isInvasive: false
      },
      {
        id: "sp-5",
        scientificName: "Azadirachta indica",
        commonName: "Neem",
        family: "Meliaceae",
        growthHabit: "Fast-growing evergreen tree",
        nativeRegion: "Indian subcontinent",
        idealPhMin: 5.0,
        idealPhMax: 8.2,
        idealSoilTexture: "Slightly acidic to alkaline, well-drained sandy or loamy soils",
        waterRequirement: "low",
        sunlightRequirement: "Full sun",
        isInvasive: false
      }
    ];

    for (const sp of species) {
      this.data.plantSpecies[sp.id] = sp;
    }

    // 2. Seed Plant Local Names
    const localNames: PlantLocalName[] = [
      // Tomato
      { id: "ln-1", plantSpeciesId: "sp-1", language: "en", localName: "Tomato" },
      { id: "ln-2", plantSpeciesId: "sp-1", language: "hi", localName: "टमाटर (Tamatar)" },
      { id: "ln-3", plantSpeciesId: "sp-1", language: "mr", localName: "टोमॅटो (Tomato)" },
      // Rice
      { id: "ln-4", plantSpeciesId: "sp-2", language: "en", localName: "Rice" },
      { id: "ln-5", plantSpeciesId: "sp-2", language: "hi", localName: "धान / चावल (Dhan / Chawal)" },
      { id: "ln-6", plantSpeciesId: "sp-2", language: "mr", localName: "भात / तांदूळ (Bhat / Tandul)" },
      // Cotton
      { id: "ln-7", plantSpeciesId: "sp-3", language: "en", localName: "Cotton" },
      { id: "ln-8", plantSpeciesId: "sp-3", language: "hi", localName: "कपास (Kapaas)" },
      { id: "ln-9", plantSpeciesId: "sp-3", language: "mr", localName: "कापूस (Kapus)" },
      // Sugarcane
      { id: "ln-10", plantSpeciesId: "sp-4", language: "en", localName: "Sugarcane" },
      { id: "ln-11", plantSpeciesId: "sp-4", language: "hi", localName: "गन्ना (Ganna)" },
      { id: "ln-12", plantSpeciesId: "sp-4", language: "mr", localName: "ऊस (Us)" },
      // Neem
      { id: "ln-13", plantSpeciesId: "sp-5", language: "en", localName: "Neem" },
      { id: "ln-14", plantSpeciesId: "sp-5", language: "hi", localName: "नीम (Neem)" },
      { id: "ln-15", plantSpeciesId: "sp-5", language: "mr", localName: "कडुनिंब (Kadunimb)" },
    ];

    for (const ln of localNames) {
      this.data.plantLocalNames[ln.id] = ln;
    }

    // 3. Seed Plant Diseases Reference
    const diseaseRefs: PlantDiseaseReference[] = [
      {
        id: "dr-1",
        plantSpeciesId: "sp-1",
        diseaseName: "Early Blight",
        typicalSymptoms: "Dark brown spots with concentric rings (target-like pattern) appearing first on older lower leaves.",
        commonTreatment: "Apply copper-based fungicides.",
        organicTreatment: "Remove infected lower leaves immediately; spray organic neem oil mixed with mild soap, or copper-hydroxide organic formulation."
      },
      {
        id: "dr-2",
        plantSpeciesId: "sp-1",
        diseaseName: "Late Blight",
        typicalSymptoms: "Large, dark brown water-soaked patches on leaves and stems with white fungal mold visible on the underside in humid weather.",
        commonTreatment: "Fungicides like Mancozeb or Chlorothalonil.",
        organicTreatment: "Apply bio-fungicides containing Bacillus subtilis, crop rotation, and avoid overhead watering."
      },
      {
        id: "dr-3",
        plantSpeciesId: "sp-2",
        diseaseName: "Blast Disease",
        typicalSymptoms: "Spindle-shaped spots on leaves with reddish-brown margins and grey centers.",
        commonTreatment: "Spray Tricyclazole or Isoprothiolane.",
        organicTreatment: "Use disease-resistant varieties, optimize nitrogen levels, and treat seeds with Pseudomonas fluorescens bio-agent."
      },
      {
        id: "dr-4",
        plantSpeciesId: "sp-3",
        diseaseName: "Bacterial Blight",
        typicalSymptoms: "Angular leaf spots restricted by veins, and blackening of branches (blackarm phase).",
        commonTreatment: "Copper oxychloride spray mixed with Streptocycline.",
        organicTreatment: "Seed treatment with organic neem seed kernel extract and field sanitization."
      },
      {
        id: "dr-5",
        plantSpeciesId: "sp-4",
        diseaseName: "Red Rot",
        typicalSymptoms: "Reddish discolored tissues inside split cane stems with white horizontal bands and an odor of fermented alcohol.",
        commonTreatment: "Avoid planting infected setts; clean field hygiene.",
        organicTreatment: "Treat seed setts with Trichoderma viride or hot water (52°C) prior to planting, and maintain proper drainage."
      }
    ];

    for (const dr of diseaseRefs) {
      this.data.plantDiseasesReference[dr.id] = dr;
    }

    // Seeding Default Role-Based Users
    const seededUsers: Record<string, User & { passwordHash: string }> = {
      "u-farmer-1": {
        id: "u-farmer-1",
        name: "Ramesh Patil",
        email: "farmer@krishisaathi.com",
        passwordHash: "farmer123",
        mobile: "9876543210",
        role: "farmer",
        isVerified: true,
        country: "India",
        state: "Maharashtra",
        district: "Nashik",
        village: "Pimpalgaon",
        landArea: 4.5,
        soilType: "Black Cotton Soil",
        cropsGrown: ["Wheat", "Tomato", "Sugarcane"],
        preferredLanguage: "mr",
        createdAt: new Date().toISOString()
      },
      "u-seller-1": {
        id: "u-seller-1",
        name: "Anand Kumar",
        email: "seller@krishisaathi.com",
        passwordHash: "seller123",
        mobile: "9123456789",
        role: "seller",
        isVerified: true,
        country: "India",
        state: "Maharashtra",
        district: "Nashik",
        village: "Pimpalgaon Market",
        companyName: "Agri-Grow Fertilisers & Tools Ltd",
        gstNumber: "27AAACA1234F1Z0",
        preferredLanguage: "hi",
        createdAt: new Date().toISOString()
      },
      "u-buyer-1": {
        id: "u-buyer-1",
        name: "Sanjay Gupta",
        email: "buyer@krishisaathi.com",
        passwordHash: "buyer123",
        mobile: "9567890123",
        role: "buyer",
        isVerified: true,
        country: "India",
        state: "Maharashtra",
        district: "Mumbai",
        village: "APMC Market",
        companyName: "Gupta Agro Exports Ltd",
        buyerType: "exporter",
        preferredLanguage: "en",
        createdAt: new Date().toISOString()
      },
      "u-admin-1": {
        id: "u-admin-1",
        name: "Admin Officer",
        email: "admin@krishisaathi.com",
        passwordHash: "admin123",
        mobile: "9000000000",
        role: "admin",
        isVerified: true,
        country: "India",
        state: "New Delhi",
        district: "Central Delhi",
        village: "Krishi Bhawan",
        preferredLanguage: "en",
        createdAt: new Date().toISOString()
      }
    };

    for (const [id, user] of Object.entries(seededUsers)) {
      this.data.users[id] = user;
    }

    // Seeding Default Crop Listings (listed by Ramesh Patil)
    const seededCrops: CropListing[] = [
      {
        id: "crop-1",
        farmerId: "u-farmer-1",
        farmerName: "Ramesh Patil",
        cropName: "Wheat (Sarbati Premium Grade)",
        quantity: 2500,
        unit: "kg",
        pricePerUnit: 28,
        country: "India",
        state: "Maharashtra",
        district: "Nashik",
        village: "Pimpalgaon",
        description: "Naturally grown Sarbati wheat, harvested last week. Extensively dried, minimal moisture, golden luster grains.",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "crop-2",
        farmerId: "u-farmer-1",
        farmerName: "Ramesh Patil",
        cropName: "Organic Vine-Ripe Tomatoes",
        quantity: 800,
        unit: "kg",
        pricePerUnit: 22,
        country: "India",
        state: "Maharashtra",
        district: "Nashik",
        village: "Pimpalgaon",
        description: "Juicy organic red tomatoes, hand-picked. Perfect size and firmness for transport and retail sale.",
        imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600",
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ];

    for (const crop of seededCrops) {
      this.data.cropListings[crop.id] = crop;
    }

    // Seeding Default Agricultural Products (listed by Agri-Grow Seller)
    const seededProducts: AgriculturalProduct[] = [
      {
        id: "prod-1",
        sellerId: "u-seller-1",
        sellerName: "Agri-Grow Fertilisers & Tools Ltd",
        name: "Premium NPK 19-19-19 Fertilizer",
        category: "fertilizers",
        description: "Water-soluble balanced chemical fertilizer. Highly effective for early growth, root branching, and crop yield booster.",
        price: 480,
        unit: "bag (25 kg)",
        inventory: 45,
        imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600",
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "prod-2",
        sellerId: "u-seller-1",
        sellerName: "Agri-Grow Fertilisers & Tools Ltd",
        name: "Organic Cold-Pressed Neem Oil Spray",
        category: "pesticides",
        description: "100% natural, biodegradable pest controller. Eradicates spider mites, aphids, whiteflies, and other leaf caterpillars.",
        price: 290,
        unit: "bottle (1 Liter)",
        inventory: 85,
        imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "prod-3",
        sellerId: "u-seller-1",
        sellerName: "Agri-Grow Fertilisers & Tools Ltd",
        name: "Manual Knapsack Battery Sprayer (16L)",
        category: "sprayers",
        description: "Heavy-duty double pump rechargeable sprayer. High pressure nozzle with adjustable lance for uniform pesticide coverage.",
        price: 2850,
        unit: "piece",
        inventory: 12,
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        isVerified: true,
        createdAt: new Date().toISOString()
      }
    ];

    for (const prod of seededProducts) {
      this.data.agriculturalProducts[prod.id] = prod;
    }

    console.log("Seeding complete!");
  }

  // --- Users Table API ---
  public getUsers() { return this.data.users; }
  public getUserById(id: string) { return this.data.users[id]; }
  public getUserByEmail(email: string) {
    return Object.values(this.data.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  public addUser(user: User, passwordHash: string) {
    this.data.users[user.id] = { ...user, passwordHash };
    this.save();
    syncToSupabase("Users", { ...user, passwordHash });
    return user;
  }
  public updateUser(id: string, updates: Partial<User>) {
    if (this.data.users[id]) {
      this.data.users[id] = { ...this.data.users[id], ...updates };
      this.save();
      syncToSupabase("Users", this.data.users[id]);
      return this.data.users[id];
    }
    return null;
  }

  // --- Plant Species & Reference Tables ---
  public getPlantSpecies() { return Object.values(this.data.plantSpecies); }
  public findSpeciesByName(scientificOrCommonName: string): PlantSpecies | null {
    const term = scientificOrCommonName.toLowerCase();
    return Object.values(this.data.plantSpecies).find(
      (s) => s.scientificName.toLowerCase().includes(term) || s.commonName.toLowerCase().includes(term)
    ) || null;
  }
  public getLocalNamesForSpecies(speciesId: string) {
    return Object.values(this.data.plantLocalNames).filter((n) => n.plantSpeciesId === speciesId);
  }
  public getDiseasesForSpecies(speciesId: string) {
    return Object.values(this.data.plantDiseasesReference).filter((dr) => dr.plantSpeciesId === speciesId);
  }

  // --- Plant Identification Logs Table ---
  public getPlantIdLogs(userId?: string) {
    const logs = Object.values(this.data.plantIdentificationLogs);
    if (userId) {
      return logs.filter((log) => log.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addPlantIdLog(log: PlantIdentificationLog) {
    this.data.plantIdentificationLogs[log.id] = log;
    this.save();
    syncToSupabase("Plant_Identification_Logs", log);
    return log;
  }

  // --- Disease Reports Table ---
  public getDiseaseReports(userId?: string) {
    const reports = Object.values(this.data.diseaseReports);
    if (userId) {
      return reports.filter((r) => r.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addDiseaseReport(report: DiseaseReport) {
    this.data.diseaseReports[report.id] = report;
    this.save();
    syncToSupabase("Disease_Reports", report);
    return report;
  }

  // --- Weather Records Table ---
  public getWeatherRecord(state: string, district: string) {
    return Object.values(this.data.weatherRecords).find(
      (w) => w.state.toLowerCase() === state.toLowerCase() && w.district.toLowerCase() === district.toLowerCase()
    ) || null;
  }
  public saveWeatherRecord(record: WeatherRecord) {
    this.data.weatherRecords[record.id] = record;
    this.save();
    syncToSupabase("Weather_Records", record);
    return record;
  }

  // --- Fertilizer & Irrigation Plans ---
  public getFertilizerPlans() {
    return Object.values(this.data.fertilizerPlans);
  }
  public addFertilizerPlan(plan: FertilizerPlan) {
    this.data.fertilizerPlans[plan.id] = plan;
    this.save();
    syncToSupabase("Fertilizer_Plans", plan);
    return plan;
  }
  public getIrrigationPlans() {
    return Object.values(this.data.irrigationPlans);
  }
  public addIrrigationPlan(plan: IrrigationPlan) {
    this.data.irrigationPlans[plan.id] = plan;
    this.save();
    syncToSupabase("Irrigation_Plans", plan);
    return plan;
  }

  // --- Chat History Table ---
  public getChatHistory(userId: string) {
    return Object.values(this.data.chatHistory)
      .filter((c) => c.userId === userId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  public addChatMessage(msg: ChatMessage) {
    this.data.chatHistory[msg.id] = msg;
    this.save();
    syncToSupabase("Chat_History", msg);
    return msg;
  }

  // --- Notifications Table ---
  public getNotifications(userId: string) {
    return Object.values(this.data.notifications)
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addNotification(notification: Notification) {
    this.data.notifications[notification.id] = notification;
    this.save();
    syncToSupabase("Notifications", notification);
    return notification;
  }
  public markNotificationAsRead(id: string) {
    if (this.data.notifications[id]) {
      this.data.notifications[id].isRead = true;
      this.save();
      syncToSupabase("Notifications", this.data.notifications[id]);
    }
  }

  // --- Crop Listings API ---
  public getCropListings() {
    return Object.values(this.data.cropListings).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addCropListing(listing: CropListing) {
    this.data.cropListings[listing.id] = listing;
    this.save();
    syncToSupabase("Crop_Listings", listing);
    return listing;
  }
  public updateCropListing(id: string, updates: Partial<CropListing>) {
    if (this.data.cropListings[id]) {
      this.data.cropListings[id] = { ...this.data.cropListings[id], ...updates };
      this.save();
      syncToSupabase("Crop_Listings", this.data.cropListings[id]);
      return this.data.cropListings[id];
    }
    return null;
  }
  public deleteCropListing(id: string) {
    if (this.data.cropListings[id]) {
      delete this.data.cropListings[id];
      this.save();
      deleteFromSupabase("Crop_Listings", id);
      return true;
    }
    return false;
  }

  // --- Agricultural Products API ---
  public getAgriculturalProducts() {
    return Object.values(this.data.agriculturalProducts).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addAgriculturalProduct(product: AgriculturalProduct) {
    this.data.agriculturalProducts[product.id] = product;
    this.save();
    syncToSupabase("Agricultural_Products", product);
    return product;
  }
  public updateAgriculturalProduct(id: string, updates: Partial<AgriculturalProduct>) {
    if (this.data.agriculturalProducts[id]) {
      this.data.agriculturalProducts[id] = { ...this.data.agriculturalProducts[id], ...updates };
      this.save();
      syncToSupabase("Agricultural_Products", this.data.agriculturalProducts[id]);
      return this.data.agriculturalProducts[id];
    }
    return null;
  }
  public deleteAgriculturalProduct(id: string) {
    if (this.data.agriculturalProducts[id]) {
      delete this.data.agriculturalProducts[id];
      this.save();
      deleteFromSupabase("Agricultural_Products", id);
      return true;
    }
    return false;
  }

  // --- Marketplace Orders API ---
  public getMarketplaceOrders() {
    return Object.values(this.data.marketplaceOrders).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addMarketplaceOrder(order: MarketplaceOrder) {
    this.data.marketplaceOrders[order.id] = order;
    this.save();
    syncToSupabase("Marketplace_Orders", order);
    return order;
  }
  public updateMarketplaceOrder(id: string, updates: Partial<MarketplaceOrder>) {
    if (this.data.marketplaceOrders[id]) {
      this.data.marketplaceOrders[id] = { ...this.data.marketplaceOrders[id], ...updates };
      this.save();
      syncToSupabase("Marketplace_Orders", this.data.marketplaceOrders[id]);
      return this.data.marketplaceOrders[id];
    }
    return null;
  }

  // --- Marketplace Chats API ---
  public getMarketplaceChats() {
    return Object.values(this.data.marketplaceChats).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public addMarketplaceChat(chat: MarketplaceChat) {
    this.data.marketplaceChats[chat.id] = chat;
    this.save();
    syncToSupabase("Marketplace_Chats", chat);
    return chat;
  }

  // --- Payments API ---
  public getPayments() {
    return Object.values(this.data.payments).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  public getPaymentById(id: string) {
    return this.data.payments[id] || null;
  }
  public addPayment(payment: PaymentRecord) {
    this.data.payments[payment.id] = payment;
    this.save();
    syncToSupabase("Payments", payment);
    return payment;
  }
  public updatePayment(id: string, updates: Partial<PaymentRecord>) {
    if (this.data.payments[id]) {
      this.data.payments[id] = { ...this.data.payments[id], ...updates };
      this.save();
      syncToSupabase("Payments", this.data.payments[id]);
      return this.data.payments[id];
    }
    return null;
  }

  // --- Transactions API ---
  public getTransactions() {
    return Object.values(this.data.transactions).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
  public addTransaction(tx: TransactionRecord) {
    this.data.transactions[tx.id] = tx;
    this.save();
    syncToSupabase("Transactions", tx);
    return tx;
  }
  public updateTransaction(id: string, updates: Partial<TransactionRecord>) {
    if (this.data.transactions[id]) {
      this.data.transactions[id] = { ...this.data.transactions[id], ...updates };
      this.save();
      syncToSupabase("Transactions", this.data.transactions[id]);
      return this.data.transactions[id];
    }
    return null;
  }

  // --- Admin User operations ---
  public getAllUsers() {
    return Object.values(this.data.users).map(({ passwordHash, ...user }) => user);
  }
  public deleteUser(id: string) {
    if (this.data.users[id]) {
      delete this.data.users[id];
      this.save();
      deleteFromSupabase("Users", id);
      return true;
    }
    return false;
  }
}
