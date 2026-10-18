import { z } from "zod";

export const categoryCreateSchema = z.object({
  code: z.string().min(2),
  name_en: z.string().min(2),
  name_hi: z.string().min(2),
  name_mr: z.string().min(2),
  name_mai: z.string().optional().default(""),
  name_bho: z.string().optional().default(""),
  description_en: z.string().optional().default(""),
  description_hi: z.string().optional().default(""),
  description_mr: z.string().optional().default(""),
  description_mai: z.string().optional().default(""),
  description_bho: z.string().optional().default(""),
  icon: z.string().optional().default("Sprout"),
  display_order: z.number().optional().default(0),
});

export const quizAttemptSchema = z.object({
  quizId: z.string().min(1),
  answers: z.array(z.object({
    questionId: z.string().min(1),
    selectedOptionIndex: z.number().int().min(0),
  })),
});

export const lessonProgressSchema = z.object({
  lessonId: z.string().min(1),
  isCompleted: z.boolean().optional().default(false),
  lastWatchedSeconds: z.number().optional().default(0),
});
