"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import districtData from "@/data/data.json"; 
import { File } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function StaffStatementDownloadPage() {
  const generateZonesSchoolsReport = () => {
    const { district, zones } = districtData;
    const rows = [];
    zones.forEach((zone) => {
      zone.schools.forEach((school) => {
        rows.push({
          District: district,
          Zone: zone.zone,
          Zonation: zone.zonation,
          SchoolName: school.name,
          SchoolID: school.id,
          Address: school.address,
          Principal: school.principal,
          Contact: school.contact,
          Scheme: school.scheme,
          "No of Employees": school.employees ? school.employees.length : 0,
        });
      });
    });
    return rows;
  };



  const generateSchoolEmployeesReport = (schoolId) => {
    let foundSchool = null;
    districtData.zones.forEach((zone) => {
      zone.schools.forEach((school) => {
        if (String(school.id) === String(schoolId)) {
          foundSchool = school;
        }
      });
    });
    if (!foundSchool) return [];
    return foundSchool.employees || [];
  };

  const downloadExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };


  const handleDownload = () => {
    if (reportType === "zones-schools") {
      const reportData = generateZonesSchoolsReport();
      downloadExcel(reportData, "Zones_Schools_Report.xlsx");
    } else if (reportType === "school-employees") {
      if (!selectedSchoolId) {
        alert("Please select a school.");
        return;
      }
      const reportData = generateSchoolEmployeesReport(selectedSchoolId);
      downloadExcel(reportData, "School_Employees_Report.xlsx");
    }
  };
  const { user, userRole } = useUser();
  const schoolId = userRole === "schoolAdmin" ? user?.schoolId || null : null;
  const [reportType, setReportType] = useState(userRole === "schoolAdmin" ? "school-employees" : "zones-schools");
  const [selectedSchoolId, setSelectedSchoolId] = useState(schoolId || "");

  // Build a list of all schools for admins (except schoolAdmin)
  const schools = [];
  if (userRole !== "schoolAdmin") {
    districtData.zones.forEach((zone) => {
      zone.schools.forEach((school) => {
        schools.push({
          id: school.id,
          name: school.name,
        });
      });
    });
  }




  return (
    <div className="min-h-screen capitalize">
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <File className="w-8 h-8 text-primary" /> Reports Download
          </h1>
          <p className="mt-2 font-medium text-sm text-gray-600">
            Download Excel Reports for Schools and their Staff Members
          </p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-[3px] border-primary">
          <div className="flex-1 mb-6 w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setSelectedSchoolId("");
              }}
              
              className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm "
            >
              {userRole !== "schoolAdmin"&&<option value="zones-schools">Zones & Schools Report</option>}
              <option value="school-employees"> Staff Statement Report</option>
            </select>
          </div>

          {/* School Selection Dropdown (Hidden for schoolAdmin) */}
          {reportType === "school-employees" && userRole !== "schoolAdmin" && (
            <div className="flex-1 mb-6 w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select School:</label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
              >
                <option value="">Select a School</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.id})
                  </option>
                ))}
              </select>
            </div>
          )}

         
          <button
            onClick={handleDownload}
            className="px-4 py-2 mt-4 transition bg-blue-500 font-semibold text-sm text-white rounded hover:bg-blue-600"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
