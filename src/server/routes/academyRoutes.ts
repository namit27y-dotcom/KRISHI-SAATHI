import { Router } from "express";
import { AcademyController } from "../controllers/academyController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/categories", AcademyController.getCategories);
router.get("/categories/:categoryId/videos", AcademyController.getCategoryVideos);
router.get("/courses", AcademyController.getCourses);
router.get("/courses/:id", AcademyController.getCourseDetails);
router.get("/lessons/:lessonId", AcademyController.getLesson);
router.get("/lessons/:lessonId/videos", AcademyController.getLessonVideos);
router.post("/progress", AcademyController.updateProgress);
router.get("/progress", AcademyController.getUserProgress);

export default router;
