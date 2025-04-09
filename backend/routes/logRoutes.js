import express from "express";
import { getLogs, getLocalStats, getLastLogin } from "../controllers/logController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("CEO", "ZEO", "School"), getLogs);
router.get("/stats", protect, authorizeRoles("CEO", "ZEO", "School"), getLocalStats);
router.get("/user/:username/last-login", getLastLogin);

export default router;
