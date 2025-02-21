"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ArrowLeftRightIcon,  // Replacing SwapHorizontal with Swap
  Search as SearchIcon,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock Transfer Data
const mockTransfers = [
  { id: 1, name: "John Doe", designation: "Teacher", currentSchool: "School A", requestedSchool: "School B", reason: "Relocation", status: "Pending", date: "2024-02-15" },
  { id: 2, name: "Jane Smith", designation: "Non-Teaching Staff", currentSchool: "School B", requestedSchool: "School C", reason: "Family Reasons", status: "Pending", date: "2024-02-16" },
  { id: 3, name: "Alice Brown", designation: "Teacher", currentSchool: "School C", requestedSchool: "School A", reason: "Promotion", status: "Approved", date: "2024-01-20" },
  { id: 4, name: "Michael Johnson", designation: "Teacher", currentSchool: "School A", requestedSchool: "School C", reason: "Health Issues", status: "Rejected", date: "2024-01-25", comments: "No vacancies available." },
];

// Sample Transfer Statistics Data for Charts (if needed later)
const transferStats = [
  { school: "School A", Transfers: 10 },
  { school: "School B", Transfers: 8 },
  { school: "School C", Transfers: 12 },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkSelection, setBulkSelection] = useState([]);
  const [comment, setComment] = useState("");

  // Approve Transfer
  const approveTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id
          ? { ...transfer, status: "Approved", date: new Date().toISOString().split("T")[0] }
          : transfer
      )
    );
    toast.success("Transfer request approved!");
  };

  // Reject Transfer
  const rejectTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id
          ? { ...transfer, status: "Rejected", comments: comment, date: new Date().toISOString().split("T")[0] }
          : transfer
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
    toast.success(`Selected transfers marked as ${status}`);
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
    <div className=" min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <header className="mb-8 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-secondary flex items-center gap-2">
          <ArrowLeftRightIcon className="w-8 h-8 text-primary" />
          Employee Transfers
        </h1>
        <p className="mt-2 font-medium text-gray-600">
          Manage transfer requests with bulk actions
        </p>
      </header>

      {/* Search & Bulk Actions */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <SearchIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="text"
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleBulkAction("Approved")}
                disabled={!bulkSelection.length}
                className="flex items-center gap-1 bg-green-500 transition hover:bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkAction("Rejected")}
                disabled={!bulkSelection.length}
                className="flex items-center gap-1 bg-red-500 transition hover:bg-red-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg overflow-x-auto shadow-sm border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Current School
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Requested School
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={bulkSelection.includes(transfer.id)}
                      onChange={() =>
                        setBulkSelection((prev) =>
                          prev.includes(transfer.id)
                            ? prev.filter((id) => id !== transfer.id)
                            : [...prev, transfer.id]
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">{transfer.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{transfer.currentSchool}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{transfer.requestedSchool}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{transfer.reason}</td>
                  <td className={`px-6 py-3 text-sm font-semibold ${
                    transfer.status === "Pending"
                      ? "text-yellow-500"
                      : transfer.status === "Approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                    {transfer.status}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {transfer.status === "Pending" && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => approveTransfer(transfer.id)}
                          className="flex items-center gap-1 bg-green-500 transition font-medium hover:bg-green-600 text-white px-3 py-[6px] rounded text-xs"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectTransfer(transfer.id)}
                          className="flex items-center gap-1 bg-red-500 transition font-medium hover:bg-red-600 text-white px-3 py-[6px] rounded text-xs"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransfers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No transfers found.
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
