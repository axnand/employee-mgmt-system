"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LineChart, Line } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Schools */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Total Schools</h3>
        <p className="text-lg">Number of schools in the district</p>
        <div className="text-4xl font-bold mt-4">{schoolData.length}</div>
      </div>

      {/* Total Employees */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Total Employees</h3>
        <p className="text-lg">Teaching & Non-Teaching staff</p>
        <div className="text-4xl font-bold mt-4">
          {staffData.reduce((acc, curr) => acc + curr.value, 0)}
        </div>
      </div>

      {/* Total Students */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="text-xl font-semibold">Total Students</h3>
        <p className="text-lg">Current enrollment</p>
        <div className="text-4xl font-bold mt-4">
          {enrollmentData[enrollmentData.length - 1].students}
        </div>
      </div>

      {/* School Enrollment Bar Chart */}
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

      {/* Staff Distribution Pie Chart */}
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

      {/* Enrollment Trends Line Chart */}
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
    </div>
  );
}
