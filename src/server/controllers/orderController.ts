import { Response, NextFunction } from "express";
import { OrderService } from "../services/orderService.js";
import { orderCreateSchema, orderUpdateSchema } from "../validators/marketplaceValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class OrderController {
  public static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const orders = await OrderService.getOrders(req.user);
      res.json({ success: true, orders });
    } catch (err) {
      next(err);
    }
  }

  public static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const validated = orderCreateSchema.parse(req.body);
      const order = await OrderService.createOrder(req.user, {
        type: validated.type,
        listingOrProductId: validated.listingOrProductId,
        quantity: validated.quantity,
        deliveryAddress: validated.deliveryAddress,
        paymentMethod: validated.paymentMethod
      });
      res.status(201).json({ success: true, order });
    } catch (err) {
      next(err);
    }
  }

  public static async updateOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const { id } = req.params;
      const validated = orderUpdateSchema.parse(req.body);
      const updated = await OrderService.updateOrderStatus(id, validated);
      res.json({ success: true, order: updated });
    } catch (err) {
      next(err);
    }
  }
}
