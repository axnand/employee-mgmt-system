import express from "express";
import {
  getTransferRequests,
  createTransferRequest,
  approveTransferRequest,
  respondToTransferRequest,
} from "../controllers/transferController.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/transfers
 * Protected route - 
 *  - Main admin can view all transfer requests.
 *  - School admin can view only requests initiated by or targeting their school.
 */
router.get("/", protect, getTransferRequests);

/**
 * POST /api/transfers
 * Protected route - 
 *  - Only school admin can initiate a transfer request.
 */
router.post("/", protect, isSchoolAdmin, createTransferRequest);

/**
 * PUT /api/transfers/:id/approve
 * Protected route - 
 *  - Only main admin can approve or reject a transfer request.
 */
router.put("/:id/approve", protect, isAdmin, approveTransferRequest);

/**
 * PUT /api/transfers/:id/respond
 * Protected route - 
 *  - Only the receiving school admin can accept or reject an approved transfer request.
 */
router.put("/:id/respond", protect, isSchoolAdmin, respondToTransferRequest);

export default router;
