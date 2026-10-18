import { z } from "zod";

export const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  postalCode: z.string().optional(),
  confirmLocation: z.boolean().optional().default(true),
});

export const languagePreferenceSchema = z.object({
  language: z.enum(["en", "hi", "mr", "mai", "bho", "pa", "ta", "te", "bn", "es", "vi", "sw"]),
});
