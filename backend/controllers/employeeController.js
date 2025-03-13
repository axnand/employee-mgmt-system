// controllers/employeeController.js
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import School from "../models/School.js";
import { createLog } from "../services/logService.js";

/**
 * GET /api/employees
 * - Main admin: gets all employees.
 * - School admin: gets employees only from their school.
 */
export const getEmployees = async (req, res) => {
  try {
    let employees;
    if (req.user.role === "admin") {
      // Main admin can view all employees.
      employees = await Employee.find({});
    } else if (req.user.role === "schoolAdmin") {
      // School admin: find employees in his/her school.
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

/**
 * GET /api/employees/:id
 * - Main admin can view any employee.
 * - School admin can view an employee only if that employee belongs to their school.
 */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (req.user.role === "admin") {
      return res.json(employee);
    } else if (req.user.role === "schoolAdmin") {
      const school = await School.findById(req.user.schoolId).populate("employees");
      const inSchool = school.employees.some(
        (emp) => emp._id.toString() === employee._id.toString()
      );
      if (!inSchool) {
        return res.status(403).json({ message: "Not authorized to view this employee" });
      }
      return res.json(employee);
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};

/**
 * POST /api/employees
 * - Allows main admin or school admin to create an employee.
 *   School admins always create employees in their own school.
 *   Main admin may specify the school in req.body.
 */
export const createEmployee = async (req, res) => {
  try {
    console.log("🔹 Received Employee Data:", JSON.stringify(req.body, null, 2)); // ✅ Debugging Log

    const schoolId = req.user.role === "schoolAdmin" ? req.user.schoolId : req.body.school;

    if (!schoolId) {
      return res.status(400).json({ message: "School ID is required" });
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const newEmployee = await Employee.create({
      ...req.body,
      school: schoolId,
    });

    school.employees.push(newEmployee._id);
    await school.save();

    res.status(201).json({ message: "Employee created", employee: newEmployee });

  } catch (error) {
    console.error("❌ Error creating employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
};



/**
 * PUT /api/employees/:id
 * - Main admin can update any employee.
 * - School admin can update only employees in their school.
 */
export const updateEmployee = async (req, res) => {
  try {
    // For school admins, ensure the employee belongs to their school.
    if (req.user.role === "schoolAdmin") {
      const school = await School.findById(req.user.schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      const isEmployeeInSchool = school.employees.some(
        (empId) => empId.toString() === req.params.id
      );
      if (!isEmployeeInSchool) {
        return res.status(403).json({ message: "Not authorized to update this employee" });
      }
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Update Employee",
      description: `Updated employee ${updatedEmployee.employeeName}`,
      ip: req.ip,
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

/**
 * DELETE /api/employees/:id
 * - Main admin can delete any employee.
 * - School admin can delete only employees in their school.
 */
export const deleteEmployee = async (req, res) => {
  try {
    // For school admins, check that the employee belongs to their school.
    if (req.user.role === "schoolAdmin") {
      const school = await School.findById(req.user.schoolId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      const isEmployeeInSchool = school.employees.some(
        (empId) => empId.toString() === req.params.id
      );
      if (!isEmployeeInSchool) {
        return res.status(403).json({ message: "Not authorized to delete this employee" });
      }
      // Remove the employee from the school's array.
      school.employees = school.employees.filter(
        (empId) => empId.toString() !== req.params.id
      );
      await school.save();
    }
    const deletedEmp = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmp) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Delete Employee",
      description: `Deleted employee ${deletedEmp.employeeName}`,
      ip: req.ip,
    });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
