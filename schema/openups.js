// schema/openups.js
import mongoose from "mongoose";

const OpenupsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // make it Number
  description: { type: String, required: true },
  image: { type: Buffer },                  // store the raw image
  imageType: { type: String },             // store MIME type
}, { timestamps: true });

export const Openups = mongoose.model("Openups", OpenupsSchema);

