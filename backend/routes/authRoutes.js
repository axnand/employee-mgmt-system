import express from "express";
import {
  loginUser,
  updatePassword,
  registerSchoolAdmin,
  registerStaff,
  registerZonalAdmin
} from "../controllers/authController.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.put("/update-password", protect, updatePassword);
router.post("/register-school-admin", protect, isAdmin, registerSchoolAdmin);
router.post("/register-staff", protect, isSchoolAdmin, registerStaff);
router.post("/register-zonal-admin", protect, isAdmin, registerZonalAdmin);

export default router;
