import { ObjectId } from "mongodb";
import User from "../models/userModel.js";
import crypto from "crypto";

export default async function checkAuth(req, res, next) {
  const {token } = req.signedCookies
  //in cookie perser we founf cookie on  req.signedCookies
  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

   const {_id , expiry } = JSON.parse(token)

  try {
    const user = await User.findOne({ _id }).lean();
    if (!user) {
      return res.status(401).json({ error: "Not logged!" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not logged in!" });
  }
}
