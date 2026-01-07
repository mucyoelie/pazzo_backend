import mongoose from "mongoose";

const switchSchema = new mongoose.Schema({
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

export const Switch = mongoose.model("Switch", switchSchema);
