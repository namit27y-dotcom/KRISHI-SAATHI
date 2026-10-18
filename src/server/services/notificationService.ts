import { dbConnection } from "../db/connection.js";

export class NotificationService {
  public static async getNotifications(userId: string) {
    const rows = await dbConnection.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        title: r.title,
        message: r.message,
        type: r.type,
        isRead: !!r.is_read,
        createdAt: r.created_at
      }));
    }
    const fallbackList = dbConnection.getFallbackTable("notifications");
    return fallbackList.filter(n => n.userId === userId || n.user_id === userId);
  }

  public static async createNotification(data: { userId: string; title: string; message: string; type?: string }) {
    const id = "notif-" + Math.random().toString(36).substring(2, 11);
    const { userId, title, message, type = "info" } = data;

    await dbConnection.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, title, message, type, false]
    );

    const notif = {
      id,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    dbConnection.getFallbackTable("notifications").push(notif);
    dbConnection.saveFallback();

    return notif;
  }

  public static async markAsRead(id: string) {
    await dbConnection.execute(`UPDATE notifications SET is_read = TRUE WHERE id = ?`, [id]);
    const fallbackList = dbConnection.getFallbackTable("notifications");
    const found = fallbackList.find(n => n.id === id);
    if (found) {
      found.isRead = true;
      found.is_read = true;
      dbConnection.saveFallback();
    }
    return true;
  }

  public static async markAllAsRead(userId: string) {
    await dbConnection.execute(`UPDATE notifications SET is_read = TRUE WHERE user_id = ?`, [userId]);
    const fallbackList = dbConnection.getFallbackTable("notifications");
    for (const n of fallbackList) {
      if (n.userId === userId || n.user_id === userId) {
        n.isRead = true;
        n.is_read = true;
      }
    }
    dbConnection.saveFallback();
    return true;
  }
}
