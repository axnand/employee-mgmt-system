// controllers/employeeController.js
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import School from "../models/School.js";
import Zone from "../models/Zone.js";
import { createLog } from "../services/logService.js";
import User from "../models/User.js";

/**
 * GET /api/employees
 * - CEO (admin): gets all employees.
 * - ZEO: gets employees only from their zone.
 * - School admin: gets employees only from their school.
 */
export const getEmployees = async (req, res) => {
  try {
    let employees;
    if (req.user.role.roleName === "CEO") {
      // CEO can view all employees.
      employees = await Employee.find({});
    } else if (req.user.role.roleName === "ZEO") {
      // ZEO can view employees from their zone only
      const zone = await Zone.findById(req.user.zoneId).populate({
        path: "schools",
        populate: { path: "employees" }
      });

      employees = zone.schools.reduce((acc, school) => [...acc, ...school.employees], []);
    } else if (req.user.role.roleName === "School") {
      // School admin can view employees only in their school.
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
 * - CEO can view any employee.
 * - ZEO can view employees only if they belong to schools within their zone.
 * - School admin can view an employee only if that employee belongs to their school.
 */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (req.user.role.roleName === "CEO") {
      return res.json(employee);
    } else if (req.user.role.roleName === "ZEO") {
      const zone = await Zone.findById(req.user.zoneId).populate("schools");
      const schoolIds = zone.schools.map((school) => school._id.toString());

      if (!schoolIds.includes(employee.school.toString())) {
        return res.status(403).json({ message: "Not authorized to view this employee" });
      }

      return res.json(employee);
    } else if (req.user.role.roleName === "School") {
      if (employee.school.toString() !== req.user.schoolId) {
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
 * - Allows CEO, ZEO, or School admin to create an employee.
 */
export const createEmployee = async (req, res) => {
  try {
    const schoolId = req.user.role.roleName === "School" ? req.user.schoolId : req.body.school;

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

    const newUser = await User.create({
      userName: req.body.credentials?.username || newEmployee.employeeId,
      role: req.body.roleId,
      password: req.body.credentials?.passwordHash,
      schoolId,
      employeeId: newEmployee._id,
      passwordChanged: false,
    });

    await createLog({
      admin: req.user.userId,
      role: req.user.role.roleName,
      action: "Employee Creation",
      description: `Created employee ${newEmployee.fullName}`,
      ip: req.ip,
    });

    res.status(201).json({ message: "Employee created", employee: newEmployee });

  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error });
  }
};

/**
 * PUT /api/employees/:id
 * - CEO, ZEO, and School Admin can update an employee if permitted.
 */
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
      role: req.user.role.roleName,
      action: "Update Employee",
      description: `Updated employee ${updatedEmployee.fullName}`,
      ip: req.ip,
    });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

/**
 * DELETE /api/employees/:id
 * - CEO, ZEO, and School Admin can delete an employee if permitted.
 */
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await createLog({
      admin: req.user.userId,
      role: req.user.role.roleName,
      action: "Delete Employee",
      description: `Deleted employee ${deletedEmployee.fullName}`,
      ip: req.ip,
    });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
