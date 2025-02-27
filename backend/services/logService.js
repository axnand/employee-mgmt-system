// services/logService.js
import Log from "../models/Log.js";

/**
 * Creates a log entry for significant events.
 * @param {Object} logData - Details of the log entry.
 * @param {String} logData.admin - Identifier (or name) of the user performing the action.
 * @param {String} logData.role - Role of the user (e.g., "Super Admin", "Admin", "School Admin").
 * @param {String} logData.action - Action performed (e.g., "Login", "Employee Transfer Request", "Create Employee", "Update School", etc.).
 * @param {String} [logData.school="-"] - School identifier if applicable.
 * @param {String} logData.description - Brief description of the event.
 * @param {String} [logData.ip] - IP address from which the event occurred.
 */
export const createLog = async ({
  admin,
  role,
  action,
  school = "-",
  description,
  ip,
}) => {
  try {
    await Log.create({
      admin,
      role,
      action,
      school,
      description,
      ip,
    });
  } catch (error) {
    console.error("Failed to create log:", error);
  }
};
