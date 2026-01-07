import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ServerRoutes from "./Routes/ServerRoutes.js";
import authRoutes from "./Routes/auth.js";
import FirewallRoutes from "./Routes/FirewallRoutes.js";
import LaptopRoutes from "./Routes/LaptopRoutes.js";
import SwitchRoutes from "./Routes/SwitchRoutes.js";
import partnerRoutes from "./Routes/partnerRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // stop the server if DB fails
  }
}

connectDB();

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});
app.use("/api/auth", authRoutes);
app.use("/api/servers", ServerRoutes);
app.use("/api/firewalls", FirewallRoutes);
app.use("/api/laptops", LaptopRoutes);
app.use("/api/switches", SwitchRoutes);
app.use("/api/partners", partnerRoutes);

// ❌ 404 Handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  console.error("⚠️ 404:", error.message);
  res.status(404).json({ message: error.message });
});

// 🛑 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

