import express from "express";
import { isAuthenticated } from "../MiddleWare/Auth.js";
import {
  buySubscription,
  paymentVerification,
} from "../Controllers/PaymentController.js";

const router = express.Router();

// Buy Subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

// Payment verification
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

export default router;
