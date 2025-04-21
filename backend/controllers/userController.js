// import { client } from "../config/db.js";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose, { Types } from "mongoose";
import crypto from "crypto";
import { json } from "stream/consumers";
import { signedCookie } from "cookie-parser";
// import { Types } from "mongoose";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  // let password_Salt = "FJ6b1+49KmmdeHSNHq+4";
  let hased_Pass = crypto
    .createHash("sha256")
    .update("FJ6b1+49KmmdeHSNHq+4")
    .digest("hex");
  // const db = req.db;
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(409).json({
      error: "User already exists",
      message:
        "A user with this email address already exists. Please try logging in or use a different email.",
    });
  }
  const session = await mongoose.startSession();

  try {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    console.log(rootDirId, userId);
    session.startTransaction();
    await Directory.insertOne(
      {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session }
    );

    await User.insertOne(
      {
        _id: userId,
        name,
        email,
        password: hased_Pass,
        rootDirId,
      },
      { session }
    );

    session.commitTransaction();
    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    session.abortTransaction();
    // console.error("Error in register:", err.errorResponse.errInfo.details.schemaRulesNotSatisfied);
    //in the upper case we can debug the error and find out the exact error
    if (err.code === 121) {
      res
        .status(400)
        .json({ error: "Invalid input, please enter valid details" });
    } else {
      next(err);
    }
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let verify_Pass = crypto
    .createHash("sha256")
    .update("FJ6b1+49KmmdeHSNHq+4")
    .digest("hex");

  const user = await User.findOne({ email, password: verify_Pass });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }
  const cookiesPayload = JSON.stringify({
    _id: user._id.toString(),
    expiry: Math.round(Date.now() / 1000 + 100000),
  })

  res.cookie("token", cookiesPayload, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  res.status(200).json({ message: "Logged In" });
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
  });
};

export const logout = (req, res) => {
  res.clearCookie("uid");
  res.status(204).end();
};
