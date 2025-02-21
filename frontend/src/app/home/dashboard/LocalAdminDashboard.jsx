"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Clipboard,
  FileText,
  ArrowLeftRight,
  UserPlus,
  LogOut,
  Calendar,
  School,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock Data
const attendanceData = [
  { date: "2024-02-01", present: 80, absent: 10, leave: 5 },
  { date: "2024-02-02", present: 75, absent: 12, leave: 8 },
  { date: "2024-02-03", present: 85, absent: 5, leave: 6 },
];

const totalEmployees = 120; // Example count
const pendingTransfers = 3; // Example pending transfers
const attendanceRate = 92; // Example percentage

export default function LocalAdminDashboard() {
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    setRecentActivities([
      { action: "Marked Attendance", time: "2024-02-16 09:00 AM" },
      { action: "Requested Employee Transfer", time: "2024-02-15 03:30 PM" },
      { action: "Generated Attendance Report", time: "2024-02-14 12:45 PM" },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Total Employees */}
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-[15px] font-semibold">Total Employees</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">School Staff Count</p>
          <div className="text-2xl font-bold">{totalEmployees}</div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <Clipboard className="h-5 w-5 text-blue-500" />
            <h3 className="text-[15px] font-semibold">Attendance Rate</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Daily School Attendance</p>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
        </div>

        {/* Pending Transfers */}
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold">Pending Transfers</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Awaiting Approval</p>
          <div className="text-2xl font-bold">{pendingTransfers}</div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4 text-[#071e38]">Attendance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 14, fill: "#0d2745" }} />
            <YAxis tick={{ fontSize: 14, fill: "#0d2745" }} />
            <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar dataKey="present" fill="#377DFF" barSize={40} radius={[5, 5, 0, 0]} />
            <Bar dataKey="absent" fill="#FF8042" barSize={40} radius={[5, 5, 0, 0]} />
            <Bar dataKey="leave" fill="#FFBB28" barSize={40} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <h3 className="text-xl font-bold mb-4 text-secondary">Quick Actions</h3>
        <div className="mt-4 flex gap-x-3 items-center">
          <Link href="/home/mark-attendance">
            <button className="w-full py-2 px-4 bg-[#377DFF] text-white rounded shadow-md text-sm font-semibold hover:bg-[#2d6ca3] flex items-center justify-center gap-2">
              <Clipboard size={16} /> Mark Attendance
            </button>
          </Link>
          <Link href="/home/request-transfer">
            <button className="w-full py-2 px-4 bg-[#377DFF] text-white rounded shadow-md text-sm font-semibold hover:bg-[#2d6ca3] flex items-center justify-center gap-2">
              <ArrowLeftRight size={16} /> Request Transfer
            </button>
          </Link>
          <Link href="/home/generate-report">
            <button className="w-full py-2 px-4 bg-[#377DFF] text-white rounded shadow-md text-sm font-semibold hover:bg-[#2d6ca3] flex items-center justify-center gap-2">
              <FileText size={16} /> Generate Report
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}