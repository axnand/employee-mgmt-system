"use client";

import { useState } from "react";

const schools = [
  { id: 1, name: "School A" },
  { id: 2, name: "School B" },
  { id: 3, name: "School C" },
];

const staffData = [
  { id: 1, name: "John Doe", designation: "Teacher", school: "School A", status: "Present" },
  { id: 2, name: "Jane Smith", designation: "Administrator", school: "School B", status: "Absent" },
  { id: 3, name: "Bob Johnson", designation: "Teacher", school: "School C", status: "Present" },
  { id: 4, name: "Alice Brown", designation: "Teacher", school: "School A", status: "Present" },
  { id: 5, name: "Charlie Davis", designation: "Administrator", school: "School C", status: "Absent" },
];

export default function SchoolStatusPage() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = staffData.filter(
    (staff) =>
      (selectedSchool === "" || staff.school === selectedSchool) &&
      (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">School Status Dashboard</h1>
      
      {/* Filters */}
      <div className="flex justify-between mb-4">
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="border rounded-md p-2 w-1/4"
        >
          <option value="">Select a school</option>
          <option value="all">All Schools</option>
          {schools.map((school) => (
            <option key={school.id} value={school.name}>
              {school.name}
            </option>
          ))}
        </select>

        <input
          className="border rounded-md p-2 w-1/3"
          placeholder="Search by name, designation, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Staff Table */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Designation</th>
            <th className="py-2 px-4 text-left">School</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => (
            <tr key={staff.id} className="border-b">
              <td className="py-2 px-4">{staff.name}</td>
              <td className="py-2 px-4">{staff.designation}</td>
              <td className="py-2 px-4">{staff.school}</td>
              <td className="py-2 px-4">{staff.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
