import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/paymentService.js";
import { paymentInitiateSchema, paymentVerifySchema } from "../validators/marketplaceValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { dbConnection } from "../db/connection.js";

export class PaymentController {
  public static async initiate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = paymentInitiateSchema.parse(req.body);
      const result = await PaymentService.initiatePayment(req.user, validated.orderId, validated.gateway, validated.upiId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = paymentVerifySchema.parse(req.body);
      const result = await PaymentService.verifyPayment(req.user, validated.paymentId, validated.status, validated.signature);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId, event, signature } = req.body;
      if (!paymentId || !event) {
        return res.status(400).json({ success: false, error: "Missing webhook parameters." });
      }

      const txId = "tx-rec-" + Math.random().toString(36).substring(2, 11);
      await dbConnection.execute(
        `INSERT INTO transactions (id, payment_id, gateway_response, webhook_status) VALUES (?, ?, ?, ?)`,
        [txId, paymentId, JSON.stringify({ webhook_event: event, signature, processed_at: new Date().toISOString() }), "processed"]
      );

      res.json({ success: true, received: true });
    } catch (err) {
      next(err);
    }
  }

  public static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rows = await dbConnection.query(`SELECT * FROM payments WHERE id = ?`, [id]);
      const payment = rows && rows.length > 0 ? rows[0] : dbConnection.getFallbackTable("payments").find(p => p.id === id);
      if (!payment) return res.status(404).json({ success: false, error: "Payment not found." });
      res.json({ success: true, payment });
    } catch (err) {
      next(err);
    }
  }

  public static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const payments = await PaymentService.getPaymentHistory(req.user);
      res.json({ success: true, payments });
    } catch (err) {
      next(err);
    }
  }

  public static async getReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // order id
      const orders = await dbConnection.query(`SELECT * FROM orders WHERE id = ?`, [id]);
      const order = orders && orders.length > 0 ? orders[0] : dbConnection.getFallbackTable("marketplaceOrders").find(o => o.id === id);
      if (!order) return res.status(404).send("<h1>Order not found</h1>");

      const payments = await dbConnection.query(`SELECT * FROM payments WHERE order_id = ? AND payment_status = 'successful'`, [id]);
      const payment = payments && payments.length > 0 ? payments[0] : {
        id: order.payment_id || "N/A",
        transaction_id: order.payment_id ? `txn-${order.payment_id.substring(4)}` : "N/A",
        gateway: "UPI",
        created_at: order.created_at || new Date().toISOString()
      };

      const tax = order.tax_amount !== undefined ? Number(order.tax_amount) : Math.round(Number(order.subtotal || order.totalPrice) * 0.05);
      const delivery = order.delivery_charge !== undefined ? Number(order.delivery_charge) : (order.type === "crop" ? 450 : 120);
      const discount = order.discount_amount !== undefined ? Number(order.discount_amount) : 0;
      const grandTotal = order.grand_total !== undefined ? Number(order.grand_total) : (Number(order.subtotal || order.totalPrice) + tax + delivery - discount);

      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order #${order.id}</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); border-radius: 12px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #059669; }
          .title { text-align: right; }
          .title h1 { margin: 0; font-size: 28px; color: #111827; }
          .meta-info { display: flex; justify-content: space-between; margin-top: 30px; margin-bottom: 40px; }
          .meta-block h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; color: #6b7280; }
          .meta-block p { margin: 4px 0; font-size: 14px; }
          .invoice-table { width: 100%; border-collapse: collapse; text-align: left; }
          .invoice-table th { background: #f9fafb; padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #4b5563; }
          .invoice-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
          .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
          .totals-table { width: 300px; border-collapse: collapse; }
          .totals-table td { padding: 8px 12px; font-size: 14px; }
          .totals-table tr.grand-total { border-top: 2px solid #e5e7eb; font-weight: bold; font-size: 16px; color: #059669; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; background-color: #d1fae5; color: #065f46; }
          .print-btn { display: block; width: fit-content; margin: 20px auto 0 auto; padding: 10px 20px; background-color: #059669; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="logo">🌾 Krishi Saathi</div>
            <div class="title">
              <h1>INVOICE</h1>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Order #${order.id}</p>
            </div>
          </div>
          <div class="meta-info">
            <div class="meta-block">
              <h3>Billed To (Buyer)</h3>
              <p><strong>${order.buyer_name || order.buyerName}</strong></p>
              <p>Delivery: ${order.delivery_address || order.deliveryAddress || "APMC Market Yard"}</p>
              <p>Date: ${new Date(order.created_at || order.createdAt).toLocaleString("en-IN")}</p>
            </div>
            <div class="meta-block" style="text-align: right;">
              <h3>Payment Status</h3>
              <p><span class="badge">Successful</span></p>
              <p><strong>Method:</strong> UPI</p>
              <p><strong>Txn ID:</strong> ${payment.transaction_id || payment.transactionId || "N/A"}</p>
            </div>
          </div>
          <table class="invoice-table">
            <thead>
              <tr><th>Description</th><th style="text-align: right;">Amount</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.item_title || order.itemTitle || "Agri Product / Crop"} (${order.type === 'crop' ? 'Direct Crop Trade' : 'Agriculture Supply Product'})</td>
                <td style="text-align: right;">₹${order.subtotal || order.totalPrice}</td>
              </tr>
            </tbody>
          </table>
          <div class="totals">
            <table class="totals-table">
              <tr><td>Subtotal:</td><td style="text-align: right;">₹${order.subtotal || order.totalPrice}</td></tr>
              <tr><td>GST (5%):</td><td style="text-align: right;">₹${tax}</td></tr>
              <tr><td>Delivery:</td><td style="text-align: right;">₹${delivery}</td></tr>
              <tr><td>Discount:</td><td style="text-align: right; color: #dc2626;">-₹${discount}</td></tr>
              <tr class="grand-total"><td>Grand Total:</td><td style="text-align: right;">₹${grandTotal}</td></tr>
            </table>
          </div>
          <div class="footer">
            <p>Thank you for trading through Krishi Saathi Platform. Digitally verified secure tax invoice.</p>
          </div>
          <button class="print-btn" onclick="window.print()">Print or Download Invoice (PDF)</button>
        </div>
      </body>
      </html>
      `;
      res.send(html);
    } catch (err) {
      next(err);
    }
  }
}
