import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createNewCourse,
  searchCourses,
  getPublishedCourses,
  getMyCreatedCourses,
  updateCourseDetails,
  getCourseDetails,
  addLectureToCourse,
  getCourseLectures,
  togglePublishCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/published", getPublishedCourses);
router.get("/search", searchCourses);
router.get("/c/:courseId", getCourseDetails); // Course details should be public

// Protected routes - everything below requires authentication
router.use(isAuthenticated);

// Get course lectures (requires authentication to check enrollment)
router.get("/c/:courseId/lectures", getCourseLectures);

// Course management
router
  .route("/")
  .post(restrictTo("instructor"), upload.single("thumbnail"), createNewCourse)
  .get(restrictTo("instructor"), getMyCreatedCourses);

// Course updates and deletion (requires authentication)
router
  .route("/c/:courseId")
  .patch(
    restrictTo("instructor"),
    upload.single("thumbnail"),
    updateCourseDetails
  )
  .delete(restrictTo("instructor"), deleteCourse);

// Publish/unpublish course
router.patch("/c/:courseId/publish", restrictTo("instructor"), togglePublishCourse);

// Add lectures (instructor only)
router.post("/c/:courseId/lectures", restrictTo("instructor"), upload.single("video"), addLectureToCourse);

export default router;

