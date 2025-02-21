'use client'
import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  School,
  Users,
  BookA,
  ArrowLeftRightIcon,
  Clipboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve the logged-in user from localStorage on mount
  
  const { user, userRole } = useUser();
  console.log("User role:", userRole);
  console.log("User:", user);

  const schoolId = useMemo(() => {
    return userRole === "localAdmin" && user?.schoolId ? parseInt(user.schoolId, 10) : null;
  }, [userRole, user]);

  // Define navigation items for each role
  const navItemsByRole = {
    mainAdmin: [
      {
        title: "Dashboard",
        href: "/home/dashboard",
        icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      },
      {
        title: "School Status",
        href: "/home/school-status",
        icon: <School className="mr-2 h-5 w-5" />,
      },
      {
        title: "Transfers",
        href: "/home/transfers",
        icon: <ArrowLeftRightIcon className="mr-2 h-5 w-5" />,
      },
      {
        title: "Logs",
        href: "/home/logs",
        icon: <Clipboard className="mr-2 h-5 w-5" />,
      },
    ],
    localAdmin: [
      {
        title: "Dashboard",
        href: "/home/dashboard",
        icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      },
      {
        title: "Employees",
        href: `/home/school-status/${schoolId}`,
        icon: <Users className="mr-2 h-5 w-5" />,
      },
      {
        title: "Attendance",
        href: "/home/attendance",
        icon: <BookA className="mr-2 h-5 w-5" />,
      },
      {
        title: "Transfers",
        href: "/home/transfers",
        icon: <ArrowLeftRightIcon className="mr-2 h-5 w-5" />,
      },
      {
        title: "Logs",
        href: "/home/logs",
        icon: <Clipboard className="mr-2 h-5 w-5" />,
      },
    ],
    normalUser: [
      {
        title: "Dashboard",
        href: "/home/dashboard",
        icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      },

    ],
  };

  // Get nav items based on the user's role
  const navItems = navItemsByRole[userRole] || [];

  // Update active tab based on pathname
  useEffect(() => {
    navItems.forEach((item) => {
      const segment = item.href.split("/").pop();
      if (pathname.includes(segment)) {
        setActiveTab(item.title);
      }
    });
    if (pathname.includes("login")) {
      setActiveTab("logout");
    }
  }, [pathname, navItems]);

  // Simulate a loading state on tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  // Logout function clears user data and redirects to login
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex-none bg-[#fffdfd] shadow-black shadow-2xl text-[#6c6d6d] w-72 h-full py-4">
        <div className="px-6 h-[80vh]">
          <h2 className="text-2xl text-[#377DFF] font-bold mb-3">EMS Admin</h2>
          <hr className="mb-4" />
          <div className="flex flex-col justify-between text-sm h-full">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`flex items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                      activeTab === item.title
                        ? "bg-[#377DFF] text-white"
                        : "text-[#6c6d6d]"
                    }`}
                    onClick={() => handleTabClick(item.title)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <button
                onClick={handleLogout}
                className={`flex w-full items-center hover:text-white transition py-3 px-2 rounded-md font-medium hover:bg-[#377DFF] ${
                  activeTab === "logout"
                    ? "bg-[#377DFF] text-white"
                    : "text-[#6c6d6d]"
                }`}
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-none">
          <TopBar />
        </div>
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
