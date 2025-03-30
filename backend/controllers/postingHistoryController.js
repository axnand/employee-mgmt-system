// controllers/postingHistoryController.js
import PostingHistory from "../models/PostingHistory.js";
import Employee from "../models/Employee.js";
import Zone from "../models/Zone.js";
import { createLog } from "../services/logService.js";

/**
 * GET /api/posting-history/:employeeId
 * Fetches the posting history of a particular employee.
 * CEO can view all employees, ZEO can view employees within their zone, and School Admin can view employees only in their school.
 */
export const getPostingHistoryByEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (req.user.role.roleName === "CEO") {
      // CEO can view posting history of all employees
      const history = await PostingHistory.find({ employee: req.params.employeeId }).populate("office");
      res.json({ history });

    } else if (req.user.role.roleName === "ZEO") {
      // ZEO can view posting history of employees within their zone
      const zone = await Zone.findById(req.user.zoneId).populate("schools");

      const schoolIds = zone.schools.map(school => school._id.toString());
      if (!schoolIds.includes(employee.school.toString())) {
        return res.status(403).json({ message: "Not authorized to view this employee's posting history" });
      }

      const history = await PostingHistory.find({ employee: req.params.employeeId }).populate("office");
      res.json({ history });

    } else if (req.user.role.roleName === "School") {
      // School Admin can only view posting history for employees within their own school
      if (employee.school.toString() !== req.user.schoolId) {
        return res.status(403).json({ message: "Not authorized to view this employee's posting history" });
      }

      const history = await PostingHistory.find({ employee: req.params.employeeId }).populate("office");
      res.json({ history });
      
    } else {
      res.status(403).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching posting history", error: error.message });
  }
};

/**
 * POST /api/posting-history
 * Creates a new posting history record.
 * Only CEO, ZEO, or School Admins are allowed to create posting history.
 */
export const createPostingHistory = async (req, res) => {
  try {
    const { employee, office } = req.body;

    const employeeRecord = await Employee.findById(employee);
    if (!employeeRecord) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (req.user.role.roleName === "School" && employeeRecord.school.toString() !== req.user.schoolId) {
      return res.status(403).json({ message: "Not authorized to add posting history for this employee" });
    }

    if (req.user.role.roleName === "ZEO") {
      const zone = await Zone.findById(req.user.zoneId).populate("schools");
      const schoolIds = zone.schools.map(school => school._id.toString());

      if (!schoolIds.includes(employeeRecord.school.toString())) {
        return res.status(403).json({ message: "Not authorized to add posting history for this employee" });
      }
    }

    const newHistory = await PostingHistory.create(req.body);

    await createLog({
      admin: req.user.userId,
      role: req.user.role.roleName,
      action: "Create Posting History",
      description: `Created posting history for employee ${employeeRecord.fullName}`,
      ip: req.ip,
    });

    res.status(201).json({ message: "Posting history created", history: newHistory });
  } catch (error) {
    res.status(500).json({ message: "Error creating posting history", error: error.message });
  }
};
