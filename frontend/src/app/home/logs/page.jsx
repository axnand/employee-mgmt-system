"use client";

import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock Logs Data
const mockLogs = [
  { id: 1, admin: "John Doe", role: "Super Admin", action: "Login", school: "-", description: "Admin logged in", ip: "192.168.1.1", timestamp: "2024-02-16 08:30 AM" },
  { id: 2, admin: "Jane Smith", role: "Admin", action: "Employee Transfer", school: "School A", description: "Approved transfer request for Employee X", timestamp: "2024-02-15 03:45 PM" },
  { id: 3, admin: "Alice Brown", role: "Super Admin", action: "Profile Update", school: "School C", description: "Changed designation for Employee Y", timestamp: "2024-02-15 10:15 AM" },
  { id: 4, admin: "Michael Johnson", role: "Admin", action: "Failed Login", school: "-", description: "Unsuccessful login attempt", ip: "203.0.113.5", timestamp: "2024-02-14 07:50 PM" },
];

// Sample System Activity Statistics
const systemStats = [
  { day: "Mon", Logins: 30, Transfers: 5, Updates: 10 },
  { day: "Tue", Logins: 25, Transfers: 8, Updates: 12 },
  { day: "Wed", Logins: 40, Transfers: 6, Updates: 15 },
  { day: "Thu", Logins: 35, Transfers: 4, Updates: 10 },
  { day: "Fri", Logins: 50, Transfers: 9, Updates: 20 },
];

export default function LogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);

  // Search & Filter Logs
  const filteredLogs = logs.filter(
    (log) =>
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

      <h1 className="text-3xl font-bold mb-4">📜 System Logs & Activity Tracking</h1>

      {/* Logs Overview & Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Total Actions (24h)</h3>
          <p className="text-2xl">120</p>
        </div>
        <div className="bg-blue-500 text-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Admin Logins</h3>
          <p className="text-2xl">45</p>
        </div>
        <div className="bg-green-500 text-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Transfers Processed</h3>
          <p className="text-2xl">20</p>
        </div>
        <div className="bg-yellow-500 text-white shadow-lg p-4 rounded-md">
          <h3 className="text-lg font-semibold">Modifications</h3>
          <p className="text-2xl">30</p>
        </div>
      </div>

      {/* Activity Trends Charts */}
      <h2 className="text-2xl font-semibold">📈 System Activity Trends</h2>
      <div className="grid grid-cols-2 gap-4 my-4">
        {/* Bar Chart: Logins, Transfers, Updates */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={systemStats}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Logins" fill="#2196F3" />
            <Bar dataKey="Transfers" fill="#4CAF50" />
            <Bar dataKey="Updates" fill="#FFC107" />
          </BarChart>
        </ResponsiveContainer>

        {/* Pie Chart: Breakdown of Activities */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={systemStats} dataKey="Logins" nameKey="day" fill="#2196F3" label />
            <Pie data={systemStats} dataKey="Transfers" nameKey="day" fill="#4CAF50" label />
            <Pie data={systemStats} dataKey="Updates" nameKey="day" fill="#FFC107" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Search & Filters */}
      <div className="flex justify-between mb-4">
        <input
          className="border p-2 rounded-md w-2/3"
          placeholder="🔍 Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Logs Table */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Date & Time</th>
            <th className="p-3 text-left">Admin</th>
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Affected School</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
  {filteredLogs.map((log) => (
    <tr key={log.id} className="border-b">
      <td className="p-3">{log.timestamp}</td>
      <td className="p-3">{log.admin} ({log.role})</td>
      <td className="p-3">{log.action}</td>
      <td className="p-3">{log.school}</td>
      <td className="p-3">{log.description}</td>
      <td className="p-3">
        <button 
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => setModalData(log)} // ✅ Opens modal with log details
        >
          🔍 View
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* View Log Details Modal */}
{modalData && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
      <button className="absolute top-2 right-2 text-xl" onClick={() => setModalData(null)}>✖</button>
      
      <h2 className="text-xl font-bold mb-2">📜 Log Details</h2>
      <p><strong>Admin:</strong> {modalData.admin} ({modalData.role})</p>
      <p><strong>Action:</strong> {modalData.action}</p>
      <p><strong>School Affected:</strong> {modalData.school}</p>
      <p><strong>Description:</strong> {modalData.description}</p>
      <p><strong>Timestamp:</strong> {modalData.timestamp}</p>
      {modalData.ip && <p><strong>IP Address:</strong> {modalData.ip}</p>}
      
      <button className="bg-gray-600 text-white px-4 py-2 mt-4 rounded w-full" onClick={() => setModalData(null)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
