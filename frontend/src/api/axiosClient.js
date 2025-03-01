import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g. "http://localhost:5000/api"
  timeout: 10000, // optional timeout in milliseconds
});

// Request interceptor to add auth token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to transform errors into friendly messages
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // For a 401 response, throw a friendly error message
      if (error.response.status === 401) {
        return Promise.reject(
          new Error(
            error.response.data?.message ||
              "Invalid credentials. Please try again."
          )
        );
      }
      // Additional status checks can be added here if needed.
    }
    // Default generic error message for any other error
    return Promise.reject(new Error("Something went wrong. Please try again later."));
  }
);

export default axiosClient;
