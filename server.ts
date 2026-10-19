import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ENV } from "./src/server/config/env.js";
import { dbConnection } from "./src/server/db/connection.js";
import { app, initializeDatabase } from "./src/server/app.js";

// Ensure process working directory matches realpath for Vite dev server & bundling consistency
try {
  process.chdir(fs.realpathSync(process.cwd()));
} catch (_) {}

async function startServer() {
  console.log("[Server] Starting Krishi Saathi...");
  const PORT = ENV.PORT;
  const httpServer = http.createServer(app);

  // Initialize Database Connection & Migrations
  await initializeDatabase();

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
