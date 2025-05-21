import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import {
  getCurrentUser,
  login,
  loginWithGoogle,
  logout,
  logoutAll,
  register,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/", checkAuth, getCurrentUser);

router.post("/logout", logout);
router.post("/logout-all", checkAuth, logoutAll);
router.post("/google-login", loginWithGoogle);

export default router;
