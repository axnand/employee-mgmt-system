"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRightIcon } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import { getTransferRequests } from "@/api/transferService";

export default function OutgoingTransfersPage() {
  const { user } = useUser();
  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  // For outgoing transfers, filter those where fromSchool's _id matches user's schoolId.
  const outgoingTransfers =
    transfersData?.transferRequests.filter(
      (t) =>
        t.fromSchool &&
        t.fromSchool._id &&
        t.fromSchool._id.toString() === user.schoolId.toString()
    ) || [];

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
                {outgoingTransfers.length > 0 ? (
                  outgoingTransfers.map((transfer) => (
                    <tr key={transfer._id}>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.employee && transfer.employee.employeeName
                          ? transfer.employee.employeeName
                          : transfer.employee}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.toSchool && transfer.toSchool.name
                          ? transfer.toSchool.name
                          : transfer.toSchool}
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
