"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRightIcon, Search as SearchIcon } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import { getTransferRequests } from "@/api/transferService";

export default function OutgoingTransfersPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  // Filter and sort outgoing transfers in descending order by date
  const outgoingTransfers =
    transfersData?.transferRequests
      .filter(
        (t) =>
          t.fromSchool &&
          t.fromSchool._id &&
          t.fromSchool._id.toString() === user.schoolId.toString()
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  // Apply search filter
  const filteredTransfers = outgoingTransfers.filter((transfer) => {
    const employeeName = transfer.employee?.employeeName || "";
    const toSchoolName = transfer.toSchool?.name || "";
    const status = transfer.status || "";
    return (
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Page Header */}
      <header className="mb-10 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <ArrowLeftRightIcon className="w-8 h-8 text-primary" />
          Outgoing Transfers
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          View your current and past requests.
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="relative flex-1">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
            <input
              type="text"
              placeholder="Search outgoing transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="max-w-7xl mx-auto px-4 bg-white p-6 rounded-lg shadow-sm">
        {isLoading ? (
          <p>Loading transfers...</p>
        ) : error ? (
          <p className="text-red-500">Error loading transfers</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransfers.length > 0 ? (
                  filteredTransfers.map((transfer) => (
                    <tr key={transfer._id}>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.employee?.employeeName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.toSchool?.name || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.comment}
                      </td>
                      <td
                        className={`px-6 py-3 text-sm font-semibold ${
                          transfer.status === "pending"
                            ? "text-yellow-500"
                            : transfer.status === "approved_by_main"
                            ? "text-green-500"
                            : transfer.status === "accepted_by_receiving"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {transfer.status}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No outgoing transfers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )} 
      </div>
    </div>
  );
}
