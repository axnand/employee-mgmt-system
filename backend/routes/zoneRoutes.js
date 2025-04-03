import express from "express";
import {
  getZones,
  createZone,
  updateZone,
  deleteZone,
} from "../controllers/zoneController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getZones);
router.post("/", protect, authorizeRoles("CEO"), createZone);
router.put("/:zoneId", protect, authorizeRoles("CEO"), updateZone);
router.delete("/:zoneId", protect, authorizeRoles("CEO"), deleteZone);

export default router;
