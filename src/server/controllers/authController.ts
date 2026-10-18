import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);
      res.status(201).json({
        success: true,
        user: result.user,
        token: result.token
      });
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData.email, validatedData.password);
      res.json({
        success: true,
        user: result.user,
        token: result.token
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const user = await AuthService.getProfile(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
}
