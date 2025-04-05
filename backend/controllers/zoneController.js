
import Zone from "../models/Zone.js";
import District from "../models/District.js";
import User from "../models/User.js";


export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate("district");
    res.status(200).json({ zones });
  } catch (error) {
    res.status(500).json({ message: "Error fetching zones", error: error.message });
  }
};



export const createZone = async (req, res) => {
  try {
    const { name, district, zedioOfficer, zeoUserName, zeoPassword } = req.body;

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
      zedioOfficer
    });

    await newZone.save();

   
    if (!zeoUserName || !zeoPassword) {
      return res.status(400).json({ message: "ZEO Username and Password are required" });
    }

    

    const newUser = new User({
      userName: zeoUserName,
      password: zeoPassword,
      role: 'ZEO',
      passwordChanged: false,
      districtId: district,
      zoneId: newZone._id
    });

    await newUser.save();

    res.status(201).json({ message: "Zone created and ZEO user created successfully", zone: newZone, user: newUser });
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
