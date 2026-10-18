import { Router } from "express";
import { PaymentController } from "../controllers/paymentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/initiate", authenticateToken, PaymentController.initiate);
router.post("/verify", authenticateToken, PaymentController.verify);
router.post("/webhook", PaymentController.webhook);
router.get("/status/:id", PaymentController.getStatus);
router.get("/receipt/:id", PaymentController.getReceipt);
router.get("/history", authenticateToken, PaymentController.getHistory);

export default router;
