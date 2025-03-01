// controllers/schoolController.js
import School from "../models/School.js";
import Zone from "../models/Zone.js";

/**
 * GET /api/schools
 * - Main admin: view all schools.
 * - School admin: view only their own school.
 */
export const getAllSchools = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const schools = await School.find({}).populate("employees").populate("zone");
      return res.json(schools);
    } else if (req.user.role === "schoolAdmin") {
      const school = await School.findById(req.user.schoolId)
        .populate("employees")
        .populate("zone");
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      return res.json([school]); // return as an array for consistency
    } else {
      return res.status(403).json({ message: "Not authorized to view schools" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error });
  }
};




/**
 * GET /api/schools/mine
 * - School admin: view details of their own school.
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
 * - Main admin: view details of any school by ID.
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


/**
 * GET /api/schools/status
 * - Returns zones with their schools grouped together.
 * - Accessible to the main admin.
 */
export const getSchoolStatus = async (req, res) => {
    try {
      // Find all zones and populate the associated schools.
      const zones = await Zone.find({}).populate("schools");
      res.status(200).json({ zones });
    } catch (error) {
      res.status(500).json({ message: "Error fetching school status", error: error.message });
    }
  };
