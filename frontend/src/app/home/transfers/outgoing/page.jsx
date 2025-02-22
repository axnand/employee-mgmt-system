"use client";
import { useState } from "react";
import { ArrowLeftRightIcon, LogOut } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dummy Data for Outgoing Transfers
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

export default function OutgoingTransfersPage() {
  const [transfers, setTransfers] = useState(dummyOutgoingTransfers);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    currentSchool: "",
    requestedSchool: "",
    reason: "",
  });

  // Handle form submission to add a new transfer request
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, designation, currentSchool, requestedSchool, reason } = formData;
    if (!name || !designation || !currentSchool || !requestedSchool || !reason) {
      toast.error("Please fill in all fields");
      return;
    }
    const newTransfer = {
      id: Date.now(),
      name,
      designation,
      currentSchool,
      requestedSchool,
      reason,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };
    setTransfers([...transfers, newTransfer]);
    toast.success("Outgoing transfer request submitted!");
    // Reset the form fields
    setFormData({
      name: "",
      designation: "",
      currentSchool: "",
      requestedSchool: "",
      reason: "",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <LogOut className="w-8 h-8 text-primary" />
          Outgoing Transfers
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Create a new outgoing transfer request and view current and past requests.
        </p>
      </header>

      {/* Form for creating a new outgoing transfer request */}
      <div className="max-w-7xl mx-auto mb-8 ">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-[2px] border-primary">
          <h2 className="text font-semibold text-gray-800 mb-4">New Transfer Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="currentSchool"
                placeholder="Current School"
                value={formData.currentSchool}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="requestedSchool"
                placeholder="Requested School"
                value={formData.requestedSchool}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <textarea
              name="reason"
              placeholder="Reason for transfer"
              value={formData.reason}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 font-semibold transition text-white px-4 py-2 rounded-md"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>

      {/* Table showing current and past outgoing requests */}
      <div className="max-w-7xl mx-auto px-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <LogOut className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-800">Outgoing Requests</h2>
        </div>
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
                  </tr>
                ))
              ) : (
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
    </div>
  );
}
