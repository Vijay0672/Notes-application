import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
// ✅ CORS middleware FIRST (before routes)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost:")) {
        // ✅ Allow any localhost port (5173, 5175, etc.)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allow cookies across ports
  })
);


// ✅ Allow JSON + cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
