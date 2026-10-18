import { Router } from "express";
import { LocationController } from "../controllers/locationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/confirm", authenticateToken, LocationController.confirmLocation);
router.get("/suggest-language", LocationController.suggestLanguage);
router.post("/preferred-language", authenticateToken, LocationController.setPreferredLanguage);
router.get("/bilingual-display", LocationController.getBilingualDisplay);

export default router;
