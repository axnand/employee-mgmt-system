import TransferRequest from "../models/TransferRequest.js";
import School from "../models/School.js";
import { createLog } from "./logService.js";

export const createTransferRequest = async (
  { employeeId, fromSchoolId, toSchoolId, requestedBy, comment },
  currentUser,
  ip
) => {
  const existingRequest = await TransferRequest.findOne({
    employee: employeeId,
    status: "pending",
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
    status: "pending",
    comment,
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


export const approveTransferRequest = async (requestId, action, currentUser, ip) => {
  const transferRequest = await TransferRequest.findById(requestId);

  if (!transferRequest) throw new Error("Transfer request not found");

  if (action === "approve") transferRequest.status = "approved_by_main";
  else if (action === "reject") transferRequest.status = "rejected";
  else throw new Error("Invalid action");

  await transferRequest.save();

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Transfer Request Review",
    description: `${action} transfer request ${transferRequest._id}`,
    ip,
  });

  return transferRequest;
};


export const respondToTransferRequest = async (requestId, action, currentUser, ip, reason) => {
  const transferRequest = await TransferRequest.findById(requestId);

  if (!transferRequest) throw new Error("Transfer request not found");

  if (transferRequest.status !== "approved_by_main")
    throw new Error("Transfer request has not been approved by the CEO yet");

  if (action === "accept") transferRequest.status = "accepted_by_receiving";
  else if (action === "reject") {
    if (!reason || reason.trim() === "") throw new Error("Rejection reason is required");
    transferRequest.status = "rejected";
    transferRequest.rejectionReason = reason;
  } else throw new Error("Invalid action");

  await transferRequest.save();

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Incoming Transfer Response",
    description: `${action} transfer request ${transferRequest._id}`,
    ip,
  });

  return transferRequest;
};
