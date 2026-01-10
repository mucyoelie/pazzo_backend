import mongoose from "mongoose";

const openupsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: Buffer, // store image as Buffer
  },
});

export const Openups = mongoose.model("Openups", openupsSchema);
