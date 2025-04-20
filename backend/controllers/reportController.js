import Employee from "../models/Employee.js";
import School from "../models/School.js";
import XLSX from "xlsx";
export const getSchoolReport = async (req, res) => {
    const { role, schoolId, zoneId } = req.user; // assuming populated from auth
    let filter = {};
  
    if (role === "schoolAdmin") filter._id = schoolId;
    if (role === "zeo") filter.zone = zoneId;
    if (req.query.zoneId) filter.zone = req.query.zoneId;
    if (req.query.schoolId) filter._id = req.query.schoolId;
  
    const schools = await School.find(filter)
      .populate("zone")
      .populate("office"); // For school name
  
    const data = schools.map(school => ({
      Zone: school.zone?.name,
      SchoolName: school.office?.officeName,
      SchoolID: school.udiseId,
      Address: school.address,
      Principal: school.principal,
      Contact: school.office?.contact || "-",
      Scheme: school.scheme,
      NoOfStudents: school.numberOfStudents,
      IsPMShiriSchool: school.isPMShiriSchool ? "Yes" : "No",
    }));
  
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "Schools");
  
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", "attachment; filename=Schools_Report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(buffer);
  };

  

export const getEmployeeReport = async (req, res) => {
  try {
    const { role, schoolId, zoneId } = req.user;
    const { zoneId: queryZoneId, schoolId: querySchoolId } = req.query;

    let schoolFilter = {};

    // Role-based filters
    if (role === "schoolAdmin") {
      schoolFilter._id = schoolId;
    } else if (role === "zeo") {
      schoolFilter.zone = zoneId;
    }

    // Manual filters (for CEO or UI filters)
    if (queryZoneId) {
      schoolFilter.zone = queryZoneId;
    }
    if (querySchoolId) {
      schoolFilter._id = querySchoolId;
    }

    // First, find the matching schools
    const schools = await School.find(schoolFilter).select("_id office zone").populate("office zone");
    const schoolMap = new Map();
    schools.forEach((s) => {
      schoolMap.set(String(s._id), {
        schoolId: s._id,
        schoolName: s.office?.officeName || "N/A",
        zone: s.zone?.name || "N/A",
      });
    });

    const schoolIds = Array.from(schoolMap.keys());

    // Then find employees in those schools
    const employees = await Employee.find({ school: { $in: schoolIds } }).populate("school");

    // Format report data
    const reportData = employees.map((emp) => {
      const meta = schoolMap.get(String(emp.school));
      return {
        Zone: meta.zone,
        SchoolName: meta.schoolName,
        EmployeeName: emp.name,
        Designation: emp.designation,
        Phone: emp.phone,
        Email: emp.email || "-",
        Gender: emp.gender,
        EmployeeID: emp._id.toString(),
      };
    });

    // Generate Excel
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, sheet, "Employees");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=Employees_Report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    return res.send(buffer);
  } catch (error) {
    console.error("Error generating employee report:", error);
    res.status(500).json({ message: "Failed to generate report", error: error.message });
  }
};

  