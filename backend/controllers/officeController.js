import Office from "../models/Office.js";
import School from "../models/School.js";
import User from "../models/User.js";

// A helper function to get full DDO officer details using the ddoOfficerId (employeeId)
import Employee from "../models/Employee.js";
const getDdoOfficerDetails = async (ddoOfficerId) => {
  if (!ddoOfficerId) return null;
  // Assuming that the Employee model uses employeeId as a unique identifier
  const ddoOfficer = await Employee.findOne({ employeeId: ddoOfficerId });
  return ddoOfficer;
};

// Get all offices
export const getOffices = async (req, res) => {
  try {
    const offices = await Office.find()
      .select("officeId officeName officeType ddoOfficerId isDdo ddoCode parentOffice contact address")
      .populate("parentOffice", "officeName"); // No 'schools' population since it's not in the schema
    res.json({ offices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offices", error: error.message });
  }
};

// Get an office by ID
export const getOfficeById = async (req, res) => {
  try {
    const { officeId } = req.params;
    const office = await Office.findById(officeId)
      .populate("parentOffice", "officeName");

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    let ddoOfficerDetails = null;
    if (office.ddoOfficerId) {
      ddoOfficerDetails = await getDdoOfficerDetails(office.ddoOfficerId);
    }

    res.json({ office, ddoOfficerDetails });
  } catch (error) {
    res.status(500).json({ message: "Error fetching office", error: error.message });
  }
};

// Create a new office
export const createOffice = async (req, res) => {
  try {
    const { officeId, officeName, officeType, ddoOfficer, schools, ddoCode, parentOffice, isDdo } = req.body;

    // Validate required fields
    if (!officeId || !officeName || !officeType) {
      return res.status(400).json({ message: "Office ID, name, and type are required" });
    }

    let schoolIds = [];
    if (officeType === "Educational" && schools && schools.length > 0) {
      // Create each school and associated school admin user if credentials provided
      for (const schoolData of schools) {
        const { adminUserName, adminPassword, ...schoolDetails } = schoolData;
        const newSchool = new School({ ...schoolDetails, office: null });
        await newSchool.save();
        schoolIds.push(newSchool._id);

        if (adminUserName && adminPassword) {
          const newUser = new User({
            userName: adminUserName,
            password: adminPassword,
            role: "schoolAdmin",
            office: newSchool._id, // Will be updated after office creation
            schoolId: newSchool._id,
          });
          await newUser.save();
        }
      }
    }

    const officeData = {
      officeId,
      officeName,
      officeType,
      ddoOfficerId: ddoOfficer, // ddoOfficer now comes in as a string (employeeId)
      ddoCode,
      parentOffice: parentOffice || undefined,
      isDdo,
    };

    // If educational, you might want to store the created school IDs elsewhere
    // (If needed, update the School model separately)

    const newOffice = new Office(officeData);
    await newOffice.save();

    // Optionally update schools and users with new office reference if applicable
    if (schoolIds.length > 0) {
      await Promise.all([
        School.updateMany({ _id: { $in: schoolIds } }, { $set: { office: newOffice._id } }),
        User.updateMany({ schoolId: { $in: schoolIds } }, { $set: { office: newOffice._id } })
      ]);
    }

    res.status(201).json({ message: "Office created successfully", office: newOffice });
  } catch (error) {
    res.status(500).json({ message: "Error creating office", error: error.message });
  }
};

// Update an existing office
export const updateOffice = async (req, res) => {
  try {
    const { officeId } = req.params; // officeId here is the _id of the Office document
    const { officeName, officeType, ddoOfficer, ddoCode, parentOffice, isDdo } = req.body;

    const updatedOffice = await Office.findByIdAndUpdate(
      officeId,
      { officeName, officeType, ddoOfficerId: ddoOfficer, ddoCode, parentOffice, isDdo },
      { new: true }
    ).populate("parentOffice", "officeName");

    if (!updatedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({ message: "Office updated", office: updatedOffice });
  } catch (error) {
    res.status(500).json({ message: "Error updating office", error: error.message });
  }
};

// Delete an office
export const deleteOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const deletedOffice = await Office.findByIdAndDelete(officeId);

    if (!deletedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({ message: "Office deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting office", error: error.message });
  }
};
