import express from "express";
import { getLogs, getLocalStats } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route: Main admin sees all logs; school admin sees only logs for their school.
router.get("/", protect, getLogs);

// Protected route: Returns aggregated stats for the last 24 hours.
router.get("/stats", protect, getLocalStats);

export default router;
