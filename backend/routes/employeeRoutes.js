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

router.get("/", protect, getEmployees);


router.get("/:id", protect, getEmployeeById);


router.post("/", protect, authorizeRoles("admin", "schoolAdmin"), createEmployee);


router.put("/:id", protect, authorizeRoles("admin", "schoolAdmin"), updateEmployee);


router.delete("/:id", protect, authorizeRoles("admin", "schoolAdmin"), deleteEmployee);

export default router;
