import User from "../models/User.js";

export const getUserByOfficeId = async (req, res) => {
  try {
    const { officeId } = req.params;

    const user = await User.findOne({ office: officeId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};
