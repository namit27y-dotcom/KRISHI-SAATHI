import { Router } from "express";
import { NotificationController } from "../controllers/notificationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", NotificationController.getNotifications);
router.post("/", NotificationController.createNotification);
router.post("/:id/read", NotificationController.markAsRead);
router.post("/read-all", authenticateToken, NotificationController.markAllAsRead);

export default router;
