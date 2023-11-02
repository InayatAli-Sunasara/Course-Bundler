import { CatchAsyncError } from "../MiddleWare/CatchAsyncErrors.js";
import { User } from "../Model/User.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const buySubscription = CatchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.role === "admin")
        return next(new ErrorHandler("Admin can't buy subscription", 400));

    const plan_id = process.env.PLAN_ID || "plan_MmZA5vQVmIqfY1";

    const subscription = await instance.subscriptions.create({
        plan_id: plan_id,
        customer_notify: 1,
        total_count: 12,
    });
    user.subscription.id = subscription.id;

    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({ success: true, subscriptionId: subscription.id });
});

export const paymentVerification = CatchAsyncError(async(req, res, next) => {
    const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } =
    req.body;

    const user = await User.findById(req.user._id);

    const subscription_id = user.subscription.id;

    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
        .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic)
        return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

    // Database Comes here

    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id,
    });

    user.subscription.status = "active";

    await user.save();
    res.redirect(
        `${process.env.FRONTEND_URL}/paymentsuccess${razorpay_payment_id}`
    );
});