import User from "../models/User.js";
import { createLog } from "./logService.js";
import bcrypt from "bcrypt";

/**
 * Registers a new Zonal Admin (ZEO). Only the main admin can do this.
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

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Register Zonal Admin",
    description: `Created Zonal Admin user: ${userName} for Zone ID: ${zoneId}`,
    ip
  });

  return newUser;
};

/**
 * Registers a new School Admin. Only the main admin can do this.
 */
export const registerSchoolAdmin = async ({ userName, password, schoolId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userName });
  if (existingUser) throw new Error("User already exists");

  const newUser = new User({
    userName,
    password,
    role: "School",
    schoolId,
    passwordChanged: false
  });

  await newUser.save();

  await createLog({
    admin: currentUser.userId,
    role: "Super Admin",
    action: "Register School Admin",
    school: schoolId,
    description: `Created School Admin user: ${userName} for School ID: ${schoolId}`,
    ip
  });

  return newUser;
};

/**
 * Registers a new Staff Member. A School Admin or the Main Admin can do this.
 */
export const registerStaff = async ({ userName, password, employeeId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userName });
  if (existingUser) throw new Error("User already exists");

  const newUser = new User({
    userName,
    password,
    role: "staff",
    employeeId,
    passwordChanged: false
  });

  await newUser.save();

  await createLog({
    admin: currentUser.userId,
    role: currentUser.role,
    action: "Register Staff",
    school: currentUser.schoolId || "-", 
    description: `Created staff user: ${userName} for Employee ID: ${employeeId}`,
    ip
  });

  return newUser;
};

/**
 * Updates a user's password (e.g., after first login or if forced by admin).
 */
export const updatePassword = async (userId, newPassword, ip) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordChanged = true;

  await user.save();

  await createLog({
    admin: user.userId,
    role: user.role,
    action: "Password Update",
    school: user.schoolId || "-", 
    description: `User ${user.userId} updated their password.`,
    ip
  });

  return user;
};
