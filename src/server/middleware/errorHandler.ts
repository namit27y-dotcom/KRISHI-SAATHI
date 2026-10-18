import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { isProd } from "../config/env.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError || err.issues || err.errors) {
    const rawErrors = err.issues || err.errors || [];
    const errorDetails = Array.isArray(rawErrors)
      ? rawErrors.map((e: any) => ({
          field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
          message: e.message
        }))
      : [];

    return res.status(400).json({
      success: false,
      error: "Validation failed: " + (errorDetails.length > 0 ? errorDetails.map(e => `${e.field}: ${e.message}`).join(", ") : err.message),
      details: errorDetails
    });
  }

  // Handle standard HTTP / database errors
  const statusCode = typeof err.status === "number" ? err.status : (typeof err.statusCode === "number" ? err.statusCode : 500);
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isProd ? {} : { stack: err.stack })
  });
}
