import express from "express";
import multer from "multer";
import { Openups } from "../schema/openups.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;

    const newOpenups = new Openups({
      name,
      price,
      description,
      image: imageBuffer,
    });

    await newOpenups.save();
    res.status(201).json({ message: "Open Ups created", data: newOpenups });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ all
router.get("/", async (req, res) => {
  try {
    const items = await Openups.find();
    const formatted = items.map((item) => ({
      ...item.toObject(),
      image: item.image?.toString("base64"),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

// READ single
router.get("/:id", async (req, res) => {
  try {
    const item = await Openups.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ 
      ...item.toObject(), 
      image: item.image?.toString("base64") 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.buffer;

    const updated = await Openups.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        price, 
        description, 
        ...(image && { image }) 
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating", error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Openups.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
});

export default router;
