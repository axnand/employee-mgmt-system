
import Office from "../models/Office.js";
import Zone from "../models/Zone.js";
import School from "../models/School.js";
import User from "../models/User.js";

export const getOffices = async (req, res) => {
  try {
    const offices = await Office.find()
      .select("officeId officeName officeType zone ddoOfficer schools isDdo ddoCode parentOffice")
      .populate("zone")
      .populate("ddoOfficer", "fullName employeeId")
      .populate("schools", "name udiseId");

    res.json({ offices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offices", error: error.message });
  }
};



export const createOffice = async (req, res) => {
  try {
    const { officeId, officeName, officeType, zone, ddoOfficer, schools, ddoCode, parentOffice, isDdo } = req.body;

    if (!officeId || !officeName || !officeType || !zone) {
      return res.status(400).json({ message: "Office name, type, and zone are required" });
    }

    const existingZone = await Zone.findById(zone);
    if (!existingZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    let schoolIds = [];

    if (officeType === "Educational" && schools && schools.length > 0) {
      for (const schoolData of schools) {
        const { adminUserName, adminPassword, ...schoolDetails } = schoolData;
        const newSchool = new School({
          ...schoolData,
          office: null,
        });

        await newSchool.save();
        schoolIds.push(newSchool._id);

        if (adminUserName && adminPassword) {

          const newUser = new User({
            userName: adminUserName,
            password: adminPassword,
            role: "schoolAdmin",
            office: newSchool.office,
            schoolId: newSchool._id,
            zoneId: zone,
            districtId: existingZone.districtId 
          });

          await newUser.save();
        }
      }
    }

    const officeData = {
      officeId,
      officeName,
      officeType,
      zone,
      ddoOfficer,
      ddoCode,
      parentOffice,
      isDdo
    };

    if (officeType === "Educational") {
      officeData.schools = schoolIds;
    }

    const newOffice = new Office(officeData);
    await newOffice.save();

    if (schoolIds.length > 0) {
      await School.updateMany(
        { _id: { $in: schoolIds } },
        { $set: { office: newOffice._id } }
      );

      await User.updateMany(
        { schoolId: { $in: schoolIds } },
        { $set: { office: newOffice._id } }
      );
    }

    res.status(201).json({ message: "Office created successfully", office: newOffice });
  } catch (error) {
    res.status(500).json({ message: "Error creating office", error: error.message });
  }
};

export const updateOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const { officeName, officeType, zone, ddoOfficer, schools, ddoCode, parentOffice, isDdo } = req.body;

    const updatedOffice = await Office.findByIdAndUpdate(
      { officeId },
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
