import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect, isAdmin, isSchoolAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/employees
 * Protected route - 
 *  - Main admin can view all employees across schools.
 *  - School admin can view only employees in their school.
 */
router.get("/", protect, getEmployees);

/**
 * GET /api/employees/:id
 * Protected route - 
 *  - Main admin can view any employee.
 *  - School admin can view only if the employee is in their school.
 */
router.get("/:id", protect, getEmployeeById);

/**
 * POST /api/employees
 * Protected route - 
 *  - Only school admin (or main admin, if desired) can create employees in their school.
 */
router.post("/", protect, isSchoolAdmin, createEmployee);

/**
 * PUT /api/employees/:id
 * Protected route - 
 *  - Only school admin can update employees in their school.
 */
router.put("/:id", protect, isSchoolAdmin, updateEmployee);

/**
 * DELETE /api/employees/:id
 * Protected route - 
 *  - Only school admin can remove employees in their school.
 */
router.delete("/:id", protect, isSchoolAdmin, deleteEmployee);

export default router;
