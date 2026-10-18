import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/chatService.js";
import { chatMessageSchema } from "../validators/marketplaceValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class ChatController {
  public static async getChats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userA, userB } = req.query;
      if (!userA || !userB) {
        return res.status(400).json({ success: false, error: "Both userA and userB query parameters are required." });
      }
      const chats = await ChatService.getConversationMessages(userA as string, userB as string);
      res.json({ success: true, chats });
    } catch (err) {
      next(err);
    }
  }

  public static async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const senderId = req.user?.id || req.body.senderId;
      const senderName = req.user?.name || req.body.senderName || "Sender";
      if (!senderId) return res.status(401).json({ success: false, error: "Sender authentication is required." });

      const validated = chatMessageSchema.parse(req.body);
      const chat = await ChatService.sendMessage({
        senderId,
        senderName,
        receiverId: validated.receiverId,
        receiverName: validated.receiverName,
        message: validated.message
      });

      res.status(201).json({ success: true, chat });
    } catch (err) {
      next(err);
    }
  }
}
