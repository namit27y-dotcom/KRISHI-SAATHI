import { dbConnection } from "../db/connection.js";

export class AcademyService {
  // Get all categories with localized labels
  public static async getCategories(lang: string = "en") {
    const rows = await dbConnection.query(`SELECT * FROM farming_categories WHERE is_active = TRUE ORDER BY display_order ASC`);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        code: r.code,
        name: lang === "hi" ? r.name_hi : lang === "mr" ? r.name_mr : lang === "mai" ? r.name_mai : lang === "bho" ? r.name_bho : r.name_en,
        nameEn: r.name_en,
        description: lang === "hi" ? r.description_hi : lang === "mr" ? r.description_mr : lang === "mai" ? r.description_mai : lang === "bho" ? r.description_bho : r.description_en,
        descriptionEn: r.description_en,
        icon: r.icon,
        imageUrl: r.image_url,
        displayOrder: r.display_order
      }));
    }
    const fallbackList = dbConnection.getFallbackTable("farming_categories");
    return fallbackList.map(c => ({
      id: c.id,
      code: c.code,
      name: lang === "hi" ? c.name_hi : lang === "mr" ? c.name_mr : lang === "mai" ? c.name_mai : lang === "bho" ? c.name_bho : c.name_en,
      nameEn: c.name_en,
      description: lang === "hi" ? c.description_hi : lang === "mr" ? c.description_mr : lang === "mai" ? c.description_mai : lang === "bho" ? c.description_bho : c.description_en,
      descriptionEn: c.description_en,
      icon: c.icon,
      imageUrl: c.image_url,
      displayOrder: c.display_order
    }));
  }

  // Get courses by category
  public static async getCourses(categoryId?: string, lang: string = "en") {
    let sql = `SELECT * FROM courses WHERE is_published = TRUE`;
    const params: any[] = [];
    if (categoryId) {
      sql += ` AND category_id = ?`;
      params.push(categoryId);
    }
    sql += ` ORDER BY display_order ASC`;

    const rows = await dbConnection.query(sql, params);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        categoryId: r.category_id,
        title: lang === "hi" ? r.title_hi : lang === "mr" ? r.title_mr : lang === "mai" ? r.title_mai : lang === "bho" ? r.title_bho : r.title_en,
        titleEn: r.title_en,
        description: lang === "hi" ? r.description_hi : lang === "mr" ? r.description_mr : lang === "mai" ? r.description_mai : lang === "bho" ? r.description_bho : r.description_en,
        descriptionEn: r.description_en,
        level: r.level,
        thumbnailUrl: r.thumbnail_url,
        durationMinutes: r.duration_minutes
      }));
    }

    let list = dbConnection.getFallbackTable("courses");
    if (categoryId) list = list.filter(c => c.category_id === categoryId || c.categoryId === categoryId);
    return list.map(c => ({
      id: c.id,
      categoryId: c.category_id || c.categoryId,
      title: lang === "hi" ? c.title_hi : lang === "mr" ? c.title_mr : lang === "mai" ? c.title_mai : lang === "bho" ? c.title_bho : c.title_en,
      titleEn: c.title_en,
      description: lang === "hi" ? c.description_hi : lang === "mr" ? c.description_mr : lang === "mai" ? c.description_mai : lang === "bho" ? c.description_bho : c.description_en,
      descriptionEn: c.description_en,
      level: c.level,
      thumbnailUrl: c.thumbnail_url,
      durationMinutes: c.duration_minutes
    }));
  }

  // Get full course details with modules, lessons, and real YouTube videos
  public static async getCourseDetails(courseId: string, lang: string = "en") {
    const courses = await dbConnection.query(`SELECT * FROM courses WHERE id = ?`, [courseId]);
    const course = courses && courses.length > 0 ? courses[0] : dbConnection.getFallbackTable("courses").find(c => c.id === courseId);
    if (!course) throw new Error("Course not found");

    const modules = await dbConnection.query(`SELECT * FROM course_modules WHERE course_id = ? ORDER BY display_order ASC`, [courseId]);
    const fallbackModules = dbConnection.getFallbackTable("course_modules").filter(m => m.course_id === courseId || m.courseId === courseId);
    const activeModules = (modules && modules.length > 0) ? modules : fallbackModules;
    
    const formattedModules = [];

    for (const m of activeModules || []) {
      const lessons = await dbConnection.query(`SELECT * FROM lessons WHERE module_id = ? AND is_published = TRUE ORDER BY display_order ASC`, [m.id]);
      const fallbackLessons = dbConnection.getFallbackTable("lessons").filter(l => (l.module_id === m.id || l.moduleId === m.id) && l.is_published !== false);
      const activeLessons = (lessons && lessons.length > 0) ? lessons : fallbackLessons;
      
      const formattedLessons = [];

      for (const l of activeLessons || []) {
        const trans = await dbConnection.query(`SELECT * FROM lesson_translations WHERE lesson_id = ? AND language = ?`, [l.id, lang]);
        const fallbackTrans = dbConnection.getFallbackTable("lesson_translations").find(t => (t.lesson_id === l.id || t.lessonId === l.id) && t.language === lang);
        const tr = (trans && trans.length > 0) ? trans[0] : fallbackTrans;

        const videos = await AcademyService.getLessonVideos(l.id);

        formattedLessons.push({
          id: l.id,
          moduleId: m.id,
          title: tr ? tr.title : (lang === "hi" && l.title_hi ? l.title_hi : l.title_en),
          titleEn: l.title_en,
          titleHi: l.title_hi || l.title_en,
          videoUrl: l.video_url,
          videoDuration: l.video_duration || "5:00",
          content: tr ? tr.content : l.content_en,
          contentEn: l.content_en,
          displayOrder: l.display_order,
          videos
        });
      }

      formattedModules.push({
        id: m.id,
        courseId: course.id,
        title: lang === "hi" ? (m.title_hi || m.title_en) : lang === "mr" ? (m.title_mr || m.title_en) : lang === "mai" ? (m.title_mai || m.title_en) : lang === "bho" ? (m.title_bho || m.title_en) : m.title_en,
        titleEn: m.title_en,
        displayOrder: m.display_order,
        lessons: formattedLessons
      });
    }

    return {
      id: course.id,
      categoryId: course.category_id || course.categoryId,
      title: lang === "hi" ? course.title_hi : lang === "mr" ? course.title_mr : lang === "mai" ? course.title_mai : lang === "bho" ? course.title_bho : course.title_en,
      titleEn: course.title_en,
      description: lang === "hi" ? course.description_hi : lang === "mr" ? course.description_mr : lang === "mai" ? course.description_mai : lang === "bho" ? course.description_bho : course.description_en,
      descriptionEn: course.description_en,
      level: course.level,
      thumbnailUrl: course.thumbnail_url,
      durationMinutes: course.duration_minutes,
      modules: formattedModules
    };
  }

  // Get specific lesson by ID
  public static async getLesson(lessonId: string, lang: string = "en") {
    const lessons = await dbConnection.query(`SELECT * FROM lessons WHERE id = ?`, [lessonId]);
    const lesson = (lessons && lessons.length > 0) ? lessons[0] : dbConnection.getFallbackTable("lessons").find(l => l.id === lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const trans = await dbConnection.query(`SELECT * FROM lesson_translations WHERE lesson_id = ? AND language = ?`, [lessonId, lang]);
    const fallbackTrans = dbConnection.getFallbackTable("lesson_translations").find(t => (t.lesson_id === lessonId || t.lessonId === lessonId) && t.language === lang);
    const tr = (trans && trans.length > 0) ? trans[0] : fallbackTrans;

    const videos = await AcademyService.getLessonVideos(lessonId);

    return {
      id: lesson.id,
      moduleId: lesson.module_id || lesson.moduleId,
      title: tr ? tr.title : lesson.title_en,
      titleEn: lesson.title_en,
      videoUrl: lesson.video_url,
      videoDuration: lesson.video_duration || "5:00",
      content: tr ? tr.content : lesson.content_en,
      contentEn: lesson.content_en,
      displayOrder: lesson.display_order,
      videos
    };
  }

  // Get videos attached to a lesson
  public static async getLessonVideos(lessonId: string) {
    const rows = await dbConnection.query(`SELECT * FROM lesson_videos WHERE lesson_id = ? AND is_active = TRUE ORDER BY is_primary DESC, id ASC`, [lessonId]);
    if (rows && rows.length > 0) {
      return rows.map(v => ({
        id: v.id,
        lessonId: v.lesson_id,
        youtubeVideoId: v.youtube_video_id,
        youtubeUrl: v.youtube_url,
        title: v.title,
        description: v.description,
        language: v.language,
        durationSeconds: v.duration_seconds,
        thumbnailUrl: v.thumbnail_url || (v.youtube_video_id ? `https://img.youtube.com/vi/${v.youtube_video_id}/hqdefault.jpg` : ""),
        isPrimary: Boolean(v.is_primary)
      }));
    }

    const fallbackList = dbConnection.getFallbackTable("lesson_videos").filter(v => (v.lesson_id === lessonId || v.lessonId === lessonId) && v.is_active !== false);
    return fallbackList.map(v => ({
      id: v.id,
      lessonId: v.lesson_id || v.lessonId,
      youtubeVideoId: v.youtube_video_id || v.youtubeVideoId,
      youtubeUrl: v.youtube_url || v.youtubeUrl,
      title: v.title,
      description: v.description,
      language: v.language || "en",
      durationSeconds: v.duration_seconds || v.durationSeconds || 0,
      thumbnailUrl: v.thumbnail_url || v.thumbnailUrl || (v.youtube_video_id || v.youtubeVideoId ? `https://img.youtube.com/vi/${v.youtube_video_id || v.youtubeVideoId}/hqdefault.jpg` : ""),
      isPrimary: Boolean(v.is_primary ?? v.isPrimary ?? true)
    }));
  }

  // Get all videos for a farming category
  public static async getCategoryVideos(categoryId: string, lang: string = "en") {
    const courses = await AcademyService.getCourses(categoryId, lang);
    const categoryVideos = [];

    for (const c of courses) {
      const details = await AcademyService.getCourseDetails(c.id, lang);
      for (const m of details.modules) {
        for (const l of m.lessons) {
          categoryVideos.push({
            courseId: c.id,
            courseTitle: c.title,
            moduleId: m.id,
            moduleTitle: m.title,
            lessonId: l.id,
            lessonTitle: l.title,
            videoDuration: l.videoDuration,
            videos: l.videos
          });
        }
      }
    }

    return categoryVideos;
  }

  // Record user lesson progress
  public static async recordProgress(userId: string, lessonId: string, isCompleted: boolean, lastWatchedSeconds: number) {
    await dbConnection.execute(
      `INSERT INTO user_lesson_progress (id, user_id, lesson_id, is_completed, last_watched_seconds)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE is_completed = VALUES(is_completed), last_watched_seconds = VALUES(last_watched_seconds)`,
      [
        `prog-${userId}-${lessonId}`,
        userId,
        lessonId,
        isCompleted ? 1 : 0,
        lastWatchedSeconds || 0
      ]
    );
    return { success: true, userId, lessonId, isCompleted, lastWatchedSeconds };
  }

  // Get user progress
  public static async getUserProgress(userId: string) {
    const rows = await dbConnection.query(`SELECT * FROM user_lesson_progress WHERE user_id = ?`, [userId]);
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        lessonId: r.lesson_id,
        isCompleted: Boolean(r.is_completed),
        lastWatchedSeconds: r.last_watched_seconds,
        updatedAt: r.updated_at
      }));
    }
    const fallback = dbConnection.getFallbackTable("user_lesson_progress").filter(p => p.user_id === userId || p.userId === userId);
    return fallback.map(r => ({
      id: r.id,
      userId: r.user_id || r.userId,
      lessonId: r.lesson_id || r.lessonId,
      isCompleted: Boolean(r.is_completed ?? r.isCompleted),
      lastWatchedSeconds: r.last_watched_seconds || r.lastWatchedSeconds || 0,
      updatedAt: r.updated_at || r.updatedAt
    }));
  }
}
