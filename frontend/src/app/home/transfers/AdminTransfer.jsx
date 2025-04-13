import { useState } from "react";
import { CheckCircle, XCircle, ArrowLeftRightIcon, Search as SearchIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { getTransferRequests, approveTransferRequest } from "@/api/transferService";

export default function AdminTransfer() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  const pendingTransfers = (transfersData?.transferRequests ?? []).filter(
    (t) => t.status === "Pending"
  );

  const approveMutation = useMutation({
    mutationFn: ({ requestId, action }) =>
      approveTransferRequest(requestId, action, "Reviewed by CEO"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      toast.success("Transfer request updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating transfer request");
    },
  });

  const handleApprove = (requestId) => {
    approveMutation.mutate({ requestId, action: "approve" });
  };

  const handleReject = (requestId) => {
    approveMutation.mutate({ requestId, action: "reject" });
  };

  const filteredTransfers = pendingTransfers?.filter((transfer) => {
    const employeeName = transfer.employee?.employeeName || "";
    const fromOfficeName = transfer.fromOffice?.officeName || "";
    const toOfficeName = transfer.toOffice?.officeName || "";
    const status = transfer.status || "";
    return (
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fromOfficeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toOfficeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <ArrowLeftRightIcon className="w-8 h-8 text-primary" />
          Transfer Requests (Main Admin)
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Review and update transfer requests.
        </p>
      </header>
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-primary">
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
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading transfer requests</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Current Office
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Requested Office
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
                        {transfer.fromOffice?.officeName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.toOffice?.officeName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.transferReason || "N/A"}
                      </td>
                      <td className={`px-6 py-3 text-sm font-semibold ${
                        transfer.status === "Pending"
                          ? "text-yellow-500"
                          : transfer.status === "MainAdminApproved"
                          ? "text-green-500"
                          : transfer.status === "FullyApproved"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}>
                        {transfer.status}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(transfer._id)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded text-xs"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(transfer._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded text-xs"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No transfer requests found.
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