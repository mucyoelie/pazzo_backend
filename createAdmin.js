import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./schema/user.js";

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "developerfrontend84@gmail.com";
  const password = "kigali123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    return process.exit();
  }

  const user = new User({ email, password: hashedPassword });
  await user.save();

  console.log("Admin user created!");
  process.exit();
}

createAdmin();