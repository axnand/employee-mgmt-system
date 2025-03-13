
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "employee_photos", 
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

const router = express.Router();

// POST /api/uploads - upload a file and return its URL
router.post("/", parser.single("file"), (req, res) => {
  // req.file.path will contain the URL
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});

export default router;
