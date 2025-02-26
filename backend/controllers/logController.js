// controllers/logController.js
import Log from "../models/Log.js";

/**
 * GET /api/logs
 * Returns log entries.
 * - Main admin sees all logs.
 * - School admin sees only logs related to their school.
 */
export const getLogs = async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    let filter = {};

    if (role === "schoolAdmin") {
      // Assuming your Log model stores the school name or ID in a field named "school"
      // You may need to adjust the filter based on how you store the school data.
      filter = { school: req.user.schoolName || schoolId };
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 }).exec();
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
};

/**
 * GET /api/logs/stats
 * Returns aggregated log statistics for the last 24 hours.
 */
export const getLocalStats = async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let match = { createdAt: { $gte: twentyFourHoursAgo } };
    if (role === "schoolAdmin") {
      // If school admins are restricted by their school, adjust the filter accordingly.
      match.school = req.user.schoolName || schoolId;
    }

    const stats = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      }
    ]);

    // Construct a stats object.
    const totalActions = stats.reduce((acc, cur) => acc + cur.count, 0);
    const attendanceUpdates = stats.find(s => s._id === "Attendance Update")?.count || 0;
    const transfersProcessed = stats.find(s => s._id === "Employee Transfer Request")?.count || 0;
    const profileModifications = stats.find(s => s._id.toLowerCase().includes("profile"))?.count || 0;

    res.json({
      stats: [
        { title: "Total Actions (24h)", value: totalActions },
        { title: "Attendance Updates", value: attendanceUpdates },
        { title: "Transfers Processed", value: transfersProcessed },
        { title: "Profile Modifications", value: profileModifications }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};
