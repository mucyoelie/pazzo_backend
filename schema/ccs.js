import mongoose from "mongoose";

const ccsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: Buffer },      // raw image stored as binary
  imageType: { type: String },  // MIME type (e.g. image/png)
}, { timestamps: true });

const CCS = mongoose.model("CCS", ccsSchema);
export default CCS;
;

