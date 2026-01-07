import express from "express";
import multer from "multer";
import { Firewall } from "../schema/firewallSchema.js";

const router = express.Router();

// Store image in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE a new firewall product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;

    const firewall = await Firewall.create({
      name,
      price,
      description,
      image: imageBuffer,
    });

    res.status(201).json({ message: "Firewall created successfully", firewall });
  } catch (error) {
    res.status(500).json({ message: "Error creating firewall", error: error.message });
  }
});

// READ all firewall products
router.get("/", async (req, res) => {
  try {
    const firewalls = await Firewall.find();
    const formatted = firewalls.map((item) => ({
      ...item.toObject(),
      image: item.image?.toString("base64"),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching firewalls", error: error.message });
  }
});

// READ a single firewall product by ID
router.get("/:id", async (req, res) => {
  try {
    const firewall = await Firewall.findById(req.params.id);
    if (!firewall) return res.status(404).json({ message: "Firewall not found" });

    res.json({ ...firewall.toObject(), image: firewall.image?.toString("base64") });
  } catch (error) {
    res.status(500).json({ message: "Error fetching firewall", error: error.message });
  }
});

// UPDATE a firewall product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.buffer;

    const updated = await Firewall.findByIdAndUpdate(
      req.params.id,
      { name, price, description, ...(image && { image }) },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Firewall not found" });

    res.json({ message: "Firewall updated successfully", firewall: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating firewall", error: error.message });
  }
});

// DELETE a firewall product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Firewall.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Firewall not found" });

    res.json({ message: "Firewall deleted successfully", firewall: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting firewall", error: error.message });
  }
});

export default router;
