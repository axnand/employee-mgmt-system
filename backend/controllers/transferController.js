import TransferRequest from "../models/TransferRequest.js";
import TransferRemark from "../models/TransferRemark.js";
import { 
  createTransferRequest as createTransferRequestService,
  approveTransferRequestService as approveTransferRequestService,
  respondToTransferRequest as respondTransferService 
} from "../services/transferService.js";
export const getTransferRequests = async (req, res) => {
  try {
    const requests = await TransferRequest.find()
      .populate("employee")
      .populate("fromOffice")
      .populate("toOffice")
      .exec();

    res.json({ transferRequests: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer requests", error: error.message });
  }
};

export const createTransferRequest = async (req, res) => {
  try {
    const {
      employee,
      fromOffice,
      toOffice,
      transferType,
      transferDate,
      transferReason,
      transferOrderNo,
      transferOrderDate,
      transferOrder,
    } = req.body;

    if (!employee || !fromOffice || !toOffice || !transferType || !transferDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transferRequest = await createTransferRequestService(
      {
        employee,
        fromOffice,
        toOffice,
        transferType,
        transferDate,
        transferReason,
        transferOrderNo,
        transferOrderDate,
        transferOrder,
      },
      req.user,
      req.ip
    );

    return res.status(201).json({ message: "Transfer request created", transferRequest });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating transfer request",
      error: error.message,
    });
  }
};



export const approveTransferRequest = async (req, res) => {
  try {
    const { action, remarkText } = req.body;
    const transferRequest = await approveTransferRequestService(
      req.params.id,
      action,
      req.user,
      req.ip,
      remarkText
    );

    res.json({ message: `Transfer request ${action}d successfully`, transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer request", error: error.message });
  }
};


export const respondToTransferRequest = async (requestId, action, currentUser, ip, reason = "") => {
  try {
    console.log("🔍 Received Transfer Response Request:", { requestId, action, reason });

    const transferRequest = await TransferRequest.findById(requestId);
    if (!transferRequest) throw new Error("Transfer request not found");

    // Only allow school admin to act on MainAdminApproved requests
    if (transferRequest.status !== "MainAdminApproved") {
      throw new Error("Transfer request has not been approved by the Main Admin yet");
    }

    let remarkType = "";
    let remarkText = "";

    if (action === "accept") {
      transferRequest.status = "FullyApproved";
      transferRequest.acceptedBy = currentUser.userId;
      transferRequest.acceptanceDate = new Date();

      remarkType = "SchoolAdminApproval";
      remarkText = "Accepted by Receiving Office Admin";
    } else if (action === "reject") {
      const trimmedReason = reason.trim();
      if (!trimmedReason) throw new Error("Rejection reason is required");

      transferRequest.status = "Rejected";
      transferRequest.processedBy = currentUser.userId;
      transferRequest.approvalDate = new Date();

      remarkType = "Rejection";
      remarkText = trimmedReason;
    } else {
      throw new Error("Invalid action");
    }

    // Save updated transfer request
    await transferRequest.save();

    // Save remark
    await TransferRemark.create({
      transfer: transferRequest._id,
      remarkType,
      remarkText,
      addedBy: currentUser.userId,
    });

    // Log action
    await createLog({
      admin: currentUser.userId,
      role: currentUser.role,
      action: "Incoming Transfer Response",
      description: `${action} transfer request ${transferRequest._id}` + 
        (action === "reject" ? ` with reason: ${remarkText}` : ""),
      ip,
    });

    return transferRequest;
  } catch (error) {
    console.error("❌ Error in respondToTransferRequest:", error.message);
    throw new Error(error.message);
  }
};

