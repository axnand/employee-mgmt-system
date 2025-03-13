"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ArrowLeftRight,
  School as SchoolIcon,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMySchool } from "@/api/schoolService";
import { getTransferRequests } from "@/api/transferService";
import { getRecentActivities } from "@/api/logService";
import axiosClient from "@/api/axiosClient";

// --- (Optional) If you have a real API for retirements, use that; otherwise, use mock data ---
const mockRetirementEmployees = [
  {
    emp_id: 4623,
    school_id: "89",
    emp_name: "Amit Sharma",
    present_designation: "Senior Assistant",
    date_of_retirement: "2025-03-15",
  },
  {
    emp_id: 4623,
    school_id: "89",
    emp_name: "Suman Verma",
    present_designation: "Principal",
    date_of_retirement: "2050-05-15",
  },
  {
    emp_id: 4624,
    school_id: "89",
    emp_name: "Rahul Singh",
    present_designation: "Teacher",
    date_of_retirement: "2025-03-05",
  },
  {
    emp_id: 4625,
    school_id: "89",
    emp_name: "Neha Gupta",
    present_designation: "Vice Principal",
    date_of_retirement: "2049-03-25",
  },
  {
    emp_id: 4627,
    school_id: "89",
    emp_name: "Rohit Kumar",
    present_designation: "Clerk",
    date_of_retirement: "2025-02-28",
  },
];

export default function SchoolAdminDashboard() {
  // Fetch school details for the logged-in admin
  const {
    data: mySchool,
    isLoading: schoolLoading,
    error: schoolError,
  } = useQuery({
    queryKey: ["mySchool"],
    queryFn: getMySchool,
    refetchOnWindowFocus: false,
  });

  // Fetch all transfer requests
  const {
    data: transfersData,
    isLoading: transfersLoading,
    error: transfersError,
  } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  // Fetch recent activities (logs)
  const {
    data: recentActivities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: getRecentActivities,
    refetchOnWindowFocus: false,
  });
  console.log("Recent Activities:", recentActivities);


  // Total employees from mySchool.employees
  const totalEmployees = mySchool ? mySchool.employees?.length || 0 : 0;

  // Compute pending transfers for this school:
  // - As source with status "pending"
  // - As destination with status "approved_by_main"
  const transferRequests = transfersData?.transferRequests || [];
  const pendingTransfers = transferRequests.filter((t) => {
    if (!mySchool) return false;
    const schoolIdStr = mySchool._id.toString();
    const isSource =
      t.fromSchool &&
      t.fromSchool._id &&
      t.fromSchool._id.toString() === schoolIdStr &&
      t.status === "pending";
    const isReceiving =
      t.toSchool &&
      t.toSchool._id &&
      t.toSchool._id.toString() === schoolIdStr &&
      t.status === "approved_by_main";
    return isSource || isReceiving;
  });

  // Retirement Announcements (using mock data)
  const [filterDays, setFilterDays] = useState(30);
  const [filteredRetirements, setFilteredRetirements] = useState([]);

  const computeDaysLeft = (dateOfRetirement) => {
    const today = new Date();
    const retirementDate = new Date(dateOfRetirement);
    const diffTime = retirementDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (mySchool) {
      const filtered = mockRetirementEmployees.filter((emp) => {
        const daysLeft = computeDaysLeft(emp.date_of_retirement);
        return daysLeft <= filterDays;
      });
      setFilteredRetirements(filtered);
    }
  }, [filterDays, mySchool]);

  // Filter recent activities based on current school.
  // If activity.school is an object, use activity.school.name; otherwise, use it directly.
  const filteredActivities =
    recentActivities?.filter((activity) => {
      let logSchoolName = "";
      if (activity.school && typeof activity.school === "object") {
        logSchoolName = activity.school.name || "";
      } else {
        logSchoolName = activity.school || "";
      }
      // Compare case-insensitively; if no match, fallback to showing all logs.
      return logSchoolName.toLowerCase() === (mySchool ? mySchool.name.toLowerCase() : "");
    }) || [];

  // If filtering yields no activities, we can fall back to all recent activities.
  const activitiesToShow = filteredActivities.length > 0 ? filteredActivities : recentActivities || [];

  if (schoolLoading || transfersLoading || activitiesLoading) {
    return <p className="text-center">Loading dashboard data...</p>;
  }
  if (schoolError) {
    return (
      <p className="text-center text-red-500">
        Error loading school data: {schoolError.message}
      </p>
    );
  }
  if (transfersError) {
    return (
      <p className="text-center text-red-500">
        Error loading transfers: {transfersError.message}
      </p>
    );
  }
  if (activitiesError) {
    return (
      <p className="text-center text-red-500">
        Error loading recent activities: {activitiesError.message}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Total Employees */}
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-[15px] font-semibold">Total Employees</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">School Staff Count</p>
          <div className="text-2xl font-bold">{totalEmployees}</div>
        </div>

        {/* Pending Transfers */}
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold">Pending Transfers</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">Awaiting Response</p>
          <div className="text-2xl font-bold">{pendingTransfers.length}</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <h3 className="text-xl font-bold mb-4 text-secondary">Recent Activities</h3>
        {activitiesToShow && activitiesToShow.length > 0 ? (
          <div className="space-y-2">
            {activitiesToShow.map((activity, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="font-semibold">{activity.action}</span> at{" "}
                {activity.createdAt
                  ? new Date(activity.createdAt).toLocaleString()
                  : "N/A"}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No recent activities found for your school.
          </p>
        )}
        <div className="mt-4 text-right">
          <Link
            href="/home/logs"
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            View All Logs
          </Link>
        </div>
      </div>

      {/* Retirement Announcements */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-2 border-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
            Retirement Announcements
          </h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-sm text-gray-700">
              Show retirements in next (days):
            </label>
            <input
              type="number"
              id="filter"
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value))}
              className="w-16 border border-gray-300 rounded p-1 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Employee ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Designation
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Date of Retirement
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRetirements.length > 0 ? (
                filteredRetirements.map((emp) => (
                  <tr key={emp.emp_id}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {emp.emp_id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {emp.emp_name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {emp.present_designation}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {emp.date_of_retirement}
                    </td>
                    <td>
                      <Link href={`/home/school-status/${emp.school_id}/retirement/${emp.emp_id}`}>
                        <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-sm text-gray-700 text-center">
                    No retirements within the next {filterDays} days.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
