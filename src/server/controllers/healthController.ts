import { Request, Response } from "express";
import { dbConnection } from "../db/connection.js";
import { ENV } from "../config/env.js";

export class HealthController {
  public static async check(req: Request, res: Response) {
    const dbStatus = dbConnection.getStatus();

    res.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
      version: "2.0.0",
      services: {
        api: "online",
        database: {
          engine: "MySQL",
          connected: dbStatus.connected,
          host: dbStatus.host,
          port: dbStatus.port,
          database: dbStatus.database,
          storageMode: dbStatus.connected
            ? "MySQL Database (Active Connection Pool)"
            : "Persistent JSON Fallback Storage (data/db.json)",
          connectionDetails: dbStatus.connected
            ? "Connected to live MySQL database"
            : `MySQL offline (${dbStatus.error || "connection failed"}). Fallback JSON storage active.`
        },
        geminiAI: {
          configured: !!ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY !== "MOCK_KEY",
          model: "gemini-2.5-flash"
        },
        googleMaps: {
          configured: !!ENV.VITE_GOOGLE_MAPS_API_KEY
        }
      }
    });
  }
}
