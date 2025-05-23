import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getCurrentUser,
  login,
  logout,
  logoutAll,
  register,
} from "../controllers/userController.js";


const router = express.Router();

router.post("/user/register", register);

router.post("/user/login", login);

router.get("/user/", checkAuth, getCurrentUser);
router.get("/users", checkAuth, (req, res, next) => {
  if (req.user.role == "user") {
    return res.status(403).json({ error: "You are not Authorizes to login the  page " });
  }
  next();
}, getAllUsers);

router.post("/logout", logout);
router.post("/logout-all", checkAuth, logoutAll);



export default router;
