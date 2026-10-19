import dotenv from "dotenv";
import path from "path";

// Load .env if present
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  
  // Database Configuration (MySQL)
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
  DB_NAME: process.env.DB_NAME || "krishi_saathi",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "krishi_saathi_super_secure_production_jwt_secret_key_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  
  // AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  
  // URLs & CORS
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  
  // Google Maps & Weather
  VITE_GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY || "",
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || "",
};

export const isProd = ENV.NODE_ENV === "production";
