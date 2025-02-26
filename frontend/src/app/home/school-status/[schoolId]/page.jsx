"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Users, Search, ChevronLeft, Check, X, AlertTriangle, Briefcase } from "lucide-react";
import Link from "next/link";
import districtData from "@/data/data.json";
import { School, MapPin, User, Phone } from "lucide-react";
import { useUser } from "@/context/UserContext";

// Flatten schools from all zones, attach zone info, and generate a unique id if needed.
const allSchools = districtData.zones.flatMap((zone, zoneIndex) =>
  zone.schools.map((school, schoolIndex) => ({
    ...school,
    zone: zone.zone,
    id: school.id || `${zoneIndex}-${schoolIndex}`,
  }))
)

export default function SchoolDetailsPage() {
  const { schoolId } = useParams();
  const [allSchoolsState, setAllSchoolsState] = useState(allSchools);
  const [schoolInfo, setSchoolInfo] = useState(
    allSchoolsState.find((school) => school.id === parseInt(schoolId, 10))
  );

  const { user, userRole } = useUser();

  // Update schoolInfo whenever allSchoolsState changes
  useEffect(() => {
    setSchoolInfo(allSchoolsState.find((school) => school.id === parseInt(schoolId, 10)));
  }, [allSchoolsState, schoolId]);

  // Employee filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [retirementFilter, setRetirementFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("");

  // Get employees from school data (or an empty array)
  const employees = schoolInfo ? schoolInfo.employees || [] : [];
  // Build unique category from the employees list
  const uniqueCategory = Array.from(new Set(employees.map(emp => emp.category)));

  // Build unique designations from employees for the dropdown
  const uniqueDesignations = Array.from(new Set(employees.map(emp => emp.present_designation)));


  // Filter employees based on search criteria
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || emp.category === categoryFilter;
    const matchesDesignation = designationFilter === "" || emp.present_designation === designationFilter;
    // const matchesRetirement = retirementFilter === "" || emp.date_of_retirement === retirementFilter;
    return matchesSearch && matchesCategory && matchesDesignation ;
  });

  const handleSaveNewEmployee = () => {
    if (!newEmployeeData.emp_id || !newEmployeeData.emp_name) {
      alert("Please provide at least Employee ID and Name.");
      return;
    }

    // Update the school in the state
    const updatedSchools = allSchoolsState.map((school) => {
      if (school.id === schoolInfo.id) {
        return {
          ...school,
          employees: [...(school.employees || []), newEmployeeData], // Append new employee
        };
      }
      return school;
    });

    setAllSchoolsState(updatedSchools); // Update global state
    setIsAddModalOpen(false);
    setNewEmployeeData({});

    console.log("Updated Schools Data:", updatedSchools);
  };

  const statusIcon = (attendance) => {
    switch (attendance) {
      case "Present":
        return <Check className="w-5 h-5 text-green-500" />;  
      case "Absent":
        return <X className="w-5 h-5 text-red-500" />;
      case "Leave":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "On Duty":
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!schoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">School not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 capitalize">
      <div className="max-w-7xl mx-auto">
        {userRole === "admin" && (<Link href="/home/school-status">
          <button className="mb-6 text-[15px] font-semibold rounded-md text-secondary hover:text-primary transition flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> <span>Back</span>
          </button>
        </Link>)}

        {/* School Information Card */}
        <div className="bg-white border-l-2 border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 font-medium text-sm">
          <div className="flex items-center gap-3">
            <School className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-secondary">{schoolInfo.name}</h1>
          </div>
          <div className="mt-4 space-y-3">
            <p className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 text-secondary mr-2" />
              {schoolInfo.address}
            </p>
            <p className="flex items-center text-gray-600">
              <User className="w-5 h-5 text-secondary mr-2" />
              {schoolInfo.principal}
            </p>
            <p className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 text-secondary mr-2" />
              {schoolInfo.contact}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-secondary">School Type:</span> {schoolInfo.scheme}{" "}
            </p>
          </div>
        </div>

        {/* Employee Filter Component */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-2 border-primary">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Employees</h2>
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
            {/* Name Search */}
            <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="employeeSearch" className="block text-sm font-medium text-gray-700 mb-1">
        Search by Name
      </label>
      <input
        id="employeeSearch"
        type="text"
        placeholder="Employee name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
      />
    </div>
             {/* Category Filter */}
             <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="designationFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Category
      </label>
      <select
        id="categoryFilter"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
      >
        <option value="">All Categories</option>
        {uniqueCategory.map((ctg, idx) => (
          <option key={idx} value={ctg}>
            {ctg}
          </option>
        ))}
      </select>
    </div>
            {/* Designation Filter */}
            <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="designationFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Designation
      </label>
      <select
        id="designationFilter"
        value={designationFilter}
        onChange={(e) => setDesignationFilter(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
      >
        <option value="">All Designations</option>
        {uniqueDesignations.map((des, idx) => (
          <option key={idx} value={des}>
            {des}
          </option>
        ))}
      </select>
    </div>

{/* 
    Retirement Date Filter
    <div className="flex-1 mb-4 md:mb-0">
      <label htmlFor="retirementFilter" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Retirement Date
      </label>
      <input
        id="retirementFilter"
        type="date"
        value={retirementFilter}
        onChange={(e) => setRetirementFilter(e.target.value)}
        className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
      />
    </div> */}

          </div>
        </div>

        {/* Employee Search & Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" /> Employees
            </h2>
            <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="font-semibold text-[13px] px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600"
                  >
                    Add New Employee
                  </button>
          </div>
          <div className="bg-white rounded-lg overflow-x-auto border">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.emp_id} className="">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.emp_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.emp_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.present_designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center text-sm text-gray-900">
                    {emp.attendance ? (
                            <>
                            {statusIcon(emp.attendance)}
                            <span className="ml-2">{emp.attendance}</span>
                            </>
                        ): "No Status"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/home/school-status/${encodeURIComponent(schoolInfo.id)}/${emp.emp_id}`}>
                        <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-10">
          <div className="bg-white  p-6 max-h-full overflow-y-auto w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Add New Employee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* UDISE Code */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  UDISE Code
                </label>
                <input
                  type="text"
                  value={newEmployeeData.udise_code || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      udise_code: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Name of Sanctioned Posts */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Name of Sanctioned Posts
                </label>
                <input
                  type="text"
                  value={newEmployeeData.name_of_sanctioned_posts || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      name_of_sanctioned_posts: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Employee Name */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={newEmployeeData.emp_name || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      emp_name: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Employee ID */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Employee ID
                </label>
                <input
                  type="number"
                  value={newEmployeeData.emp_id || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      emp_id: Number(e.target.value),
                    })
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
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, category: e.target.value })}
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
              {/* Date of Birth */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newEmployeeData.date_of_birth || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      date_of_birth: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Date of First Appointment */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Date of First Appointment
                </label>
                <input
                  type="date"
                  value={newEmployeeData.date_of_first_appointment || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      date_of_first_appointment: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Designation at First Appointment */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Designation at First Appointment
                </label>
                <input
                  type="text"
                  value={newEmployeeData.designation_at_first_appointment || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      designation_at_first_appointment: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Qualification */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  value={newEmployeeData.qualification || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      qualification: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
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
                />
              </div>
              {/* Present Designation */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Present Designation
                </label>
                <input
                  type="text"
                  value={newEmployeeData.present_designation || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      present_designation: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Date of Latest Promotion */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Date of Latest Promotion
                </label>
                <input
                  type="date"
                  value={newEmployeeData.date_of_latest_promotion || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      date_of_latest_promotion: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Date of Retirement */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Date of Retirement
                </label>
                <input
                  type="date"
                  value={newEmployeeData.date_of_retirement || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      date_of_retirement: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Working Since (Current Office) */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Working Since (Current Office)
                </label>
                <input
                  type="date"
                  value={
                    newEmployeeData.date_from_which_working_in_this_current_office ||
                    ""
                  }
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      date_from_which_working_in_this_current_office:
                        e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Current Payscale */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Current Payscale
                </label>
                <input
                  type="text"
                  value={newEmployeeData.current_payscale || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      current_payscale: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Pay Level */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Pay Level
                </label>
                <input
                  type="text"
                  value={newEmployeeData.pay_level || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      pay_level: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* Gross Salary */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  Gross Salary
                </label>
                <input
                  type="text"
                  value={newEmployeeData.gross_salary || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      gross_salary: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              {/* NPS/OPS */}
              <div>
                <label className="font-semibold text-gray-600 block mb-1">
                  NPS/OPS
                </label>
                <input
                  type="text"
                  value={newEmployeeData.whether_nps_or_ops || ""}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      whether_nps_or_ops: e.target.value,
                    })
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
                onClick={() => setIsAddModalOpen(false)}
                className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
