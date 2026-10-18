import { dbConnection } from "../db/connection.js";

export class PaymentService {
  public static async initiatePayment(user: any, orderId: string, gateway: string = "razorpay", upiId: string = "user@pay") {
    const orders = await dbConnection.query(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    const order = orders && orders.length > 0 ? orders[0] : dbConnection.getFallbackTable("marketplaceOrders").find(x => x.id === orderId);
    if (!order) throw new Error("Order not found.");

    if (order.payment_status === "paid" || order.paymentStatus === "paid") {
      throw new Error("This order has already been paid successfully.");
    }

    const grandTotal = Number(order.grand_total || order.grandTotal || order.totalPrice || order.subtotal);
    const paymentId = "pay-" + Math.random().toString(36).substring(2, 11);
    const transactionId = "txn-" + Math.random().toString(36).substring(2, 11);

    const paymentSql = `
      INSERT INTO payments (id, order_id, gateway, payment_method, upi_id, transaction_id, amount, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await dbConnection.execute(paymentSql, [paymentId, orderId, gateway, "UPI", upiId, transactionId, grandTotal, "initiated"]);

    // Log transaction
    const txId = "tx-rec-" + Math.random().toString(36).substring(2, 11);
    await dbConnection.execute(
      `INSERT INTO transactions (id, payment_id, gateway_response, webhook_status) VALUES (?, ?, ?, ?)`,
      [txId, paymentId, JSON.stringify({ status: "initiated", gateway }), "pending"]
    );

    // Update order
    await dbConnection.execute(
      `UPDATE orders SET payment_status = 'pending_payment', payment_id = ?, payment_method = 'UPI' WHERE id = ?`,
      [paymentId, orderId]
    );

    const payment = {
      id: paymentId,
      orderId,
      gateway,
      paymentMethod: "UPI" as const,
      upiId,
      transactionId,
      amount: grandTotal,
      paymentStatus: "initiated" as const,
      createdAt: new Date().toISOString()
    };

    const receiverUpi = "krishisaathi@yesbank";
    const merchantName = "Krishi Saathi Agri Trade";
    const note = `Payment for order ${orderId}`;
    const intentUrl = `upi://pay?pa=${encodeURIComponent(receiverUpi)}&pn=${encodeURIComponent(merchantName)}&am=${grandTotal.toFixed(2)}&tr=${transactionId}&cu=INR&tn=${encodeURIComponent(note)}`;

    return { payment, qrCodeData: intentUrl, intentUrl };
  }

  public static async verifyPayment(user: any, paymentId: string, status: "successful" | "failed" | "cancelled", signature?: string) {
    const payments = await dbConnection.query(`SELECT * FROM payments WHERE id = ?`, [paymentId]);
    const payment = payments && payments.length > 0 ? payments[0] : dbConnection.getFallbackTable("payments").find(p => p.id === paymentId);
    if (!payment) throw new Error("Payment record not found.");

    const orderId = payment.order_id || payment.orderId;
    const orders = await dbConnection.query(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    const order = orders && orders.length > 0 ? orders[0] : dbConnection.getFallbackTable("marketplaceOrders").find(o => o.id === orderId);
    if (!order) throw new Error("Associated order not found.");

    const verifiedSig = signature || `sig-${paymentId}-${orderId}-verified`;
    await dbConnection.execute(
      `UPDATE payments SET payment_status = ?, signature = ? WHERE id = ?`,
      [status, verifiedSig, paymentId]
    );

    // Log transaction
    const txId = "tx-rec-" + Math.random().toString(36).substring(2, 11);
    await dbConnection.execute(
      `INSERT INTO transactions (id, payment_id, gateway_response, webhook_status) VALUES (?, ?, ?, ?)`,
      [
        txId,
        paymentId,
        JSON.stringify({ event: `payment.${status}`, amount: payment.amount, signature: verifiedSig, timestamp: new Date().toISOString() }),
        "processed"
      ]
    );

    if (status === "successful") {
      await dbConnection.execute(
        `UPDATE orders SET payment_status = 'paid', status = 'accepted' WHERE id = ?`,
        [orderId]
      );

      const sellerId = order.seller_id || order.sellerId;
      const buyerId = order.buyer_id || order.buyerId;

      await dbConnection.execute(
        `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "notif-" + Math.random().toString(36).substring(2, 11),
          sellerId,
          "Payment Received! 💳",
          `${user.name} completed payment of ₹${payment.amount} via UPI for order #${orderId}.`,
          "success",
          false
        ]
      );

      await dbConnection.execute(
        `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "notif-" + Math.random().toString(36).substring(2, 11),
          buyerId,
          "Payment Successful! 🎉",
          `Your payment of ₹${payment.amount} was verified. Transaction ID #${payment.transaction_id || payment.transactionId}.`,
          "success",
          false
        ]
      );
    } else {
      await dbConnection.execute(
        `UPDATE orders SET payment_status = 'failed' WHERE id = ?`,
        [orderId]
      );
    }

    const updatedOrder = (await dbConnection.query(`SELECT * FROM orders WHERE id = ?`, [orderId]))[0];
    return {
      success: status === "successful",
      payment: { ...payment, paymentStatus: status, signature: verifiedSig },
      order: updatedOrder
    };
  }

  public static async getPaymentHistory(user: any) {
    if (user.role === "admin") {
      return await dbConnection.query(`SELECT * FROM payments ORDER BY created_at DESC`);
    }
    return await dbConnection.query(
      `SELECT p.* FROM payments p JOIN orders o ON p.order_id = o.id WHERE o.buyer_id = ? OR o.seller_id = ? ORDER BY p.created_at DESC`,
      [user.id, user.id]
    );
  }
}
