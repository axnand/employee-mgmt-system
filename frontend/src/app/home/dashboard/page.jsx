'use client'

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LineChart, Line } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, School, UserPlus, LogOut, Users, FileText, ArrowLeftRightIcon, Clipboard } from "lucide-react";
import Link from "next/link";

// Sample data for visualization
const schoolData = [
  { name: "School A", students: 400 },
  { name: "School B", students: 300 },
  { name: "School C", students: 500 },
  { name: "School D", students: 200 },
  { name: "School E", students: 350 },
];

const enrollmentData = [
  { year: "2018", students: 1200 },
  { year: "2019", students: 1300 },
  { year: "2020", students: 1400 },
  { year: "2021", students: 1600 },
  { year: "2022", students: 1800 },
];

const staffData = [
  { name: "Teaching", value: 300 },
  { name: "Non-Teaching", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Sample recent activities (In real-world, you may fetch this from an API)
  useEffect(() => {
    setRecentActivities([
      { action: "Logged in", time: "2022-09-12 10:20 AM" },
      { action: "Updated School Info", time: "2022-09-11 05:10 PM" },
      { action: "Added New Employee", time: "2022-09-10 11:30 AM" },
    ]);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Overview Statistics */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Total Schools</h3>
        <p className="text-lg">Number of schools in the district</p>
        <div className="text-4xl font-bold mt-4">{schoolData.length}</div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Total Employees</h3>
        <p className="text-lg">Teaching & Non-Teaching staff</p>
        <div className="text-4xl font-bold mt-4">
          {staffData.reduce((acc, curr) => acc + curr.value, 0)}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Total Students</h3>
        <p className="text-lg">Current enrollment</p>
        <div className="text-4xl font-bold mt-4">
          {enrollmentData[enrollmentData.length - 1].students}
        </div>
      </div>

      {/* Visual Data */}
      <div className="col-span-2 bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">School Enrollment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={schoolData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Staff Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={staffData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {staffData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-3 bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Enrollment Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="students" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activities */}
      <div className="col-span-3 bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Recent Activities</h3>
        <div className="space-y-2 mt-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600">
              <span>{activity.action}</span>
              <span>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-span-3 bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Quick Actions</h3>
        <div className="space-y-4 mt-4">
          <Link href="/home/add-employee">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm bg-[#377DFF] text-white hover:bg-[#2d6ca3]">
              Add New Employee
            </button>
          </Link>
          <Link href="/home/update-school-info">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm bg-[#377DFF] text-white hover:bg-[#2d6ca3]">
              Update School Info
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
