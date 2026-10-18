import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { dbConnection } from "../db/connection.js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "seller" | "buyer" | "admin";
  isVerified?: boolean;
  preferredLanguage?: string;
  country?: string;
  state?: string;
  district?: string;
  village?: string;
  soilType?: string;
  landArea?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access token is required. Authorization header missing or malformed."
      });
    }

    const token = authHeader.split(" ")[1];

    // Handle legacy/guest tokens for demo mode
    if (token.startsWith("mock-jwt-token-")) {
      const legacyId = token.replace("mock-jwt-token-", "");
      const users = await dbConnection.query(`SELECT * FROM users WHERE id = ?`, [legacyId]);
      if (users && users.length > 0) {
        const u = users[0];
        req.user = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isVerified: !!u.is_verified,
          preferredLanguage: u.preferred_language || "en",
          country: u.country,
          state: u.state,
          district: u.district,
          village: u.village,
          soilType: u.soil_type,
          landArea: u.land_area
        };
        return next();
      }
      // Demo guest user fallback
      if (legacyId === "guest-1") {
        req.user = {
          id: "guest-1",
          name: "Ramesh Patil",
          email: "ramesh.patil@krishisaathi.com",
          role: "farmer",
          isVerified: true,
          preferredLanguage: "en",
          country: "India",
          state: "Maharashtra",
          district: "Pune",
          village: "Khed",
          soilType: "Loamy",
          landArea: 1.5
        };
        return next();
      }
      return res.status(401).json({ success: false, error: "Invalid legacy token." });
    }

    // Verify cryptographic JWT
    jwt.verify(token, ENV.JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: "Invalid or expired authentication token."
        });
      }

      const users = await dbConnection.query(`SELECT * FROM users WHERE id = ?`, [decoded.userId]);
      if (!users || users.length === 0) {
        return res.status(401).json({
          success: false,
          error: "User associated with token no longer exists."
        });
      }

      const u = users[0];
      req.user = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isVerified: !!u.is_verified,
        preferredLanguage: u.preferred_language || "en",
        country: u.country,
        state: u.state,
        district: u.district,
        village: u.village,
        soilType: u.soil_type,
        landArea: u.land_area
      };
      next();
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Authentication error." });
  }
}

export function requireRoles(...allowedRoles: Array<"farmer" | "seller" | "buyer" | "admin">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized. Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: User role '${req.user.role}' is not authorized for this operation. Requires one of: [${allowedRoles.join(", ")}]`
      });
    }

    next();
  };
}

export const requireAdmin = requireRoles("admin");
export const requireFarmer = requireRoles("farmer", "admin");
export const requireSeller = requireRoles("seller", "admin");
export const requireBuyer = requireRoles("buyer", "admin");
