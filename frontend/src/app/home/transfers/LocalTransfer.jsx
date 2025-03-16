"use client";
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ArrowLeftRightIcon,
  Search as SearchIcon,
  LogIn,
  LogOut,
  
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dummy Data for Local Admin Transfers

// Outgoing transfers: requests sent by employees of the local school to transfer to another school.
const dummyOutgoingTransfers = [
  {
    id: 1,
    name: "John Doe",
    designation: "Teacher",
    currentSchool: "Local School",
    requestedSchool: "School B",
    reason: "Relocation",
    status: "Pending",
    date: "2024-02-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    designation: "Non-Teaching Staff",
    currentSchool: "Local School",
    requestedSchool: "School C",
    reason: "Better Opportunity",
    status: "Approved",
    date: "2024-02-10",
  },
];

// Incoming transfers: requests coming from other schools for an employee to join the local school.
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

export default function LocalTransfersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [incomingTransfers, setIncomingTransfers] = useState(dummyIncomingTransfers);
  const [outgoingTransfers] = useState(dummyOutgoingTransfers);
  const [comment, setComment] = useState("");

  // Approve incoming transfer (local admin action)
  const approveIncomingTransfer = (id) => {
    setIncomingTransfers((prev) =>
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

  // Reject incoming transfer (local admin action)
  const rejectIncomingTransfer = (id) => {
    setIncomingTransfers((prev) =>
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

  // Filter function used for both tables
  const filterTransfers = (transfer) => {
    return (
      transfer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.currentSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.requestedSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredOutgoing = outgoingTransfers.filter(filterTransfers);
  const filteredIncoming = incomingTransfers.filter(filterTransfers);

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10 max-w-7xl mx-auto ">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <ArrowLeftRightIcon className="w-8 h-8 text-primary" />
          Transfers
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Manage outgoing and incoming transfer requests for your school
        </p>
      </header>

      {/* Search Bar */}
      {/* <div className=" mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="relative">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div> */}

      {/* Outgoing Transfers */}
      <div className=" bg-white p-6 rounded-lg shadow-sm my-12">
      <div className="flex items-center space-x-2 mb-4">
  <LogOut className="h-5 w-5 text-orange-500 " />
  <h2 className="text-lg font-semibold text-gray-800 ">Outgoing</h2>
</div>
    
        <div className="bg-white rounded-lg overflow-x-auto shadow-sm border">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium">
              {filteredOutgoing.map((transfer) => (
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
                </tr>
              ))}
              {filteredOutgoing.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No outgoing transfers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incoming Transfers */}
      <div className=" bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
  <LogIn className="h-5 w-5 text-blue-500" />
  <h2 className="text-lg font-semibold text-gray-800  text-center">Ingoing</h2>
</div>
        <div className="bg-white rounded-lg overflow-x-auto shadow-sm border">
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
            <tbody className="bg-white divide-y divide-gray-200 font-medium">
              {filteredIncoming.map((transfer) => (
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
                    {transfer.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveIncomingTransfer(transfer.id)}
                          className="flex items-center gap-1 bg-green-500 transition hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectIncomingTransfer(transfer.id)}
                          className="flex items-center gap-1 bg-red-500 transition hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                    {transfer.status !== "Pending" && (
                      <span className="text-xs text-gray-600">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredIncoming.length === 0 && (
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
