'use client'
import React, { useState } from "react"
import { LayoutDashboard, School, UserPlus, LogOut } from "lucide-react"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"

export default function DashboardLayout({ children }) {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Function to handle tab selection
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`flex-none bg-[#141414]  shadow-2xl text-[#e2e2e2] w-72 h-full py-4`}>
        <div className="px-6 h-[80vh]">
          <h2 className="text-2xl text-[#377DFF] font-bold mb-3 ">EMS Admin</h2>
          <hr className="mb-4"></hr>
          <div className="flex flex-col justify-between text-sm h-full">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/home/dashboard"
                  className={`flex items-center hover:text-white transition py-2 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "dashboard" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("dashboard")}
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/home/school-status"
                  className={`flex items-center hover:text-white transition py-2 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "school-status" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("school-status")}
                >
                  <School className="mr-2 h-5 w-5" />
                  <span>School Status</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/home/manage-admin"
                  className={`flex items-center hover:text-white transition py-2 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "manage-admin" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("manage-admin")}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  <span>Add/Update School Admin</span>
                </Link>
              </li>
            </ul>
            <div>
              <Link
                href="/login"
                className={`flex items-center hover:text-white transition py-2 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                  activeTab === "logout" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                }`}
                onClick={() => handleTabClick("logout")}
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-none">
          {/* TopBar Component (you can keep using it) */}
          <TopBar />
        </div>
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
