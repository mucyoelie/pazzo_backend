import express from "express";
import multer from "multer";
import { Openups } from "../schema/openups.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE OpenUps
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;
    const imageType = req.file?.mimetype;

    const newOpenups = new Openups({
      name,
      price: Number(price),
      description,
      image: imageBuffer,
      imageType,
    });

    await newOpenups.save();

    res.status(201).json({
      message: "OpenUps created successfully",
      data: {
        _id: newOpenups._id,
        name: newOpenups.name,
        price: newOpenups.price,
        description: newOpenups.description,
        image: newOpenups.image ? { data: newOpenups.image.toString("base64"), contentType: newOpenups.imageType } : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all OpenUps
router.get("/", async (req, res) => {
  try {
    const items = await Openups.find();
    const formatted = items.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image ? { data: item.image.toString("base64"), contentType: item.imageType } : null,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching OpenUps", error: error.message });
  }
});

// UPDATE OpenUps
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;
    const imageType = req.file?.mimetype;

    const updated = await Openups.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        price: Number(price), 
        description, 
        ...(imageBuffer && { image: imageBuffer, imageType }) 
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json({
      message: "OpenUps updated successfully",
      data: updated.image ? { 
        _id: updated._id,
        name: updated.name,
        price: updated.price,
        description: updated.description,
        image: { data: updated.image.toString("base64"), contentType: updated.imageType }
      } : updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating OpenUps", error: error.message });
  }
});

// DELETE OpenUps
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Openups.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "OpenUps deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting OpenUps", error: error.message });
  }
});

export default router;
