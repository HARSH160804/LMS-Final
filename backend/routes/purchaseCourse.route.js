import express from "express";
import {
  getCoursePurchaseStatus,
  getPurchasedCourses,
  handleStripeWebhook,
  initiateStripeCheckout,
  enrollFree,
} from "../controllers/coursePurchase.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, initiateStripeCheckout);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), handleStripeWebhook);
router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCoursePurchaseStatus);

router.route("/").get(isAuthenticated, getPurchasedCourses);

// Free course enrollment
router.route("/enroll-free").post(isAuthenticated, enrollFree);

export default router;

