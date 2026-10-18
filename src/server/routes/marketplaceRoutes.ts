import { Router } from "express";
import { MarketplaceController } from "../controllers/marketplaceController.js";
import { OrderController } from "../controllers/orderController.js";
import { ChatController } from "../controllers/chatController.js";
import { authenticateToken, requireFarmer, requireSeller, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Crop Listings
router.get("/crops", MarketplaceController.getCrops);
router.post("/crops", authenticateToken, requireFarmer, MarketplaceController.createCrop);
router.put("/crops/:id", authenticateToken, MarketplaceController.updateCrop);
router.delete("/crops/:id", authenticateToken, MarketplaceController.deleteCrop);
router.put("/crops/:id/verify", authenticateToken, requireAdmin, MarketplaceController.verifyCrop);

// Agricultural Products
router.get("/products", MarketplaceController.getProducts);
router.post("/products", authenticateToken, requireSeller, MarketplaceController.createProduct);
router.put("/products/:id", authenticateToken, MarketplaceController.updateProduct);
router.delete("/products/:id", authenticateToken, MarketplaceController.deleteProduct);
router.put("/products/:id/verify", authenticateToken, requireAdmin, MarketplaceController.verifyProduct);

// Orders
router.get("/orders", authenticateToken, OrderController.getOrders);
router.post("/orders", authenticateToken, OrderController.createOrder);
router.put("/orders/:id", authenticateToken, OrderController.updateOrder);

// Direct Chats
router.get("/chats", ChatController.getChats);
router.post("/chats", ChatController.sendMessage);

export default router;
