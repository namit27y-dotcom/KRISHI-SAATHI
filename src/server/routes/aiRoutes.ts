import { Router } from "express";
import { AIController } from "../controllers/aiController.js";
import { authenticateToken } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { WeatherService } from "../services/weatherService.js";

const router = Router();

// Feature 9: Plant Species & Identification
router.get("/plant-species", AIController.getPlantSpecies);
router.post("/plant-id/analyze", aiLimiter, AIController.identifyPlant);
router.get("/plant-id/logs", AIController.getPlantIdLogs);

// Feature 1: Crop Disease Detection
router.post("/disease/analyze", aiLimiter, AIController.detectDisease);
router.get("/disease/reports", AIController.getDiseaseReports);

// Feature 2: Weather & Crop Recommendations
router.post("/weather/recommend", aiLimiter, async (req, res, next) => {
  try {
    const { state, district, soilType, season, userId } = req.body;
    const result = {
      state,
      district,
      season,
      recommendations: [
        {
          cropName: "Wheat",
          suitableSowingPeriod: "Nov 1 - Nov 25",
          whyRecommended: `Optimal cool winter climate in ${district} paired with moisture-retaining ${soilType} soil.`,
          estimatedDaysToHarvest: "115-125 days"
        },
        {
          cropName: "Chickpea (Gram)",
          suitableSowingPeriod: "Oct 15 - Nov 10",
          whyRecommended: `Drought-tolerant nitrogen-fixing legume requiring minimal irrigation in ${state}.`,
          estimatedDaysToHarvest: "110-120 days"
        },
        {
          cropName: "Mustard",
          suitableSowingPeriod: "Oct 1 - Oct 31",
          whyRecommended: `Low water footprint matching winter temperature gradients.`,
          estimatedDaysToHarvest: "105-115 days"
        }
      ]
    };
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// Live Weather Endpoint
router.get("/weather/current", async (req, res, next) => {
  try {
    const { district, state, lat, lon } = req.query;
    const data = await WeatherService.getCurrentWeather(
      state as string,
      district as string,
      lat ? parseFloat(lat as string) : undefined,
      lon ? parseFloat(lon as string) : undefined
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Feature 2.5: Predictive AI Yield Forecasting
router.post("/gemini/yield-forecast", aiLimiter, AIController.forecastYield);

// Feature 3: Fertilizer Planner
router.post("/plans/fertilizer", aiLimiter, AIController.planFertilizer);

// Feature 4: Irrigation Planner
router.post("/plans/irrigation", aiLimiter, AIController.planIrrigation);

// Feature 5: Government Schemes
router.post("/schemes/query", aiLimiter, AIController.querySchemes);

// Feature 6: AI Chat Assistant
router.post("/chat", aiLimiter, AIController.chat);
router.get("/chat/history", AIController.getChatHistory);

// Animal & Fish Health Advisor
router.post("/farming/animal-health", aiLimiter, AIController.analyzeAnimalHealth);

export default router;
