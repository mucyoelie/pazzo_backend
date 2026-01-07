import mongoose from "mongoose";

const firewallSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: Buffer,
});

export const Firewall = mongoose.model("Firewall", firewallSchema);
