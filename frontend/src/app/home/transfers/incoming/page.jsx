"use client";
import { useState } from "react";
import { CheckCircle, XCircle, LogIn } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dummy Data for Incoming Transfers
const dummyIncomingTransfers = [
  {
    id: 3,
    name: "Alice Brown",
    designation: "Teacher",
    currentSchool: "School D",
    requestedSchool: "Local School",
    reason: "Professional Growth",
    status: "Pending",
    date: "2024-02-16",
  },
  {
    id: 4,
    name: "Michael Johnson",
    designation: "Teacher",
    currentSchool: "School E",
    requestedSchool: "Local School",
    reason: "Family Reasons",
    status: "Rejected",
    date: "2024-02-12",
    comments: "Not eligible at this time.",
  },
];

export default function IncomingTransfersPage() {
  const [transfers, setTransfers] = useState(dummyIncomingTransfers);
  const [comment, setComment] = useState("");

  // Approve an incoming transfer request
  const approveIncomingTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id
          ? {
              ...transfer,
              status: "Approved",
              date: new Date().toISOString().split("T")[0],
              comments: "",
            }
          : transfer
      )
    );
    toast.success("Incoming transfer approved!");
  };

  // Reject an incoming transfer request
  const rejectIncomingTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id
          ? {
              ...transfer,
              status: "Rejected",
              comments: comment,
              date: new Date().toISOString().split("T")[0],
            }
          : transfer
      )
    );
    setComment("");
    toast.error("Incoming transfer rejected!");
  };

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <LogIn className="w-8 h-8 text-blue-500" />
          Incoming Transfers
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Manage incoming transfer requests for your school.
        </p>
      </header>

      {/* Table showing current and past incoming transfer requests */}
      <div className="max-w-7xl mx-auto px-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
            <tbody className="divide-y divide-gray-200">
              {transfers.length > 0 ? (
                transfers.map((transfer) => (
                  <tr key={transfer.id}>
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
                      {transfer.status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveIncomingTransfer(transfer.id)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded text-xs"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectIncomingTransfer(transfer.id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded text-xs"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No incoming transfers found.
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
