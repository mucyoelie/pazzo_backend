import mongoose from "mongoose";

const partnerRequestSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: String,
  phone: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PartnerRequest", partnerRequestSchema);
