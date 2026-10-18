import { Response, NextFunction } from "express";
import { UserService } from "../services/userService.js";
import { updateProfileSchema } from "../validators/authValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class UserController {
  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = updateProfileSchema.parse(req.body);
      const updated = await UserService.updateProfile(req.user.id, validated);
      res.json({ success: true, user: updated });
    } catch (err) {
      next(err);
    }
  }
}

export class AdminController {
  public static async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.json({ success: true, users });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
      await UserService.verifyUser(id, !!isVerified);
      res.json({ success: true, message: `User verification updated to ${!!isVerified}` });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.json({ success: true, message: "User deleted successfully." });
    } catch (err) {
      next(err);
    }
  }
}
