"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Users, Search, ChevronLeft } from "lucide-react";
import Link from "next/link";
import districtData from "@/data/data.json";
import { School, MapPin, User, Phone } from "lucide-react";

// Flatten schools from all zones, attach zone info, and generate a unique id if needed.
const allSchools = districtData.zones.flatMap((zone, zoneIndex) =>
  zone.schools.map((school, schoolIndex) => ({
    ...school,
    zone: zone.zone,
    id: school.id || `${zoneIndex}-${schoolIndex}`
  }))
);

export default function SchoolDetailsPage() {
  // Retrieve the school id from URL params
  const { schoolId } = useParams();
  console.log("school",schoolId);
  console.log("allschool",allSchools);
  const schoolInfo = allSchools.find(
    (school) => school.id === parseInt(schoolId, 10)
  );


  // Employee filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [retirementFilter, setRetirementFilter] = useState("");

  // Get employees from school data (or an empty array)
  const employees = schoolInfo ? schoolInfo.employees : [];

  // Build unique designations from employees for the dropdown
  const uniqueDesignations = Array.from(new Set(employees.map(emp => emp.present_designation)));

  // Filter employees based on all filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation =
      designationFilter === "" || emp.present_designation === designationFilter;
    const matchesRetirement =
      retirementFilter === "" || emp.date_of_retirement === retirementFilter;
    return matchesSearch && matchesDesignation && matchesRetirement;
  });

  if (!schoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">School not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 capitalize">
      <div className="max-w-7xl mx-auto">
        <Link href="/home/school-status">
          <button className="mb-6 text-[15px] font-semibold rounded-md text-secondary hover:text-primary transition flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> <span>Back</span>
          </button>
        </Link>

        {/* School Information Card */}
        <div className="bg-white border-l-2 border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 font-medium text-sm">
          <div className="flex items-center gap-3">
            <School className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-secondary">{schoolInfo.name}</h1>
          </div>
          <div className="mt-4 space-y-3">
            <p className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 text-secondary mr-2" />
              {schoolInfo.address}
            </p>
            <p className="flex items-center text-gray-600">
              <User className="w-5 h-5 text-secondary mr-2" />
              {schoolInfo.principal}
            </p>
            <p className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 text-secondary mr-2" />
              {schoolInfo.contact}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-secondary">School Type:</span> {schoolInfo.school_type}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-secondary">Scheme:</span> {schoolInfo.scheme}{" "}
              <span className="font-semibold ml-1">| Sub Scheme:</span> {schoolInfo.sub_scheme}
            </p>
          </div>
        </div>

        {/* Employee Filter Component */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-2 border-primary">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Employees</h2>
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
            {/* Name Search */}
            <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="employeeSearch" className="block text-sm font-medium text-gray-700 mb-1">
        Search by Name
      </label>
      <input
        id="employeeSearch"
        type="text"
        placeholder="Employee name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
      />
    </div>
            {/* Designation Filter */}
            <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="designationFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Designation
      </label>
      <select
        id="designationFilter"
        value={designationFilter}
        onChange={(e) => setDesignationFilter(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
      >
        <option value="">All Designations</option>
        {uniqueDesignations.map((des, idx) => (
          <option key={idx} value={des}>
            {des}
          </option>
        ))}
      </select>
    </div>

    {/* Retirement Date Filter */}
    <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="retirementFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Retirement Date
      </label>
      <input
        id="retirementFilter"
        type="date"
        value={retirementFilter}
        onChange={(e) => setRetirementFilter(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
      />
    </div>

          </div>
        </div>

        {/* Employee Search & Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Employees
          </h2>
          <div className="bg-white rounded-lg overflow-x-auto border">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date of Retirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.emp_id} className="">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.emp_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.emp_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.present_designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.date_of_retirement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/home/school-status/${encodeURIComponent(schoolInfo.id)}/${emp.emp_id}`}>
                        <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
