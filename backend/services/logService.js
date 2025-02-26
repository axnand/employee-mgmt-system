// services/logService.js
import Log from "../models/Log.js";

/**
 * Creates a log entry for significant events.
 * @param {Object} logData - Details of the log entry.
 * @param {String} logData.admin - The identifier (or name) of the user performing the action.
 * @param {String} logData.role - The role of the user (e.g., "Super Admin", "Admin").
 * @param {String} logData.action - The action performed (e.g., "Login", "Employee Transfer Request").
 * @param {String} [logData.school="-"] - School name or identifier if applicable.
 * @param {String} logData.description - A brief description of the event.
 * @param {String} [logData.ip] - The IP address from which the event occurred.
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
