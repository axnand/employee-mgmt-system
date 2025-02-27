// controllers/logController.js
import Log from "../models/Log.js";

/**
 * GET /api/logs
 * - Main admin: views logs for all zones and schools.
 * - School admin: views only logs related to their school.
 *   (This includes events like creation, update, deletion of employees, schools, zones,
 *    transfer events, and login events.)
 */
export const getLogs = async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    let filter = {};
    if (role === "schoolAdmin") {
      // For school admins, filter by school identifier.
      filter = { school: schoolId };
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
      match.school = schoolId;
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

    const totalActions = stats.reduce((acc, cur) => acc + cur.count, 0);
    res.json({
      stats: [
        { title: "Total Actions (24h)", value: totalActions },
        { title: "Transfers Processed", value: stats.find(s => s._id === "Transfer Request Review")?.count || 0 },
        { title: "Employee Updates", value: stats.find(s => s._id === "Update Employee")?.count || 0 },
        // Add additional stat entries as needed.
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};
