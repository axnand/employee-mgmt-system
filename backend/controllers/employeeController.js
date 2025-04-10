
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import School from "../models/School.js";
import Zone from "../models/Zone.js";
import { createLog } from "../services/logService.js";
import User from "../models/User.js";
// import BasicPay from "../models/BasicPay.js";
// import DA from "../models/DA.js";
// import HRA from "../models/HRA.js";
import EmployeeSalaries from "../models/EmployeeSalary.js";
import PostingHistory from "../models/PostingHistory.js";
import Office from "../models/Office.js";


export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

export const getDdoOfficerDetails = async (ddoOfficerId) => {
  if (!ddoOfficerId) return null;
  const ddoOfficer = await Employee.findOne({ employeeId: ddoOfficerId });
  return ddoOfficer;
};

export const getEmployeesByZone = async (req, res) => {
  try {
    const zoneId = req.params.zoneId;
    const offices = await Office.find({ zone: zoneId });
    const officeIds = offices.map(o => o._id);
    const employees = await Employee.find({ office: { $in: officeIds } });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees by zone", error: error.message });
  }
};

export const getEmployeesByOffice = async (req, res) => {
  try {
    const officeId = req.params.officeId;
    const employees = await Employee.find({ office: officeId });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees by office", error: error.message });
  }
};
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
};



export const createEmployee = async (req, res) => {
  console.log("Request body:", req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const officeId = req.body.office || req.body.officeId;
    console.log("Office ID:", officeId);
    if (!officeId || !mongoose.Types.ObjectId.isValid(officeId)) {
      return res.status(400).json({ message: "Valid Office ID is required" });
    }
    const office = await Office.findById(officeId);
    if (!office) return res.status(404).json({ message: "Office not found" });

    // Create a new employee
    const newEmployeeData = { ...req.body, office: officeId };
    const newEmployeeArr = await Employee.create([newEmployeeData], { session });
    const savedEmployee = newEmployeeArr[0]; // Since Mongoose returns an array when using transactions

    
    const newUser = await User.create(
      [
        {
          userName: req.body.employeeId || savedEmployee.employeeId,
          role: 'staff',
          password: req.body.credentials?.passwordHash,
          office: officeId,
          employeeId: savedEmployee._id,
          passwordChanged: false,
        },
      ],
      { session }
    );

    if (req.body.postingHistory && Array.isArray(req.body.postingHistory)) {
      const postingRecords = req.body.postingHistory.map((posting) => ({
        employee: savedEmployee._id,
        office: posting.office,
        designationDuringPosting: posting.designationDuringPosting,
        startDate: posting.startDate,
        endDate: posting.endDate,
        postingType: posting.postingType,
        reason: posting.reason,
        remarks: posting.remarks,
      }));

      if (postingRecords.length > 0) {
        await PostingHistory.insertMany(postingRecords, { session });
      }
    }

    // Log the employee creation action
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Employee Creation",
      description: `Created employee ${savedEmployee.fullName}`,
      ip: req.ip,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Employee created successfully", employee: savedEmployee });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};



export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Update Employee",
      description: `Updated employee ${updatedEmployee.fullName}`,
      ip: req.ip,
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Delete Employee",
      description: `Deleted employee ${deletedEmployee.fullName}`,
      ip: req.ip,
    });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
