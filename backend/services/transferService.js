import TransferRequest from "../models/TransferRequest.js";
import TransferRemark from "../models/TransferRemark.js";
import School from "../models/School.js";
import { createLog } from "./logService.js";

export const createTransferRequest = async (
  { employeeId, fromSchoolId, toSchoolId, requestedBy, comment },
  currentUser,
  ip
) => {
  const existingRequest = await TransferRequest.findOne({
    employee: employeeId,
    status: "Pending",
  });

  if (existingRequest) {
    throw new Error("A pending transfer request for this employee already exists");
  }

  const fromSchool = await School.findById(fromSchoolId);
  if (!fromSchool) throw new Error("Source school not found");

  const transferRequest = await TransferRequest.create({
    employee: employeeId,
    fromSchool: fromSchoolId,
    toSchool: toSchoolId,
    requestedBy,
    status: "Pending",
    comment,
  });

  await TransferRemark.create({
    transferRequest: transferRequest._id,
    remarkType: "RequestCreation",
    remarkText: comment || "No remarks provided",
    addedBy: currentUser.userId,
  });

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Employee Transfer Request",
    school: fromSchool.name,
    description: `Initiated transfer request for employee ${employeeId}. Reason: ${comment}`,
    ip,
  });

  return transferRequest;
};

export const approveTransferRequest = async (requestId, action, currentUser, ip, remarkText = "") => {
  const transferRequest = await TransferRequest.findById(requestId);

  if (!transferRequest) throw new Error("Transfer request not found");

  if (action === "approve") {
    transferRequest.status = "MainAdminApproved";
  } else if (action === "reject") {
    transferRequest.status = "Rejected";
  } else {
    throw new Error("Invalid action");
  }

  await transferRequest.save();

  await TransferRemark.create({
    transferRequest: transferRequest._id,
    remarkType: action === "approve" ? "MainAdminApproval" : "Rejection",
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
    transferRequest: transferRequest._id,
    remarkType: action === "accept" ? "SchoolAdminApproval" : "Rejection",
    remarkText: reason || (action === "accept" ? "Accepted by Receiving School Admin" : "Rejected by Receiving School Admin"),
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
