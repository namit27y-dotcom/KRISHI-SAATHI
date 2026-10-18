import { Request, Response, NextFunction } from "express";
import { LocationService } from "../services/locationService.js";
import { locationUpdateSchema, languagePreferenceSchema } from "../validators/locationValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { dbConnection } from "../db/connection.js";

export class LocationController {
  public static async confirmLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = locationUpdateSchema.parse(req.body);
      const result = await LocationService.updateConfirmedLocation(req.user.id, validated);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async suggestLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const state = req.query.state as string;
      const country = (req.query.country as string) || "India";
      const suggestion = LocationService.suggestLanguageFromLocation(state, country);
      res.json({ success: true, ...suggestion });
    } catch (err) {
      next(err);
    }
  }

  public static async setPreferredLanguage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const { language } = languagePreferenceSchema.parse(req.body);
      await dbConnection.execute(`UPDATE users SET preferred_language = ? WHERE id = ?`, [language, req.user.id]);
      res.json({ success: true, preferredLanguage: language });
    } catch (err) {
      next(err);
    }
  }

  public static async getBilingualDisplay(req: Request, res: Response, next: NextFunction) {
    try {
      const value = req.query.value as string;
      const lang = (req.query.lang as string) || "en";
      const formatted = LocationService.formatBilingual(value, lang);
      res.json({ success: true, ...formatted });
    } catch (err) {
      next(err);
    }
  }
}
