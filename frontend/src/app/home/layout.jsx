'use client'
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Use next/navigation for pathname
import { LayoutDashboard, School, Users, BookA, FileText, ArrowLeftRightIcon, Clipboard, LogOut } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname

  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  // Use effect to synchronize the pathname with the activeTab state on mount
  useEffect(() => {
    if (pathname.includes('dashboard')) setActiveTab('dashboard');
    else if (pathname.includes('school-status')) setActiveTab('school-status');
    else if (pathname.includes('manage-admin')) setActiveTab('manage-admin');
    else if (pathname.includes('login')) setActiveTab('logout');
    else if (pathname.includes('transfers')) setActiveTab('transfers');
    else if (pathname.includes('employees')) setActiveTab('employees');
    
    else if (pathname.includes('attendance')) setActiveTab('attendance');
    else if (pathname.includes('logs')) setActiveTab('logs');
  }, [pathname]); // This will run whenever the pathname changes

  // Function to handle click and update active tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsLoading(true); // Start loading when tab is clicked
    // Simulate loading delay before displaying the content (adjust or replace with real logic)
    setTimeout(() => {
      setIsLoading(false); // End loading after a delay (2 seconds)
    }, 1200);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex-none bg-[#141414] shadow-2xl text-[#e2e2e2] w-72 h-full py-4">
        <div className="px-6 h-[80vh]">
          <h2 className="text-2xl text-[#377DFF] font-bold mb-3">EMS Admin</h2>
          <hr className="mb-4" />
          <div className="flex flex-col justify-between text-sm h-full">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/home/dashboard"
                  className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
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
                  className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
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
                  href="/home/employees"
                  className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "employees" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("employees")}
                >
                  <Users className="mr-2 h-5 w-5" />
                  <span>Employees</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/home/attendance"
                  className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "attendance" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("attendance")}
                >
                  <BookA className="mr-2 h-5 w-5" />
                  <span>Attendance</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/home/transfers"
                  className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "transfers" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("transfers")}
                >
                  <ArrowLeftRightIcon className="mr-2 h-5 w-5" />
                  <span>Transfers</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/home/logs"
                  className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                    activeTab === "logs" ? "bg-[#377DFF] text-white" : "text-[#e2e2e2]"
                  }`}
                  onClick={() => handleTabClick("logs")}
                >
                  <Clipboard className="mr-2 h-5 w-5" />
                  <span>Logs</span>
                </Link>
              </li>
            </ul>
            <div>
              <Link
                href="/login"
                className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
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
          {/* TopBar Component */}
          <TopBar />
        </div>
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div> {/* Custom spinner style */}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
