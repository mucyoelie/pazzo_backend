import express from "express";
import multer from "multer";
import { Server } from "../schema/server.js";

const router = express.Router();
const storage = multer.memoryStorage(); // store image in memory as Buffer
const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageBuffer = req.file?.buffer;

    const newServer = new Server({
      name,
      price,
      description,
      image: imageBuffer,
    });

    await newServer.save();
    res.status(201).json({ message: "Product created", server: newServer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ all
router.get("/", async (req, res) => {
  try {
    const servers = await Server.find();
    const formatted = servers.map((item) => ({
      ...item.toObject(),
      image: item.image?.toString("base64"),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching servers" });
  }
});

// READ single
router.get("/:id", async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) return res.status(404).json({ message: "Not found" });
    res.json({ ...server.toObject(), image: server.image?.toString("base64") });
  } catch (error) {
    res.status(500).json({ message: "Error fetching server", error: error.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file?.buffer;

    const updated = await Server.findByIdAndUpdate(
      req.params.id,
      { name, price, description, ...(image && { image }) },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", server: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating", error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Server.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", server: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
});

export default router;
