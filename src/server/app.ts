import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { ENV } from "./config/env.js";
import { dbConnection } from "./db/connection.js";
import { runMigrations } from "./db/migrations.js";
import { runSeed } from "./db/seed.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

let dbInitialized = false;

export async function initializeDatabase() {
  if (dbInitialized) return;
  try {
    const isConnected = await dbConnection.connect();
    if (isConnected) {
      await runMigrations();
      await runSeed();
    } else {
      await runMigrations();
      await runSeed();
    }
    dbInitialized = true;
  } catch (err: any) {
    console.error("[Server] Database initialization warning:", err.message || err);
  }
}

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
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

  // Ensure database initialization
  initializeDatabase().catch((err) => {
    console.warn("[App] Background db initialization:", err.message || err);
  });

  // Rate Limiter for general API endpoints
  app.use("/api", apiLimiter);

  // Mount Master API Router
  app.use("/api", apiRouter);

  // Centralized Error Handler for API routes
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
