import School from "../models/School.js";
import Zone from "../models/Zone.js";

/**
 * GET /api/schools
 * Returns all schools (populated with employees and zone).
 */
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({}).populate("employees").populate("zone");
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error });
  }
};

/**
 * GET /api/schools/:id
 * Returns details of a school by ID.
 */
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate("employees").populate("zone");
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching school by ID", error });
  }
};

/**
 * GET /api/schools/mine
 * Returns the school for the authenticated user (based on req.user.schoolId).
 */
export const getMySchool = async (req, res) => {
  try {
    const school = await School.findById(req.user.schoolId).populate("employees").populate("zone");
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your school", error });
  }
};

/**
 * GET /api/schools/status
 * Returns zones with their associated schools.
 */
export const getSchoolStatus = async (req, res) => {
  try {
    const zones = await Zone.find({}).populate("schools");
    res.status(200).json({ zones });
  } catch (error) {
    res.status(500).json({ message: "Error fetching school status", error: error.message });
  }
};
