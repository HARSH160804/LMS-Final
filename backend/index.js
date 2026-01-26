import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import razorpayRoute from "./routes/razorpay.routes.js";
import healthRoute from "./routes/health.routes.js";

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy - Required for Render deployment
// Enables Express to trust the X-Forwarded-* headers from Render's reverse proxy
// This is critical for:
// - Proper HTTPS detection (req.protocol will be 'https')
// - Secure cookie handling (cookies with secure: true will work)
// - Correct client IP detection
app.set("trust proxy", 1);

// ============================================================================
// GLOBAL CORS + OPTIONS SHORT-CIRCUIT - MUST BE FIRST MIDDLEWARE
// ============================================================================
// This middleware MUST run before cors(), body parsers, auth, rate-limit, etc.
// It manually sets CORS headers and immediately returns 204 for OPTIONS requests.
// 
// Why this is required:
// 1. Browser preflight OPTIONS requests MUST get 204 response immediately
// 2. CORS headers MUST be present on OPTIONS responses
// 3. OPTIONS requests MUST NOT reach auth, validation, or rate-limit middleware
// 4. cors() middleware alone is insufficient for complex scenarios
// 5. Render/Cloudflare proxy requires explicit header handling
//
// This fixes: "No 'Access-Control-Allow-Origin' header present" errors
// ============================================================================
app.use((req, res, next) => {
  // Hardcoded Vercel frontend origin (replace with your actual Vercel URL)
  const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
  
  // Set CORS headers for ALL requests (not just OPTIONS)
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  
  // Debug log for OPTIONS requests (remove after debugging)
  if (req.method === "OPTIONS") {
    console.log("🔍 OPTIONS Request:", {
      method: req.method,
      origin: req.headers.origin,
      path: req.path,
      headers: req.headers
    });
  }
  
  // If this is an OPTIONS request, return 204 immediately and STOP
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  
  // For non-OPTIONS requests, continue to next middleware
  next();
});

// CORS Configuration - Simplified (global middleware above handles OPTIONS)
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// Logging Middleware (before other middleware for better debugging)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser Middleware (before routes)
app.use(express.json({ limit: "10kb" })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Security Middleware
app.use(helmet()); // Set security HTTP headers
// app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
// app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Global rate limiting with OPTIONS bypass
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  skip: (req) => req.method === "OPTIONS", // Skip rate limiting for preflight requests
});

// Apply rate limiting to API routes (OPTIONS already bypassed)
app.use("/api", limiter);

// API Routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/razorpay", razorpayRoute);
app.use("/health", healthRoute);

// Simple API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global Error Handler.
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    ` Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
