import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import crypto from "crypto";

/**
 * Create a new user account
 * @route POST /api/v1/users/signup
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const createUserAccount = async (req, res) => {
  try {
    // Safely destructure request body
    const { name, email, password, role = "student" } = req.body || {};

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Validate email format
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user (password hashing is handled by the model)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    // Update last active and generate token
    await user.updateLastActive();
    generateToken(res, user, "Account created successfully");
    
  } catch (error) {
    // Log error for debugging
    console.error("Signup error:", error);
    
    // Always return JSON response, never throw
    return res.status(500).json({
      success: false,
      message: "An error occurred during signup. Please try again.",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message,
        stack: error.stack 
      }),
    });
  }
};

/**
 * Authenticate user and get token
 * @route POST /api/v1/users/signin
 * Browser-safe: No throwing, all errors return JSON responses
 */
export const authenticateUser = async (req, res) => {
  try {
    // Safely destructure request body
    const { email, password } = req.body || {};

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Validate email format
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password
    if (typeof password !== 'string' || password.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last active
    await user.updateLastActive();
    
    // Remove password from response
    user.password = undefined;
    
    // Generate token and send response
    generateToken(res, user, `Welcome back ${user.name}`);
    
  } catch (error) {
    // Log error for debugging
    console.error("Signin error:", error);
    
    // Always return JSON response, never throw
    return res.status(500).json({
      success: false,
      message: "An error occurred during signin. Please try again.",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message,
        stack: error.stack 
      }),
    });
  }
};

/**
 * Sign out user and clear cookie
 * @route POST /api/v1/users/signout
 */
export const signOutUser = catchAsync(async (_, res) => {
  // Clear cookie with same settings as when it was set
  const cookieOptions = {
    httpOnly: true,
    maxAge: 0,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };
  
  res.cookie("token", "", cookieOptions);
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
});

/**
 * Get current user profile
 * @route GET /api/v1/users/profile
 */
export const getCurrentUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.id)
    .populate({
      path: "enrolledCourses.course",
      select: "title description thumbnail",
    })
    .populate({
      path: "createdCourses",
      select: "title thumbnail enrolledStudents",
    });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON(),
      totalEnrolledCourses: user.totalEnrolledCourses,
    },
  });
});

/**
 * Update user profile
 * @route PATCH /api/v1/users/profile
 */
export const updateUserProfile = catchAsync(async (req, res) => {
  const { name, email, bio } = req.body;
  const updateData = { name, email: email?.toLowerCase(), bio };

  // Handle avatar upload if provided
  if (req.file) {
    const avatarResult = await uploadMedia(req.file.path);
    updateData.avatar = avatarResult?.secure_url || req.file.path;

    // Delete old avatar if it's not the default
    const user = await User.findById(req.id);
    if (user.avatar && user.avatar !== "default-avatar.png") {
      await deleteMediaFromCloudinary(user.avatar);
    }
  }

  // Update user and get updated document
  const updatedUser = await User.findByIdAndUpdate(req.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

/**
 * Change user password
 * @route PATCH /api/v1/users/password
 */
export const changeUserPassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

/**
 * Request password reset
 * @route POST /api/v1/users/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError("No user found with this email", 404);
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send reset token via email

  res.status(200).json({
    success: true,
    message: "Password reset instructions sent to email",
  });
});

/**
 * Reset password
 * @route POST /api/v1/users/reset-password/:token
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Get user by reset token
  const user = await User.findOne({
    resetPasswordToken: crypto.createHash("sha256").update(token).digest("hex"),
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  // Update password and clear reset token
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

/**
 * Delete user account
 * @route DELETE /api/v1/users/account
 */
export const deleteUserAccount = catchAsync(async (req, res) => {
  const user = await User.findById(req.id);

  // Delete avatar if not default
  if (user.avatar && user.avatar !== "default-avatar.png") {
    await deleteMediaFromCloudinary(user.avatar);
  }

  // Delete user
  await User.findByIdAndDelete(req.id);

  // Clear cookie with same settings as when it was set
  const cookieOptions = {
    httpOnly: true,
    maxAge: 0,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };
  
  res.cookie("token", "", cookieOptions);
  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
