import Otp from "../models/otpModel.js";
import { sendOtp } from "../services/otpService.js";
import User from "../models/userModel.js";

import { loginWithGoogle } from "../services/loginWithGoogle.js";

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

  let userInfo = await loginWithGoogle(token);
  const { name, email, picture } = userInfo;
  const user = await User.findOne({ email });
  if (!user) {
    // const newUser = await User.create({
    //   name,
    //   email,
    //   profile: picture
    // }); 
    // // i have also emplement here rootdir and handle with session
    return res.json({ message: "created bal  " });
  } else {
    return res.status(400).json({ error: "User exists" });
  }


}





export { sendOtpRequest, verifyOtpRequest };
