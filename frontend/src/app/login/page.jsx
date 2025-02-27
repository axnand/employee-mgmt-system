"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { loginUser as loginUserService } from "@/api/authService";

export default function LoginPage() {
  const [userType, setUserType] = useState("admin"); // Role selection (admin, schoolAdmin, staff)
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser, setUserRole } = useUser();

  const mutation = useMutation({
    mutationFn: (credentials) => loginUserService(credentials),
    onSuccess: (data) => {
      // Always store token even if password hasn't been changed so that update endpoint can be called.
      localStorage.setItem("token", data.token);
      // Update user context with the details from the response.
      setUser({ userId: data.userId, role: data.role });
      setUserRole(data.role);
      // Redirect based on forced password change flag.
      if (data.forcePasswordChange) {
        router.push("/update-password");
      } else {
        router.push("/home/dashboard");
      }
    },
    onError: (err) => {
      const message =
        err.response?.data?.message || "An error occurred. Please try again later.";
      setError(message);
      console.error("Login error:", err);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    // Pass along userType as loginAs to the backend.
    mutation.mutate({ userId, password, loginAs: userType });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[26rem]">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your credentials to access your account
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="space-y-4 text-sm">
            {/* User Type Dropdown */}
            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700"
              >
                User Type
              </label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              >
                <option value="admin">Admin</option>
                <option value="schoolAdmin">School Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            {/* User ID Input */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              />
            </div>
            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            {mutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-2 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
