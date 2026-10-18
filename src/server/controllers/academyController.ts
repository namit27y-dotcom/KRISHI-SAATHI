import { Request, Response, NextFunction } from "express";
import { AcademyService } from "../services/academyService.js";
import { lessonProgressSchema } from "../validators/academyValidator.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export class AcademyController {
  public static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = (req.query.lang as string) || "en";
      const categories = await AcademyService.getCategories(lang);
      res.json({ success: true, categories });
    } catch (err) {
      next(err);
    }
  }

  public static async getCategoryVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const lang = (req.query.lang as string) || "en";
      const videos = await AcademyService.getCategoryVideos(categoryId, lang);
      res.json({ success: true, videos });
    } catch (err) {
      next(err);
    }
  }

  public static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.query.categoryId as string;
      const lang = (req.query.lang as string) || "en";
      const courses = await AcademyService.getCourses(categoryId, lang);
      res.json({ success: true, courses });
    } catch (err) {
      next(err);
    }
  }

  public static async getCourseDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lang = (req.query.lang as string) || "en";
      const course = await AcademyService.getCourseDetails(id, lang);
      res.json({ success: true, course });
    } catch (err) {
      next(err);
    }
  }

  public static async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      const lang = (req.query.lang as string) || "en";
      const lesson = await AcademyService.getLesson(lessonId, lang);
      res.json({ success: true, lesson });
    } catch (err) {
      next(err);
    }
  }

  public static async getLessonVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      const videos = await AcademyService.getLessonVideos(lessonId);
      res.json({ success: true, videos });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || req.body.userId || "guest-1";
      const validated = lessonProgressSchema.parse(req.body);
      const result = await AcademyService.recordProgress(userId, validated.lessonId, validated.isCompleted, validated.lastWatchedSeconds);
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  }

  public static async getUserProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || req.user?.id || "guest-1";
      const progress = await AcademyService.getUserProgress(userId);
      res.json({ success: true, progress });
    } catch (err) {
      next(err);
    }
  }
}
