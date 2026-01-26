import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe checkout session for course purchase
 * @route POST /api/v1/payments/create-checkout-session
 */
export const initiateStripeCheckout = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  // Find course and validate
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Create a new course purchase record
  const newPurchase = new CoursePurchase({
    course: courseId,
    user: req.id,
    amount: course.price,
    status: "pending",
    paymentMethod: "stripe",
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course.title,
            images: [],
          },
          unit_amount: course.price * 100, // Amount in paise
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/course-progress/${courseId}`,
    cancel_url: `${process.env.CLIENT_URL}/course-detail/${courseId}`,
    metadata: {
      courseId: courseId,
      userId: req.id,
    },
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
  });

  if (!session.url) {
    throw new AppError("Failed to create checkout session", 400);
  }

  // Save purchase record with session ID
  newPurchase.paymentId = session.id;
  await newPurchase.save();

  res.status(200).json({
    success: true,
    data: {
      checkoutUrl: session.url,
    },
  });
});

/**
 * Handle Stripe webhook events
 * @route POST /api/v1/payments/webhook
 */
export const handleStripeWebhook = catchAsync(async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    throw new AppError(`Webhook Error: ${error.message}`, 400);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Find and update purchase record
    const purchase = await CoursePurchase.findOne({
      paymentId: session.id,
    }).populate("course");

    if (!purchase) {
      throw new AppError("Purchase record not found", 404);
    }

    // Update purchase details
    purchase.amount = session.amount_total
      ? session.amount_total / 100
      : purchase.amount;
    purchase.status = "completed";
    await purchase.save();

    // Make all lectures accessible
    if (purchase.course?.lectures?.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    // Update user's enrolled courses
    await User.findByIdAndUpdate(
      purchase.user._id,
      { $addToSet: { enrolledCourses: purchase.course._id } },
      { new: true }
    );

    // Update course's enrolled students
    await Course.findByIdAndUpdate(
      purchase.course._id,
      { $addToSet: { enrolledStudents: purchase.user } },
      { new: true }
    );
  }

  res.status(200).json({ received: true });
});

/**
 * Get course details with purchase status
 * @route GET /api/v1/payments/courses/:courseId/purchase-status
 */
export const getCoursePurchaseStatus = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  // Find course with populated data
  const course = await Course.findById(courseId)
    .populate("instructor", "name avatar")
    .populate("lectures", "lectureTitle videoUrl duration");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if user has purchased the course
  const purchased = await CoursePurchase.exists({
    user: req.id,
    course: courseId,
    status: "completed",
  });

  res.status(200).json({
    success: true,
    data: {
      course,
      isPurchased: Boolean(purchased),
    },
  });
});

/**
 * Get all purchased courses
 * @route GET /api/v1/payments/purchased-courses
 */
export const getPurchasedCourses = catchAsync(async (req, res) => {
  const purchases = await CoursePurchase.find({
    user: req.id,
    status: "completed",
  }).populate({
    path: "course",
    select: "title thumbnail description category",
    populate: {
      path: "instructor",
      select: "name avatar",
    },
  });

  // Filter out purchases where the course has been deleted
  const validPurchases = purchases.filter(p => p.course !== null);

  // Return purchase objects with courseId field as expected by frontend
  res.status(200).json({
    success: true,
    data: validPurchases.map((purchase) => ({
      _id: purchase._id,
      courseId: purchase.course,  // Frontend expects courseId, not course
      status: purchase.status,
      createdAt: purchase.createdAt,
    })),
  });
});

/**
 * Enroll in a free course
 * @route POST /api/v1/purchase/enroll-free
 */
export const enrollFree = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  // Find course and validate
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if course is free
  if (course.price > 0) {
    throw new AppError("This course is not free. Please purchase it.", 400);
  }

  // Check if already enrolled
  const existingPurchase = await CoursePurchase.findOne({
    user: req.id,
    course: courseId,
    status: "completed",
  });

  if (existingPurchase) {
    return res.status(200).json({
      success: true,
      message: "Already enrolled in this course",
      alreadyEnrolled: true,
    });
  }

  // Create a completed purchase record for free course
  const purchase = await CoursePurchase.create({
    course: courseId,
    user: req.id,
    amount: 0,
    currency: "INR",
    status: "completed",
    paymentMethod: "free",
    paymentId: `free_${Date.now()}_${req.id}`,
  });

  // Update user's enrolled courses
  await User.findByIdAndUpdate(
    req.id,
    { $addToSet: { enrolledCourses: courseId } },
    { new: true }
  );

  // Update course's enrolled students
  await Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { enrolledStudents: req.id } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Successfully enrolled in the course",
    data: purchase,
  });
});

