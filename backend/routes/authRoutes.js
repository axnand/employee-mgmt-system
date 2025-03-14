import express from "express";
import {
  loginUser,
  updatePassword,
  registerSchoolAdmin,
} from "../controllers/authController.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/auth/login
 * Public route - Logs in a user (admin, schoolAdmin, or staff).
 */
router.post("/login", loginUser);

/**
 * PUT /api/auth/update-password
 * Protected route - Forces user to update password on first login or any other time.
 */
router.put("/update-password", protect, updatePassword);

/**
 * POST /api/auth/register-school-admin
 * Protected route - Only main admin can register a new school admin.
 */
router.post("/register-school-admin", protect, isAdmin, registerSchoolAdmin);

/**
 * POST /api/auth/register-staff
 * Protected route - School admin (or main admin) can register new staff.
 */


export default router;
