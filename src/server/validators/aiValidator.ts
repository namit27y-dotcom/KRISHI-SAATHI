import { z } from "zod";

export const plantIdSchema = z.object({
  plantPhoto: z.string().min(10, "Plant photo base64 is required"),
  soilPhoto: z.string().optional(),
  userId: z.string().optional(),
  preferredLanguage: z.string().optional().default("en"),
});

export const diseaseAnalyzeSchema = z.object({
  image: z.string().min(10, "Crop image is required"),
  userId: z.string().optional(),
  preferredLanguage: z.string().optional().default("en"),
});

export const weatherRecommendSchema = z.object({
  state: z.string().min(2),
  district: z.string().min(2),
  soilType: z.string().min(2),
  season: z.string().min(2),
  userId: z.string().optional(),
});

export const yieldForecastSchema = z.object({
  cropName: z.string().min(2),
  soilType: z.string().min(2),
  landArea: z.union([z.number(), z.string()]).transform(v => parseFloat(String(v)) || 1),
  state: z.string().min(2),
  district: z.string().min(2),
  historicalSummary: z.string().optional(),
  userId: z.string().optional(),
});

export const fertilizerPlanSchema = z.object({
  crop: z.string().min(2),
  growthStage: z.string().min(2),
  soilType: z.string().min(2),
  fieldSize: z.union([z.number(), z.string()]).transform(v => parseFloat(String(v)) || 1),
  userId: z.string().optional(),
});

export const irrigationPlanSchema = z.object({
  crop: z.string().min(2),
  growthStage: z.string().min(2),
  soilType: z.string().min(2),
  userId: z.string().optional(),
});

export const schemesQuerySchema = z.object({
  query: z.string().optional().default("What schemes support smallholder farmers?"),
  state: z.string().optional().default("Maharashtra"),
  crop: z.string().optional().default("Cotton"),
  landSize: z.union([z.number(), z.string()]).optional().transform(v => parseFloat(String(v)) || 2),
  userId: z.string().optional(),
});

export const chatAssistantSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(z.object({
    role: z.string(),
    text: z.string()
  })).optional().default([]),
  userId: z.string().optional(),
  farmingCategory: z.string().optional().default("crops"),
  preferredLanguage: z.string().optional().default("en"),
});

export const animalHealthSchema = z.object({
  animalType: z.enum(["dairy_cattle", "sheep", "goat", "poultry", "pig", "fish", "bees"]),
  symptoms: z.string().min(5, "Symptoms must be described in detail"),
  durationDays: z.number().optional().default(1),
  preferredLanguage: z.string().optional().default("en"),
});
