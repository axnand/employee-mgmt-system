"use client";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock Employee Data
const mockEmployees = [
  { id: 1, name: "John Doe", designation: "Teacher", school: "School A", status: "Present" },
  { id: 2, name: "Jane Smith", designation: "Non-Teaching Staff", school: "School B", status: "Absent" },
  { id: 3, name: "Alice Brown", designation: "Teacher", school: "School C", status: "Leave" },
  { id: 4, name: "Michael Johnson", designation: "Non-Teaching Staff", school: "School A", status: "Remote Work" },
];

// Sample Attendance Data for Charts
const attendanceData = [
  { day: "Mon", Teachers: 80, NonTeachers: 20 },
  { day: "Tue", Teachers: 75, NonTeachers: 25 },
  { day: "Wed", Teachers: 85, NonTeachers: 15 },
  { day: "Thu", Teachers: 90, NonTeachers: 10 },
  { day: "Fri", Teachers: 95, NonTeachers: 5 },
];

export default function AttendancePage() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");

  // Update Attendance Status
  // ✅ Updated Attendance Update Function (Fix Double Toast Issue)
  const updateAttendance = (id, status) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status } : emp))
    );
  
    if (toast.isActive(`attendance-toast-${id}`)) {
      toast.dismiss(`attendance-toast-${id}`); // ✅ Dismiss only if toast exists
    }
  
    toast.success(`Attendance marked as ${status}`, {
      autoClose: 3000,
      closeOnClick: true,
      toastId: `attendance-toast-${id}`, // ✅ Unique ID per employee
    });
  };
  
  const markAllAttendance = (status) => {
    setEmployees((prev) => prev.map((emp) => ({ ...emp, status })));
  
    if (toast.isActive("bulk-attendance-toast")) {
      toast.dismiss("bulk-attendance-toast"); // ✅ Dismiss only if exists
    }
  
    toast.success(`All employees marked as ${status}`, {
      autoClose: 3000,
      closeOnClick: true,
      toastId: "bulk-attendance-toast", // ✅ Unique ID for bulk action
    });
  };
  
  

  // Search Filter
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <h1 className="text-3xl font-bold mb-4">📊 Attendance Dashboard</h1>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl">100</p>
        </div>
        <div className="bg-green-500 text-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Present Today</h3>
          <p className="text-2xl">80</p>
        </div>
        <div className="bg-red-500 text-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Absent Today</h3>
          <p className="text-2xl">20</p>
        </div>
        <div className="bg-yellow-500 text-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">On Leave</h3>
          <p className="text-2xl">10</p>
        </div>
      </div>

      {/* Attendance Chart Section */}
      <h2 className="text-2xl font-semibold">📈 Attendance Trends</h2>
      <div className="grid grid-cols-2 gap-4 my-4">
        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Teachers" fill="#4CAF50" />
            <Bar dataKey="NonTeachers" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>

        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={attendanceData} dataKey="Teachers" nameKey="day" fill="#4CAF50" label />
            <Pie data={attendanceData} dataKey="NonTeachers" nameKey="day" fill="#2196F3" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table */}
      <h2 className="text-2xl font-semibold my-4">📋 Employee Attendance</h2>
      <div className="flex justify-between mb-4">
        <input
          className="border p-2 rounded-md w-2/3"
          placeholder="🔍 Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => markAllAttendance("Present")}>
          ✅ Mark All Present
        </button>
      </div>

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Designation</th>
            <th className="p-3 text-left">School</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id} className="border-b">
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.designation}</td>
              <td className="p-3">{emp.school}</td>
              <td className={`p-3 font-semibold ${emp.status === "Present" ? "text-green-500" : "text-red-500"}`}>
                {emp.status}
              </td>
              <td className="p-3">
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => updateAttendance(emp.id, "Present")}>
                  ✅ Present
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => updateAttendance(emp.id, "Absent")}>
                  ❌ Absent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
