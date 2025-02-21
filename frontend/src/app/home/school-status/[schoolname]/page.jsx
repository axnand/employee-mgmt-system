"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Users, Search, ChevronLeft } from "lucide-react";
import Link from "next/link";
import districtData from "@/data/data.json";
import { School, MapPin, User, Phone } from "lucide-react";


// Flatten schools from all zones and attach their zone info
const allSchools = districtData.zones.flatMap((zone) =>
  zone.schools.map((school) => ({ ...school, zone: zone.zone }))
);

export default function SchoolDetailsPage() {
  const { schoolname } = useParams();
  const decodedSchoolName = decodeURIComponent(schoolname);
  const schoolInfo = allSchools.find((school) => school.name === decodedSchoolName);

  // Employee search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filter employees from the school's employees array
  const employees = schoolInfo ? schoolInfo.employees : [];
  const filteredEmployees = employees.filter((emp) =>
    emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.present_designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="mb-6 text-[15px] font-semibold  rounded-md text-secondary hover:text-primary transition flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> <span>Back</span>
          </button>
        </Link>
        {/* School Information Card */}
        <div className="bg-white border-l-2 border-primary p-6 rounded-lg shadow  transition duration-300 mb-8 font-medium text-sm">
  <div className="flex items-center gap-3">
    <School className="w-7 h-7 text-primary" />
    <h1 className="text-2xl font-bold text-secondary">{schoolInfo.name}</h1>
  </div>
  <div className="mt-4 space-y-3">
    <p className="flex items-center text-gray-600">
      <MapPin className="w-5 h-5 text-secondary mr-2 " />
      {schoolInfo.address}
    </p>
    <p className="flex items-center text-gray-600">
      <User className="w-5 h-5 text-secondary mr-2 " />
      {schoolInfo.principal}
    </p>
    <p className="flex items-center text-gray-600">
      <Phone className="w-5 h-5 text-secondary mr-2 " />
      {schoolInfo.contact}
    </p>
    <p className="text-gray-600">
      <span className="font-semibold text-secondary">School Type:</span> {schoolInfo.school_type}
    </p>
    <p className="text-gray-600">
      <span className="font-semibold text-secondary">Scheme:</span> {schoolInfo.scheme} 
      <span className="font-semibold ml-1">| Sub Scheme:</span> {schoolInfo.sub_scheme}
    </p>
  </div>
</div>

        {/* Employee Search & Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <Users className="w-6 h-6 text-primary" /> Employees
  </h2>
  <div className="mb-4">
    <label htmlFor="employeeSearch" className="block text-sm font-medium text-gray-700 mb-1">
      Search Employees
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        id="employeeSearch"
        type="text"
        placeholder="Name or designation"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 border-gray-300 rounded-md py-2 border px-2 text-sm"
      />
    </div>
  </div>

  <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Employee ID
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Name
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Designation
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Date of Retirement
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {filteredEmployees.map((emp) => (
      <tr key={emp.emp_id}>
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
          <Link href={`/home/school-status/Gerhold%20High%20School/${emp.emp_id}`}>
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
