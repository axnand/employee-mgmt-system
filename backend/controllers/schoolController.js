import School from "../models/School.js";
import Zone from "../models/Zone.js";


export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({}).populate("employees").populate("zone");
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error });
  }
};


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


export const getSchoolStatus = async (req, res) => {
  try {
    const zones = await Zone.find({}).populate("schools");
    res.status(200).json({ zones });
  } catch (error) {
    res.status(500).json({ message: "Error fetching school status", error: error.message });
  }
};

export const createSchool = async (req, res) => {
  try {
    const { udiseId, name, office, feasibilityZone, principal, contact, dateOfEstablishment } = req.body;

    const officeExists = await Office.findById(office);
    if (!officeExists) {
      return res.status(400).json({ message: "Invalid office ID" });
    }

    const newSchool = new School({
      udiseId,
      name,
      office,
      feasibilityZone,
      principal,
      contact,
      dateOfEstablishment
    });

    await newSchool.save();

    res.status(201).json({ message: "School created successfully", school: newSchool });
  } catch (error) {
    res.status(500).json({ message: "Error creating school", error: error.message });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchool = await School.findByIdAndUpdate(id, req.body, { new: true })
      .populate("employees")
      .populate({
        path: "office",
        populate: { path: "zone", select: "name district" }
      });

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({ message: "School updated successfully", school: updatedSchool });
  } catch (error) {
    res.status(500).json({ message: "Error updating school", error: error.message });
  }
};


export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSchool = await School.findByIdAndDelete(id);

    if (!deletedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting school", error: error.message });
  }
};
