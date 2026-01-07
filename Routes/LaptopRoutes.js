import express from "express";
import multer from "multer";
import { Laptop } from "../schema/laptop.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;

    const newLaptop = new Laptop({
      name,
      price,
      description,
      image: imageBuffer,
    });

    await newLaptop.save();
    res.status(201).json({ message: "Laptop created", laptop: newLaptop });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ all
router.get("/", async (req, res) => {
  try {
    const laptops = await Laptop.find();
    const formatted = laptops.map((item) => ({
      ...item.toObject(),
      image: item.image?.toString("base64"),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching laptops" });
  }
});

// READ single
router.get("/:id", async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) return res.status(404).json({ message: "Not found" });
    res.json({ ...laptop.toObject(), image: laptop.image?.toString("base64") });
  } catch (error) {
    res.status(500).json({ message: "Error fetching laptop", error: error.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.buffer;

    const updated = await Laptop.findByIdAndUpdate(
      req.params.id,
      { name, price, description, ...(image && { image }) },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", laptop: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating", error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Laptop.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", laptop: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
});

export default router;
