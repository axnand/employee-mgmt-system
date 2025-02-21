"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import districtData from "@/data/data.json";

export default function EmployeeDetailPage() {
  const router = useRouter();
  const { schoolId, employeeId } = useParams();

  // Flatten all schools
  const allSchools = districtData.zones.flatMap((zone) =>
    zone.schools.map((school) => ({ ...school, zone: zone.zone }))
  );

  // Find the current school
  const schoolInfo = allSchools.find(
    (school) => school.id === parseInt(schoolId, 10)
  );

  // Local state for the employee
  const [employee, setEmployee] = useState(null);

  // Edit mode & form data
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Transfer mode & form data
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [searchSchool, setSearchSchool] = useState("");
  const [transferSchoolId, setTransferSchoolId] = useState("");

  // Initialize employee from the current school
  useEffect(() => {
    if (schoolInfo && employeeId) {
      const emp = schoolInfo.employees.find(
        (emp) => emp.emp_id === parseInt(employeeId, 10)
      );
      setEmployee(emp);
    }
  }, [schoolInfo, employeeId]);

  // If school not found
  if (!schoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">School not found.</p>
      </div>
    );
  }

  // If we haven't loaded the employee yet
  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    );
  }

  // Handle toggling edit mode
  const handleEditClick = () => {
    setIsEditMode(true);
    // Copy current employee data into the form state
    setEditFormData({ ...employee });
  };

  // Handle saving edited data
  const handleSaveEdit = () => {
    // In a real app, you'd call an API here.
    setEmployee(editFormData);
    setIsEditMode(false);
  };

  // Handle transfer button click
  const handleTransferClick = () => {
    setIsTransferMode(true);
    setSearchSchool("");
    setTransferSchoolId("");
  };

  // Filter all schools for the dropdown (excluding the current one)
  const filteredSchools = allSchools.filter((sch) => {
    // Exclude the current school from the list
    if (sch.id === parseInt(schoolId, 10)) return false;
    // Match the search text
    return sch.name.toLowerCase().includes(searchSchool.toLowerCase());
  });

  // Submit transfer request
  const handleSubmitTransfer = () => {
    // In a real app, you'd call an API to request the transfer
    console.log(
      `Transfer requested for employee ${employeeId} from school ${schoolId} to school ${transferSchoolId}`
    );
    // Reset states
    setIsTransferMode(false);
    setSearchSchool("");
    setTransferSchoolId("");
  };

  return (
    <div className="min-h-screen p-4 capitalize">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-[15px] font-semibold rounded-md text-secondary hover:text-primary transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> <span>Back</span>
        </button>

        {/* Page Header: Employee Name + Action Buttons */}
        <div className="bg-white shadow-sm border-l-4 border-primary rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {employee.emp_name}
            </h1>
            <div className="flex gap-4">
              {!isEditMode && !isTransferMode && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="font-semibold text-[13px]  px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600 "
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleTransferClick}
                    className="font-semibold text-[13px]  px-4 py-2 bg-red-500 transition text-white rounded  hover:bg-red-600"
                  >
                    Transfer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* EDIT MODE FORM */}
        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* UDISE Code */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">UDISE Code</label>
            <input
              type="text"
              value={editFormData.udise_code || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, udise_code: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Name of Sanctioned Posts */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Name of Sanctioned Posts</label>
            <input
              type="text"
              value={editFormData.name_of_sanctioned_posts || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name_of_sanctioned_posts: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Employee Name */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Employee Name</label>
            <input
              type="text"
              value={editFormData.emp_name || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, emp_name: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Employee ID */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
            <input
              type="number"
              value={editFormData.emp_id || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, emp_id: Number(e.target.value) })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
            <input
              type="date"
              value={editFormData.date_of_birth || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date_of_birth: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of First Appointment */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
            <input
              type="date"
              value={editFormData.date_of_first_appointment || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date_of_first_appointment: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Designation at First Appointment */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Designation at First Appointment</label>
            <input
              type="text"
              value={editFormData.designation_at_first_appointment || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, designation_at_first_appointment: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Qualification */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Qualification</label>
            <input
              type="text"
              value={editFormData.qualification || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, qualification: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Subject in PG */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Subject in PG</label>
            <input
              type="text"
              value={editFormData.subject_in_pg || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, subject_in_pg: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Present Designation */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Present Designation</label>
            <input
              type="text"
              value={editFormData.present_designation || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, present_designation: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Latest Promotion */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Latest Promotion</label>
            <input
              type="date"
              value={editFormData.date_of_latest_promotion || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date_of_latest_promotion: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Retirement */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
            <input
              type="date"
              value={editFormData.date_of_retirement || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date_of_retirement: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date From Which Working In Current Office */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
            <input
              type="date"
              value={editFormData.date_from_which_working_in_this_current_office || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date_from_which_working_in_this_current_office: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Last Three Postings */}
          <div className="col-span-2">
            <h3 className="font-semibold text-gray-600 mb-1">Last Three Postings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Posting */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">First Posting School</label>
                <input
                  type="text"
                  value={editFormData.last_three_postings?.first_posting?.school || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        first_posting: {
                          ...editFormData.last_three_postings?.first_posting,
                          school: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">First Posting Start Date</label>
                <input
                  type="date"
                  value={editFormData.last_three_postings?.first_posting?.start_date || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        first_posting: {
                          ...editFormData.last_three_postings?.first_posting,
                          start_date: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">First Posting End Date</label>
                <input
                  type="date"
                  value={editFormData.last_three_postings?.first_posting?.end_date || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        first_posting: {
                          ...editFormData.last_three_postings?.first_posting,
                          end_date: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Second Posting */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Second Posting School</label>
                <input
                  type="text"
                  value={editFormData.last_three_postings?.second_posting?.school || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        second_posting: {
                          ...editFormData.last_three_postings?.second_posting,
                          school: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Second Posting Start Date</label>
                <input
                  type="date"
                  value={editFormData.last_three_postings?.second_posting?.start_date || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        second_posting: {
                          ...editFormData.last_three_postings?.second_posting,
                          start_date: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Second Posting End Date</label>
                <input
                  type="date"
                  value={editFormData.last_three_postings?.second_posting?.end_date || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        second_posting: {
                          ...editFormData.last_three_postings?.second_posting,
                          end_date: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Third Posting */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Third Posting School</label>
                <input
                  type="text"
                  value={editFormData.last_three_postings?.third_posting?.school || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        third_posting: {
                          ...editFormData.last_three_postings?.third_posting,
                          school: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Third Posting Start Date</label>
                <input
                  type="date"
                  value={editFormData.last_three_postings?.third_posting?.start_date || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        third_posting: {
                          ...editFormData.last_three_postings?.third_posting,
                          start_date: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Third Posting End Date</label>
                <input
                  type="date"
                  value={editFormData.last_three_postings?.third_posting?.end_date || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_three_postings: {
                        ...editFormData.last_three_postings,
                        third_posting: {
                          ...editFormData.last_three_postings?.third_posting,
                          end_date: e.target.value,
                        },
                      },
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
            </div>
          </div>
          {/* Current Payscale */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Current Payscale</label>
            <input
              type="text"
              value={editFormData.current_payscale || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, current_payscale: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Pay Level */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Pay Level</label>
            <input
              type="text"
              value={editFormData.pay_level || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, pay_level: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Gross Salary */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
            <input
              type="text"
              value={editFormData.gross_salary || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, gross_salary: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* NPS/OPS */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">NPS/OPS</label>
            <input
              type="text"
              value={editFormData.whether_nps_or_ops || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, whether_nps_or_ops: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mt-4 flex gap-4">
              <button
                onClick={handleSaveEdit}
                className="font-semibold text-[13px]  px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600 "
              >
                Save
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="font-semibold text-[13px]  px-4 py-2 transition bg-gray-300 text-gray-700 rounded  hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
        </div>
        
        )}

        {/* TRANSFER MODE FORM */}
        {isTransferMode && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Transfer Request
            </h2>
            <div className="mb-4">
              <label className="font-semibold text-gray-600 block mb-1">
                Search School
              </label>
              <input
                type="text"
                placeholder="Type to filter schools..."
                value={searchSchool}
                onChange={(e) => setSearchSchool(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="font-semibold text-gray-600 block mb-1">
                Select School
              </label>
              <select
                value={transferSchoolId}
                onChange={(e) => setTransferSchoolId(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 text-sm"
              >
                <option value="">-- Choose a school --</option>
                {filteredSchools.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmitTransfer}
                disabled={!transferSchoolId}
                className="font-semibold text-[13px]  px-4 py-2 bg-red-500 text-white rounded transition  hover:bg-red-600 disabled:opacity-50"
              >
                Submit Transfer
              </button>
              <button
                onClick={() => setIsTransferMode(false)}
                className="font-semibold text-[13px]  px-4 py-2 bg-gray-300 text-gray-700 roun-full ed hover:bg-gray-4-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Display employee info if not editing or transferring */}
        {!isEditMode && !isTransferMode && (
          <div className="bg-white shadow rounded-lg p-6">
            {/* Basic Employee Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Employee ID:</span>
                  <span className="text-gray-600 font-medium">{employee.emp_id}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Date of Birth:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.date_of_birth}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">First Appointment:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.date_of_first_appointment}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Designation at First Appointment:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.designation_at_first_appointment}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Qualification:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.qualification}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Subject in PG:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.subject_in_pg}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Present Designation:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.present_designation}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Latest Promotion:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.date_of_latest_promotion}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Retirement Date:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.date_of_retirement}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Working Since:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.date_from_which_working_in_this_current_office}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Current Payscale:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.current_payscale}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Pay Level:</span>
                  <span className="text-gray-600 font-medium">{employee.pay_level}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Gross Salary:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.gross_salary}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">NPS/OPS:</span>
                  <span className="text-gray-600 font-medium">
                    {employee.whether_nps_or_ops}
                  </span>
                </p>
              </div>
            </div>

            {/* Last Three Postings */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                Last Three Postings
              </h2>
              <div className="space-y-4 text-sm">
                {["first_posting", "second_posting", "third_posting"].map(
                  (key, index) => {
                    const posting = employee.last_three_postings[key];
                    const postingTitle =
                      index === 0
                        ? "First Posting"
                        : index === 1
                        ? "Second Posting"
                        : "Third Posting";
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 border border-gray-200 rounded-md"
                      >
                        <p className="font-semibold text-secondary mb-2 text-[15px] ">
                          {postingTitle}:
                        </p>
                        <p>
                          <span className="font-semibold text-gray-600 mr-1">
                            School:
                          </span>
                          <span className="text-gray-600 font-medium">
                            {posting.school}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-600 mr-1">
                            Start Date:
                          </span>
                          <span className="text-gray-600 font-medium">
                            {posting.start_date}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-600 mr-1">
                            End Date:
                          </span>
                          <span className="text-gray-600 font-medium">
                            {posting.end_date}
                          </span>
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
