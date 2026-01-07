// routes/SwitchRoutes.js
import express from "express";
import multer from "multer";
import { Switch } from "../schema/switchSchema.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;

    const newSwitch = new Switch({
      name,
      price,
      description,
      image: imageBuffer,
    });

    await newSwitch.save();
    res.status(201).json({ message: "Switch created", switch: newSwitch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ all
router.get("/", async (req, res) => {
  try {
    const switches = await Switch.find();
    const formatted = switches.map((item) => ({
      ...item.toObject(),
      image: item.image?.toString("base64"),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching switches" });
  }
});

// READ single
router.get("/:id", async (req, res) => {
  try {
    const singleSwitch = await Switch.findById(req.params.id);
    if (!singleSwitch) return res.status(404).json({ message: "Not found" });
    res.json({ ...singleSwitch.toObject(), image: singleSwitch.image?.toString("base64") });
  } catch (error) {
    res.status(500).json({ message: "Error fetching switch", error: error.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.buffer;

    const updated = await Switch.findByIdAndUpdate(
      req.params.id,
      { name, price, description, ...(image && { image }) },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", switch: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating", error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Switch.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", switch: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
});

export default router;
