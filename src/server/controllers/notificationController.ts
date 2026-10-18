import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService.js";

export class NotificationController {
  public static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || (req as any).user?.id;
      if (!userId) return res.status(400).json({ success: false, error: "userId is required" });
      const notifications = await NotificationService.getNotifications(userId);
      res.json({ success: true, notifications });
    } catch (err) {
      next(err);
    }
  }

  public static async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, title, message, type } = req.body;
      if (!userId || !title || !message) {
        return res.status(400).json({ success: false, error: "userId, title, and message are required" });
      }
      const notification = await NotificationService.createNotification({ userId, title, message, type });
      res.json({ success: true, notification });
    } catch (err) {
      next(err);
    }
  }

  public static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(id);
      res.json({ success: true, message: "Notification marked as read." });
    } catch (err) {
      next(err);
    }
  }

  public static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.body.userId as string) || (req as any).user?.id;
      if (!userId) return res.status(400).json({ success: false, error: "userId is required" });
      await NotificationService.markAllAsRead(userId);
      res.json({ success: true, message: "All notifications marked as read." });
    } catch (err) {
      next(err);
    }
  }
}
