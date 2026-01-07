// models/Server.js
import mongoose from "mongoose";

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: Buffer }, // Store image as binary
});

export const Server = mongoose.model("Server", ServerSchema);
