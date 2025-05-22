import express from "express";
import { continueWithGoogle, sendOtpRequest, verifyOtpRequest } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtpRequest);
router.post("/verify-otp", verifyOtpRequest);
router.post("/google-login" , continueWithGoogle)


export default router;
