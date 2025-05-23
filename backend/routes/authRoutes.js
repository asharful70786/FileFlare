import express from "express";
import { continueWithGoogle, sendOtpRequest, verifyOtpRequest , continueWithGithub } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtpRequest);
router.post("/verify-otp", verifyOtpRequest);
router.post("/google-login" , continueWithGoogle)
router.get("/github/callback" , continueWithGithub)


export default router;
