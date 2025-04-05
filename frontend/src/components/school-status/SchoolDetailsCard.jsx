"use client";

import { useState,useEffect,useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditSchoolModal from "./EditSchoolModal";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import {
  Users,
  ChevronLeft,
  Briefcase,
} from "lucide-react";
import { School, MapPin, User, Phone } from "lucide-react";
import { useUser } from "@/context/UserContext";
import AddEmployeeModal from "./AddEmployeeModal";
import { ToastContainer, toast } from "react-toastify";

export default function SchoolDetailsCard({ schoolInfo }) {
  const { userRole, user } = useUser();
  const schoolId = user?.schoolId;
  console.log("SchoolInfo",schoolInfo);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const editModalRef = useRef(null);

  useOutsideClick(editModalRef, () => {
    if (isEditing) {
      setDropdownVisible(false);
    }
  });


  // Use the employees array from the fresh schoolInfo data.
  const [employees, setEmployees] = useState(schoolInfo.employees || []);

  useEffect(() => {
    setEmployees(schoolInfo.employees || []);
  }, [schoolInfo]);

  console.log("employees:", employees);

  // Employee filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showError, setShowError] = useState(false);

  // Build unique staff types (using staffType field)
  const uniqueCategory = Array.from(new Set(employees.map((emp) => emp.staffType)));
  // Build unique designations (using presentDesignation field)
  const uniqueDesignations = Array.from(new Set(employees.map((emp) => emp.presentDesignation)));

  // Filter employees using the proper field names
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || emp.staffType === categoryFilter;
    const matchesDesignation =
      designationFilter === "" || emp.presentDesignation === designationFilter;
    return matchesSearch && matchesCategory && matchesDesignation;
  });


  

  const handleSaveNewEmployee = async () => {
    console.log("🔹 Submitting Employee Data:", JSON.stringify(newEmployeeData, null, 2));

    if (!newEmployeeData.staffType || !newEmployeeData.presentDesignation) {
        alert("Error: Staff Type and Present Designation are required!");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...newEmployeeData,
              staffType: newEmployeeData.staffType ? newEmployeeData.staffType.toLowerCase() : "",
              presentDesignation: newEmployeeData.presentDesignation || "Unknown",
              bed: newEmployeeData.bed === "Yes" ? true : false,
              photograph: "",
              school: String(schoolInfo._id), // ✅ Ensure it's a string.
          }),
          
        });

        const text = await response.text();
        console.log("🔹 Raw API response:", text);

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${text}`);
        }

        const data = JSON.parse(text);
        toast.success("Employee Added Successfully");
        console.log("✅ Employee Added Successfully:", data);
    } catch (error) {
      toast.error("Error Adding Employee", error.message);
    }
};


  
  

  const { data: schoolData, refetch } = useQuery({
    queryKey: ["school", schoolInfo.id], // Assuming school has an id
    queryFn: async () => {
      const response = await fetch(`/api/schools/${schoolInfo.id}`);
      return response.json();
    },
    initialData: schoolInfo, // Ensures data is available initially
  });

  console.log("Filtered employees:", filteredEmployees);
  
  

  if (!schoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">School not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen capitalize">
      <ToastContainer/>
      <div className="max-w-7xl mx-auto">
        {/* School Information */}
         <div className="bg-white border-l-[3px] border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 text-sm">
      <div className="flex items-center gap-3">
        <School className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-secondary">{schoolInfo.name}</h1>
      </div>
      <div className="mt-4 space-y-3">
        <p className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 text-secondary mr-2" />
          {schoolInfo.address || "No address provided"}
        </p>
        <p className="flex items-center text-gray-600">
          <User className="w-5 h-5 text-secondary mr-2" />
          {schoolInfo.principal || "No principal provided"}
        </p>
        <p className="flex items-center text-gray-600">
          <Phone className="w-5 h-5 text-secondary mr-2" />
          {schoolInfo.contact || "No contact provided"}
        </p>
        {schoolInfo.office && schoolInfo.office.zone && (
          <p className="flex items-center text-gray-600">
            <span className="font-semibold text-secondary">Zone: </span>{" "}
            {schoolInfo.office.zone.name}
          </p>
        )}
        {schoolInfo.office && schoolInfo.office.zone && schoolInfo.office.zone.district && (
          <p className="flex items-center text-gray-600">
            <span className="font-semibold text-secondary">District:</span>{" "}
            {schoolInfo.office.zone.district}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-semibold text-secondary">UDISe ID:</span>{" "}
          {schoolInfo.udiseId}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold text-secondary">Feasibility Zone:</span>{" "}
          {schoolInfo.feasibilityZone}
        </p>
        {schoolInfo.scheme && (
          <p className="text-gray-600">
            <span className="font-semibold text-secondary">Scheme:</span>{" "}
            {schoolInfo.scheme}
          </p>
        )}
        {schoolInfo.subScheme && (
          <p className="text-gray-600">
            <span className="font-semibold text-secondary">Sub Scheme:</span>{" "}
            {schoolInfo.subScheme}
          </p>
        )}
        {schoolInfo.dateOfEstablishment && (
          <p className="text-gray-600">
            <span className="font-semibold text-secondary">Established:</span>{" "}
            {new Date(schoolInfo.dateOfEstablishment).toLocaleDateString()}
          </p>
        )}
        {schoolInfo.dateOfUpgrade && (
          <p className="text-gray-600">
            <span className="font-semibold text-secondary">Upgraded On:</span>{" "}
            {new Date(schoolInfo.dateOfUpgrade).toLocaleDateString()}
          </p>
        )}
      </div>
      {schoolInfo && schoolInfo._id && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit School Details
        </button>
      )}

      {isEditing && (
        <EditSchoolModal
          ref={editModalRef}
          school={schoolInfo}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>

        {/* Employee Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-[3px] border-primary">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Employees</h2>
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
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
            <div className="flex-1 mb-4 md:mb-0">
              <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Staff Type
              </label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
              >
                <option value="">All Staff Types</option>
                {uniqueCategory.map((ctg, idx) => (
                  <option key={idx} value={ctg}>
                    {ctg}
                  </option>
                ))}
              </select>
            </div>
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
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-700" />
              <h3 className="text-[15px] font-semibold">Total Employees</h3>
            </div>
            <p className="text-[13px] pt-1 text-gray-600">Teaching & Non-Teaching staff</p>
            <div className="text-2xl font-bold">{employees.length}</div>
          </div>
        </div>

        {/* Employee Table */}
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.presentDesignation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-x-2">
                      <Link href={`/home/school-status/${encodeURIComponent(emp._id)}`}>
                        <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Employee Modal */}
      {isAddModalOpen && (
         <AddEmployeeModal
         newEmployeeData={newEmployeeData}
         setNewEmployeeData={setNewEmployeeData}
         isOpen={isAddModalOpen}
         onClose={() => setIsAddModalOpen(false)}
         handleSaveNewEmployee={handleSaveNewEmployee}
         showError={showError}
         setShowError={setShowError}
         schoolInfo={schoolInfo}               // Pass schoolInfo here
         setEmployees={setEmployees}           // Pass employees updater
         setIsAddModalOpen={setIsAddModalOpen}   // Pass modal control function
         queryClient={queryClient}             // Pass react-query client if needed
       />
      )}
    </div>
  );
}
