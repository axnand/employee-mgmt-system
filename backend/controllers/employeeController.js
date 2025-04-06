
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


export const getEmployees = async (req, res) => {
  

  try {
    console.log("User role:", req.user.role);
    let employees;
    
    if (req.user.role === "CEO") {
      // CEO can access all employees
      employees = await Employee.find({});
    } else if (req.user.role === "ZEO") {
      // For ZEO, populate the zone's schools and then get employees
      const zone = await Zone.findById(req.user.zoneId).populate({
        path: "schools",
        populate: { path: "employees" },
      });
      employees = zone.schools.reduce((acc, school) => [...acc, ...school.employees], []);
    } else if (req.user.role === "schoolAdmin") {
      // For schoolAdmin, find the employees for the given school
      const school = await School.findById(req.user.schoolId).populate("employees");
      employees = school ? school.employees : [];
    } else {
      return res.status(403).json({ message: "Not authorized to view employees" });
    }
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    // Fetch the employee by ID from the request
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (req.user.role === "CEO") {
      // CEO can access any employee
      return res.json(employee);

    } else if (req.user.role === "ZEO") {
      const zone = await Zone.findById(req.user.zoneId).populate("schools");
      const schoolIds = zone.schools.map((school) => school._id.toString());

      if (!schoolIds.includes(employee.school.toString())) {
        return res.status(403).json({ message: "Not authorized to view this employee" });
      }

      return res.json(employee);

    } else if (req.user.role === "schoolAdmin") {
      if (employee.school.toString() !== req.user.schoolId) {
        return res.status(403).json({ message: "Not authorized to view this employee" });
      }
      return res.json(employee);

    } else if (req.user.role === "staff") {
      // Allow staff to view only their own profile
      if (employee._id.toString() !== req.user.employeeId) {
        return res.status(403).json({ message: "Not authorized to view this profile" });
      }
      return res.json(employee);

    } else {
      return res.status(403).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};



export const createEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Determine the school ID based on the user's role
    const schoolId =
      req.user.role === "schoolAdmin"
        ? req.user.schoolId
        : req.body.school;

    if (!schoolId || !mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({ message: "Valid School ID is required" });
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Create a new employee
    const newEmployee = await Employee.create(
      [
        {
          ...req.body,
          school: schoolId,
        },
      ],
      { session }
    );

    const savedEmployee = newEmployee[0]; // Since Mongoose returns an array when using transactions

    // Push the new employee ID into the school's employees array and save the school
    school.employees.push(savedEmployee._id);
    await school.save({ session });

    // Create a User record for the employee
    const newUser = await User.create(
      [
        {
          userName: req.body.credentials?.username || savedEmployee.employeeId,
          role: 'staff',
          password: req.body.credentials?.passwordHash,
          schoolId,
          employeeId: savedEmployee._id,
          passwordChanged: false,
        },
      ],
      { session }
    );

    // Handle Posting History
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
