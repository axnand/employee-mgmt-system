"use client";

import React from "react";
import {
  // You can import additional icons here if needed in the modal
} from "lucide-react";

export default function AddEmployeeModal({
  newEmployeeData,
  setNewEmployeeData,
  isOpen,
  onClose,
  handleSaveNewEmployee,
  uniqueCategory,
  getSanctionedPosts,
  showError,
  setShowError,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-white p-6 max-h-full overflow-y-auto w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Employee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* UDISE Code */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">UDISE Code</label>
            <input
              type="text"
              value={newEmployeeData.udise_code || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, udise_code: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Employee Category */}
          <div>
            <label htmlFor="employeeCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee Category
            </label>
            <select
              id="employeeCategory"
              value={newEmployeeData.category || ""}
              onChange={(e) => {
                setNewEmployeeData({
                  ...newEmployeeData,
                  category: e.target.value,
                  name_of_sanctioned_posts: ""
                });
                setShowError(false); // Reset error when a category is selected
              }}
              className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
            >
              <option value="">Select Category</option>
              {uniqueCategory.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Name of Sanctioned Posts */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Name of Sanctioned Posts</label>
            <select
              value={newEmployeeData.name_of_sanctioned_posts || ""}
              onChange={(e) => {
                if (!newEmployeeData.category) {
                  setShowError(true);
                  return;
                }
                setNewEmployeeData({ ...newEmployeeData, name_of_sanctioned_posts: e.target.value });
              }}
              onFocus={() => {
                if (!newEmployeeData.category) {
                  setShowError(true);
                }
              }}
              className={`border rounded w-full p-2 ${
                showError && !newEmployeeData.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {newEmployeeData.category ? "Select Post" : "Please select a category first"}
              </option>
              {newEmployeeData.category &&
                getSanctionedPosts().map((post, index) => (
                  <option key={index} value={post}>
                    {post}
                  </option>
                ))}
            </select>
            {showError && !newEmployeeData.category && (
              <p className="text-red-500 text-sm mt-1">Please select a category first.</p>
            )}
          </div>
          {/* Employee Name */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Employee Name</label>
            <input
              type="text"
              value={newEmployeeData.emp_name || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, emp_name: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Employee ID */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
            <input
              type="number"
              value={newEmployeeData.emp_id || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, emp_id: Number(e.target.value) })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
            <input
              type="date"
              value={newEmployeeData.date_of_birth || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, date_of_birth: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of First Appointment */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
            <input
              type="date"
              value={newEmployeeData.date_of_first_appointment || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, date_of_first_appointment: e.target.value })
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
              value={newEmployeeData.designation_at_first_appointment || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  designation_at_first_appointment: e.target.value,
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
            <label className="font-semibold text-gray-600 block mb-1">
              Qualification (B.Ed)
            </label>
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
            <label className="font-semibold text-gray-600 block mb-1">
              Subject in PG
            </label>
            <input
              type="text"
              value={newEmployeeData.subject_in_pg || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  subject_in_pg: e.target.value,
                })
              }
              className="border border-gray-300 rounded w-full p-2"
              disabled={newEmployeeData.qualification !== "Yes"}
            />
          </div>
          {/* Present Designation */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">
              Present Designation
            </label>
            <select
              value={newEmployeeData.present_designation || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  present_designation: e.target.value,
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
              value={newEmployeeData.date_of_latest_promotion || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, date_of_latest_promotion: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Retirement */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
            <input
              type="date"
              value={newEmployeeData.date_of_retirement || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, date_of_retirement: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Working Since (Current Office) */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
            <input
              type="date"
              value={newEmployeeData.date_from_which_working_in_this_current_office || ""}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  date_from_which_working_in_this_current_office: e.target.value,
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
              value={newEmployeeData.current_payscale || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, current_payscale: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Pay Level */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Pay Level</label>
            <input
              type="text"
              value={newEmployeeData.pay_level || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, pay_level: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Gross Salary */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
            <input
              type="text"
              value={newEmployeeData.gross_salary || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, gross_salary: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* NPS/OPS */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">NPS/OPS</label>
            <input
              type="text"
              value={newEmployeeData.whether_nps_or_ops || ""}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, whether_nps_or_ops: e.target.value })
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
