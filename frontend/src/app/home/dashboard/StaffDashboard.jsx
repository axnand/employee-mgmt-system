    "use client";

    import React, { useState, useEffect } from "react";
    import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
    import {
      Calendar as LucideCalendar,
      CheckCircle,
      XCircle,
      User,
      Building,
    } from "lucide-react";
    import Link from "next/link";
    import { formatDate } from "@/utils/dateUtils";

    // For the attendance calendar
    import Calendar from "react-calendar";
    import "react-calendar/dist/Calendar.css";

    import "@/styles/customCalendar.css"

    // Dummy employee/user data
    const initialEmployeeData = {
      udise_code: 307435,
      name_of_sanctioned_posts: "Senior Assistant",
      emp_name: "Amit Sharma",
      emp_id: 4623,
      date_of_birth: "1985-05-15",
      date_of_first_appointment: "2016-08-20",
      designation_at_first_appointment: "Junior Senior Assistant",
      qualification: "M.Ed",
      subject_in_pg: "Computer Science",
      present_designation: "Senior Assistant",
      date_of_latest_promotion: "2019-05-17",
      date_of_retirement: "2050-05-15",
      date_from_which_working_in_this_current_office: "2016-08-20",
      last_three_postings: {
        first_posting: {
          school: "Prev School 1",
          start_date: "2016-08-20",
          end_date: "2018-01-02",
        },
        second_posting: {
          school: "Prev School 2",
          start_date: "2018-01-03",
          end_date: "2019-05-18",
        },
        third_posting: {
          school: "Current School",
          start_date: "2019-05-19",
          end_date: "Present",
        },
      },
      current_payscale: "₹676821",
      pay_level: "Level 5",
      gross_salary: "₹949389",
      whether_nps_or_ops: "NPS",
    };

    // Dummy attendance history data
    // "Present" means on duty, "Absent" is absent, "Leave" means on leave.
    const attendanceHistoryData = [
      { date: "2025-02-01", status: "Present" },
      { date: "2025-02-02", status: "Present" },
      { date: "2025-02-03", status: "Present" },
      { date: "2025-02-04", status: "Present" },
      { date: "2025-02-05", status: "Present" },
      { date: "2025-02-06", status: "Present" },
      { date: "2025-02-07", status: "Leave" },
      { date: "2025-02-08", status: "Leave" },
      { date: "2025-02-09", status: "Absent" },
      { date: "2025-02-10", status: "Present" },
      { date: "2025-02-11", status: "Present" },
      { date: "2025-02-12", status: "Present" },
      { date: "2025-02-13", status: "Present" },
      { date: "2025-02-14", status: "Present" },
      { date: "2025-02-15", status: "Present" },
      { date: "2025-02-16", status: "Present" },
      { date: "2025-02-17", status: "Present" },
      { date: "2025-02-18", status: "Present" },
      { date: "2025-02-19", status: "Present" },
      { date: "2025-02-20", status: "Present" },
      { date: "2025-02-21", status: "Present" },
      { date: "2025-02-22", status: "Present" },
      { date: "2025-02-23", status: "Present" },
      { date: "2025-02-24", status: "Present" },
      { date: "2025-02-25", status: "Leave" },
      { date: "2025-02-26", status: "Present" },
      { date: "2025-02-27", status: "Present" },
      { date: "2025-02-28", status: "Present" },
      { date: "2025-02-29", status: "Present" },
    ];

    // Prepare data for the attendance summary pie chart
    const attendanceSummary = [
      {
        status: "Present",
        count: attendanceHistoryData.filter(
          (item) => item.status === "Present"
        ).length,
      },
      {
        status: "Absent",
        count: attendanceHistoryData.filter(
          (item) => item.status === "Absent"
        ).length,
      },
      {
        status: "Leave",
        count: attendanceHistoryData.filter(
          (item) => item.status === "Leave"
        ).length,
      },
    ];

    const COLORS = ["#00C49F", "#FF8042", "#FFBB28"]; // Green, Red, Yellow

    // Dummy Transfer History Data for the timeline
    const transferHistoryData = [
      {
        date: "2024-01-15",
        from: "Current School",
        to: "School X",
        status: "Approved",
        reason: "Relocation",
      },
      {
        date: "2024-03-20",
        from: "School X",
        to: "Current School",
        status: "Pending",
        reason: "Reassignment",
      },
    ];

    export default function StaffDashboard() {
      const [profile, setProfile] = useState(initialEmployeeData);
      const [attendanceHistory, setAttendanceHistory] = useState([]);
      const [transferHistory, setTransferHistory] = useState([]);
      const [selectedDate, setSelectedDate] = useState(new Date());

      useEffect(() => {
        // In production, fetch the employee's attendance and transfer history via an API
        setAttendanceHistory(attendanceHistoryData);
        setTransferHistory(transferHistoryData);

        //console.log to verify the attendance map
        const map = attendanceHistoryData.reduce((acc, record) => {
          acc[record.date] = record.status;
          return acc;
        }, {});
        console.log("Attendance Map:", map);
      }, []);

      // Create a lookup map from date string (YYYY-MM-DD) to attendance status.
      const attendanceMap = attendanceHistory.reduce((acc, record) => {
        acc[record.date] = record.status;
        return acc;
      }, {});
      

      // tileClassName returns a custom class based on the attendance status.
      const getTileClassName = ({ date, view }) => {
        if (view === "month") {
          // Format date to YYYY-MM-DD
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateString = `${year}-${month}-${day}`;

          const status = attendanceMap[dateString];

          if (status === "Present") return "calendar-present";
          if (status === "Absent") return "calendar-absent";
          if (status === "Leave") return "calendar-leave";
        }
        return "";
      };
      

      return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary">
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-blue-500" />
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.emp_name}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    Employee ID: {profile.emp_id}
                  </p>
                  <p className="text-gray-500 text-sm font-medium capitalize">
                    Present Designation: {profile.present_designation}
                  </p>
                </div>
              </div>
              {/* Multi-column layout for profile details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-600 font-medium">
                <div className="space-y-3">
                  <p>
                    <strong className="mr-1">UDISE Code:</strong>{" "}
                    {profile.udise_code}
                  </p>
                  <p>
                    <strong className="mr-1">Sanctioned Post:</strong>{" "}
                    {profile.name_of_sanctioned_posts}
                  </p>
                  <p>
                    <strong className="mr-1">
                      Designation at First Appointment:
                    </strong>{" "}
                    {profile.designation_at_first_appointment}
                  </p>
                  <p>
                    <strong className="mr-1">Date of First Appointment:</strong>{" "}
                    {profile.date_of_first_appointment}
                  </p>
                  <p>
                    <strong className="mr-1">Latest Promotion:</strong>{" "}
                    {profile.date_of_latest_promotion}
                  </p>
                  <p>
                    <strong className="mr-1">Retirement Date:</strong>{" "}
                    {profile.date_of_retirement}
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong className="mr-1">Date of Birth:</strong>{" "}
                    {profile.date_of_birth}
                  </p>
                  <p>
                    <strong className="mr-1">Qualification:</strong>{" "}
                    {profile.qualification}
                  </p>
                  <p>
                    <strong className="mr-1">Subject (PG):</strong>{" "}
                    {profile.subject_in_pg}
                  </p>
                  <p>
                    <strong className="mr-1">
                      Date from Working in Current Office:
                    </strong>{" "}
                    {profile.date_from_which_working_in_this_current_office}
                  </p>
                  <p>
                    <strong className="mr-1">Current Payscale:</strong>{" "}
                    {profile.current_payscale}
                  </p>
                  <p>
                    <strong className="mr-1">Pay Level:</strong>{" "}
                    {profile.pay_level}
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong className="mr-1">Gross Salary:</strong>{" "}
                    {profile.gross_salary}
                  </p>
                  <p>
                    <strong className="mr-1">NPS or OPS:</strong>{" "}
                    {profile.whether_nps_or_ops}
                  </p>
                  <div className="mt-2">
                    <strong className="block mb-1">Last Three Postings:</strong>
                    <ul className="list-disc list-inside text-[13px]">
                      <li>
                        {profile.last_three_postings.first_posting.school} (
                        {profile.last_three_postings.first_posting.start_date}{" "}
                        to {profile.last_three_postings.first_posting.end_date})
                      </li>
                      <li>
                        {profile.last_three_postings.second_posting.school} (
                        {profile.last_three_postings.second_posting.start_date}{" "}
                        to {profile.last_three_postings.second_posting.end_date}
                        )
                      </li>
                      <li>
                        {profile.last_three_postings.third_posting.school} (
                        {profile.last_three_postings.third_posting.start_date}{" "}
                        to {profile.last_three_postings.third_posting.end_date})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Summary and Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
              {/* Attendance Summary (Pie Chart) */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <LucideCalendar className="w-5 h-5 text-purple-500" />
                  Attendance Summary
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Summary (Past Records)
                </p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceSummary}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {attendanceSummary.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm">
                  {attendanceSummary.map((entry, idx) => (
                    <p key={idx}>
                      <span className="font-semibold">{entry.status}:</span>{" "}
                      {entry.count} day(s)
                    </p>
                  ))}
                </div>
              </div>

              {/* Attendance Calendar */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <LucideCalendar className="w-5 h-5 text-green-500" />
                  Attendance Calendar
                </h3>
                <div className="text-gray-500 text-sm mt-3 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00C49F]"></div>
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF8042]"></div>
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFBB28]"></div>
                    <span>Leave</span>
                  </div>
                </div>
                <div className="mt-10 w-full flex justify-center">
                  {/* For consistency, we set locale to "en-GB" so that date labels match */}
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName={getTileClassName}
                    locale="en-GB"
                  />
                </div>
              </div>
            </div>

            {/* Transfer History Timeline */}
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary font-medium">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Transfer History
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                Your transfer requests in a timeline
              </p>
              <div className="relative border-l-2 border-dashed border-gray-300 ml-6 text-sm">
                {transferHistory.map((transfer, index) => (
                  <div key={index} className="mb-10 ml-8 flex">
                    <span className="flex absolute -left-[19px] justify-center items-center p-2 rounded-full bg-blue-100 ring-2 ring-primary">
                      <Building className="w-5 h-5 text-blue-600" />
                    </span>
                    <div className="flex flex-col gap-y-1">
                      <time className="block mb-2 text-xs font-semibold leading-none text-gray-400">
                        {transfer.date}
                      </time>
                      <h3 className="text-[15px] font-semibold text-gray-900">
                        {transfer.from} &rarr; {transfer.to}
                      </h3>
                      <p className="text-[13px] font-medium text-gray-500">
                        Status: {transfer.status} | Reason: {transfer.reason}
                      </p>
                    </div>
                  </div>
                ))}
                {transferHistory.length === 0 && (
                  <div className="mb-10 ml-6 text-gray-500">
                    No transfer records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
