"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Calendar, CheckCircle, XCircle, User } from "lucide-react";
import Link from "next/link";

// Dummy employee/user data
const initialEmployeeData = {
  udise_code: 307435,
  name_of_sanctioned_posts: "senior assistant",
  emp_name: "Amit Sharma",
  emp_id: 4623,
  date_of_birth: "1985-05-15",
  date_of_first_appointment: "2016-08-20",
  designation_at_first_appointment: "junior senior assistant",
  qualification: "M.Ed",
  subject_in_pg: "Computer Science",
  present_designation: "senior assistant",
  date_of_latest_promotion: "2019-05-17",
  date_of_retirement: "2050-05-15",
  date_from_which_working_in_this_current_office: "2016-08-20",
  last_three_postings: {
    first_posting: {
      school: "Prev School 1",
      start_date: "2016-08-20",
      end_date: "2018-01-02",
    },
    second_posting: {
      school: "Prev School 2",
      start_date: "2018-01-03",
      end_date: "2019-05-18",
    },
    third_posting: {
      school: "Current School",
      start_date: "2019-05-19",
      end_date: "Present",
    },
  },
  current_payscale: "₹676821",
  pay_level: "Level 5",
  gross_salary: "₹949389",
  whether_nps_or_ops: "NPS",
};

// Dummy attendance history data
const attendanceHistoryData = [
  { date: "2024-02-10", status: "Present" },
  { date: "2024-02-11", status: "Present" },
  { date: "2024-02-12", status: "Absent" },
  { date: "2024-02-13", status: "Present" },
  { date: "2024-02-14", status: "Present" },
  { date: "2024-02-15", status: "Present" },
  { date: "2024-02-16", status: "Absent" },
];

// Prepare data for the attendance summary pie chart
const attendanceSummary = [
  { status: "Present", count: attendanceHistoryData.filter(item => item.status === "Present").length },
  { status: "Absent", count: attendanceHistoryData.filter(item => item.status === "Absent").length },
];

const COLORS = ["#00C49F", "#FF8042"];

// Dummy Transfer History Data
const transferHistoryData = [
  { date: "2024-01-15", from: "Current School", to: "School X", status: "Approved", reason: "Relocation" },
  { date: "2024-03-20", from: "School X", to: "Current School", status: "Pending", reason: "Reassignment" },
];

export default function UserDashboard() {
  const [profile, setProfile] = useState(initialEmployeeData);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transferHistory, setTransferHistory] = useState([]);

  // Local states for profile form
  const [newName, setNewName] = useState(profile.emp_name);
  const [newDob, setNewDob] = useState(profile.date_of_birth);

  useEffect(() => {
    // In production, fetch the employee's attendance history and transfer history from an API
    setAttendanceHistory(attendanceHistoryData);
    setTransferHistory(transferHistoryData);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      emp_name: newName,
      date_of_birth: newDob,
    }));
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary">
          <div className="flex items-center gap-4">
            <User className="w-12 h-12 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.emp_name}</h2>
              <p className="text-gray-500 text-sm font-medium">Employee ID: {profile.emp_id}</p>
              <p className="text-gray-500 text-sm font-medium capitalize">
                Designation: {profile.present_designation}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 font-medium">
            <div>
              <p>
                <strong className="mr-1">Date of Birth:</strong> {profile.date_of_birth}
              </p>
              <p>
                <strong className="mr-1">Qualification:</strong> {profile.qualification}
              </p>
              <p>
                <strong className="mr-1">Subject (PG):</strong> {profile.subject_in_pg}
              </p>
            </div>
            <div>
              <p>
                <strong className="mr-1">First Appointment:</strong> {profile.date_of_first_appointment}
              </p>
              <p>
                <strong className="mr-1">Latest Promotion:</strong> {profile.date_of_latest_promotion}
              </p>
              <p>
                <strong className="mr-1">Retirement Date:</strong> {profile.date_of_retirement}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Attendance Summary
            </h3>
            <p className="text-gray-500 text-sm mt-1">Summary for the past week</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceSummary}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {attendanceSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm">
              {attendanceSummary.map((entry, idx) => (
                <p key={idx}>
                  <span className="font-semibold">{entry.status}:</span> {entry.count} days
                </p>
              ))}
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Attendance History
            </h3>
            <p className="text-gray-500 text-sm mt-1">Daily attendance records</p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-gray-600 uppercase">Date</th>
                    <th className="p-3 text-left text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceHistory.map((record, index) => (
                    <tr key={index}>
                      <td className="p-3 text-gray-700">{record.date}</td>
                      <td className="p-3 text-gray-700 flex items-center gap-1">
                        {record.status === "Present" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        {record.status}
                      </td>
                    </tr>
                  ))}
                  {attendanceHistory.length === 0 && (
                    <tr>
                      <td colSpan="2" className="p-3 text-center text-gray-500">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transfer History */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary font-medium">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Transfer History</h3>
          <p className="text-gray-500 text-sm mb-4">Your transfer requests and their status</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-gray-600 uppercase">Date</th>
                  <th className="p-3 text-left text-gray-600 uppercase">From</th>
                  <th className="p-3 text-left text-gray-600 uppercase">To</th>
                  <th className="p-3 text-left text-gray-600 uppercase">Status</th>
                  <th className="p-3 text-left text-gray-600 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transferHistory.map((transfer, index) => (
                  <tr key={index}>
                    <td className="p-3 text-gray-700">{transfer.date}</td>
                    <td className="p-3 text-gray-700">{transfer.from}</td>
                    <td className="p-3 text-gray-700">{transfer.to}</td>
                    <td className="p-3 text-gray-700">{transfer.status}</td>
                    <td className="p-3 text-gray-700">{transfer.reason}</td>
                  </tr>
                ))}
                {transferHistory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-3 text-center text-gray-500">
                      No transfer records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 text-sm font-medium">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="emp_name">
                  Name
                </label>
                <input
                  id="emp_name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date_of_birth">
                  Date of Birth
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  value={newDob}
                  onChange={(e) => setNewDob(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
