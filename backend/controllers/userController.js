
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose, { Types } from "mongoose";
import crypto from "crypto";


export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const salt = crypto.randomBytes(16)
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512").toString("base64url");
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
        password: `${salt.toString("base64url")}.${hashedPassword.toString("base64url")}`,
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
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials , User not found" });
  }
  const [salt, savedPassword] = user.password.split(".");

  const enterPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, "base64url"), 100000, 32, "sha512").toString("base64url");
  if (savedPassword !== enterPassword) {
    return res.status(401).json({ error: "Invalid Credentials  , password does not match" });
  }

  const cookiesPayload = JSON.stringify({
    _id: user._id.toString(),
    expiry: Math.round(Date.now() / 1000 + 100000),
  })

  res.cookie("token", cookiesPayload, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, 
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
