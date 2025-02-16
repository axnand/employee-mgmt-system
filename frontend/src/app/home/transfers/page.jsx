"use client";

import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock Transfer Data
const mockTransfers = [
  { id: 1, name: "John Doe", designation: "Teacher", currentSchool: "School A", requestedSchool: "School B", reason: "Relocation", status: "Pending", date: "2024-02-15" },
  { id: 2, name: "Jane Smith", designation: "Non-Teaching Staff", currentSchool: "School B", requestedSchool: "School C", reason: "Family Reasons", status: "Pending", date: "2024-02-16" },
  { id: 3, name: "Alice Brown", designation: "Teacher", currentSchool: "School C", requestedSchool: "School A", reason: "Promotion", status: "Approved", date: "2024-01-20" },
  { id: 4, name: "Michael Johnson", designation: "Teacher", currentSchool: "School A", requestedSchool: "School C", reason: "Health Issues", status: "Rejected", date: "2024-01-25", comments: "No vacancies available." },
];

// Sample Transfer Statistics Data for Charts
const transferStats = [
  { school: "School A", Transfers: 10 },
  { school: "School B", Transfers: 8 },
  { school: "School C", Transfers: 12 },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [comment, setComment] = useState("");

  // Approve Transfer
  const approveTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id ? { ...transfer, status: "Approved", date: new Date().toISOString().split("T")[0] } : transfer
      )
    );
    toast.success("Transfer request approved!");
  };

  // Reject Transfer
  const rejectTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id ? { ...transfer, status: "Rejected", comments: comment, date: new Date().toISOString().split("T")[0] } : transfer
      )
    );
    setComment(""); // Reset comment box
    toast.error("Transfer request rejected!");
  };

  // Bulk Approval/Rejection
  const handleBulkAction = (status) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        bulkSelection.includes(transfer.id)
          ? { ...transfer, status, date: new Date().toISOString().split("T")[0], comments: status === "Rejected" ? comment : "" }
          : transfer
      )
    );
    setBulkSelection([]);
    toast.success(`All selected transfers marked as ${status}`);
  };

  // Filtered Transfers
  const filteredTransfers = transfers.filter(
    (transfer) =>
      transfer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.currentSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.requestedSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

      <h1 className="text-3xl font-bold mb-4">🔄 Employee Transfers</h1>

      {/* Search & Bulk Actions */}
      <div className="flex justify-between mb-4">
        <input
          className="border p-2 rounded-md w-2/3"
          placeholder="🔍 Search transfers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleBulkAction("Approved")} disabled={!bulkSelection.length}>
            ✅ Approve Selected
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleBulkAction("Rejected")} disabled={!bulkSelection.length}>
            ❌ Reject Selected
          </button>
        </div>
      </div>

      {/* Transfers Table */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Select</th>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Current School</th>
            <th className="p-3 text-left">Requested School</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransfers.map((transfer) => (
            <tr key={transfer.id} className="border-b">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={bulkSelection.includes(transfer.id)}
                  onChange={() => setBulkSelection((prev) => (prev.includes(transfer.id) ? prev.filter((id) => id !== transfer.id) : [...prev, transfer.id]))}
                />
              </td>
              <td className="p-3">{transfer.name}</td>
              <td className="p-3">{transfer.currentSchool}</td>
              <td className="p-3">{transfer.requestedSchool}</td>
              <td className="p-3">{transfer.reason}</td>
              <td className={`p-3 font-semibold ${transfer.status === "Pending" ? "text-yellow-500" : transfer.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                {transfer.status}
              </td>
              <td className="p-3">
                {transfer.status === "Pending" && (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => approveTransfer(transfer.id)}>
                      ✅ Approve
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => rejectTransfer(transfer.id)}>
                      ❌ Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
