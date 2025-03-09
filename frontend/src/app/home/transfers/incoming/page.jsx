"use client";

import { useState } from "react";
import { CheckCircle, XCircle, LogIn, Search as SearchIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { getTransferRequests, respondToTransferRequest } from "@/api/transferService";

export default function IncomingTransfersPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all transfer requests from the backend
  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  // Filter incoming transfers: only those with status "approved_by_main"
  // and where the populated toSchool._id matches the user's schoolId.
  const incomingTransfers =
    transfersData?.transferRequests.filter(
      (t) =>
        t.toSchool &&
        t.toSchool._id &&
        t.toSchool._id.toString() === user.schoolId.toString() &&
        t.status === "approved_by_main"
    ) || [];

  // Apply search filter on employee name, fromSchool name, or toSchool name.
  const filteredTransfers = incomingTransfers.filter((transfer) => {
    const employeeName = transfer.employee?.employeeName || "";
    const fromSchoolName = transfer.fromSchool?.name || "";
    const toSchoolName = transfer.toSchool?.name || "";
    return (
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fromSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toSchoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Mutation for responding to a transfer request
  const respondMutation = useMutation({
    mutationFn: ({ requestId, action }) =>
      respondToTransferRequest(requestId, action, user, window.location.hostname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      toast.success("Response submitted successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Error responding to transfer request");
    },
  });

  const handleApprove = (requestId) => {
    respondMutation.mutate({ requestId, action: "accept" });
  };

  const handleReject = (requestId) => {
    respondMutation.mutate({ requestId, action: "reject" });
  };

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <LogIn className="w-8 h-8 text-blue-500" />
          Incoming Transfers
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Manage incoming transfer requests for your school.
        </p>
      </header>
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
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
        </div>
      </div>
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
                    Created On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
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
                      <td className="px-6 py-3 text-sm">
                        {transfer.status === "approved_by_main" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(transfer._id)}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded text-xs"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(transfer._id)}
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
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No incoming transfers found.
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
