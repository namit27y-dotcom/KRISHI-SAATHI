import { Router } from "express";
import { UserController, AdminController } from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

export const userRoutes = Router();
userRoutes.put("/profile/update", authenticateToken, UserController.updateProfile);

export const adminRoutes = Router();
adminRoutes.get("/users", authenticateToken, requireAdmin, AdminController.getAllUsers);
adminRoutes.put("/users/:id/verify", authenticateToken, requireAdmin, AdminController.verifyUser);
adminRoutes.delete("/users/:id", authenticateToken, requireAdmin, AdminController.deleteUser);
