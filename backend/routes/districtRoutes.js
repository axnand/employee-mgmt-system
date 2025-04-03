import express from "express";
import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict
} from "../controllers/districtController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDistricts);
router.post("/", protect, isAdmin, createDistrict);
router.put("/:districtId", protect, isAdmin, updateDistrict);
router.delete("/:districtId", protect, isAdmin, deleteDistrict);

export default router;
