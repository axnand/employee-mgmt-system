"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRightIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import { getTransferRequests, createTransferRequest } from "@/api/transferService";

export default function OutgoingTransfersPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    employeeId: "",
    toSchoolId: "",
    comment: "",
  });

  // Fetch all transfer requests (backend should return requests relevant to the user)
  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  // For outgoing transfers, filter those where fromSchool matches the current admin's school
  const outgoingTransfers =
    transfersData?.transferRequests.filter(
      (t) => t.fromSchool.toString() === user.schoolId.toString()
    ) || [];

  // Mutation to create a new transfer request
  const createMutation = useMutation({
    mutationFn: (newData) => createTransferRequest(newData, user, window.location.hostname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      toast.success("Outgoing transfer request submitted!");
      setFormData({ employeeId: "", toSchoolId: "", comment: "" });
    },
    onError: (err) => {
      toast.error(err.message || "Error submitting transfer request");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { employeeId, toSchoolId, comment } = formData;
    if (!employeeId || !toSchoolId || !comment) {
      toast.error("Please fill in all fields");
      return;
    }
    // fromSchool and requestedBy are taken from the authenticated user (backend does that)
    createMutation.mutate({ employeeId, fromSchoolId: user.schoolId, toSchoolId, comment });
  };

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
          Create a new outgoing transfer request and view your current and past requests.
        </p>
      </header>

      {/* New Transfer Request Form */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-2 border-primary">
          <h2 className="text font-semibold text-gray-800 mb-4">New Transfer Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, employeeId: e.target.value }))
                }
                className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="toSchoolId"
                placeholder="Requested School ID"
                value={formData.toSchoolId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, toSchoolId: e.target.value }))
                }
                className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <textarea
              name="comment"
              placeholder="Reason for transfer"
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
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
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Requested School ID
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
                {outgoingTransfers.length > 0 ? (
                  outgoingTransfers.map((transfer) => (
                    <tr key={transfer._id}>
                      <td className="px-6 py-3 text-sm text-gray-900">{transfer.employee}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{transfer.toSchool}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{transfer.comment}</td>
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
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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
