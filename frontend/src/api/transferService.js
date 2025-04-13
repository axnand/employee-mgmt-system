import axiosClient from "./axiosClient";


export const createTransferRequest = async (transferData) => {
  const response = await axiosClient.post("/transfers", transferData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data.transferRequest; 
};


export const getTransferRequests = async () => {
  const response = await axiosClient.get("/transfers", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data; 
};

// Responds to a transfer request (accept/reject) by the receiving office admin
export const respondToTransferRequest = async (requestId, action, reason) => {
  const response = await axiosClient.put(
    `/transfers/${requestId}/respond`,
    { action, reason },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.transferRequest; // Adjust as necessary
};

export const approveTransferRequest = async (requestId, action, remarkText) => {
  const response = await axiosClient.put(
    `/transfers/${requestId}/approve`,
    { action, remarkText },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.transferRequest; // Adjust based on your backend's response
};
