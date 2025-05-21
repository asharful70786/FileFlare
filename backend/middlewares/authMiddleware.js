import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";

export default async function checkAuth(req, res, next) {
  try {
    const { sid } = req.signedCookies;
    if (!sid) {
      return res.status(401).json({ error: "Not logged in!" });
    }
    const session = await Session.findById(sid);
    if (!session) {
      res.clearCookie("sid");
      return res.status(401).json({ error: "Session expired or invalid!" });
    }
    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      res.clearCookie("sid");
      await Session.findByIdAndDelete(sid);
      return res.status(401).json({ error: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("checkAuth error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
