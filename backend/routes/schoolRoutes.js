import express from "express";
import {
  getAllSchools,
  getSchoolById,
  getMySchool,
  getSchoolStatus,
} from "../controllers/schoolController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status", protect, getSchoolStatus);

router.get("/mine", protect, getMySchool);

router.get("/", protect, getAllSchools);

router.get("/:id", protect, getSchoolById);

export default router;
