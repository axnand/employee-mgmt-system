"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import { getTransferRequests } from "@/api/transferService";

export default function TransferHistoryPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all transfer requests from the backend
  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });
  const schoolTransfers =
    transfersData?.transferRequests
      .filter((t) => {
        const fromMatch =
          t.fromSchool &&
          t.fromSchool._id &&
          t.fromSchool._id.toString() === user.schoolId.toString();
        const toMatch =
          t.toSchool &&
          t.toSchool._id &&
          t.toSchool._id.toString() === user.schoolId.toString();
        return fromMatch || toMatch;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const filteredTransfers = schoolTransfers.filter((transfer) => {
    const employeeName = transfer.employee?.employeeName || "";
    const fromSchoolName = transfer.fromSchool?.name || "";
    const toSchoolName = transfer.toSchool?.name || "";
    const status = transfer.status || "";
    return (
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fromSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-secondary">Transfer History</h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          View all transfer requests related to your school.
        </p>
      </header>
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="relative flex-1">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
            <input
              type="text"
              placeholder="Search transfer history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 bg-white p-6 rounded-lg shadow-sm">
        {isLoading ? (
          <p>Loading transfer history...</p>
        ) : error ? (
          <p className="text-red-500">Error loading transfer history</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    From School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    To School
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
                        {transfer.fromSchool?.name || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.toSchool?.name || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.comment || "N/A"}
                      </td>
                      <td className={`px-6 py-3 text-sm font-semibold ${
                        transfer.status === "pending"
                          ? "text-yellow-500"
                          : transfer.status === "approved_by_main"
                          ? "text-green-500"
                          : transfer.status === "accepted_by_receiving"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}>
                        {transfer.status}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No transfer history found.
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
