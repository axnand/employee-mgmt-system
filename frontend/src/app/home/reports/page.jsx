"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { File } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function StaffStatementDownloadPage() {

  const [zones, setZones] = useState([]);
const [schools, setSchools] = useState([]);
const [selectedZoneId, setSelectedZoneId] = useState("");
const { user } = useUser();
const userRole = user?.role;
const schoolId = userRole === "schoolAdmin" ? user?.schoolId || "" : "";
const [selectedSchoolId, setSelectedSchoolId] = useState(schoolId);
const [reportType, setReportType] = useState(
  userRole === "schoolAdmin" ? "school-employees" : "zones-schools"
);
const [loadingZones, setLoadingZones] = useState(false);
const [loadingSchools, setLoadingSchools] = useState(false);



useEffect(() => {
  if (userRole === "ceo" || userRole === "zeo") {
    fetchZones();
  }
}, []);

const fetchZones = async () => {
  try {
    const response = await fetch("/api/zones");
    const data = await response.json();
    setZones(data.zones);
    if (userRole === "zeo") {
      const zone = data.zones.find((z) => z._id === user.zoneId);
      if (zone) {
        setSelectedZoneId(zone._id);
        fetchSchools(zone._id);
      }
    }
  } catch (error) {
    console.error("Failed to fetch zones", error);
  }
};

const fetchSchools = async (zoneId) => {
  try {
    const response = await fetch(`/api/zones/${zoneId}/schools`);
    const data = await response.json();
    setSchools(data);
  } catch (error) {
    console.error("Failed to fetch schools", error);
  }
};

useEffect(() => {
  if (selectedZoneId) {
    fetchSchools(selectedZoneId);
  }
}, [selectedZoneId]);

const downloadExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, fileName);
};




  


const handleDownload = async () => {
  if (reportType === "zones-schools") {
    let url = "/api/reports/schools";
    if (userRole === "zeo") url += `?zoneId=${user.zoneId}`;
    if (userRole === "ceo" && selectedZoneId) url += `?zoneId=${selectedZoneId}`;

    const response = await fetch(url);
    const data = await response.json();
    downloadExcel(data, "School_Report.xlsx");
  }

  if (reportType === "school-employees") {
    if (!selectedSchoolId) {
      alert("Please select a school.");
      return;
    }

    const response = await fetch(`/api/reports/employees/${selectedSchoolId}`);
    const data = await response.json();
    downloadExcel(data, "School_Employees_Report.xlsx");
  }
};






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
          
          {userRole === "CEO" && (
  <div className="flex-1 mb-6 w-1/3">
    <label className="block text-sm font-medium text-gray-700 mb-1">Select Zone:</label>
    <select
      value={selectedZoneId}
      onChange={(e) => {
        setSelectedZoneId(e.target.value);
        setSelectedSchoolId("");
      }}
      className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
    >
      <option value="">Select a Zone</option>
      {zones.map((zone) => (
        <option key={zone._id} value={zone._id}>
          {zone.name}
        </option>
      ))}
    </select>
  </div>
)}
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
                  <option key={school._id} value={school._id}>
                  {school.schoolName} ({school._id})
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
