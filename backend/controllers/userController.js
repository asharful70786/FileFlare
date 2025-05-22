
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import Session from "../models/sessionModel.js";


export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  let hased_Password = await bcrypt.hash(password, 10);
  const foundUser = await User.findOne({ email });
  const session = await mongoose.startSession();

  try {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();
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
        password: hased_Password,
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
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(409).json({ error: "A user with this email address already exists" });
      }
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

  try {
    let enteredPassword = await bcrypt.compare(password, user.password);

    if (!enteredPassword) {
      return res.status(401).json({ error: "Invalid Credentials  , User not found" });
    }

    const session = await Session.create({ userId: user._id });
    const userSession = await Session.find({ userId: user._id });
    if (userSession.length >= 3) {
      await Session.findByIdAndDelete(userSession[0]._id);
    } //logout user if he login more than 3 times

    res.cookie("sid", session._id, {
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({ message: "Logged In" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error at login time" });
  }
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture
  });
};

export const logout = async (req, res) => {
  res.clearCookie("sid");
  await Session.findByIdAndDelete(req.signedCookies.sid);
  res.status(204).end();
};

// export const continueWithGoogle = async (req, res) => {
//   const { token } = req.body;
//   if (!token) {
//     return res.status(400).json({ error: "Token is required" });
//   }

//   let userInfo = await loginWithGoogle(token);
//    const {name , email , picture } = userInfo;
//    console.log(name , email , picture);
//     const user = await User.findOne({email});
//     if (!user) {
//       return ;
//     }else{
//       const newUser =   await User.create({
//         name,
//         email,
//         profile: picture
//       });
//       res.json({ newUser });
//     }


// }



export const logoutAll = async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.user._id });
    res.clearCookie("sid");
    console.log("All sessions deleted");
    return res.status(204).end();
  } catch (error) {
    console.error("Error in logoutAll:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
