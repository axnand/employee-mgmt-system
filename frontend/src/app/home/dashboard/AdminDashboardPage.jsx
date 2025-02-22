"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  School,
  Users,
  ArrowLeftRight,
  Clipboard,
} from "lucide-react";
import Link from "next/link";

/* 
  SAMPLE DATA (You’d likely fetch real data from an API in production)
*/

// School-wise Enrollment
const schoolData = [
  { name: "School A", students: 400 },
  { name: "School B", students: 300 },
  { name: "School C", students: 500 },
  { name: "School D", students: 200 },
  { name: "School E", students: 350 },
];

// Yearly Enrollment Trends
const enrollmentData = [
  { year: "2018", students: 1200 },
  { year: "2019", students: 1300 },
  { year: "2020", students: 1400 },
  { year: "2021", students: 1600 },
  { year: "2022", students: 1800 },
  { year: "2024", students: 2200 },
];

// Staff Distribution
const staffData = [
  { name: "Teaching", value: 300 },
  { name: "Non-Teaching", value: 200 },
];

// Attendance Status Data for Pie Chart
const attendanceStatusData = [
  { name: "Present", value: 800 },
  { name: "Absent", value: 50 },
  { name: "On Leave", value: 30 },
  { name: "On Duty", value: 20 },
];

// Retirement Employees Sample Data
const retirementEmployees = [
  {
    emp_id: 4623,
    school_id: "89",
    emp_name: "Amit Sharma",
    present_designation: "Senior Assistant",
    date_of_retirement: "2025-03-15",
    
     // soon (within 30 days if today is 2025-02-23)
  },
  {
    emp_id: 4624,
    school_id: "89",
    emp_name: "Suman Verma",
    present_designation: "Principal",
    date_of_retirement: "2050-05-15", // far in the future
  },
  {
    emp_id: 4625,
    school_id: "89",
    emp_name: "Rahul Singh",
    present_designation: "Teacher",
    date_of_retirement: "2025-03-05", // soon
  },
  {
    emp_id: 4626,
    school_id: "89",
    emp_name: "Neha Gupta",
    present_designation: "Vice Principal",
    date_of_retirement: "2049-03-25", // far in the future
  },
  {
    emp_id: 4627,
    school_id: "89",
    emp_name: "Rohit Kumar",
    present_designation: "Clerk",
    date_of_retirement: "2025-02-28", // very soon
  },
];

// Extra metrics for the dashboard
const totalSchools = schoolData.length;
const totalStaff = staffData.reduce((acc, curr) => acc + curr.value, 0);
const totalStudents = enrollmentData[enrollmentData.length - 1].students;
const pendingTransfers = 5; // example placeholder

// Colors for the Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboardPage() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [filterDays, setFilterDays] = useState(30);
  const [filteredRetirements, setFilteredRetirements] = useState([]);

  // Sample recent activities
  useEffect(() => {
    setRecentActivities([
      { action: "Logged in", time: "2022-09-12 10:20 AM" },
      { action: "Updated School Info", time: "2022-09-11 05:10 PM" },
      { action: "Added New Employee", time: "2022-09-10 11:30 AM" },
    ]);
  }, []);

  // Function to compute days left until retirement from today
  const computeDaysLeft = (dateOfRetirement) => {
    const today = new Date();
    const retirementDate = new Date(dateOfRetirement);
    const diffTime = retirementDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter retirement employees based on filterDays
  useEffect(() => {
    const filtered = retirementEmployees.filter((emp) => {
      const daysLeft = computeDaysLeft(emp.date_of_retirement);
      return daysLeft <= filterDays;
    });
    setFilteredRetirements(filtered);
  }, [filterDays]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        {/* Total Schools */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <School className="h-5 w-5 text-blue-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Total Schools
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Number of schools in the district
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {totalSchools}
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Total Employees
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Teaching & Non-Teaching staff
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {totalStaff}
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-purple-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Total Students
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Current enrollment
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {totalStudents}
          </div>
        </div>

        {/* Pending Transfers */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Pending Transfers
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Awaiting approval
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {pendingTransfers}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex gap-x-4 w-full">
        {/* Enrollment Trends (Line Chart) */}
        <div className="bg-white shadow-sm rounded-lg p-4 w-3/5">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Enrollment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{
                  fontSize: 14,
                  fill: "#0d2745",
                  style: { fontWeight: "600" },
                }}
                tickLine={{ stroke: "#377DFF" }}
              />
              <YAxis
                tick={{
                  fontSize: 14,
                  fill: "#0d2745",
                  style: { fontWeight: "600" },
                }}
                tickLine={{ stroke: "#377DFF" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  fontSize: "14px",
                }}
                itemStyle={{ color: "#377DFF" }}
              />
              <Legend wrapperStyle={{ fontSize: "14px", color: "#377DFF" }} />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#377DFF"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Status (Pie Chart) */}
        <div className="bg-white shadow-sm rounded-lg p-4 w-2/5">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Attendance Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {attendanceStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  fontSize: "14px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "14px", color: "#377DFF", fontWeight: "500" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Recent Activities
        </h3>
        <div className="divide-y divide-gray-200 mt-2">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="py-2 flex items-center justify-between text-sm font-medium text-gray-600"
            >
              <span>{activity.action}</span>
              <span className="text-gray-400 text-[13px]">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/home/logs"
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            View All Logs
          </Link>
        </div>
      </div>

      {/* Retirement Announcements - Employee Retirement Table with Filter */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
            Retirement Announcements
          </h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-sm text-gray-700">
              Show retirements in next (days):
            </label>
            <input
              type="number"
              id="filter"
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value))}
              className="w-16 border border-gray-300 rounded p-1 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Employee ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Designation
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Date of Retirement
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRetirements.map((emp) => (
                <tr key={emp.emp_id}>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {emp.emp_id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {emp.emp_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {emp.present_designation}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {emp.date_of_retirement}
                  </td>
                  <td>
                  <Link href={`/home/school-status/${emp.school_id}/${emp.emp_id}`}>
                        <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                          View
                        </button>
                      </Link>
                  </td>
                </tr>
              ))}
              {filteredRetirements.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-2 text-sm text-gray-700 text-center"
                  >
                    No retirements within the next {filterDays} days.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
