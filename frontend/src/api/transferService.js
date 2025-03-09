import axiosClient from "./axiosClient";

// Creates a transfer request
export const createTransferRequest = async (transferData, currentUser, ip) => {
  const response = await axiosClient.post("/transfers", transferData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data.transferRequest; // Adjust this if your backend returns a different structure
};

// Fetches all transfer requests
export const getTransferRequests = async () => {
  const response = await axiosClient.get("/transfers", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data; // Expected to include a property like { transferRequests: [...] }
};

// Responds to a transfer request (accept/reject) by the receiving school admin
export const respondToTransferRequest = async (requestId, action, currentUser, ip) => {
  const response = await axiosClient.put(
    `/transfers/${requestId}/respond`,
    { action },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.transferRequest; // Adjust as necessary
};

export const approveTransferRequest = async (requestId, action, currentUser, ip) => {
    const response = await axiosClient.put(
      `/transfers/${requestId}/approve`,
      { action },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.transferRequest; // Adjust based on your backend's response
  };
