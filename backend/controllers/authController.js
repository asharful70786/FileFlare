import Otp from "../models/otpModel.js";
import { sendOtp } from "../services/otpService.js";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose, { Types } from "mongoose";
import { loginWithGoogle } from "../services/loginWithGoogle.js";
import Session from "../models/sessionModel.js";

const sendOtpRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const resData = await sendOtp(email);
    return res.status(200).json({ message: resData.message });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


const verifyOtpRequest = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }
    await Otp.deleteOne({ email });
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};


export const continueWithGoogle = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  let userInfo;
  try {
    userInfo = await loginWithGoogle(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  const { name, email, picture } = userInfo;

  try {
    const user = await User.findOne({ email });
    if (user) {
      //google login here 
      const session = await Session.create({ userId: user._id });
      const userSession = await Session.find({ userId: user._id });
      if (userSession.length >= 3) {
        await Session.findByIdAndDelete(userSession[0]._id);
      }
      res.cookie("sid", session._id, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.status(200).json({ message: "Logged In" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const newUserId = new Types.ObjectId();
    const rootDirId = new Types.ObjectId();

    // Create root directory for the user
    await Directory.create(
      [{
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId: newUserId
      }],
      { session }
    );

    // Create user document
    await User.create(
      [{
        _id: newUserId,
        name,
        email,
        picture,
        rootDirId
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    const userSession = await Session.create({ userId: newUserId });

    res.cookie("sid", userSession._id, {
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error in continueWithGoogle:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

export { sendOtpRequest, verifyOtpRequest };
