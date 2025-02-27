// controllers/transferController.js
import TransferRequest from "../models/TransferRequest.js";
import { 
  createTransferRequest as createTransferRequestService,
  approveTransferRequest as approveTransferService,
  respondToTransferRequest as respondTransferService 
} from "../services/transferService.js";

/**
 * GET /api/transfers
 * - Main admin: can view all transfer requests.
 * - School admin: can view requests either initiated by or targeting their school.
 */
export const getTransferRequests = async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    let filter = {};
    if (role === "schoolAdmin") {
      filter = { $or: [{ fromSchool: schoolId }, { toSchool: schoolId }] };
    }
    const requests = await TransferRequest.find(filter)
      .populate("employee")
      .populate("fromSchool")
      .populate("toSchool")
      .exec();
    res.json({ transferRequests: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer requests", error });
  }
};

/**
 * POST /api/transfers
 * - School admin can initiate a transfer request.
 *   Expected req.body: { employeeId, toSchoolId, comment }
 */
export const createTransferRequest = async (req, res) => {
  try {
    const { employeeId, toSchoolId, comment } = req.body;
    // fromSchool is derived from the authenticated user's school.
    const fromSchoolId = req.user.schoolId;
    // Delegate the creation to the transfer service.
    const transferRequest = await createTransferRequestService(
      { employeeId, fromSchoolId, toSchoolId, requestedBy: req.user.userId, comment },
      req.user,
      req.ip
    );
    res.status(201).json({ message: "Transfer request created", transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error creating transfer request", error: error.message });
  }
};

/**
 * PUT /api/transfers/:id/approve
 * - Main admin can approve (or reject) a transfer request.
 *   Expected req.body: { action } where action is "approve" or "reject".
 */
export const approveTransferRequest = async (req, res) => {
  try {
    const { action } = req.body; // "approve" or "reject"
    const transferRequest = await approveTransferService(req.params.id, action, req.user, req.ip);
    res.json({ message: `Transfer request ${action}d successfully`, transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer request", error: error.message });
  }
};

/**
 * PUT /api/transfers/:id/respond
 * - Receiving school admin responds to an approved transfer request.
 *   Expected req.body: { action } with "accept" or "reject".
 */
export const respondToTransferRequest = async (req, res) => {
  try {
    const { action } = req.body; // "accept" or "reject"
    const transferRequest = await respondTransferService(req.params.id, action, req.user, req.ip);
    res.json({ message: `Transfer request ${action}ed successfully`, transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error responding to transfer request", error: error.message });
  }
};
