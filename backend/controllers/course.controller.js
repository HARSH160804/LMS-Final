import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

/**
 * Create a new course
 * @route POST /api/v1/courses
 */
export const createNewCourse = catchAsync(async (req, res) => {
  const { title, subtitle, description, category, level, price } = req.body;

  // Handle thumbnail upload
  let thumbnail;
  if (req.file) {
    const result = await uploadMedia(req.file.path);
    thumbnail = result?.secure_url || req.file.path;
  } else {
    throw new AppError("Course thumbnail is required", 400);
  }

  // Create course
  const course = await Course.create({
    title,
    subtitle,
    description,
    category,
    level,
    price,
    thumbnail,
    instructor: req.id,
  });

  // Add course to instructor's created courses
  await User.findByIdAndUpdate(req.id, {
    $push: { createdCourses: course._id },
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

/**
 * Search courses with filters
 * @route GET /api/v1/courses/search
 */
export const searchCourses = catchAsync(async (req, res) => {
  const {
    query = "",
    categories = [],
    level,
    priceRange,
    sortBy = "newest",
  } = req.query;

  // Create search query
  const searchCriteria = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { subtitle: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  };

  // Apply filters
  if (categories.length > 0) {
    searchCriteria.category = { $in: categories };
  }
  if (level) {
    searchCriteria.level = level;
  }
  if (priceRange) {
    const [min, max] = priceRange.split("-");
    searchCriteria.price = { $gte: min || 0, $lte: max || Infinity };
  }

  // Define sorting
  const sortOptions = {};
  switch (sortBy) {
    case "price-low":
      sortOptions.price = 1;
      break;
    case "price-high":
      sortOptions.price = -1;
      break;
    case "oldest":
      sortOptions.createdAt = 1;
      break;
    default:
      sortOptions.createdAt = -1;
  }

  const courses = await Course.find(searchCriteria)
    .populate({
      path: "instructor",
      select: "name avatar",
    })
    .sort(sortOptions);

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * Get all published courses
 * @route GET /api/v1/courses/published
 */
export const getPublishedCourses = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find({ isPublished: true })
      .populate({
        path: "instructor",
        select: "name avatar",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Course.countDocuments({ isPublished: true }),
  ]);

  res.status(200).json({
    success: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get courses created by the current user
 * @route GET /api/v1/courses/my-courses
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const getMyCreatedCourses = async (req, res) => {
  try {
    // Validate user ID
    if (!req.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    
    const courses = await Course.find({ instructor: req.id }).populate({
      path: "enrolledStudents",
      select: "name avatar",
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Get my created courses error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching your courses",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      }),
    });
  }
};

/**
 * Update course details
 * @route PATCH /api/v1/courses/:courseId
 */
export const updateCourseDetails = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { title, subtitle, description, category, level, price } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Verify ownership
  if (course.instructor.toString() !== req.id) {
    throw new AppError("Not authorized to update this course", 403);
  }

  // Handle thumbnail upload
  let thumbnail;
  if (req.file) {
    if (course.thumbnail) {
      await deleteMediaFromCloudinary(course.thumbnail);
    }
    const result = await uploadMedia(req.file.path);
    thumbnail = result?.secure_url || req.file.path;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      ...(thumbnail && { thumbnail }),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: updatedCourse,
  });
});

/**
 * Get course by ID
 * @route GET /api/v1/courses/:courseId
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }
    
    const course = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "name avatar bio",
      })
      .populate({
        path: "lectures",
        select: "title videoUrl duration isPreview order",
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...course.toJSON(),
        averageRating: course.averageRating,
      },
    });
  } catch (error) {
    console.error("Get course details error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course details",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      }),
    });
  }
};

/**
 * Add lecture to course
 * @route POST /api/v1/courses/:courseId/lectures
 */
export const addLectureToCourse = catchAsync(async (req, res) => {
  const { title, description, isPreview } = req.body;
  const { courseId } = req.params;

  // Get course and verify ownership
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  if (course.instructor.toString() !== req.id) {
    throw new AppError("Not authorized to update this course", 403);
  }

  // Handle video upload
  if (!req.file) {
    throw new AppError("Video file is required", 400);
  }

  // Upload video to cloudinary
  const result = await uploadMedia(req.file.path);
  if (!result) {
    throw new AppError("Error uploading video", 500);
  }

  // Create lecture with video details from cloudinary
  const lecture = await Lecture.create({
    title,
    description,
    isPreview,
    order: course.lectures.length + 1,
    videoUrl: result?.secure_url || req.file.path,
    publicId: result?.public_id || req.file.path,
    duration: result?.duration || 0, // Cloudinary provides duration for video files
  });

  // Add lecture to course
  course.lectures.push(lecture._id);
  await course.save();

  res.status(201).json({
    success: true,
    message: "Lecture added successfully",
    data: lecture,
  });
});

/**
 * Get course lectures
 * @route GET /api/v1/courses/:courseId/lectures
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }
    
    const course = await Course.findById(courseId).populate({
      path: "lectures",
      select: "title description videoUrl duration isPreview order",
      options: { sort: { order: 1 } },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if user has access to full course content
    let isEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === req.id
    );

    // Fallback: Check purchase record if not found in enrolledStudents
    if (!isEnrolled) {
      const purchase = await CoursePurchase.findOne({
        user: req.id,
        course: courseId,
        status: 'completed'
      });
      if (purchase) isEnrolled = true;
    }

    const isInstructor = course.instructor.toString() === req.id;

    let lectures = course.lectures;
    if (!isEnrolled && !isInstructor) {
      // Only return preview lectures for non-enrolled users
      lectures = lectures.filter((lecture) => lecture.isPreview);
    }

    return res.status(200).json({
      success: true,
      data: {
        lectures,
        isEnrolled,
        isInstructor,
      },
    });
  } catch (error) {
    console.error("Get course lectures error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course lectures",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      }),
    });
  }
};

/**
 * Toggle course publish status
 * @route PATCH /api/v1/courses/:courseId/publish
 */
export const togglePublishCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Verify ownership
  if (course.instructor.toString() !== req.id) {
    throw new AppError("Not authorized to update this course", 403);
  }

  // Toggle publish status
  course.isPublished = !course.isPublished;
  await course.save();

  res.status(200).json({
    success: true,
    message: course.isPublished ? "Course published successfully" : "Course unpublished",
    data: course,
  });
});

/**
 * Delete a course
 * @route DELETE /api/v1/courses/:courseId
 */
export const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Verify ownership
  if (course.instructor.toString() !== req.id) {
    throw new AppError("Not authorized to delete this course", 403);
  }

  // Delete course thumbnail from cloudinary if exists
  if (course.thumbnail) {
    await deleteMediaFromCloudinary(course.thumbnail);
  }

  // Delete all associated lectures and their videos
  if (course.lectures && course.lectures.length > 0) {
    for (const lectureId of course.lectures) {
      const lecture = await Lecture.findById(lectureId);
      if (lecture && lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
      await Lecture.findByIdAndDelete(lectureId);
    }
  }

  // Remove course from instructor's created courses
  await User.findByIdAndUpdate(req.id, {
    $pull: { createdCourses: courseId },
  });

  // Delete the course
  await Course.findByIdAndDelete(courseId);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});
