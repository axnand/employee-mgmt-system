"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  School,
  UserPlus,
  LogOut,
  Users,
  FileText,
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
];

// Staff Distribution
const staffData = [
  { name: "Teaching", value: 300 },
  { name: "Non-Teaching", value: 200 },
];

// Extra metrics for the dashboard
const totalSchools = schoolData.length;
const totalStaff = staffData.reduce((acc, curr) => acc + curr.value, 0);
const totalStudents = enrollmentData[enrollmentData.length - 1].students;
const pendingTransfers = 5; // example placeholder
const attendanceRate = 94; // example placeholder percentage

// Colors for the Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const [recentActivities, setRecentActivities] = useState([]);

  // Sample recent activities
  useEffect(() => {
    setRecentActivities([
      { action: "Logged in", time: "2022-09-12 10:20 AM" },
      { action: "Updated School Info", time: "2022-09-11 05:10 PM" },
      { action: "Added New Employee", time: "2022-09-10 11:30 AM" },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* Total Schools */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <School className="h-5 w-5 text-blue-500" />
            <h3 className="text-[15px] font-semibold">Total Schools</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Number of schools in the district</p>
          <div className="text-2xl font-bold">{totalSchools}</div>
        </div>

        {/* Total Employees */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-[15px] font-semibold">Total Employees</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Teaching & Non-Teaching staff</p>
          <div className="text-2xl font-bold">{totalStaff}</div>
        </div>

        {/* Total Students */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-purple-500" />
            <h3 className="text-[15px] font-semibold">Total Students</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Current enrollment</p>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </div>

        {/* Pending Transfers */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold">Pending Transfers</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Awaiting approval</p>
          <div className="text-2xl font-bold">{pendingTransfers}</div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <Clipboard className="h-5 w-5 text-pink-500" />
            <h3 className="text-[15px] font-semibold">Attendance Rate</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Overall daily average</p>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        

        {/* Enrollment Trends (Line Chart) */}
        <div className="md:col-span-3 bg-white shadow-sm rounded-lg p-4 ">
          <h3 className="text-xl font-bold mb-6 text-[#071e38]">Enrollment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
      <BarChart data={enrollmentData}>
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* X-Axis Customization */}
        <XAxis
          dataKey="year"
          tick={{ fontSize: 14, fill: "#0d2745", style:{fontWeight: "600"}  }} // Font size & color
          tickLine={{ stroke: "#377DFF" }} // Tick color
        />
        
        {/* Y-Axis Customization */}
        <YAxis
          tick={{ fontSize: 14, fill: "#0d2745", style:{fontWeight: "600"}  }} // Font size & color
          tickLine={{ stroke: "#377DFF" }} // Tick color
        />
        
        {/* Tooltip Customization */}
        <Tooltip
          contentStyle={{ backgroundColor: "#0a0a0a", color: "#fff", fontSize: "14px" }}
          itemStyle={{ color: "#377DFF" }}
        />
        
        {/* Legend Customization */}
        <Legend
          wrapperStyle={{ fontSize: "14px", color: "#377DFF" }}
        />
        
        {/* Bar Customization */}
        <Bar dataKey="students" fill="#377DFF" barSize={50} radius={[5, 5 , 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <h3 className="text-xl text-secondary font-bold mb-4">Recent Activities</h3>
        <div className="divide-y divide-gray-200 mt-2">
          {recentActivities.map((activity, index) => (
            <div key={index} className="py-2 flex items-center justify-between text-sm font-medium text-gray-600">
              <span>{activity.action}</span>
              <span className="text-gray-400 text-[13px]">{activity.time}</span>
            </div>
          ))}
        </div>
        {/* Example link to view all activities/logs */}
        <div className="mt-4 text-right">
          <Link href="/home/logs" className="text-blue-600 font-semibold hover:underline text-sm">
            View All Logs
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <h3 className="text-xl font-bold text-secondary mb-6">Quick Actions</h3>
        <div className=" mt-4 flex gap-x-3 items-center">
          <Link href="/home/add-employee">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold bg-[#377DFF] text-white hover:bg-[#2d6ca3] flex items-center justify-center gap-2">
              <UserPlus size={16} />
              Add New Employee
            </button>
          </Link>
          <Link href="/home/update-school-info">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold bg-[#377DFF] text-white hover:bg-[#2d6ca3] flex items-center justify-center gap-2">
              <School size={16} />
              Update School Info
            </button>
          </Link>
          {/* Example of additional Quick Action */}
          <Link href="/home/mark-attendance">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold bg-[#377DFF] text-white hover:bg-[#2d6ca3] flex items-center justify-center gap-2">
              <Clipboard size={16} />
              Mark Attendance
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
