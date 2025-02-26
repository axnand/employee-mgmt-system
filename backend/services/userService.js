// services/userService.js
import User from "../models/User.js";
import { createLog } from "./logService.js";
import bcrypt from "bcrypt";

/**
 * Registers a new school admin. Only main admin can do this.
 * @param {Object} params
 * @param {String} params.userId - The new user's login ID
 * @param {String} params.password - The new user's password
 * @param {String} params.schoolId - The _id of the School document
 * @param {Object} currentUser - The user making the request (main admin)
 * @param {String} ip - Request IP address
 */
export const registerSchoolAdmin = async ({ userId, password, schoolId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userId });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = new User({
    userId,
    password,
    role: "schoolAdmin",
    schoolId,
    passwordChanged: false
  });
  await newUser.save();

  // Log the creation
  await createLog({
    admin: currentUser.userId,
    role: "Super Admin",
    action: "Register School Admin",
    school: "-", // or fetch school name if you want
    description: `Created school admin user: ${userId}`,
    ip
  });

  return newUser;
};

/**
 * Registers a new staff. A school admin (or main admin) can do this.
 * @param {Object} params
 * @param {String} params.userId - The new staff's login ID
 * @param {String} params.password - The staff's password
 * @param {String} params.employeeId - The _id of the Employee document (if linked)
 * @param {Object} currentUser - The user making the request (school admin or main admin)
 * @param {String} ip - Request IP address
 */
export const registerStaff = async ({ userId, password, employeeId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userId });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = new User({
    userId,
    password,
    role: "staff",
    employeeId,
    passwordChanged: false
  });
  await newUser.save();

  // Log the creation
  await createLog({
    admin: currentUser.userId,
    role: currentUser.role === "admin" ? "Super Admin" : "Admin",
    action: "Register Staff",
    school: "-", // or fetch from currentUser if needed
    description: `Created staff user: ${userId}`,
    ip
  });

  return newUser;
};

/**
 * Forces a user to update their password (e.g., after first login).
 * @param {String} userId - The user's _id from the token
 * @param {String} newPassword
 * @param {String} ip
 */
export const updatePassword = async (userId, newPassword, ip) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.password = newPassword;
  user.passwordChanged = true;
  await user.save();

  // Log the password update
  await createLog({
    admin: user.userId,
    role: user.role,
    action: "Password Update",
    school: "-",
    description: `User ${user.userId} changed password`,
    ip
  });

  return user;
};
