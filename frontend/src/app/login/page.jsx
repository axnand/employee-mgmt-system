"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext"; // Import your context

// Define three default users with roles and credentials
const defaultUsers = [
  { role: "mainAdmin", userId: "admin", password: "admin123" },
  { role: "localAdmin", userId: "localadmin", password: "local123", school: "School A", schoolId: "89" },
  { role: "normalUser", userId: "user", password: "user123" },
];

export default function LoginPage() {
  const [userType, setUserType] = useState("mainAdmin"); // Default selected role
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  // Get setters from your context
  const { setUser, setUserRole } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if entered credentials match one of the default users
    const user = defaultUsers.find(
      (u) =>
        u.role === userType &&
        u.userId === userId.trim() &&
        u.password === password
    );

    if (user) {
      // Store user details (including role) in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      // Update the context with the new user
      setUser(user);
      setUserRole(user.role);

      console.log("Login successful", user);
      router.push("/home/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[26rem]">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your credentials to access your account
        </p>
        <form onSubmit={handleLogin}>
          <div className="space-y-4 text-sm">
            {/* User Type Dropdown */}
            <div className="text-sm">
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
                <option value="mainAdmin">Main Admin</option>
                <option value="localAdmin">Local Admin</option>
                <option value="normalUser">User</option>
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
