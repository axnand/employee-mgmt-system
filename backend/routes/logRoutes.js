import express from "express";
import { getLogs, getLocalStats } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLogs);

router.get("/stats", protect, getLocalStats);

export default router;
