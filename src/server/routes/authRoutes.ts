import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.get("/profile", authenticateToken, AuthController.getProfile);

export default router;
