// seedData.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import District from "./models/District.js";
import Zone from "./models/Zone.js";
import School from "./models/School.js";
import Employee from "./models/Employee.js";
import User from "./models/User.js"; // Ensure your User model is defined

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Drop problematic indexes on Zone and School collections
    await Zone.collection.dropIndexes().catch((err) => {
      console.error("Error dropping indexes on Zone collection:", err);
    });
    await School.collection.dropIndexes().catch((err) => {
      console.error("Error dropping indexes on School collection:", err);
    });

    // Clear existing data from collections
    await District.deleteMany({});
    await Zone.deleteMany({});
    await School.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({}); // Clear users as well

    // 1. Create a dummy District
    const district = await District.create({
      name: "Jammu District",
    });
    console.log("District created:", district);

    // 2. Create dummy Zones that belong to the district
    const zone1 = await Zone.create({
      name: "Assar Zone",
      district: district._id,
    });
    const zone2 = await Zone.create({
      name: "Baderwah Zone",
      district: district._id,
    });
    console.log("Zones created:", zone1, zone2);

    // Update the district with the created zones
    district.zones = [zone1._id, zone2._id];
    await district.save();

    // 3. Create dummy Schools under each Zone
    const school1 = await School.create({
      udiseId: "JK001", // Unique school identifier
      name: "Sanskriti Vidyalaya",
      address: "Plot 12, Sector 5, Jammu, J&K 180001",
      principal: "Amit Kumar",
      contact: "+91-9876543210",
      scheme: "elementary",
      subScheme: "10+2",
      zone: zone1._id,
      numberOfStudents: 500,
    });
    const school2 = await School.create({
      udiseId: "JK002",
      name: "Baderwah Public School",
      address: "Block B, Model Town, Baderwah, J&K 180002",
      principal: "Sunita Rani",
      contact: "+91-9876543220",
      scheme: "secondary",
      subScheme: "10+2",
      zone: zone2._id,
      numberOfStudents: 300,
    });
    console.log("Schools created:", school1, school2);

    // Update the zones with the created schools
    zone1.schools.push(school1._id);
    await zone1.save();
    zone2.schools.push(school2._id);
    await zone2.save();

    // 4. Create a dummy Employee and assign to school1
    const employee = await Employee.create({
      employeeId: "EMP1001", // Unique employee identifier
      sanctionedPost: "Teacher",
      employeeName: "Alice Johnson",
      staffType: "teaching",
      dateOfBirth: new Date("1985-01-01"),
      dateOfFirstAppointment: new Date("2010-09-01"),
      designationAtFirstAppointment: "Assistant Teacher",
      qualification: "B.Ed",
      subjectInPG: "Mathematics",
      presentDesignation: "Senior Teacher",
      dateOfLatestPromotion: new Date("2018-07-01"),
      dateOfRetirement: new Date("2045-01-01"),
      dateOfCurrentPosting: new Date("2019-08-01"),
      previousPostings: [
        {
          schoolName: "Old School",
          startDate: new Date("2010-09-01"),
          endDate: new Date("2015-06-30"),
        },
      ],
      currentPayScale: "Scale A",
      payLevel: "Level 3",
      grossSalary: "50000",
      pensionScheme: "NPS",
      school: school1._id,
    });
    console.log("Employee created:", employee);

    // Update the school with the created employee
    school1.employees.push(employee._id);
    await school1.save();

    // 5. Create the main admin user
    // Credentials: userId "admin" and password "admin123"
    const adminUser = await User.create({
      userId: "admin",
      password: "admin123",
      role: "admin",
      passwordChanged: true, // Set true if you want the admin to not be forced to change the password
    });
    console.log("Admin user created:", adminUser.userId);

    console.log("Dummy data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
