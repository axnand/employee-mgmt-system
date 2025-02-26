import express from "express";
import { getLogs, getLocalStats } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/logs
 * Protected route - 
 *  - Main admin sees all logs.
 *  - School admin sees only logs relevant to their school (and their own actions).
 */
router.get("/", protect, getLogs);

/**
 * GET /api/logs/stats
 * Protected route - 
 *  - Returns aggregated stats (e.g., total actions in 24h, attendance updates, transfers, etc.).
 */
router.get("/stats", protect, getLocalStats);

export default router;
