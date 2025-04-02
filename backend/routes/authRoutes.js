import express from "express";
import {
  loginUser,
  updatePassword,
  registerSchoolAdmin,
} from "../controllers/authController.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

router.put("/update-password", protect, updatePassword);

router.post("/register-school-admin", protect, isAdmin, registerSchoolAdmin);



export default router;
