
import TransferRequest from "../models/TransferRequest.js";
import TransferRemark from "../models/TransferRemark.js";
import { 
  createTransferRequest as createTransferRequestService,
  approveTransferRequest as approveTransferService,
  respondToTransferRequest as respondTransferService 
} from "../services/transferService.js";


export const getTransferRequests = async (req, res) => {
  try {
    let query = {};

    if (req.user.role.roleName === "CEO") {
      query = {}; 
    } 
    else if (req.user.role.roleName === "ZEO") {
      query = { fromZone: req.user.zoneId };
    } 
    else if (req.user.role.roleName === "School") {
      query = { $or: [{ fromSchool: req.user.schoolId }, { toSchool: req.user.schoolId }] };
    } 
    else {
      return res.status(403).json({ message: "Not authorized to view transfer requests" });
    }

    const requests = await TransferRequest.find(query)
      .populate("employee")
      .populate("fromSchool")
      .populate("toSchool")
      .exec();
      
    res.json({ transferRequests: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer requests", error: error.message });
  }
};


export const createTransferRequest = async (req, res) => {
  try {
    const { employeeId, toSchoolId, comment } = req.body;
    const fromSchoolId = req.user.schoolId;
    const transferRequest = await createTransferRequestService(
      { employeeId, fromSchoolId, toSchoolId, requestedBy: req.user.userId, comment },
      req.user,
      req.ip
    );

    await TransferRemark.create({
      transferRequest: transferRequest._id,
      remarkType: "RequestCreation",
      remarkText: comment || "No remarks provided",
      addedBy: req.user.userId,
    });
    res.status(201).json({ message: "Transfer request created", transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error creating transfer request", error: error.message });
  }
};


export const approveTransferRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const transferRequest = await approveTransferService(req.params.id, action, req.user, req.ip);
    await TransferRemark.create({
      transferRequest: transferRequest._id,
      remarkType: action === "approve" ? "MainAdminApproval" : "Rejection",
      remarkText: remarkText || "No remarks provided",
      addedBy: req.user.userId,
    });

    res.json({ message: `Transfer request ${action}d successfully`, transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer request", error: error.message });
  }
};


export const respondToTransferRequest = async (requestId, action, currentUser, ip, reason) => {
  try {
    console.log("🔍 Received Transfer Response Request:", { requestId, action, reason });
    const transferRequest = await TransferRequest.findById(requestId);
    await TransferRemark.create({
      transferRequest: transferRequest._id,
      remarkType: action === "accept" ? "SchoolAdminApproval" : "Rejection",
      remarkText: reason || "No remarks provided",
      addedBy: req.user.userId,
    });
    
    if (!transferRequest) {
      console.error("❌ Transfer request not found:", requestId);
      throw new Error("Transfer request not found");
    }

    if (transferRequest.status !== "approved_by_main") {
      console.error("❌ Transfer request not approved yet:", requestId);
      throw new Error("Transfer request has not been approved by the main admin yet");
    }

    if (action === "accept") {
      console.log("✅ Transfer request accepted:", requestId);
      transferRequest.status = "accepted_by_receiving";

    } else if (action === "reject") {
      if (!reason || reason.trim() === "") {
        console.error("❌ Rejection reason is missing");
        throw new Error("Rejection reason is required");
      }

      const trimmedReason = reason.trim();
      transferRequest.status = "rejected";
      transferRequest.rejectionReason = trimmedReason;

      console.log("❌ Transfer request rejected with reason:", trimmedReason);
    } else {
      console.error("❌ Invalid action received:", action);
      throw new Error("Invalid action");
    }
    await transferRequest.save();
    await createLog({
      admin: currentUser.userId,
      role: currentUser.role,
      action: "Incoming Transfer Response",
      description: `${action} transfer request ${transferRequest._id}` + 
        (action === "reject" ? ` with reason: ${reason}` : ""),
      ip,
    });

    console.log("✅ Transfer request updated successfully:", transferRequest);
    return transferRequest;

  } catch (error) {
    console.error("🚨 Error processing transfer response:", error.message);
    throw new Error(error.message);
  }
};


