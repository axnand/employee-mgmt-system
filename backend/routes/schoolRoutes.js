import express from "express";
import {
  getAllSchools,
  getSchoolById,
  getMySchool,
  getSchoolStatus,
} from "../controllers/schoolController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// These endpoints are now accessible by any authenticated user

// GET /api/schools/status – returns zones with their schools
router.get("/status", protect, getSchoolStatus);

// GET /api/schools/mine – returns the authenticated user's school (if available)
router.get("/mine", protect, getMySchool);

// GET /api/schools – returns all schools
router.get("/", protect, getAllSchools);

// GET /api/schools/:id – returns a specific school by id
router.get("/:id", protect, getSchoolById);

export default router;
