import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    let filter = {};
    if (role === "schoolAdmin") {
      filter = { school: schoolId };
    }
    const logs = await Log.find(filter).sort({ createdAt: -1 }).exec();

    const formattedLogs = logs.map((log) => ({
      action: log.action,
      description: log.description,
      admin: log.admin,
      role: log.role,
      ip: log.ip,
      time: new Date(log.createdAt).toLocaleString(),
    }));

    res.json({ logs: formattedLogs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
};


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
          count: { $sum: 1 },
        },
      },
    ]);

    const totalActions = stats.reduce((acc, cur) => acc + cur.count, 0);
    res.json({
      stats: [
        { title: "Total Actions (24h)", value: totalActions },
        {
          title: "Transfers Processed",
          value: stats.find((s) => s._id === "Transfer Request Review")?.count || 0,
        },
        {
          title: "Employee Updates",
          value: stats.find((s) => s._id === "Update Employee")?.count || 0,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};
