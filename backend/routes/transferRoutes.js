import express from "express";
import {
  getTransferRequests,
  createTransferRequest,
  approveTransferRequest,
  respondToTransferRequest,
} from "../controllers/transferController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getTransferRequests); 
router.post("/", protect, authorizeRoles("School"), createTransferRequest);
router.put("/:id/approve", protect, authorizeRoles("CEO"), approveTransferRequest);
router.put("/:id/respond", protect, authorizeRoles("School"), respondToTransferRequest);

export default router;
