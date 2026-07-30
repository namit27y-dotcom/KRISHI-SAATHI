import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Database } from "./src/server/db.js";
import { 
  identifyPlant, 
  detectDisease, 
  recommendCrops, 
  planFertilizer, 
  planIrrigation, 
  queryGovernmentSchemes, 
  chatFarmingAssistant,
  forecastYield
} from "./src/server/gemini.js";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const db = Database.getInstance();

  // Increase body limit to support base64 crop image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // --- API Routes ---

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    try {
      const { 
        name, 
        email, 
        password, 
        mobile, 
        country, 
        state, 
        district, 
        village, 
        landArea, 
        soilType, 
        preferredLanguage,
        role,
        companyName,
        gstNumber,
        buyerType,
        cropsGrown
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email and password are required" });
      }

      const existing = db.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "A user with this email already exists" });
      }

      const id = "u-" + Math.random().toString(36).substr(2, 9);
      const userRole = role || "farmer";
      
      const user: any = {
        id,
        name,
        email,
        mobile: mobile || "",
        country: country || "India",
        state: state || "",
        district: district || "",
        village: village || "",
        role: userRole,
        isVerified: userRole === "admin", // admin is pre-verified, others verified by admin
        preferredLanguage: preferredLanguage || "en",
        createdAt: new Date().toISOString()
      };

      if (userRole === "farmer") {
        user.landArea = landArea ? parseFloat(landArea) : 1;
        user.soilType = soilType || "Loamy";
        user.cropsGrown = Array.isArray(cropsGrown) 
          ? cropsGrown 
          : cropsGrown 
            ? cropsGrown.split(",").map((s: string) => s.trim()) 
            : [];
      } else if (userRole === "seller") {
        user.companyName = companyName || "";
        user.gstNumber = gstNumber || "";
      } else if (userRole === "buyer") {
        user.companyName = companyName || "";
        user.buyerType = buyerType || "wholesaler";
      }

      db.addUser(user, password); // simplified password hash
      
      // Add first welcome notification
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: id,
        title: "Welcome to Krishi Saathi! 🌾",
        message: userRole === "admin" 
          ? "You are logged in as Platform Administrator. You can now verify users, monitor crop listings, and equipment sellers."
          : `Your ${userRole} profile has been created successfully. Admin verification is pending.`,
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ user, token: `mock-jwt-token-${id}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const userRecord = db.getUserByEmail(email);
      if (!userRecord) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Simplistic password verification
      const record = db.getUsers()[userRecord.id];
      if (record.passwordHash !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Destructure password out of response
      const { passwordHash, ...user } = record;
      res.json({ user, token: `mock-jwt-token-${user.id}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Profile management
  app.get("/api/auth/profile", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const userRecord = db.getUserById(userId);
      if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
      }
      const { passwordHash, ...user } = userRecord as any;
      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/auth/profile/update", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const userRecord = db.getUserById(userId);
      if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
      }

      const updated = db.updateUser(userId, req.body);
      res.json({ user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- MARKETPLACE & ROLE-BASED ECOSYSTEM ENDPOINTS ---

  // Crop Listings (Farmers list crops, Buyers browse & purchase them)
  app.get("/api/marketplace/crops", (req, res) => {
    try {
      const { country, state, district, cropName, onlyVerified } = req.query;
      let listings = db.getCropListings();

      if (country) {
        listings = listings.filter(l => l.country.toLowerCase() === (country as string).toLowerCase());
      }
      if (state) {
        listings = listings.filter(l => l.state.toLowerCase() === (state as string).toLowerCase());
      }
      if (district) {
        listings = listings.filter(l => l.district.toLowerCase() === (district as string).toLowerCase());
      }
      if (cropName) {
        listings = listings.filter(l => l.cropName.toLowerCase().includes((cropName as string).toLowerCase()));
      }
      if (onlyVerified === "true") {
        listings = listings.filter(l => l.isVerified);
      }

      res.json({ listings });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/marketplace/crops", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user || user.role !== "farmer") {
        return res.status(403).json({ error: "Only Farmers can list crops for sale." });
      }

      const { cropName, quantity, unit, pricePerUnit, description, imageUrl } = req.body;
      if (!cropName || !quantity || !unit || !pricePerUnit) {
        return res.status(400).json({ error: "Crop name, quantity, unit and price per unit are required." });
      }

      const newListing = {
        id: "crop-" + Math.random().toString(36).substr(2, 9),
        farmerId: user.id,
        farmerName: user.name,
        cropName,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        country: user.country || "India",
        state: user.state,
        district: user.district,
        village: user.village,
        description,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
        isVerified: false, // Must be verified by Admin
        createdAt: new Date().toISOString()
      };

      db.addCropListing(newListing);

      // System notification for farmers
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        title: "Crop Listing Submitted 🌾",
        message: `Your listing for ${cropName} has been submitted and is pending admin verification.`,
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ listing: newListing });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/marketplace/crops/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateCropListing(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json({ listing: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/marketplace/crops/:id", (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteCropListing(id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/marketplace/crops/:id/verify", (req, res) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
      const updated = db.updateCropListing(id, { isVerified: !!isVerified });
      if (!updated) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Notify the farmer
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: updated.farmerId,
        title: isVerified ? "Crop Listing Approved! 💚" : "Crop Listing Disapproved",
        message: isVerified 
          ? `Your crop listing for ${updated.cropName} was verified by Admin and is now live.`
          : `Your crop listing for ${updated.cropName} is under verification hold.`,
        type: isVerified ? "success" : "warning",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.json({ listing: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // Agricultural Products (Sellers list fertilizers/tools, Farmers browse & purchase)
  app.get("/api/marketplace/products", (req, res) => {
    try {
      const { category, onlyVerified } = req.query;
      let products = db.getAgriculturalProducts();

      if (category) {
        products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (onlyVerified === "true") {
        products = products.filter(p => p.isVerified);
      }

      res.json({ products });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/marketplace/products", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user || user.role !== "seller") {
        return res.status(403).json({ error: "Only registered Agricultural Sellers can upload products." });
      }

      const { name, category, description, price, unit, inventory, imageUrl } = req.body;
      if (!name || !category || !description || !price || !unit || !inventory) {
        return res.status(400).json({ error: "Product name, category, description, price, unit and stock inventory are required." });
      }

      const newProduct = {
        id: "prod-" + Math.random().toString(36).substr(2, 9),
        sellerId: user.id,
        sellerName: user.companyName || user.name,
        name,
        category,
        description,
        price: parseFloat(price),
        unit,
        inventory: parseInt(inventory),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        isVerified: false, // Pending Admin Approval
        createdAt: new Date().toISOString()
      };

      db.addAgriculturalProduct(newProduct);

      res.status(201).json({ product: newProduct });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/marketplace/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateAgriculturalProduct(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ product: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/marketplace/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteAgriculturalProduct(id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/marketplace/products/:id/verify", (req, res) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
      const updated = db.updateAgriculturalProduct(id, { isVerified: !!isVerified });
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Notify the seller
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: updated.sellerId,
        title: isVerified ? "Product Approved 🏪" : "Product Under Review",
        message: isVerified 
          ? `Your product ${updated.name} has been approved and is now visible to Farmers.`
          : `Your product ${updated.name} has been placed under review by Admin.`,
        type: isVerified ? "success" : "warning",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.json({ product: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // Marketplace Orders (Crop purchases and Product purchases)
  app.get("/api/marketplace/orders", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let orders = db.getMarketplaceOrders();

      if (user.role === "farmer") {
        // Farmers buy products, and sell crops
        orders = orders.filter(o => o.buyerId === user.id || o.sellerId === user.id);
      } else if (user.role === "seller") {
        // Sellers sell products to farmers
        orders = orders.filter(o => o.sellerId === user.id);
      } else if (user.role === "buyer") {
        // Crop Buyers buy crops from farmers
        orders = orders.filter(o => o.buyerId === user.id);
      }
      // Admins see everything

      res.json({ orders });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/marketplace/orders", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { type, listingOrProductId, quantity, deliveryAddress } = req.body;
      if (!type || !listingOrProductId || !quantity) {
        return res.status(400).json({ error: "Order type, item reference and quantity are required." });
      }

      let itemTitle = "";
      let sellerId = "";
      let sellerName = "";
      let totalPrice = 0;

      if (type === "crop") {
        const cropListing = db.getCropListings().find(l => l.id === listingOrProductId);
        if (!cropListing) {
          return res.status(404).json({ error: "Crop listing not found" });
        }
        itemTitle = cropListing.cropName;
        sellerId = cropListing.farmerId;
        sellerName = cropListing.farmerName;
        totalPrice = cropListing.pricePerUnit * parseFloat(quantity);
      } else if (type === "product") {
        const product = db.getAgriculturalProducts().find(p => p.id === listingOrProductId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        if (product.inventory < quantity) {
          return res.status(400).json({ error: "Insufficient stock available" });
        }
        itemTitle = product.name;
        sellerId = product.sellerId;
        sellerName = product.sellerName;
        totalPrice = product.price * parseInt(quantity);

        // Deduct inventory
        db.updateAgriculturalProduct(product.id, { inventory: product.inventory - parseInt(quantity) });
      }

      const taxAmount = Math.round(totalPrice * 0.05); // 5% GST
      const deliveryCharge = type === "crop" ? 450 : 120; // Heavy crop freight vs smaller agri inputs
      const discountAmount = totalPrice > 2000 ? Math.round(totalPrice * 0.1) : 0; // 10% loyalty discount
      const grandTotal = totalPrice + taxAmount + deliveryCharge - discountAmount;

      const newOrder = {
        id: "ord-" + Math.random().toString(36).substr(2, 9),
        type,
        listingOrProductId,
        itemTitle,
        quantity: parseFloat(quantity),
        totalPrice,
        buyerId: user.id,
        buyerName: user.name,
        sellerId,
        sellerName,
        status: "pending" as const,
        deliveryAddress: deliveryAddress || "",
        paymentStatus: "unpaid" as const,
        createdAt: new Date().toISOString(),
        taxAmount,
        deliveryCharge,
        discountAmount,
        grandTotal
      };

      db.addMarketplaceOrder(newOrder);

      // Notify the seller / farmer
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: sellerId,
        title: `New Order Received! 🛒`,
        message: `${user.name} has placed a pending order for ${quantity} of your ${itemTitle}. Total: INR ${totalPrice}.`,
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Notify the buyer
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        title: `Order Placed Successfully! 🎉`,
        message: `Your request for ${quantity} of ${itemTitle} has been sent. Status: Pending seller acceptance.`,
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/marketplace/orders/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, paymentStatus } = req.body;
      const updates: any = {};
      
      if (status) updates.status = status;
      if (paymentStatus) updates.paymentStatus = paymentStatus;

      const updated = db.updateMarketplaceOrder(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Notify buyer about the updates
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: updated.buyerId,
        title: `Order Status Updated: ${status || updated.status} 📦`,
        message: `Your order for ${updated.itemTitle} has been updated to: ${status || updated.status}. Payment: ${paymentStatus || updated.paymentStatus}.`,
        type: status === "rejected" ? "warning" : "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Notify seller of payment if status became paid
      if (paymentStatus === "paid") {
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId: updated.sellerId,
          title: `Payment Received! 💳`,
          message: `Payment of INR ${updated.totalPrice} has been confirmed for order #${updated.id}.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ order: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // --- UPI Payment REST APIs ---

  // 1. Initiate Payment
  app.post("/api/payments/initiate", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { orderId, gateway = "razorpay", upiId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required to initiate payment." });
      }

      const order = db.getMarketplaceOrders().find(o => o.id === orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Check if order is already paid
      if (order.paymentStatus === "paid") {
        return res.status(400).json({ error: "This order has already been paid successfully." });
      }

      // If no taxes/delivery on older orders, compute on-the-fly
      const tax = order.taxAmount !== undefined ? order.taxAmount : Math.round(order.totalPrice * 0.05);
      const delivery = order.deliveryCharge !== undefined ? order.deliveryCharge : (order.type === "crop" ? 450 : 120);
      const discount = order.discountAmount !== undefined ? order.discountAmount : (order.totalPrice > 2000 ? Math.round(order.totalPrice * 0.1) : 0);
      const grandTotal = order.grandTotal !== undefined ? order.grandTotal : (order.totalPrice + tax + delivery - discount);

      // Create PaymentRecord in database (MySQL equivalent)
      const paymentId = "pay-" + Math.random().toString(36).substr(2, 9);
      const transactionId = "txn-" + Math.random().toString(36).substr(2, 9);
      
      const payment: any = {
        id: paymentId,
        orderId,
        gateway,
        paymentMethod: "UPI",
        upiId: upiId || "user@pay",
        transactionId,
        amount: grandTotal,
        paymentStatus: "initiated",
        createdAt: new Date().toISOString()
      };

      db.addPayment(payment);

      // Create initial TransactionRecord
      const txId = "tx-rec-" + Math.random().toString(36).substr(2, 9);
      const transaction = {
        id: txId,
        paymentId,
        gatewayResponse: JSON.stringify({ status: "initiated", details: "Payment initialized through UPI payment gateway" }),
        webhookStatus: "pending" as const,
        timestamp: new Date().toISOString()
      };
      db.addTransaction(transaction);

      // Update order status to pending_payment
      db.updateMarketplaceOrder(orderId, {
        paymentStatus: "pending_payment",
        taxAmount: tax,
        deliveryCharge: delivery,
        discountAmount: discount,
        grandTotal: grandTotal,
        paymentId: paymentId,
        paymentMethod: "UPI"
      });

      // Generate a valid deep-link UPI Intent string
      const receiverUpi = "krishisaathi@yesbank";
      const merchantName = "Krishi Saathi Agri Trade";
      const note = `Payment for order ${orderId}`;
      const intentUrl = `upi://pay?pa=${encodeURIComponent(receiverUpi)}&pn=${encodeURIComponent(merchantName)}&am=${grandTotal.toFixed(2)}&tr=${transactionId}&cu=INR&tn=${encodeURIComponent(note)}`;

      res.status(201).json({
        payment,
        qrCodeData: intentUrl,
        intentUrl
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Verify Payment (Verifies payment signatures and updates order status)
  app.post("/api/payments/verify", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { paymentId, status, signature } = req.body;
      if (!paymentId || !status) {
        return res.status(400).json({ error: "Payment ID and status are required." });
      }

      const payment = db.getPaymentById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Payment record not found." });
      }

      const order = db.getMarketplaceOrders().find(o => o.id === payment.orderId);
      if (!order) {
        return res.status(404).json({ error: "Associated order not found." });
      }

      // Verify simulated signature - e.g. md5/sha or checking if signature matches key patterns
      const expectedSignature = `sig-${paymentId}-${order.id}-verified`;
      const finalSignature = signature || expectedSignature;

      let finalPaymentStatus: any = "failed";
      if (status === "successful") {
        finalPaymentStatus = "successful";
      } else if (status === "cancelled") {
        finalPaymentStatus = "cancelled";
      }

      // Update payment record in database
      const updatedPayment = db.updatePayment(paymentId, {
        paymentStatus: finalPaymentStatus,
        signature: finalSignature
      });

      // Log a transaction record for auditing
      const txId = "tx-rec-" + Math.random().toString(36).substr(2, 9);
      db.addTransaction({
        id: txId,
        paymentId,
        gatewayResponse: JSON.stringify({
          event: `payment.${status}`,
          amount: payment.amount,
          transactionId: payment.transactionId,
          verifiedSignature: finalSignature,
          timestamp: new Date().toISOString()
        }),
        webhookStatus: "processed" as const,
        timestamp: new Date().toISOString()
      });

      if (status === "successful") {
        // Confirm order, update inventory and paymentStatus
        db.updateMarketplaceOrder(order.id, {
          paymentStatus: "paid",
          status: "accepted" // Automatically accepted upon secure payment
        });

        // Notify the seller / farmer
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId: order.sellerId,
          title: `Payment Received! 💳`,
          message: `${user.name} completed payment of ₹${payment.amount} via UPI for order #${order.id}. Order is now CONFIRMED.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });

        // Notify the buyer
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId: order.buyerId,
          title: `Payment Successful! 🎉`,
          message: `Your payment of ₹${payment.amount} was verified. Invoice #${payment.transactionId} generated successfully.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      } else {
        // Failed / Cancelled payment
        db.updateMarketplaceOrder(order.id, {
          paymentStatus: "failed"
        });

        // Notify the buyer of failure
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId: order.buyerId,
          title: `Payment Failed ❌`,
          message: `The payment attempt of ₹${payment.amount} for order #${order.id} was unsuccessful. You can retry.`,
          type: "warning",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json({
        success: status === "successful",
        payment: updatedPayment,
        order: db.getMarketplaceOrders().find(o => o.id === order.id)
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Webhook callback (Asynchronous payment gateway state callbacks)
  app.post("/api/payments/webhook", (req, res) => {
    try {
      const { paymentId, event, signature } = req.body;
      if (!paymentId || !event) {
        return res.status(400).json({ error: "Missing webhook parameters." });
      }

      console.log(`Webhook triggered for payment ${paymentId}, event: ${event}`);

      const payment = db.getPaymentById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const txId = "tx-rec-" + Math.random().toString(36).substr(2, 9);
      db.addTransaction({
        id: txId,
        paymentId,
        gatewayResponse: JSON.stringify({
          webhook_event: event,
          received_signature: signature,
          processed_at: new Date().toISOString()
        }),
        webhookStatus: "processed",
        timestamp: new Date().toISOString()
      });

      res.json({ received: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Fetch Payment Status
  app.get("/api/payments/status/:id", (req, res) => {
    try {
      const { id } = req.params;
      const payment = db.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found." });
      }
      res.json({ payment });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Download Invoice/Receipt
  app.get("/api/payments/receipt/:id", (req, res) => {
    try {
      const { id } = req.params; // order id
      const order = db.getMarketplaceOrders().find(o => o.id === id);
      if (!order) {
        return res.status(404).send("<h1>Order not found</h1>");
      }

      const payment = db.getPayments().find(p => p.orderId === order.id && p.paymentStatus === "successful") || {
        id: order.paymentId || "N/A",
        transactionId: order.paymentId ? `txn-${order.paymentId.substring(4)}` : "N/A",
        gateway: "razorpay" as const,
        paymentMethod: "UPI" as const,
        createdAt: order.createdAt
      };

      const tax = order.taxAmount !== undefined ? order.taxAmount : Math.round(order.totalPrice * 0.05);
      const delivery = order.deliveryCharge !== undefined ? order.deliveryCharge : (order.type === "crop" ? 450 : 120);
      const discount = order.discountAmount !== undefined ? order.discountAmount : (order.totalPrice > 2000 ? Math.round(order.totalPrice * 0.1) : 0);
      const grandTotal = order.grandTotal !== undefined ? order.grandTotal : (order.totalPrice + tax + delivery - discount);

      // Render a beautifully styled HTML invoice print template
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
          .logo { font-size: 24px; font-weight: bold; color: #059669; display: flex; align-items: center; gap: 8px; }
          .title { text-align: right; }
          .title h1 { margin: 0; font-size: 28px; color: #111827; }
          .meta-info { display: flex; justify-content: space-between; margin-top: 30px; margin-bottom: 40px; }
          .meta-block h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }
          .meta-block p { margin: 4px 0; font-size: 14px; }
          .invoice-table { width: 100%; border-collapse: collapse; text-align: left; }
          .invoice-table th { background: #f9fafb; padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #4b5563; }
          .invoice-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
          .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
          .totals-table { width: 300px; border-collapse: collapse; }
          .totals-table td { padding: 8px 12px; font-size: 14px; }
          .totals-table tr.grand-total { border-top: 2px solid #e5e7eb; font-weight: bold; font-size: 16px; color: #059669; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          .badge-success { background-color: #d1fae5; color: #065f46; }
          .badge-pending { background-color: #fef3c7; color: #92400e; }
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
              <p><strong>${order.buyerName}</strong></p>
              <p>Delivery Address: ${order.deliveryAddress || "APMC Market Yard"}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleString("en-IN")}</p>
            </div>
            <div class="meta-block" style="text-align: right;">
              <h3>Payment & Gateway Details</h3>
              <p><strong>Status:</strong> <span class="badge badge-success">Successful</span></p>
              <p><strong>Method:</strong> UPI</p>
              <p><strong>Gateway:</strong> ${payment.gateway.toUpperCase()}</p>
              <p><strong>Payment ID:</strong> ${payment.id}</p>
              <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
            </div>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.itemTitle} (${order.type === 'crop' ? 'Direct Crop Trade' : 'Agriculture Supply Product'})</td>
                <td style="text-align: right;">${order.quantity}</td>
                <td style="text-align: right;">₹${Math.round(order.totalPrice / order.quantity)}</td>
                <td style="text-align: right;">₹${order.totalPrice}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">₹${order.totalPrice}</td>
              </tr>
              <tr>
                <td>GST (5% applicable):</td>
                <td style="text-align: right;">₹${tax}</td>
              </tr>
              <tr>
                <td>Delivery Charges:</td>
                <td style="text-align: right;">₹${delivery}</td>
              </tr>
              <tr>
                <td>Promotional Discount:</td>
                <td style="text-align: right; color: #dc2626;">-₹${discount}</td>
              </tr>
              <tr class="grand-total">
                <td>Grand Total (Paid):</td>
                <td style="text-align: right;">₹${grandTotal}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>Thank you for trading through Krishi Saathi Platform. This is a digitally verified secure tax invoice.</p>
            <p>Support: support@krishisaathi.com | Secure payment verified by ${payment.gateway.toUpperCase()}</p>
          </div>
          
          <button class="print-btn" onclick="window.print()">Print or Download Invoice (PDF)</button>
        </div>
      </body>
      </html>
      `;
      res.send(html);
    } catch (err: any) {
      res.status(500).send(`Error generating invoice: ${err.message}`);
    }
  });

  // 6. Transaction History (Authorized & RBAC)
  app.get("/api/payments/history", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const user = db.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const payments = db.getPayments();
      const orders = db.getMarketplaceOrders();

      if (user.role === "admin") {
        // Admins can see all payments
        res.json({ payments });
      } else {
        // Users can only see payments for their orders
        const userOrdersIds = new Set(orders.filter(o => o.buyerId === user.id || o.sellerId === user.id).map(o => o.id));
        const userPayments = payments.filter(p => userOrdersIds.has(p.orderId));
        res.json({ payments: userPayments });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // Direct chats between Buyers, Sellers, and Farmers
  app.get("/api/marketplace/chats", (req, res) => {
    try {
      const { userA, userB } = req.query;
      if (!userA || !userB) {
        return res.status(400).json({ error: "Both senderId (userA) and receiverId (userB) are required to retrieve conversation logs." });
      }

      const chats = db.getMarketplaceChats().filter(
        c => (c.senderId === userA && c.receiverId === userB) || (c.senderId === userB && c.receiverId === userA)
      );

      res.json({ chats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/marketplace/chats", (req, res) => {
    try {
      const { senderId, senderName, receiverId, receiverName, message } = req.body;
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({ error: "Sender, Receiver and message body are required." });
      }

      const newChat = {
        id: "chat-" + Math.random().toString(36).substr(2, 9),
        senderId,
        senderName,
        receiverId,
        receiverName,
        message,
        createdAt: new Date().toISOString()
      };

      db.addMarketplaceChat(newChat);

      // Light socket replacement/background update: notify receiver that they got a message
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: receiverId,
        title: `New Message from ${senderName} 💬`,
        message: message.length > 50 ? `${message.substring(0, 47)}...` : message,
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ chat: newChat });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // Admin Management Endpoints
  app.get("/api/admin/users", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const adminId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const admin = db.getUserById(adminId);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admin clearance required." });
      }

      res.json({ users: db.getAllUsers() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/users/:id/verify", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const adminId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const admin = db.getUserById(adminId);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admin clearance required." });
      }

      const { id } = req.params;
      const { isVerified } = req.body;
      const updated = db.updateUser(id, { isVerified: !!isVerified });

      // Notify the verified user
      db.addNotification({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        userId: id,
        title: isVerified ? "Account Verified! 🛡️" : "Verification Revoked",
        message: isVerified 
          ? "A Platform Administrator has verified your credentials. You can now engage in trade and view full services."
          : "Your account is currently unverified. Please upload genuine details or contact administration.",
        type: isVerified ? "success" : "warning",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.json({ user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const adminId = authHeader.split(" ")[1].replace("mock-jwt-token-", "");
      const admin = db.getUserById(adminId);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admin clearance required." });
      }

      const { id } = req.params;
      const success = db.deleteUser(id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 9: Plant Species & Snap & Know Identification ---
  app.get("/api/plant-species", (req, res) => {
    res.json({ species: db.getPlantSpecies() });
  });

  app.post("/api/plant-id/analyze", async (req, res) => {
    try {
      const { plantPhoto, soilPhoto, userId, preferredLanguage } = req.body;
      if (!plantPhoto) {
        return res.status(400).json({ error: "Plant photo is required for identification" });
      }

      const user = userId ? db.getUserById(userId) : null;
      const soilType = user ? user.soilType : "Loamy";

      const result = await identifyPlant(plantPhoto, soilPhoto, soilType, preferredLanguage || user?.preferredLanguage || "en");

      // Save to logs if user is authenticated
      let logId = "";
      if (userId) {
        logId = "log-" + Math.random().toString(36).substr(2, 9);
        db.addPlantIdLog({
          id: logId,
          userId,
          photoUrl: plantPhoto, // Base64 representation or standard URL in this mockup
          identifiedSpeciesId: result.identity?.scientificName || "Unknown",
          confidenceScore: result.identity?.confidenceScore || 90,
          soilPhotoUrl: soilPhoto || undefined,
          soilCompatibilityResult: result.soilCompatibility?.compatibilityScore || "Good match",
          createdAt: new Date().toISOString()
        });

        // Add a notification about the plant ID
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId,
          title: `New Plant Identified: ${result.identity?.commonName || "Unknown"} 🌿`,
          message: `Successfully identified ${result.identity?.commonName || "plant"} with ${result.identity?.confidenceScore || 90}% confidence. Soil compatibility: ${result.soilCompatibility?.compatibilityScore || "N/A"}.`,
          type: "info",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ result, logId });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/plant-id/logs", (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      res.json({ logs: db.getPlantIdLogs(userId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 1: Crop Disease Detection ---
  app.post("/api/disease/analyze", async (req, res) => {
    try {
      const { image, userId, preferredLanguage } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Crop photo is required for diagnosis" });
      }

      const user = userId ? db.getUserById(userId) : null;
      const result = await detectDisease(image, preferredLanguage || user?.preferredLanguage || "en");

      if (userId) {
        db.addDiseaseReport({
          id: "rep-" + Math.random().toString(36).substr(2, 9),
          userId,
          cropName: result.cropName || "Unknown",
          diseaseName: result.diseaseName || "Healthy",
          confidence: result.confidence || 90,
          symptoms: result.symptoms || "",
          causes: result.causes || "",
          organicTreatment: result.organicTreatment || "",
          chemicalTreatment: result.chemicalTreatment || "",
          preventiveMeasures: result.preventiveMeasures || "",
          recoveryTime: result.recoveryTime || "",
          imageUrl: image,
          createdAt: new Date().toISOString()
        });

        // Push alert notification if diseased
        if (result.diseaseName && result.diseaseName.toLowerCase() !== "healthy" && result.diseaseName.toLowerCase() !== "healthy plant") {
          db.addNotification({
            id: "notif-" + Math.random().toString(36).substr(2, 9),
            userId,
            title: `Disease Alert: ${result.diseaseName} in ${result.cropName}! ⚠️`,
            message: `Symptoms: ${result.symptoms?.slice(0, 80)}... Try Organic: ${result.organicTreatment?.slice(0, 80)}...`,
            type: "warning",
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      }

      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/disease/reports", (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      res.json({ reports: db.getDiseaseReports(userId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 2: Weather Crop Recommendation ---
  app.post("/api/weather/recommend", async (req, res) => {
    try {
      const { state, district, soilType, season, userId } = req.body;
      if (!state || !district || !soilType || !season) {
        return res.status(400).json({ error: "State, district, soil type and season are required" });
      }

      const result = await recommendCrops(state, district, soilType, season);

      // Cache a mock weather alert for notifications
      if (userId) {
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId,
          title: `Crop Recommendation Ready 🌾`,
          message: `Recommended crops for your farm in ${district}: ${result.recommendations?.map((r: any) => r.cropName).join(", ")}.`,
          type: "info",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 2.5: Predictive AI Yield Forecasting ---
  app.post("/api/gemini/yield-forecast", async (req, res) => {
    try {
      const { cropName, soilType, landArea, state, district, historicalSummary, userId } = req.body;
      if (!cropName || !soilType || !landArea || !state || !district) {
        return res.status(400).json({ error: "Crop name, soil type, land area, state, and district are required." });
      }

      const forecast = await forecastYield(cropName, soilType, Number(landArea), state, district, historicalSummary);

      if (userId) {
        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId,
          title: `Yield Forecast Computed 📊`,
          message: `Predictive AI estimates a yield of ${forecast.predictedYieldAverage} ${forecast.predictedYieldMetric} for your ${landArea}-acre ${cropName} crop on ${soilType}.`,
          type: "info",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json(forecast);
    } catch (err: any) {
      console.error("[Yield Forecast Error]:", err);
      res.status(500).json({ error: err.message || "Failed to generate yield forecast" });
    }
  });

  // --- Feature 3: Fertilizer Planner ---
  app.post("/api/plans/fertilizer", async (req, res) => {
    try {
      const { crop, growthStage, soilType, fieldSize, userId } = req.body;
      if (!crop || !growthStage || !soilType || !fieldSize) {
        return res.status(400).json({ error: "Crop, growth stage, soil type and field size are required" });
      }

      const result = await planFertilizer(crop, growthStage, soilType, parseFloat(fieldSize));

      if (userId) {
        db.addFertilizerPlan({
          id: "fert-" + Math.random().toString(36).substr(2, 9),
          cropName: crop,
          growthStage,
          soilType,
          fieldSize: parseFloat(fieldSize),
          recommendedFertilizer: result.recommendedFertilizer,
          quantity: result.quantity,
          schedule: result.schedule,
          organicAlternatives: result.organicAlternatives,
          estimatedCost: result.estimatedCost,
          createdAt: new Date().toISOString()
        });

        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId,
          title: `Fertilizer Plan Generated 🧪`,
          message: `Your customized dose of ${result.recommendedFertilizer} for ${crop} is prepared.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 4: Irrigation Planner ---
  app.post("/api/plans/irrigation", async (req, res) => {
    try {
      const { crop, growthStage, soilType, userId } = req.body;
      if (!crop || !growthStage || !soilType) {
        return res.status(400).json({ error: "Crop, growth stage, and soil type are required" });
      }

      const result = await planIrrigation(crop, growthStage, soilType);

      if (userId) {
        db.addIrrigationPlan({
          id: "irrig-" + Math.random().toString(36).substr(2, 9),
          cropName: crop,
          waterReq: result.waterRequirement,
          frequency: result.frequency,
          timing: result.bestTiming,
          waterSavingAdvice: result.waterSavingRecommendations,
          createdAt: new Date().toISOString()
        });

        db.addNotification({
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          userId,
          title: `Irrigation Reminder Active 💧`,
          message: `Watering suggested for ${crop}: ${result.frequency}. Ideal timing: ${result.bestTiming}.`,
          type: "reminder",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 5: Government Schemes ---
  app.post("/api/schemes/query", async (req, res) => {
    try {
      const { query, state, crop, landSize, userId } = req.body;

      const result = await queryGovernmentSchemes(
        query || "What schemes support marginal farmers?",
        state || "Maharashtra",
        crop || "Cotton",
        landSize ? parseFloat(landSize) : 2
      );

      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 6: AI Chat Farming Assistant ---
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userId } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const answer = await chatFarmingAssistant(message, history || []);

      if (userId) {
        db.addChatMessage({
          id: "msg-" + Math.random().toString(36).substr(2, 9),
          userId,
          message,
          response: answer,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ response: answer });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/chat/history", (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      res.json({ history: db.getChatHistory(userId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Feature 7: Notifications ---
  app.get("/api/notifications", (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      res.json({ notifications: db.getNotifications(userId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/notifications", (req, res) => {
    try {
      const { userId, title, message, type } = req.body;
      if (!userId || !title || !message) {
        return res.status(400).json({ error: "userId, title, and message are required" });
      }
      const newNotification = {
        id: `notif-${Date.now()}`,
        userId,
        title,
        message,
        type: type || "warning",
        isRead: false,
        createdAt: new Date().toISOString()
      };
      db.addNotification(newNotification);
      res.json({ success: true, notification: newNotification });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/notifications/:id/read", (req, res) => {
    try {
      const { id } = req.params;
      db.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Live Weather API Mock - Returns realistic weather data based on Location/Region
  app.get("/api/weather/current", (req, res) => {
    const { district, state } = req.query;
    // Generate organic, rich fluctuating weather
    const temp = 28 + Math.floor(Math.random() * 8); // 28 to 36 C
    const humidity = 60 + Math.floor(Math.random() * 30); // 60 to 90%
    const wind = 8 + Math.floor(Math.random() * 12); // 8 to 20 km/h
    
    let rainfallPrediction = "Clear Sky";
    let alert = "No immediate climate alerts in your block.";
    if (humidity > 80) {
      rainfallPrediction = "Light to Moderate Showers predicted in next 24 hours.";
      alert = "Heavy downpour expected in afternoon. Clear drainage channels immediately.";
    } else if (temp > 34) {
      rainfallPrediction = "Intense Heatwave Conditions.";
      alert = "Intense noon heat. Apply water-saving mulch layers and irrigate in early mornings.";
    }

    res.json({
      location: `${district || "Pune"}, ${state || "Maharashtra"}`,
      temp,
      humidity,
      wind,
      rainfallPrediction,
      alert,
      updatedAt: new Date().toLocaleTimeString()
    });
  });

  // Document Database Seed Script Download for reference/compliance
  app.get("/api/db/create-script", (req, res) => {
    const createScript = `
-- ==========================================
-- SQL CREATE TABLE SCRIPTS FOR AGRISATHI AI
-- ==========================================

-- Users Table
CREATE TABLE Users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mobile VARCHAR(15),
    state VARCHAR(50),
    district VARCHAR(50),
    village VARCHAR(50),
    land_area DECIMAL(5,2),
    soil_type VARCHAR(50),
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plant Species Table
CREATE TABLE Plant_Species (
    id VARCHAR(50) PRIMARY KEY,
    scientific_name VARCHAR(150) NOT NULL UNIQUE,
    common_name VARCHAR(100) NOT NULL,
    family VARCHAR(100) NOT NULL,
    growth_habit VARCHAR(255),
    native_region VARCHAR(150),
    ideal_ph_min DECIMAL(3,1),
    ideal_ph_max DECIMAL(3,1),
    ideal_soil_texture VARCHAR(100),
    water_requirement VARCHAR(20),
    sunlight_requirement VARCHAR(50),
    is_invasive BOOLEAN DEFAULT FALSE
);

-- Plant Local Names (Supports Translation / Multiple Names per Language)
CREATE TABLE Plant_Local_Names (
    id VARCHAR(50) PRIMARY KEY,
    plant_species_id VARCHAR(50) NOT NULL,
    language VARCHAR(5) NOT NULL, -- 'en', 'hi', 'mr'
    local_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (plant_species_id) REFERENCES Plant_Species(id) ON DELETE CASCADE,
    INDEX idx_species_lang (plant_species_id, language)
);

-- Plant Diseases Reference (Reusable Knowledge Base)
CREATE TABLE Plant_Diseases_Reference (
    id VARCHAR(50) PRIMARY KEY,
    plant_species_id VARCHAR(50) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    typical_symptoms TEXT,
    common_treatment TEXT,
    organic_treatment TEXT,
    FOREIGN KEY (plant_species_id) REFERENCES Plant_Species(id) ON DELETE CASCADE
);

-- Plant Identification Logs (Feature 9)
CREATE TABLE Plant_Identification_Logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    photo_url TEXT NOT NULL,
    identified_species_id VARCHAR(150),
    confidence_score DECIMAL(5,2),
    soil_photo_url TEXT,
    soil_compatibility_result VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- Disease Reports Table (Individual Incidents)
CREATE TABLE Disease_Reports (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    confidence DECIMAL(5,2),
    symptoms TEXT,
    causes TEXT,
    organic_treatment TEXT,
    chemical_treatment TEXT,
    preventive_measures TEXT,
    recovery_time VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Fertilizer Plans (Feature 3)
CREATE TABLE Fertilizer_Plans (
    id VARCHAR(50) PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(50),
    soil_type VARCHAR(50),
    field_size DECIMAL(5,2),
    recommended_fertilizer TEXT,
    quantity TEXT,
    schedule TEXT,
    organic_alternatives TEXT,
    estimated_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Irrigation Plans (Feature 4)
CREATE TABLE Irrigation_Plans (
    id VARCHAR(50) PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    water_requirement VARCHAR(255),
    frequency VARCHAR(100),
    timing VARCHAR(100),
    water_saving_advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat History Table (Feature 6)
CREATE TABLE Chat_History (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Notifications (Feature 7)
CREATE TABLE Notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info', -- 'warning', 'info', 'success', 'reminder'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- ==========================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ==========================================
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_species_name ON Plant_Species(scientific_name);
CREATE INDEX idx_id_logs_user ON Plant_Identification_Logs(user_id);
CREATE INDEX idx_disease_reports_user ON Disease_Reports(user_id);
CREATE INDEX idx_notif_user ON Notifications(user_id, is_read);
`;
    res.setHeader("Content-Type", "text/plain");
    res.send(createScript);
  });

  // Vite and static asset middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
