import rateLimit from "express-rate-limit";

// Auth rate limiter to prevent brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts from this IP, please try again after 15 minutes."
  }
});

// AI endpoints rate limiter
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 AI requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AI service request limit exceeded. Please wait a moment before trying again."
  }
});

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "API rate limit exceeded. Please slow down your requests."
  }
});
