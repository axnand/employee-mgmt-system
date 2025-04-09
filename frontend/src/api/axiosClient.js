import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g. "http://13.231.148.125:5000/api"
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
    // If the response contains a custom error message, use it
    if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      return Promise.reject(new Error(error.response.data.message));
    }
    // Handle 401 errors specifically if needed
    if (error.response && error.response.status === 401) {
      return Promise.reject(
        new Error("Invalid credentials. Please try again.")
      );
    }
    // Otherwise, return a generic error message
    return Promise.reject(
      new Error("Something went wrong. Please try again later.")
    );
  }
);

export default axiosClient;
