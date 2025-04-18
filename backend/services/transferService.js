import TransferRequest from "../models/TransferRequest.js";
import TransferRemark from "../models/TransferRemark.js";
import Office from "../models/Office.js";
import { createLog } from "./logService.js";
import mongoose from "mongoose";

export const createTransferRequest = async (
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
  currentUser,
  ip
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingRequest = await TransferRequest.findOne({
      employee,
      status: "Pending",
    }).session(session);

    if (existingRequest) {
      throw new Error("A pending transfer request for this employee already exists");
    }

    const transferRequest = await TransferRequest.create(
      [{
        employee,
        fromOffice,
        toOffice,
        transferType,
        transferDate,
        transferReason,
        transferOrderNo,
        transferOrderDate,
        transferOrder,
        requestedBy: currentUser.userId,
        status: "Pending",
      }],
      { session }
    );

    await TransferRemark.create(
      [{
        transfer: transferRequest[0]._id,
        remarkType: "RequestCreation",
        remarkText: transferReason || "No remarks provided",
        addedBy: currentUser.userId,
      }],
      { session }
    );

    await createLog({
      admin: currentUser.userId,
      role: currentUser.role,
      action: "Employee Transfer Request",
      description: `Initiated transfer request for employee ${employee}. Reason: ${transferReason}`,
      ip,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return transferRequest[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const approveTransferRequestService = async (requestId, action, currentUser, ip, remarkText = "") => {
  const transferRequest = await TransferRequest.findById(requestId);

  if (!transferRequest) throw new Error("Transfer request not found");

  if (action === "approve") {
    transferRequest.status = "CEOApproved";
  } else if (action === "reject") {
    transferRequest.status = "Rejected";
  } else {
    throw new Error("Invalid action");
  }

  await transferRequest.save();

  await TransferRemark.create({
    transfer: transferRequest._id,
    remarkType: action === "approve" ? "CEOApproval" : "Rejection",
    remarkText: remarkText || (action === "approve" ? "Approved by CEO" : "Rejected by CEO"),
    addedBy: currentUser.userId,
  });

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Transfer Request Review",
    description: `${action} transfer request ${transferRequest._id}`,
    ip,
  });

  return transferRequest;
};

export const respondToTransferRequest = async (requestId, action, currentUser, ip, reason = "") => {
  const transferRequest = await TransferRequest.findById(requestId);

  if (!transferRequest) throw new Error("Transfer request not found");

  if (transferRequest.status !== "MainAdminApproved")
    throw new Error("Transfer request has not been approved by the Main Admin yet");

  if (action === "accept") {
    transferRequest.status = "FullyApproved";
  } else if (action === "reject") {
    if (!reason || reason.trim() === "") throw new Error("Rejection reason is required");
    transferRequest.status = "Rejected";
  } else {
    throw new Error("Invalid action");
  }

  await transferRequest.save();

  await TransferRemark.create({
    transfer: transferRequest._id,
    remarkType: action === "accept" ? "SchoolAdminApproval" : "Rejection",
    remarkText: reason || (action === "accept" ? "Accepted by Receiving Office Admin" : "Rejected by Receiving Office Admin"),
    addedBy: currentUser.userId,
  });

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Incoming Transfer Response",
    description: `${action} transfer request ${transferRequest._id}`,
    ip,
  });

  return transferRequest;
};
