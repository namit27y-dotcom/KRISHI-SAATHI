import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().optional().default(""),
  role: z.enum(["farmer", "seller", "buyer", "admin"]).default("farmer"),
  preferredLanguage: z.string().optional().default("en"),
  country: z.string().optional().default("India"),
  state: z.string().optional().default(""),
  district: z.string().optional().default(""),
  village: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
  landArea: z.union([z.number(), z.string()]).optional().transform(v => typeof v === "string" ? parseFloat(v) || 0 : (v || 0)),
  landUnit: z.enum(["Acres", "Bigha", "Hectares", "Guntha"]).optional().default("Acres"),
  soilType: z.string().optional().default("Loamy"),
  cropsGrown: z.union([z.array(z.string()), z.string()]).optional().default([]),
  companyName: z.string().optional().default(""),
  gstNumber: z.string().optional().default(""),
  buyerType: z.string().optional().default(""),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  mobile: z.string().optional(),
  preferredLanguage: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  postalCode: z.string().optional(),
  landArea: z.union([z.number(), z.string()]).optional().transform(v => typeof v === "string" ? parseFloat(v) || 0 : (v || 0)),
  landUnit: z.enum(["Acres", "Bigha", "Hectares", "Guntha"]).optional(),
  soilType: z.string().optional(),
  cropsGrown: z.union([z.array(z.string()), z.string()]).optional(),
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  buyerType: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isVerified: z.boolean().optional(),
});
