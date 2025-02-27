import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/employees
 * Protected route - 
 *  - Main admin can view all employees.
 *  - School admin can view only employees in their school.
 */
router.get("/", protect, getEmployees);

/**
 * GET /api/employees/:id
 * Protected route - 
 *  - Main admin can view any employee.
 *  - School admin can view an employee only if they belong to their school.
 */
router.get("/:id", protect, getEmployeeById);

/**
 * POST /api/employees
 * Protected route - 
 *  - Both main admin and school admin can create an employee.
 */
router.post("/", protect, authorizeRoles("admin", "schoolAdmin"), createEmployee);

/**
 * PUT /api/employees/:id
 * Protected route - 
 *  - Both main admin and school admin can update an employee.
 */
router.put("/:id", protect, authorizeRoles("admin", "schoolAdmin"), updateEmployee);

/**
 * DELETE /api/employees/:id
 * Protected route - 
 *  - Both main admin and school admin can delete an employee.
 */
router.delete("/:id", protect, authorizeRoles("admin", "schoolAdmin"), deleteEmployee);

export default router;
