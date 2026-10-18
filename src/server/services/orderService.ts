import { dbConnection } from "../db/connection.js";

export class OrderService {
  public static async getOrders(user: any) {
    let sql = `SELECT * FROM orders WHERE 1=1`;
    const params: any[] = [];

    if (user.role === "farmer") {
      sql += ` AND (buyer_id = ? OR seller_id = ?)`;
      params.push(user.id, user.id);
    } else if (user.role === "seller") {
      sql += ` AND seller_id = ?`;
      params.push(user.id);
    } else if (user.role === "buyer") {
      sql += ` AND buyer_id = ?`;
      params.push(user.id);
    }
    // Admins see all orders

    sql += ` ORDER BY created_at DESC`;

    const rows = await dbConnection.query(sql, params);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        type: r.type,
        listingOrProductId: r.listing_or_product_id || r.id,
        itemTitle: r.item_title || "Item",
        quantity: Number(r.quantity || 1),
        totalPrice: Number(r.subtotal || r.total_price || 0),
        buyerId: r.buyer_id,
        buyerName: r.buyer_name,
        sellerId: r.seller_id,
        sellerName: r.seller_name,
        status: r.status,
        deliveryAddress: r.delivery_address,
        paymentStatus: r.payment_status,
        taxAmount: Number(r.tax_amount || 0),
        deliveryCharge: Number(r.delivery_charge || 0),
        discountAmount: Number(r.discount_amount || 0),
        grandTotal: Number(r.grand_total || 0),
        paymentId: r.payment_id,
        paymentMethod: r.payment_method,
        createdAt: r.created_at
      }));
    }

    // Fallback in-memory orders
    let list = dbConnection.getFallbackTable("marketplaceOrders");
    if (!list || list.length === 0) list = dbConnection.getFallbackTable("orders");

    if (user.role === "farmer") {
      list = list.filter(o => o.buyerId === user.id || o.sellerId === user.id || o.buyer_id === user.id || o.seller_id === user.id);
    } else if (user.role === "seller") {
      list = list.filter(o => o.sellerId === user.id || o.seller_id === user.id);
    } else if (user.role === "buyer") {
      list = list.filter(o => o.buyerId === user.id || o.buyer_id === user.id);
    }
    return list;
  }

  public static async createOrder(buyer: any, data: { type: "crop" | "product"; listingOrProductId: string; quantity: number; deliveryAddress?: string; paymentMethod?: string }) {
    const { type, listingOrProductId, quantity, deliveryAddress = "APMC Market Yard", paymentMethod = "UPI" } = data;

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    return await dbConnection.withTransaction(async (conn) => {
      let itemTitle = "";
      let sellerId = "";
      let sellerName = "";
      let unitPrice = 0;
      let totalPrice = 0;

      if (type === "crop") {
        // Crop Listing order
        let cropListing: any = null;
        if (conn) {
          const [rows]: any = await conn.query(`SELECT * FROM crop_listings WHERE id = ? FOR UPDATE`, [listingOrProductId]);
          cropListing = rows && rows.length > 0 ? rows[0] : null;
        } else {
          const fallbackList = dbConnection.getFallbackTable("crop_listings");
          cropListing = fallbackList.find(c => c.id === listingOrProductId);
        }

        if (!cropListing) {
          throw new Error("Crop listing not found.");
        }

        const availableQty = Number(cropListing.quantity);
        if (availableQty < quantity) {
          throw new Error(`Insufficient quantity available. Requested: ${quantity}, Available: ${availableQty}`);
        }

        itemTitle = cropListing.crop_name || cropListing.cropName;
        sellerId = cropListing.farmer_id || cropListing.farmerId;
        sellerName = cropListing.farmer_name || cropListing.farmerName;
        unitPrice = Number(cropListing.price_per_unit || cropListing.pricePerUnit);
        totalPrice = unitPrice * quantity;

        // Decrease crop listing quantity atomically
        const remainingQty = availableQty - quantity;
        if (conn) {
          await conn.query(`UPDATE crop_listings SET quantity = ? WHERE id = ?`, [remainingQty, cropListing.id]);
        } else {
          cropListing.quantity = remainingQty;
          dbConnection.saveFallback();
        }

      } else if (type === "product") {
        // Agricultural Product order
        let product: any = null;
        if (conn) {
          const [rows]: any = await conn.query(`SELECT * FROM agricultural_products WHERE id = ? FOR UPDATE`, [listingOrProductId]);
          product = rows && rows.length > 0 ? rows[0] : null;
        } else {
          const fallbackList = dbConnection.getFallbackTable("agricultural_products");
          product = fallbackList.find(p => p.id === listingOrProductId);
        }

        if (!product) {
          throw new Error("Agricultural product not found.");
        }

        const currentStock = Number(product.inventory);
        if (currentStock < quantity) {
          throw new Error(`Insufficient inventory in stock. Requested: ${quantity}, In Stock: ${currentStock}`);
        }

        itemTitle = product.name;
        sellerId = product.seller_id || product.sellerId;
        sellerName = product.seller_name || product.sellerName;
        unitPrice = Number(product.price);
        totalPrice = unitPrice * quantity;

        // Deduct inventory atomically
        const newStock = currentStock - quantity;
        if (conn) {
          await conn.query(`UPDATE agricultural_products SET inventory = ? WHERE id = ?`, [newStock, product.id]);
        } else {
          product.inventory = newStock;
          dbConnection.saveFallback();
        }
      }

      // Calculations
      const taxAmount = Math.round(totalPrice * 0.05); // 5% GST
      const deliveryCharge = type === "crop" ? 450 : 120; // Freight
      const discountAmount = totalPrice > 2000 ? Math.round(totalPrice * 0.1) : 0; // 10% discount above ₹2000
      const grandTotal = totalPrice + taxAmount + deliveryCharge - discountAmount;
      const orderId = "ord-" + Math.random().toString(36).substring(2, 11);

      // Insert Order
      const insertOrderSql = `
        INSERT INTO orders (
          id, buyer_id, buyer_name, seller_id, seller_name, type, status,
          subtotal, tax_amount, delivery_charge, discount_amount, grand_total,
          payment_status, delivery_address, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const orderParams = [
        orderId, buyer.id, buyer.name, sellerId, sellerName, type, "pending",
        totalPrice, taxAmount, deliveryCharge, discountAmount, grandTotal,
        "unpaid", deliveryAddress, paymentMethod
      ];

      if (conn) {
        await conn.query(insertOrderSql, orderParams);
        // Insert order item
        const itemId = "item-" + Math.random().toString(36).substring(2, 11);
        await conn.query(
          `INSERT INTO order_items (id, order_id, item_type, item_id, item_title, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [itemId, orderId, type, listingOrProductId, itemTitle, quantity, unitPrice, totalPrice]
        );
      }

      const newOrder = {
        id: orderId,
        type,
        listingOrProductId,
        itemTitle,
        quantity,
        totalPrice,
        buyerId: buyer.id,
        buyerName: buyer.name,
        sellerId,
        sellerName,
        status: "pending" as const,
        deliveryAddress,
        paymentStatus: "unpaid" as const,
        taxAmount,
        deliveryCharge,
        discountAmount,
        grandTotal,
        paymentMethod,
        createdAt: new Date().toISOString()
      };

      // Notify Seller
      const notifSellerSql = `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`;
      const notifSellerParams = [
        "notif-" + Math.random().toString(36).substring(2, 11),
        sellerId,
        "New Order Received! 🛒",
        `${buyer.name} has placed a pending order for ${quantity} of your ${itemTitle}. Total: INR ${grandTotal}.`,
        "success",
        false
      ];

      // Notify Buyer
      const notifBuyerParams = [
        "notif-" + Math.random().toString(36).substring(2, 11),
        buyer.id,
        "Order Placed Successfully! 🎉",
        `Your request for ${quantity} of ${itemTitle} has been recorded. Grand Total: ₹${grandTotal}. Status: Pending.`,
        "info",
        false
      ];

      if (conn) {
        await conn.query(notifSellerSql, notifSellerParams);
        await conn.query(notifSellerSql, notifBuyerParams);
      } else {
        const orderTable = dbConnection.getFallbackTable("marketplaceOrders");
        orderTable.push(newOrder);
        dbConnection.saveFallback();
      }

      return newOrder;
    });
  }

  public static async updateOrderStatus(orderId: string, updates: { status?: string; paymentStatus?: string }) {
    const existing = await dbConnection.query(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    const order = existing && existing.length > 0 ? existing[0] : dbConnection.getFallbackTable("marketplaceOrders").find(x => x.id === orderId);
    if (!order) throw new Error("Order not found");

    const fields: string[] = [];
    const params: any[] = [];
    if (updates.status) { fields.push("status = ?"); params.push(updates.status); }
    if (updates.paymentStatus) { fields.push("payment_status = ?"); params.push(updates.paymentStatus); }

    if (fields.length > 0) {
      params.push(orderId);
      await dbConnection.execute(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, params);
    }

    const buyerId = order.buyer_id || order.buyerId;
    const sellerId = order.seller_id || order.sellerId;
    const itemTitle = order.item_title || order.itemTitle || "Ordered item";

    // Notify buyer
    await dbConnection.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "notif-" + Math.random().toString(36).substring(2, 11),
        buyerId,
        `Order Status Updated: ${updates.status || order.status} 📦`,
        `Your order for ${itemTitle} has been updated to: ${updates.status || order.status}. Payment: ${updates.paymentStatus || order.payment_status || order.paymentStatus}.`,
        updates.status === "rejected" ? "warning" : "success",
        false
      ]
    );

    // If marked paid, notify seller
    if (updates.paymentStatus === "paid") {
      await dbConnection.execute(
        `INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "notif-" + Math.random().toString(36).substring(2, 11),
          sellerId,
          "Payment Received! 💳",
          `Payment has been confirmed for order #${orderId}.`,
          "success",
          false
        ]
      );
    }

    const fallbackList = dbConnection.getFallbackTable("marketplaceOrders");
    const idx = fallbackList.findIndex(x => x.id === orderId);
    if (idx >= 0) {
      fallbackList[idx] = { ...fallbackList[idx], ...updates };
      dbConnection.saveFallback();
    }

    return { ...order, ...updates };
  }
}
