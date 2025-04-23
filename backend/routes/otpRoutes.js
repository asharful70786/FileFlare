import express from "express";
import { sendOtpRequest, verifyOtpRequest } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp", sendOtpRequest);
router.post("/verify-otp", verifyOtpRequest);

export default router;
