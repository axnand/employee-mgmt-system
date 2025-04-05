import express from "express";
import {
  getAllSchools,
  getSchoolById,
  getMySchool,
  getSchoolStatus,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status", protect, getSchoolStatus); 

router.get("/mine", protect, getMySchool); 

router.get("/", protect, authorizeRoles("CEO", "ZEO"), getAllSchools); 

router.get("/:id", protect, getSchoolById); 

router.post("/", protect, authorizeRoles("CEO", "ZEO"), createSchool); 

router.put("/:id", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), updateSchool);

router.delete("/:id", protect, authorizeRoles("CEO", "ZEO"), deleteSchool);

export default router;
