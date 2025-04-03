
import Zone from "../models/Zone.js";
import District from "../models/District.js";


export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate("district").populate("zedioOfficer", "fullName employeeId"); 
    res.json({ zones });
  } catch (error) {
    res.status(500).json({ message: "Error fetching zones", error: error.message });
  }
};


export const createZone = async (req, res) => {
  try {
    const { name, district, zedioOfficer } = req.body;

    if (!name || !district) {
      return res.status(400).json({ message: "Name and District are required" });
    }

    const existingDistrict = await District.findById(district);
    if (!existingDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    const existingZone = await Zone.findOne({ name, district });
    if (existingZone) {
      return res.status(400).json({ message: "Zone already exists in this district" });
    }

    const newZone = new Zone({
      name,
      district,
      zeoOfficer,
    });

    await newZone.save();
    res.status(201).json({ message: "Zone created", zone: newZone });
  } catch (error) {
    res.status(500).json({ message: "Error creating zone", error: error.message });
  }
};


export const updateZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { name, district, zedioOfficer } = req.body;

    const updatedZone = await Zone.findByIdAndUpdate(
      zoneId,
      { name, district, zedioOfficer },
      { new: true }
    ).populate("district").populate("zedioOfficer", "fullName employeeId");

    if (!updatedZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    res.json({ message: "Zone updated", zone: updatedZone });
  } catch (error) {
    res.status(500).json({ message: "Error updating zone", error: error.message });
  }
};


export const deleteZone = async (req, res) => {
  try {
    const { zoneId } = req.params;

    const deletedZone = await Zone.findByIdAndDelete(zoneId);

    if (!deletedZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    res.json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting zone", error: error.message });
  }
};
