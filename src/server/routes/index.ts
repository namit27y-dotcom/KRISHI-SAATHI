import { Router } from "express";
import authRoutes from "./authRoutes.js";
import { userRoutes, adminRoutes } from "./userRoutes.js";
import marketplaceRoutes from "./marketplaceRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import locationRoutes from "./locationRoutes.js";
import academyRoutes from "./academyRoutes.js";
import aiRoutes from "./aiRoutes.js";
import healthRoutes from "./healthRoutes.js";
import fs from "fs";
import path from "path";

const router = Router();

// Modular Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/payments", paymentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/location", locationRoutes);
router.use("/academy", academyRoutes);
router.use("/health", healthRoutes);

// AI & Agronomy routes mounted directly under /api (maintains exact compatibility with existing frontend calls)
router.use("/", aiRoutes);

// DDL schema script download endpoint (preserves existing feature)
router.get("/db/create-script", (req, res) => {
  const schemaPath = path.join(process.cwd(), "src", "server", "db", "schema.sql");
  if (fs.existsSync(schemaPath)) {
    res.setHeader("Content-Type", "text/plain");
    res.send(fs.readFileSync(schemaPath, "utf-8"));
  } else {
    res.status(404).send("Schema file not found.");
  }
});

export default router;
