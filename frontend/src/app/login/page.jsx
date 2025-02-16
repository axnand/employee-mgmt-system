"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Login attempt", { userType, userId, password });
    // For now, just redirect to dashboard
    router.push("/home/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[26rem]">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <p className="text-gray-500 mb-6 text-sm">Enter your credentials to access your account</p>
        <form onSubmit={handleLogin}>
          <div className="space-y-4 text-sm">
            {/* User Type Dropdown */}
            <div className="text-sm">
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              >
                <option value="admin">Admin</option>
                <option value="localAdmin">Local Admin</option>
                <option value="normalUser">User</option>
              </select>
            </div>

            {/* User ID Input */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
            onClick={handleLogin}
            className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Login
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
