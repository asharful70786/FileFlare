import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import checkAuth from "./middlewares/authMiddleware.js";
import otpRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";


try {
  await connectDB();
  const app = express();
  app.use(cookieParser("this is a salt"));

  app.use(express.json());
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
  );




  app.use((req, res, next) => {
    next();
  });

  app.use("/directory", checkAuth, directoryRoutes);
  app.use("/file", checkAuth, fileRoutes);
  app.use("/", userRoutes);
  app.use("/auth", otpRoutes);

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({ error: "Something went wrong!" });
  });

  app.listen(4000, () => {
    console.log(`Server Started`);
  });
} catch (err) {
  console.log("Could not connect to database!");
  console.log(err);
}
