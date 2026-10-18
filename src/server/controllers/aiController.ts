import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/aiService.js";
import { 
  plantIdSchema, 
  diseaseAnalyzeSchema, 
  weatherRecommendSchema, 
  yieldForecastSchema, 
  fertilizerPlanSchema, 
  irrigationPlanSchema, 
  schemesQuerySchema, 
  chatAssistantSchema,
  animalHealthSchema
} from "../validators/aiValidator.js";
import { dbConnection } from "../db/connection.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class AIController {
  // Plant Species Reference
  public static async getPlantSpecies(req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await dbConnection.query(`SELECT * FROM plant_species ORDER BY common_name ASC`);
      const species = rows && rows.length > 0 ? rows.map(r => ({
        id: r.id,
        scientificName: r.scientific_name,
        commonName: r.common_name,
        family: r.family,
        growthHabit: r.growth_habit,
        nativeRegion: r.native_region,
        idealPhMin: Number(r.ideal_ph_min),
        idealPhMax: Number(r.ideal_ph_max),
        idealSoilTexture: r.ideal_soil_texture,
        waterRequirement: r.water_requirement,
        sunlightRequirement: r.sunlight_requirement,
        isInvasive: !!r.is_invasive
      })) : dbConnection.getFallbackTable("plant_species");

      res.json({ success: true, species });
    } catch (err) {
      next(err);
    }
  }

  // Plant Identification ("Snap & Know")
  public static async identifyPlant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = plantIdSchema.parse(req.body);
      const userId = req.user?.id || validated.userId;
      const user = userId ? (await dbConnection.query(`SELECT * FROM users WHERE id = ?`, [userId]))[0] : null;
      const soilType = user ? (user.soil_type || user.soilType || "Loamy") : "Loamy";

      const { result, logId } = await AIService.identifyPlant(
        validated.plantPhoto,
        validated.soilPhoto,
        soilType,
        validated.preferredLanguage || user?.preferred_language || user?.preferredLanguage || "en",
        userId
      );

      res.json({ success: true, result, logId });
    } catch (err) {
      next(err);
    }
  }

  public static async getPlantIdLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ success: false, error: "userId is required" });
      const rows = await dbConnection.query(`SELECT * FROM plant_identification_logs WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
      const logs = rows && rows.length > 0 ? rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        photoUrl: r.photo_url,
        identifiedSpeciesId: r.identified_species_id,
        confidenceScore: Number(r.confidence_score),
        soilPhotoUrl: r.soil_photo_url,
        soilCompatibilityResult: r.soil_compatibility_result,
        createdAt: r.created_at
      })) : dbConnection.getFallbackTable("plantIdentificationLogs").filter(l => l.userId === userId);

      res.json({ success: true, logs });
    } catch (err) {
      next(err);
    }
  }

  // Disease Detection
  public static async detectDisease(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = diseaseAnalyzeSchema.parse(req.body);
      const userId = req.user?.id || validated.userId;
      const user = userId ? (await dbConnection.query(`SELECT * FROM users WHERE id = ?`, [userId]))[0] : null;

      const result = await AIService.detectDisease(
        validated.image,
        validated.preferredLanguage || user?.preferred_language || user?.preferredLanguage || "en",
        userId
      );

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  public static async getDiseaseReports(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ success: false, error: "userId is required" });
      const rows = await dbConnection.query(`SELECT * FROM disease_reports WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
      const reports = rows && rows.length > 0 ? rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        cropName: r.crop_name,
        diseaseName: r.disease_name,
        confidence: Number(r.confidence),
        symptoms: r.symptoms,
        causes: r.causes,
        organicTreatment: r.organic_treatment,
        chemicalTreatment: r.chemical_treatment,
        preventiveMeasures: r.preventive_measures,
        recoveryTime: r.recovery_time,
        imageUrl: r.image_url,
        createdAt: r.created_at
      })) : dbConnection.getFallbackTable("diseaseReports").filter(r => r.userId === userId);

      res.json({ success: true, reports });
    } catch (err) {
      next(err);
    }
  }

  // Animal & Fish Health
  public static async analyzeAnimalHealth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = animalHealthSchema.parse(req.body);
      const userId = req.user?.id;
      const result = await AIService.analyzeAnimalHealth(
        validated.animalType,
        validated.symptoms,
        validated.durationDays,
        validated.preferredLanguage,
        userId
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Yield Forecast
  public static async forecastYield(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = yieldForecastSchema.parse(req.body);
      const userId = req.user?.id || validated.userId;
      const forecast = await AIService.forecastYield(
        validated.cropName,
        validated.soilType,
        validated.landArea,
        validated.state,
        validated.district,
        validated.historicalSummary,
        userId
      );
      res.json({ success: true, ...forecast });
    } catch (err) {
      next(err);
    }
  }

  // Fertilizer Planner
  public static async planFertilizer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = fertilizerPlanSchema.parse(req.body);
      const userId = req.user?.id || validated.userId;
      const result = await AIService.planFertilizer(
        validated.crop,
        validated.growthStage,
        validated.soilType,
        validated.fieldSize,
        userId
      );
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  // Irrigation Planner
  public static async planIrrigation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = irrigationPlanSchema.parse(req.body);
      const userId = req.user?.id || validated.userId;
      const result = await AIService.planIrrigation(
        validated.crop,
        validated.growthStage,
        validated.soilType,
        userId
      );
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  // Government Schemes
  public static async querySchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = schemesQuerySchema.parse(req.body);
      const result = await AIService.queryGovernmentSchemes(
        validated.query,
        validated.state,
        validated.crop,
        validated.landSize
      );
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  // Chat Farming Assistant
  public static async chat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = chatAssistantSchema.parse(req.body);
      const userId = req.user?.id || validated.userId;
      const response = await AIService.chatAssistant(
        validated.message,
        validated.history,
        validated.farmingCategory,
        validated.preferredLanguage,
        userId
      );
      res.json({ success: true, response });
    } catch (err) {
      next(err);
    }
  }

  public static async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ success: false, error: "userId is required" });
      const rows = await dbConnection.query(`SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at ASC`, [userId]);
      const history = rows && rows.length > 0 ? rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        message: r.message,
        response: r.response,
        createdAt: r.created_at
      })) : dbConnection.getFallbackTable("chatHistory").filter(c => c.userId === userId);

      res.json({ success: true, history });
    } catch (err) {
      next(err);
    }
  }
}
