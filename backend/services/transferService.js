import TransferRequest from "../models/TransferRequest.js";
import School from "../models/School.js";
import { createLog } from "./logService.js";

/**
 * Creates a transfer request from one school to another.
 * @param {Object} params - Contains employeeId, fromSchoolId, toSchoolId, requestedBy, and comment.
 * @param {Object} currentUser - The user initiating the request.
 * @param {String} ip - Request IP address.
 */
export const createTransferRequest = async (
  { employeeId, fromSchoolId, toSchoolId, requestedBy, comment },
  currentUser,
  ip
) => {
  // Check if a pending transfer already exists for this employee
  const existingRequest = await TransferRequest.findOne({
    employee: employeeId,
    status: "pending",
  });
  if (existingRequest) {
    throw new Error("A pending transfer request for this employee already exists");
  }

  // Proceed to create the transfer request if no pending request exists.
  const fromSchool = await School.findById(fromSchoolId);
  if (!fromSchool) {
    throw new Error("Source school not found");
  }
  const isEmployeeInSchool = fromSchool.employees.some(
    (empId) => empId.toString() === employeeId
  );
  if (!isEmployeeInSchool) {
    throw new Error("Employee not found in your school");
  }
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

/**
 * Approves or rejects a transfer request by the main admin.
 * @param {String} requestId - The ID of the TransferRequest.
 * @param {String} action - "approve" or "reject".
 * @param {Object} currentUser - The main admin user.
 * @param {String} ip - Request IP address.
 */
export const approveTransferRequest = async (requestId, action, currentUser, ip) => {
  const transferRequest = await TransferRequest.findById(requestId);
  if (!transferRequest) {
    throw new Error("Transfer request not found");
  }
  if (action === "approve") {
    transferRequest.status = "approved_by_main";
  } else if (action === "reject") {
    transferRequest.status = "rejected";
  } else {
    throw new Error("Invalid action");
  }
  await transferRequest.save();
  await createLog({
    admin: currentUser.userId,
    role: "Super Admin",
    action: "Transfer Request Review",
    description: `${action} transfer request ${transferRequest._id}`,
    ip,
  });
  return transferRequest;
};

/**
 * Accepts or rejects a transfer request by the receiving school admin.
 * @param {String} requestId - The ID of the TransferRequest.
 * @param {String} action - "accept" or "reject".
 * @param {Object} currentUser - The receiving school admin.
 * @param {String} ip - Request IP address.
 */
export const respondToTransferRequest = async (requestId, action, currentUser, ip) => {
  const transferRequest = await TransferRequest.findById(requestId);
  if (!transferRequest) {
    throw new Error("Transfer request not found");
  }
  if (transferRequest.status !== "approved_by_main") {
    throw new Error("Transfer request has not been approved by the main admin yet");
  }
  if (action === "accept") {
    transferRequest.status = "accepted_by_receiving";
    const fromSchool = await School.findById(transferRequest.fromSchool);
    const toSchool = await School.findById(transferRequest.toSchool);
    if (!fromSchool || !toSchool) {
      throw new Error("One of the schools was not found");
    }
    // Remove employee from source school's list.
    fromSchool.employees = fromSchool.employees.filter(
      (empId) => empId.toString() !== transferRequest.employee.toString()
    );
    await fromSchool.save();
    // Add employee to destination school's list.
    if (!toSchool.employees.includes(transferRequest.employee)) {
      toSchool.employees.push(transferRequest.employee);
    }
    await toSchool.save();
  } else if (action === "reject") {
    transferRequest.status = "rejected";
  } else {
    throw new Error("Invalid action");
  }
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
