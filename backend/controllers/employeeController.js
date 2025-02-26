// controllers/employeeController.js
import Employee from "../models/Employee.js";
import School from "../models/School.js";
import { createLog } from "../services/logService.js";

/**
 * GET /api/employees
 * - Main admin can view all employees.
 * - School admin can view employees in their school only.
 */
export const getEmployees = async (req, res) => {
  try {
    let employees;
    if (req.user.role === "admin") {
      // Main admin: get all employees
      employees = await Employee.find({});
    } else if (req.user.role === "schoolAdmin") {
      // School admin: find employees in this admin's school
      // We assume we store the school's _id in req.user.schoolId
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
 * - School admin can view only if the employee is in their school.
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
      // Check if this employee is in the school
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
 * - School admin can create employees in their school.
 */
export const createEmployee = async (req, res) => {
  try {
    const { sanctionedPost, employeeName, staffType } = req.body;
    // Additional fields as needed

    // Create the employee record
    const newEmployee = await Employee.create({
      sanctionedPost,
      employeeName,
      staffType,
      // etc.
    });

    // Add this employee to the school's employees array
    const school = await School.findById(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    school.employees.push(newEmployee._id);
    await school.save();

    // Log creation
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Create Employee",
      school: school.name,
      description: `Created new employee ${employeeName} in school ${school.name}`,
      ip: req.ip,
    });

    res.status(201).json({ message: "Employee created", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error });
  }
};

/**
 * PUT /api/employees/:id
 * - School admin can update employees in their school.
 */
export const updateEmployee = async (req, res) => {
  try {
    // Check if employee is in this school
    const school = await School.findById(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const isEmployeeInSchool = school.employees.some(
      (empId) => empId.toString() === req.params.id
    );
    if (!isEmployeeInSchool && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this employee" });
    }

    // Update the employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Log update
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
 * - School admin can remove employees in their school.
 */
export const deleteEmployee = async (req, res) => {
  try {
    const school = await School.findById(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const isEmployeeInSchool = school.employees.some(
      (empId) => empId.toString() === req.params.id
    );
    if (!isEmployeeInSchool && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this employee" });
    }

    // Remove from school's array
    school.employees = school.employees.filter(
      (empId) => empId.toString() !== req.params.id
    );
    await school.save();

    const deletedEmp = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Log deletion
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
