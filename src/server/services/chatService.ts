import { dbConnection } from "../db/connection.js";

export class ChatService {
  public static async getConversationMessages(userA: string, userB: string) {
    const rows = await dbConnection.query(
      `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC`,
      [userA, userB, userB, userA]
    );

    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        message: r.message,
        createdAt: r.created_at
      }));
    }

    const fallbackList = dbConnection.getFallbackTable("marketplaceChats");
    return fallbackList.filter(
      c => (c.senderId === userA && c.receiverId === userB) || (c.senderId === userB && c.receiverId === userA)
    );
  }

  public static async sendMessage(data: { senderId: string; senderName: string; receiverId: string; receiverName?: string; message: string }) {
    const { senderId, senderName, receiverId, receiverName = "Receiver", message } = data;
    const id = "chat-" + Math.random().toString(36).substring(2, 11);

    // Find or create conversation
    const p1 = senderId < receiverId ? senderId : receiverId;
    const p2 = senderId < receiverId ? receiverId : senderId;
    const convId = `conv-${p1}-${p2}`;

    await dbConnection.execute(
      `INSERT INTO conversations (id, participant1_id, participant2_id, last_message_at) VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE last_message_at = NOW()`,
      [convId, p1, p2]
    );

    await dbConnection.execute(
      `INSERT INTO messages (id, conversation_id, sender_id, sender_name, receiver_id, receiver_name, message, is_read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, convId, senderId, senderName, receiverId, receiverName, message, false]
    );

    // Notify receiver
    await dbConnection.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "notif-" + Math.random().toString(36).substring(2, 11),
        receiverId,
        `New Message from ${senderName} 💬`,
        message.length > 50 ? `${message.substring(0, 47)}...` : message,
        "info",
        false
      ]
    );

    const chatMsg = {
      id,
      senderId,
      senderName,
      receiverId,
      receiverName,
      message,
      createdAt: new Date().toISOString()
    };

    dbConnection.getFallbackTable("marketplaceChats").push(chatMsg);
    dbConnection.saveFallback();

    return chatMsg;
  }
}
