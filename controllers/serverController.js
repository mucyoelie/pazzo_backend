// controllers/serverController.js
import multer from "multer";
import { Server } from "../schema/server.js";

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createServerProduct = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, description } = req.body;

      const newServer = await Server.create({
        name,
        price,
        description,
        image: req.file ? req.file.buffer.toString("base64") : null, // Optional: store image as base64
      });

      res.status(201).json({ message: "Server product created", server: newServer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create server product" });
    }
  },
];
