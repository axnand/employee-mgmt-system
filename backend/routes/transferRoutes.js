import express from "express";
import {
  createTransferRequest,
  approveTransferRequest,
  respondToTransferRequest,
  getTransferRequests,
} from "../controllers/transferContoller.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/transfers
 * Protected route - 
 *  - Main admin can see all transfer requests.
 *  - School admin can see only those initiated by or targeting their school.
 */
router.get("/", protect, getTransferRequests);

/**
 * POST /api/transfers
 * Protected route - 
 *  - School admin can initiate a transfer request.
 */
router.post("/", protect, isSchoolAdmin, createTransferRequest);

/**
 * PUT /api/transfers/:id/approve
 * Protected route - 
 *  - Main admin approves or rejects the request (status changes to 'approved_by_main' or 'rejected').
 */
router.put("/:id/approve", protect, isAdmin, approveTransferRequest);

/**
 * PUT /api/transfers/:id/respond
 * Protected route - 
 *  - Receiving school admin accepts or rejects an already approved request (status changes to 'accepted_by_receiving' or 'rejected').
 */
router.put("/:id/respond", protect, isSchoolAdmin, respondToTransferRequest);

export default router;
