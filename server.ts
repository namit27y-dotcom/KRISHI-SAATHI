import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { ENV } from "./src/server/config/env.js";
import { dbConnection } from "./src/server/db/connection.js";
import { runMigrations } from "./src/server/db/migrations.js";
import { runSeed } from "./src/server/db/seed.js";
import apiRouter from "./src/server/routes/index.js";
import { errorHandler } from "./src/server/middleware/errorHandler.js";
import { apiLimiter } from "./src/server/middleware/rateLimiter.js";

// Ensure process working directory matches realpath for Vite dev server & bundling consistency
try {
  process.chdir(fs.realpathSync(process.cwd()));
} catch (_) {}

async function startServer() {
  console.log("[Server] Starting Krishi Saathi...");
  const app = express();
  const PORT = ENV.PORT;
  const httpServer = http.createServer(app);

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Vite inline scripts and dynamic images
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Setup
  app.use(
    cors({
      origin: ENV.CORS_ORIGIN === "*" ? true : ENV.CORS_ORIGIN.split(",").map(s => s.trim()),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );

  // Body Parsing with appropriate limits for image payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Initialize Database Connection & Migrations
  try {
    const isConnected = await dbConnection.connect();
    if (isConnected) {
      await runMigrations();
      await runSeed();
    } else {
      // Offline fallback initialization
      await runMigrations();
      await runSeed();
    }
  } catch (err: any) {
    console.error("[Server] Database initialization warning:", err.message || err);
  }

  // Rate Limiter for general API endpoints
  app.use("/api", apiLimiter);

  // Mount Master API Router
  app.use("/api", apiRouter);

  // Centralized Error Handler for API routes
  app.use(errorHandler);

  // Vite Development and Production Static Asset Serving
  if (ENV.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          // Share HTTP server for WebSocket HMR to prevent separate port conflicts (e.g. 24678)
          hmr: process.env.DISABLE_HMR === "true" ? false : { server: httpServer },
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (viteErr: any) {
      if (viteErr.code === "EADDRINUSE") {
        console.error(`\n❌ [Vite / WebSocket Error] Port conflict detected during Vite HMR initialization:`, viteErr.message);
        console.error(`💡 Tip: Another development instance may be running. Stop it or run with DISABLE_HMR=true.\n`);
      } else {
        console.error(`\n❌ [Vite Error] Failed to initialize Vite dev server:`, viteErr);
      }
      process.exit(1);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Graceful EADDRINUSE and server error handling
  httpServer.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ [Server Error] Port ${PORT} is already in use.`);
      console.error(`💡 Causes & Solutions:`);
      console.error(`   1. Another process or previous server instance is already running on port ${PORT}.`);
      console.error(`      To find and kill the process on Windows PowerShell:`);
      console.error(`        Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
      console.error(`   2. Or specify a different port in your .env file or command line:`);
      console.error(`        PORT=3001 npm run dev\n`);
      process.exit(1);
    } else {
      console.error(`\n❌ [Server Error] Fatal server failure:`, err.message || err);
      process.exit(1);
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    const dbStatus = dbConnection.getStatus();
    const storageMode = dbStatus.connected
      ? `Live MySQL Database (${ENV.DB_NAME} on ${ENV.DB_HOST}:${ENV.DB_PORT})`
      : `Persistent JSON Fallback Storage (data/db.json) [MySQL offline: ${dbStatus.error || "connection failed"}]`;

    console.log(`====================================================`);
    console.log(`🌾 Krishi Saathi Backend is running!`);
    console.log(`🚀 URL: http://localhost:${PORT}`);
    console.log(`🛡️ Environment: ${ENV.NODE_ENV}`);
    console.log(`🗄️ Storage Mode: ${storageMode}`);
    if (!dbStatus.connected) {
      console.log(`ℹ️ Notice: To use live MySQL, configure DB_USER and DB_PASSWORD in .env.`);
    }
    console.log(`====================================================`);
  });
}

startServer();
