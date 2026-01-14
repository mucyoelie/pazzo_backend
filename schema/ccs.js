import mongoose from "mongoose";

const ccsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String
});

const CCS = mongoose.model("CCS", ccsSchema);
export default CCS;

