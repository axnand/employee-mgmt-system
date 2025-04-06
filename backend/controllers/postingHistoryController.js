
import PostingHistory from "../models/PostingHistory.js";
import Employee from "../models/Employee.js";
import Zone from "../models/Zone.js";
import { createLog } from "../services/logService.js";


export const getPostingHistoryByEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (req.user.role === "CEO") {
      const history = await PostingHistory.find({ employee: req.params.employeeId }).populate("office");
      res.json({ history });
    } else if (req.user.role === "ZEO") {
      const zone = await Zone.findById(req.user.zoneId).populate("schools");
      const schoolIds = zone.schools.map(school => school._id.toString());
      if (!schoolIds.includes(employee.school.toString())) {
        return res.status(403).json({ message: "Not authorized to view this employee's posting history" });
      }
      const history = await PostingHistory.find({ employee: req.params.employeeId }).populate("office");
      res.json({ history });
    } else if (req.user.role === "schoolAdmin") {
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


export const createPostingHistory = async (req, res) => {
  try {
    const { employee, office } = req.body;

    const employeeRecord = await Employee.findById(employee);
    if (!employeeRecord) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (req.user.role === "School" && employeeRecord.school.toString() !== req.user.schoolId) {
      return res.status(403).json({ message: "Not authorized to add posting history for this employee" });
    }

    if (req.user.role === "ZEO") {
      const zone = await Zone.findById(req.user.zoneId).populate("schools");
      const schoolIds = zone.schools.map(school => school._id.toString());

      if (!schoolIds.includes(employeeRecord.school.toString())) {
        return res.status(403).json({ message: "Not authorized to add posting history for this employee" });
      }
    }

    const newHistory = await PostingHistory.create(req.body);

    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Create Posting History",
      description: `Created posting history for employee ${employeeRecord.fullName}`,
      ip: req.ip,
    });

    res.status(201).json({ message: "Posting history created", history: newHistory });
  } catch (error) {
    res.status(500).json({ message: "Error creating posting history", error: error.message });
  }
};
