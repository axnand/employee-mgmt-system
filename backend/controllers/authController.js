// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createLog } from "../services/logService.js";
import {
  registerSchoolAdmin as registerAdminService,
  registerStaff as registerStaffService,
  updatePassword as updatePasswordService
} from "../services/userService.js";

/**
 * POST /api/auth/login
 * Logs in a user (admin, schoolAdmin, or staff) based on the provided login type.
 * Expected req.body: { userId, password, loginAs }
 */
export const loginUser = async (req, res) => {
  try {
    const { userId, password, loginAs } = req.body;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (loginAs && user.role !== loginAs) {
      return res.status(403).json({ message: `You are not authorized to login as ${loginAs}` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await createLog({
        admin: userId,
        role: user.role,
        action: "Failed Login",
        description: "Unsuccessful login attempt",
        ip: req.ip,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Build the payload and include additional fields based on role.
    const payload = {
      userId: user._id,
      role: user.role,
      forcePasswordChange: !user.passwordChanged,
    };

    // For schoolAdmin, include schoolId
    if (user.role === "schoolAdmin") {
      payload.schoolId = user.schoolId;
    }

    // For staff, include employeeId (and optionally schoolId if needed)
    if (user.role === "staff") {
      payload.employeeId = user.employeeId;
      payload.schoolId = user.schoolId;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    await createLog({
      admin: userId,
      role: user.role === "admin" ? "Super Admin" : user.role,
      action: "Login",
      description: `${userId} logged in successfully as ${user.role}`,
      ip: req.ip,
    });

    // Return additional fields in the response so the frontend can store them.
    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      forcePasswordChange: !user.passwordChanged,
      ...(user.role === "schoolAdmin" && { schoolId: user.schoolId }),
      ...(user.role === "staff" && { employeeId: user.employeeId, schoolId: user.schoolId }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


/**
 * PUT /api/auth/update-password
 * Forces user to update password on first login or any other time.
 */
export const updatePassword = async (req, res) => {
  try {
    // We assume the user is authenticated and we have userId in req.user
    const { newPassword } = req.body;
    const updatedUser = await updatePasswordService(req.user.userId, newPassword, req.ip);
    res.status(200).json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

/**
 * POST /api/auth/register-school-admin
 * Only the main admin can register a new school admin.
 * Expected req.body: { userId, password, schoolId } and (if needed) additional school info.
 */
export const registerSchoolAdmin = async (req, res) => {
  try {
    // Ensure only the main admin can register a school admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the main admin can register a school admin" });
    }

    // Expected: { userId, password, schoolId } in req.body
    const { userId, password, schoolId } = req.body;
    const newUser = await registerAdminService({ userId, password, schoolId }, req.user, req.ip);
    res.status(201).json({ message: "School admin registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering school admin", error: error.message });
  }
};

/**
 * POST /api/auth/register-staff
 * Allows either the main admin or a school admin to register new staff.
 * Expected req.body: { userId, password, employeeId }.
 */
export const registerStaff = async (req, res) => {
  try {
    // Allow only school admins or the main admin to add employees
    if (!(req.user.role === "schoolAdmin" || req.user.role === "admin")) {
      return res.status(403).json({ message: "Only school admins or the main admin can register staff" });
    }
    // Expected: { userId, password, employeeId } in req.body
    const { userId, password, employeeId } = req.body;
    const newUser = await registerStaffService({ userId, password, employeeId }, req.user, req.ip);
    res.status(201).json({ message: "Staff registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering staff", error: error.message });
  }
};
