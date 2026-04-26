import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

/**
 * Get user's progress for a specific course
 * @route GET /api/v1/progress/:courseId
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Get course details with lectures
    const courseDetails = await Course.findById(courseId)
      .populate("lectures")
      .select("courseTitle courseThumbnail lectures");

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Get user's progress for the course
    const courseProgress = await CourseProgress.findOne({
      course: courseId,
      user: req.id,
    }).populate("course");

    // If no progress found, return course details with empty progress
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          isCompleted: false,
          completionPercentage: 0,
        },
      });
    }

    // Calculate completion percentage
    const totalLectures = courseDetails.lectures.length;
    const completedLectures = courseProgress.lectureProgress.filter(
      (lp) => lp.isCompleted
    ).length;
    const completionPercentage = totalLectures > 0 
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

    console.log('📊 GET Progress Response:', {
      totalLectures,
      completedLectures,
      completionPercentage,
      storedPercentage: courseProgress.completionPercentage
    });

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        isCompleted: courseProgress.completed,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error("Get course progress error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course progress",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      }),
    });
  }
};

/**
 * Update progress for a specific lecture
 * @route PATCH /api/v1/progress/:courseId/lectures/:lectureId
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    
    // Validate parameters
    if (!courseId || !lectureId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Lecture ID are required"
      });
    }

    // Find or create course progress
    let courseProgress = await CourseProgress.findOne({
      course: courseId,
      user: req.id,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        user: req.id,
        course: courseId,
        isCompleted: false,
        lectureProgress: [],
      });
    }

    // Update lecture progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lecture.toString() === lectureId
    );

    if (lectureIndex !== -1) {
      // Toggle completion status
      courseProgress.lectureProgress[lectureIndex].isCompleted = !courseProgress.lectureProgress[lectureIndex].isCompleted;
    } else {
      courseProgress.lectureProgress.push({
        lecture: lectureId,
        isCompleted: true,
      });
    }

    // Check if course is completed
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    const completedLectures = courseProgress.lectureProgress.filter(
      (lp) => lp.isCompleted
    ).length;
    
    // Calculate accurate completion percentage based on total course lectures
    const totalLectures = course.lectures.length;
    const completionPercentage = totalLectures > 0 
      ? Math.round((completedLectures / totalLectures) * 100) 
      : 0;
    
    // Explicitly set these fields (don't rely on pre-save hook)
    courseProgress.completionPercentage = completionPercentage;
    courseProgress.isCompleted = totalLectures === completedLectures;

    console.log('📊 UPDATE Progress:', {
      lectureId,
      totalLectures,
      completedLectures,
      completionPercentage,
      lectureProgressCount: courseProgress.lectureProgress.length
    });

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully",
      data: {
        lectureProgress: courseProgress.lectureProgress,
        isCompleted: courseProgress.isCompleted,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error("Update lecture progress error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating lecture progress",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      }),
    });
  }
};

/**
 * Mark entire course as completed
 * @route PATCH /api/v1/progress/:courseId/complete
 */
export const markCourseAsCompleted = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  // Find course progress
  const courseProgress = await CourseProgress.findOne({
    course: courseId,
    user: req.id,
  });

  if (!courseProgress) {
    throw new AppError("Course progress not found", 404);
  }

  // Mark all lectures as isCompleted
  courseProgress.lectureProgress.forEach((progress) => {
    progress.isCompleted = true;
  });
  courseProgress.isCompleted = true;

  await courseProgress.save();

  res.status(200).json({
    success: true,
    message: "Course marked as completed",
    data: courseProgress,
  });
});

/**
 * Reset course progress
 * @route PATCH /api/v1/progress/:courseId/reset
 */
export const resetCourseProgress = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  // Find course progress
  const courseProgress = await CourseProgress.findOne({
    course: courseId,
    user: req.id,
  });

  if (!courseProgress) {
    throw new AppError("Course progress not found", 404);
  }

  // Reset all progress
  courseProgress.lectureProgress.forEach((progress) => {
    progress.isCompleted = false;
  });
  courseProgress.isCompleted = false;

  await courseProgress.save();

  res.status(200).json({
    success: true,
    message: "Course progress reset successfully",
    data: courseProgress,
  });
});
