import express from "express";
import {
  getAllSchools,
  getSchoolById,
  getMySchool,
  getSchoolStatus,
} from "../controllers/schoolController.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/schools
 * Protected route - 
 *  - Main admin can view all schools.
 */
router.get("/", protect, isAdmin, getAllSchools);

/**
 * GET /api/schools/mine
 * Protected route - 
 *  - School admin can view details of their own school.
 */
router.get("/mine", protect, isSchoolAdmin, getMySchool);

/**
 * GET /api/schools/:id
 * Protected route - 
 *  - Main admin can view details of any school by ID.
 */
router.get("/:id", protect, isAdmin, getSchoolById);

router.get("/status", protect, isAdmin, getSchoolStatus);

export default router;
