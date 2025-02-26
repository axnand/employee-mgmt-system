// controllers/schoolController.js
import School from "../models/School.js";

/**
 * GET /api/schools
 * - Main admin can view all schools.
 */
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({});
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error });
  }
};

/**
 * GET /api/schools/mine
 * - School admin can view details of their own school.
 */
export const getMySchool = async (req, res) => {
  try {
    const school = await School.findById(req.user.schoolId).populate("employees");
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your school", error });
  }
};

/**
 * GET /api/schools/:id
 * - Main admin can view details of any school by ID.
 */
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate("employees");
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching school by ID", error });
  }
};
