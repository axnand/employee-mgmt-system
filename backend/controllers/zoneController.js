
import Zone from "../models/Zone.js";
import District from "../models/District.js";
import User from "../models/User.js";
import Office from "../models/Office.js";
import mongoose from "mongoose";


export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate("district").populate("offices", "officeName");;
    res.status(200).json({ zones });
  } catch (error) {
    res.status(500).json({ message: "Error fetching zones", error: error.message });
  }
};


export const getZoneById = async (req, res) => {
  try {
    const { zoneId } = req.params;

    // Find the Zone by ID and populate relevant fields
    const zone = await Zone.findById(zoneId)
      .populate("district") // Populates district details
      .populate({
        path: "offices",
        model: "Office" // Ensures related Office documents are fetched
      })
      .populate({
        path: "myOffice",
        model: "Office" // Ensures the main Office for this zone is fetched
      });

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    const zeoUser = await User.findOne({ zoneId: zone._id, role: "ZEO" });

    res.status(200).json({ message: "Zone fetched successfully", zone, zeoUser });
  } catch (error) {
    console.error("❌ Error fetching zone by ID:", error.message);
    res.status(500).json({ message: "Error fetching zone", error: error.message });
  }
};

export const createZone = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, district, zedioOfficer, zeoUserName, zeoPassword, zonalOffice } = req.body;

    if (!name || !district || !zonalOffice) {
      return res.status(400).json({ message: "Name, District, and Zonal Office are required" });
    }

    const existingDistrict = await District.findById(district);
    if (!existingDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    const existingZone = await Zone.findOne({ name, district });
    if (existingZone) {
      return res.status(400).json({ message: "Zone already exists in this district" });
    }

    // ✅ Correctly checking for `zonalOffice` object existence
    if (!zonalOffice.officeId || !zonalOffice.officeName) {
      return res.status(400).json({ message: "Office ID and Office Name are required in zonalOffice" });
    }

    // ✅ Creating the office using the transaction
    const createdOffice = await Office.create([{
      officeId: zonalOffice.officeId,
      officeName: zonalOffice.officeName,
      officeType: 'Administrative',
      contact: zonalOffice.contact,
      address: zonalOffice.address
    }], { session });

    // ✅ Creating the zone with a reference to the newly created office
    const newZone = await Zone.create([{
      name,
      district,
      myOffice: createdOffice[0]._id,
      offices: [createdOffice[0]._id]
    }], { session });

    if (!zeoUserName || !zeoPassword) {
      return res.status(400).json({ message: "ZEO Username and Password are required" });
    }

    // ✅ Creating the ZEO User within the transaction
    const newUser = await User.create([{
      userName: zeoUserName,
      password: zeoPassword,
      role: 'ZEO',
      passwordChanged: false,
      districtId: district,
      zoneId: newZone[0]._id,
      office: createdOffice[0]._id
    }], { session });

    // ✅ Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Zone, Zonal Office, and ZEO user created successfully", zone: newZone[0], user: newUser[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error creating zone:", error.message);
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
