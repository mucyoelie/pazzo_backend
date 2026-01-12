import express from "express";
import multer from "multer";
import { CCS } from "../schema/ccs.js"; 

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;

    const newCCS = new CCS({
      name,
      price: Number(price),
      description,
      image: imageBuffer,
    });

    await newCCS.save();

    res.status(201).json({
      message: "CCS item created successfully",
      ccs: {
        ...newCCS.toObject(),
        image: imageBuffer ? imageBuffer.toString("base64") : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await CCS.find();

    const formatted = items.map((item) => ({
      ...item.toObject(),
      image: item.image ? item.image.toString("base64") : null,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CCS", error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const item = await CCS.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "CCS not found" });

    res.json({
      ...item.toObject(),
      image: item.image ? item.image.toString("base64") : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching CCS", error: error.message });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newImage = req.file?.buffer;

    const updated = await CCS.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        description,
        ...(newImage && { image: newImage }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "CCS not found" });

    res.json({
      message: "CCS updated successfully",
      ccs: {
        ...updated.toObject(),
        image: updated.image ? updated.image.toString("base64") : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating CCS", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CCS.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "CCS not found" });

    res.json({
      message: "CCS deleted successfully",
      ccs: {
        _id: deleted._id,
        name: deleted.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting CCS", error: error.message });
  }
});


export default router;
