"use client";

import React from "react";

export default function AddEmployeeModal({
  newEmployeeData,
  setNewEmployeeData,
  isOpen,
  onClose,
  showError,
  setShowError,
  schoolInfo, // Selected school information
  setEmployees, // Function to update the employees list
  setIsAddModalOpen, // Function to control modal open state
  queryClient, // react-query client for refetching data
}) {
  if (!isOpen) return null;

  const nonTeachingPosts = [
    "Accountant", "Accounts Assistant", "Assistant Director (P & S)", "CEO", "Driver",
    "Head Assistant", "Junior Assistant", "Laboratory Assistant", "Library Assistant",
    "Senior Assistant", "Statistical Assistant", "Assistant Programmer",
    "Assistant Engineer", "Computer Assistant"
  ];

  const teachingPosts = [
    "Lecturer", "Lecturer Physical Education", "Physical Education Master",
    "Physical Education Teacher", "Principal GHSS", "Principal HSS", "Teacher",
    "Teacher 3rd RRET NP", "Teacher RRET NP", "Teacher Grade II",
    "Teacher Grade III", "Teacher RET SSA", "Teacher RRET SSA",
    "Special Education Teacher"
  ];

  // Define available staff types
  const staffTypes = ["Teaching", "Non-Teaching"];

  // Function to get sanctioned posts based on staffType
  const getSanctionedPosts = () => {
    if (newEmployeeData.staffType === "Teaching") return teachingPosts;
    if (newEmployeeData.staffType === "Non-Teaching") return nonTeachingPosts;
    return [];
  };

  const handleSaveNewEmployee = async () => {
    // Validate required fields: Employee ID, Name, sanctionedPost, and staffType
    if (
      !newEmployeeData.employeeId ||
      !newEmployeeData.employeeName ||
      !newEmployeeData.sanctionedPost ||
      !newEmployeeData.staffType
    ) {
      alert("Please provide all required fields: Employee ID, Name, Designation, and Staff Type.");
      return;
    }
    
    // Check if schoolInfo is available
    if (!schoolInfo || !schoolInfo._id) {
      alert("School information is missing. Please select a valid school.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve auth token

      if (!token) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include auth token
        },
        body: JSON.stringify({
          employeeId: newEmployeeData.employeeId,
          employeeName: newEmployeeData.employeeName,
          sanctionedPost: newEmployeeData.sanctionedPost,
          staffType: newEmployeeData.staffType.toLowerCase(), // "teaching" or "non-teaching"
          school: schoolInfo._id, // Attach the selected school ID
          udise_code: schoolInfo.udiseId, // Attach UDISE Code if needed
          dateOfBirth: newEmployeeData.dateOfBirth || null,
          dateOfFirstAppointment: newEmployeeData.dateOfFirstAppointment || null,
          designationAtFirstAppointment: newEmployeeData.designationAtFirstAppointment || "",
          qualification: newEmployeeData.qualification || "",
          subjectInPG: newEmployeeData.subjectInPG || "",
          presentDesignation: newEmployeeData.presentDesignation || "",
          dateOfLatestPromotion: newEmployeeData.dateOfLatestPromotion || null,
          dateOfRetirement: newEmployeeData.dateOfRetirement || null,
          dateOfCurrentPosting: newEmployeeData.dateOfCurrentPosting || null,
          currentPayScale: newEmployeeData.currentPayScale || "",
          payLevel: newEmployeeData.payLevel || "",
          grossSalary: newEmployeeData.grossSalary || "",
          pensionScheme: newEmployeeData.pensionScheme || "NPS", // Default to NPS
        }),
      });

      const text = await response.text();
      console.log("Raw API response:", text);

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} - ${text}`);
      }

      const data = JSON.parse(text);

      // Add new employee to the list
      setEmployees((prevEmployees) => [...prevEmployees, data.employee]);

      // Refetch school data to update employees
      queryClient.invalidateQueries({ queryKey: ["school", schoolInfo.id] });

      // Close modal and reset form
      setIsAddModalOpen(false);
      setNewEmployeeData({});
    } catch (error) {
      console.error("Error adding employee:", error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-white p-6 max-h-full overflow-y-auto w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Employee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Staff Type */}
          <div>
            <label htmlFor="staffType" className="block text-sm font-medium text-gray-700 mb-1">
              Select Staff Type
            </label>
            <select
              id="staffType"
              value={newEmployeeData.staffType || ""}
              onChange={(e) => {
                setNewEmployeeData({
                  ...newEmployeeData,
                  staffType: e.target.value,
                  sanctionedPost: "" // Reset post selection when type changes
                });
                setShowError(false);
              }}
              className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
            >
              <option value="">Select Staff Type</option>
              {staffTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Name of Sanctioned Posts */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Name of Sanctioned Posts</label>
            <select
              value={newEmployeeData.sanctionedPost || ""}
              onChange={(e) => {
                if (!newEmployeeData.staffType) {
                  setShowError(true);
                  return;
                }
                setNewEmployeeData({ ...newEmployeeData, sanctionedPost: e.target.value });
              }}
              onFocus={() => {
                if (!newEmployeeData.staffType) {
                  setShowError(true);
                }
              }}
              className={`border rounded w-full p-2 ${
                showError && !newEmployeeData.staffType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {newEmployeeData.staffType ? "Select Post" : "Please select a staff type first"}
              </option>
              {newEmployeeData.staffType &&
                getSanctionedPosts().map((post, index) => (
                  <option key={index} value={post}>
                    {post}
                  </option>
                ))}
            </select>
            {showError && !newEmployeeData.staffType && (
              <p className="text-red-500 text-sm mt-1">Please select a staff type first.</p>
            )}
          </div>

          {/* Employee Name */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Employee Name</label>
            <input
              type="text"
              value={newEmployeeData.employeeName || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, employeeName: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Employee ID */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
            <input
              type="number"
              value={newEmployeeData.employeeId || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, employeeId: Number(e.target.value) })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
            <input
              type="date"
              value={newEmployeeData.dateOfBirth || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, dateOfBirth: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of First Appointment */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
            <input
              type="date"
              value={newEmployeeData.dateOfFirstAppointment || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, dateOfFirstAppointment: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Designation at First Appointment */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">
              Designation at First Appointment
            </label>
            <select
              value={newEmployeeData.designationAtFirstAppointment || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  designationAtFirstAppointment: e.target.value,
                })
              }
              className="border border-gray-300 rounded w-full p-2"
            >
              <option value="">Select Designation</option>
              {/* Designations Sorted Alphabetically */}
              <option value="Accountant">Accountant</option>
              <option value="Accounts Assistant">Accounts Assistant</option>
              <option value="Assistant Director (P & S)">Assistant Director (P & S)</option>
              <option value="Assistant Engineer">Assistant Engineer</option>
              <option value="Assistant Programmer">Assistant Programmer</option>
              <option value="CEO">CEO</option>
              <option value="Clerk">Clerk</option>
              <option value="Computer Assistant">Computer Assistant</option>
              <option value="Driver">Driver</option>
              <option value="Head Assistant">Head Assistant</option>
              <option value="Junior Assistant">Junior Assistant</option>
              <option value="Laboratory Assistant">Laboratory Assistant</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Lecturer Physical Education">Lecturer Physical Education</option>
              <option value="Library Assistant">Library Assistant</option>
              <option value="Physical Education Master">Physical Education Master</option>
              <option value="Physical Education Teacher">Physical Education Teacher</option>
              <option value="Principal GHSS">Principal GHSS</option>
              <option value="Principal HSS">Principal HSS</option>
              <option value="Registrar">Registrar</option>
              <option value="Senior Assistant">Senior Assistant</option>
              <option value="Special Education Teacher">Special Education Teacher</option>
              <option value="Statistical Assistant">Statistical Assistant</option>
              <option value="Teacher">Teacher</option>
              <option value="Teacher 3rd RRET NP">Teacher 3rd RRET NP</option>
              <option value="Teacher Grade II">Teacher Grade II</option>
              <option value="Teacher Grade III">Teacher Grade III</option>
              <option value="Teacher RET SSA">Teacher RET SSA</option>
              <option value="Teacher RRET NP">Teacher RRET NP</option>
              <option value="Teacher RRET SSA">Teacher RRET SSA</option>
              <option value="Technical Staff">Technical Staff</option>
            </select>
          </div>
          {/* Qualification (B.Ed) */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Qualification (B.Ed)</label>
            <select
              value={newEmployeeData.qualification || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  qualification: e.target.value,
                })
              }
              className="border border-gray-300 rounded w-full p-2"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {/* Subject in PG */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Subject in PG</label>
            <input
              type="text"
              value={newEmployeeData.subjectInPG || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  subjectInPG: e.target.value,
                })
              }
              className="border border-gray-300 rounded w-full p-2"
              disabled={newEmployeeData.qualification !== "Yes"}
            />
          </div>
          {/* Present Designation */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Present Designation</label>
            <select
              value={newEmployeeData.presentDesignation || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  presentDesignation: e.target.value,
                })
              }
              className="border border-gray-300 rounded w-full p-2"
            >
              <option value="">Select Designation</option>
              {/* All Designations Sorted Alphabetically */}
              <option value="Accountant">Accountant</option>
              <option value="Accounts Assistant">Accounts Assistant</option>
              <option value="Assistant Director (P & S)">Assistant Director (P & S)</option>
              <option value="Assistant Engineer">Assistant Engineer</option>
              <option value="Assistant Programmer">Assistant Programmer</option>
              <option value="CEO">CEO</option>
              <option value="Clerk">Clerk</option>
              <option value="Computer Assistant">Computer Assistant</option>
              <option value="Driver">Driver</option>
              <option value="Head Assistant">Head Assistant</option>
              <option value="Junior Assistant">Junior Assistant</option>
              <option value="Laboratory Assistant">Laboratory Assistant</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Lecturer Physical Education">Lecturer Physical Education</option>
              <option value="Library Assistant">Library Assistant</option>
              <option value="Physical Education Master">Physical Education Master</option>
              <option value="Physical Education Teacher">Physical Education Teacher</option>
              <option value="Principal GHSS">Principal GHSS</option>
              <option value="Principal HSS">Principal HSS</option>
              <option value="Registrar">Registrar</option>
              <option value="Senior Assistant">Senior Assistant</option>
              <option value="Special Education Teacher">Special Education Teacher</option>
              <option value="Statistical Assistant">Statistical Assistant</option>
              <option value="Teacher">Teacher</option>
              <option value="Teacher 3rd RRET NP">Teacher 3rd RRET NP</option>
              <option value="Teacher Grade II">Teacher Grade II</option>
              <option value="Teacher Grade III">Teacher Grade III</option>
              <option value="Teacher RET SSA">Teacher RET SSA</option>
              <option value="Teacher RRET NP">Teacher RRET NP</option>
              <option value="Teacher RRET SSA">Teacher RRET SSA</option>
              <option value="Technical Staff">Technical Staff</option>
            </select>
          </div>
          {/* Date of Latest Promotion */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Latest Promotion</label>
            <input
              type="date"
              value={newEmployeeData.dateOfLatestPromotion || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, dateOfLatestPromotion: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Retirement */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
            <input
              type="date"
              value={newEmployeeData.dateOfRetirement || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, dateOfRetirement: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Current Posting */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
            <input
              type="date"
              value={newEmployeeData.dateOfCurrentPosting || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  dateOfCurrentPosting: e.target.value,
                })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Current Payscale */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Current Payscale</label>
            <input
              type="text"
              value={newEmployeeData.currentPayScale || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, currentPayScale: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Pay Level */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Pay Level</label>
            <input
              type="text"
              value={newEmployeeData.payLevel || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, payLevel: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Gross Salary */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
            <input
              type="text"
              value={newEmployeeData.grossSalary || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, grossSalary: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Pension Scheme */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">NPS/OPS</label>
            <input
              type="text"
              value={newEmployeeData.pensionScheme || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, pensionScheme: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleSaveNewEmployee}
            className="font-semibold text-[13px] px-4 py-2 bg-primary text-white rounded transition hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
