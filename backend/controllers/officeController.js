// controllers/officeController.js
import Office from "../models/Office.js";
import Zone from "../models/Zone.js";


export const getOffices = async (req, res) => {
  try {
    const offices = await Office.find()
      .populate("zone")
      .populate("ddoOfficer", "fullName employeeId")
      .populate("schools", "name udiseId");

    res.json({ offices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offices", error: error.message });
  }
};

/**
 * Create a new office
 */
export const createOffice = async (req, res) => {
  try {
    const { officeName, officeType, zone, ddoOfficer, schools, ddoCode, parentOffice, isDdo } = req.body;

    if (!officeName || !officeType || !zone) {
      return res.status(400).json({ message: "Office name, type, and zone are required" });
    }

    // Check if the zone exists
    const existingZone = await Zone.findById(zone);
    if (!existingZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    const newOffice = new Office({
      officeName,
      officeType,
      zone,
      ddoOfficer,
      schools,
      ddoCode,
      parentOffice,
      isDdo
    });

    await newOffice.save();
    res.status(201).json({ message: "Office created", office: newOffice });
  } catch (error) {
    res.status(500).json({ message: "Error creating office", error: error.message });
  }
};

/**
 * Update an existing office
 */
export const updateOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const { officeName, officeType, zone, ddoOfficer, schools, ddoCode, parentOffice, isDdo } = req.body;

    const updatedOffice = await Office.findByIdAndUpdate(
      officeId,
      { officeName, officeType, zone, ddoOfficer, schools, ddoCode, parentOffice, isDdo },
      { new: true }
    )
      .populate("zone")
      .populate("ddoOfficer", "fullName employeeId")
      .populate("schools", "name udiseId");

    if (!updatedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({ message: "Office updated", office: updatedOffice });
  } catch (error) {
    res.status(500).json({ message: "Error updating office", error: error.message });
  }
};

/**
 * Delete an office
 */
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
