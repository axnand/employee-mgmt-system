import express from "express";
import {
  getZones,
  createZone,
  updateZone,
  deleteZone
} from "../controllers/zoneController.js";

const router = express.Router();

router.get("/", getZones);
router.post("/", createZone);
router.put("/:zoneId", updateZone);
router.delete("/:zoneId", deleteZone);

export default router;
