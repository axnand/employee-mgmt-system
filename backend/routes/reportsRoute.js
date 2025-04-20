import { getEmployeeReport, getSchoolReport } from "../controllers/reportController";

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/employees", protect, getEmployeeReport);
router.get("/school", protect, getSchoolReport);

export default router;