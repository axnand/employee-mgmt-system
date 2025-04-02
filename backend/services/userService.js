// services/userService.js
import User from "../models/User.js";
import { createLog } from "./logService.js";
import bcrypt from "bcrypt";

/**
 * Registers a new school admin. Only the main admin can do this.
 * @param {Object} params
 * @param {String} params.userId - The new user's login ID.
 * @param {String} params.password - The new user's password.
 * @param {String} params.schoolId - The _id of the School document.
 * @param {Object} currentUser - The user making the request (main admin).
 * @param {String} ip - Request IP address.
 */

export const registerZonalAdmin = async ({ userName, password, zoneId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userName });
  if (existingUser) throw new Error("User already exists");

  const newUser = new User({
    userName,
    password,
    role: "ZEO",
    zoneId,
    passwordChanged: false
  });

  await newUser.save();
  return newUser;
};
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
  await createLog({
    admin: currentUser.userId,
    role: "Super Admin",
    action: "Register School Admin",
    school: schoolId, // or fetch the school name if desired
    description: `Created school admin user: ${userId}`,
    ip
  });
  return newUser;
};

/**
 * Registers a new staff. A school admin or the main admin can do this.
 * @param {Object} params
 * @param {String} params.userId 
 * @param {String} params.password 
 * @param {String} params.employeeId 
 * @param {Object} currentUser 
 * @param {String} ip
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
  await createLog({
    admin: currentUser.userId,
    role: currentUser.role === "admin" ? "Super Admin" : "Admin",
    action: "Register Staff",
    school: "-", // optionally replace with currentUser.schoolId or name
    description: `Created staff user: ${userId}`,
    ip
  });
  return newUser;
};

/**
 * Forces a user to update their password (e.g., after first login).
 * @param {String} userId 
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
  await createLog({
    admin: user.userId,
    role: user.role,
    action: "Password Update",
    school: "-", // adjust if needed
    description: `User ${user.userId} changed password`,
    ip
  });
  return user;
};
