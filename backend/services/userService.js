import User from "../models/User.js";
import { createLog } from "./logService.js";
import bcrypt from "bcrypt";

export const registerZonalAdmin = async ({ userName, password, zoneId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userName });
  if (existingUser) throw new Error("User already exists");
  const newUser = new User({
    userName,
    password,
    role: "ZEO",
    zoneId,
    passwordChanged: false,
  });
  await newUser.save();
  await createLog({
    admin: currentUser.userName,
    role: currentUser.role,
    action: "Register Zonal Admin",
    description: `Created zonal admin: ${userName} for Zone ID: ${zoneId}`,
    ip,
  });
  return newUser;
};

export const registerSchoolAdmin = async ({ userName, password, schoolId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userName });
  if (existingUser) throw new Error("User already exists");
  const newUser = new User({
    userName,
    password,
    role: "schoolAdmin",
    schoolId,
    passwordChanged: false,
  });
  await newUser.save();
  await createLog({
    admin: currentUser.userName,
    role: "Super Admin",
    action: "Register School Admin",
    school: schoolId,
    description: `Created school admin: ${userName} for School ID: ${schoolId}`,
    ip,
  });
  return newUser;
};

export const registerStaff = async ({ userName, password, employeeId }, currentUser, ip) => {
  const existingUser = await User.findOne({ userName });
  if (existingUser) throw new Error("User already exists");
  const newUser = new User({
    userName,
    password,
    role: "staff",
    employeeId,
    passwordChanged: false,
  });
  await newUser.save();
  await createLog({
    admin: currentUser.userName,
    role: currentUser.role,
    action: "Register Staff",
    school: currentUser.schoolId || "-",
    description: `Created staff user: ${userName} for Employee ID: ${employeeId}`,
    ip,
  });
  return newUser;
};

export const updatePassword = async (userId, newPassword, ip) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordChanged = true;

    await user.save(); // This will trigger the 'pre("save")' hook

    // Optionally, log the password change if needed
    console.log(`Password updated successfully for user ${user.userName} from IP: ${ip}`);

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
