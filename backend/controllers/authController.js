// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createLog } from "../services/logService.js";
import { registerSchoolAdmin as registerAdminService, registerStaff as registerStaffService, updatePassword as updatePasswordService } from "../services/userService.js";

/**
 * POST /api/auth/login
 * Logs in a user (admin, schoolAdmin, or staff).
 */
export const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Comparing password:", password, "with hash:", user.password);
console.log("Password match result:", isMatch);
    if (!isMatch) {
      // Log failed login attempt
      await createLog({
        admin: userId,
        role: user.role,
        action: "Failed Login",
        description: "Unsuccessful login attempt",
        ip: req.ip,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If user has not changed default password yet (for schoolAdmin or staff)
    if (!user.passwordChanged && (user.role === "schoolAdmin" || user.role === "staff")) {
      return res.status(200).json({
        message: "Change password required",
        forcePasswordChange: true,
        userId: user._id,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Log successful login
    await createLog({
      admin: userId,
      role: user.role === "admin" ? "Super Admin" : "Admin",
      action: "Login",
      description: `${userId} logged in successfully`,
      ip: req.ip,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
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
 * Only main admin can register a new school admin.
 */
export const registerSchoolAdmin = async (req, res) => {
  try {
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
 * School admin can register new staff.
 */
export const registerStaff = async (req, res) => {
  try {
    // Expected: { userId, password, employeeId } in req.body
    const { userId, password, employeeId } = req.body;
    const newUser = await registerStaffService({ userId, password, employeeId }, req.user, req.ip);

    res.status(201).json({ message: "Staff registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering staff", error: error.message });
  }
};
