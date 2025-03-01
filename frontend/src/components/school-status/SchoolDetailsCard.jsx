"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  ChevronLeft,
  // Check,
  // X,
  // AlertTriangle,
  Briefcase,
  // UserX,
  // UserCheck,
  // UserMinus,
  // UserRoundPenIcon
} from "lucide-react";
import { School, MapPin, User, Phone } from "lucide-react";
import { useUser } from "@/context/UserContext";
import AddEmployeeModal from "./AddEmployeeModal";

export default function SchoolDetailsCard({ schoolInfo }) {
  const { userRole } = useUser();
  console.log("SchoolInfo",schoolInfo);
  const queryClient = useQueryClient();


  // Use the employees array from the fresh schoolInfo data.
  const [employees, setEmployees] = useState(schoolInfo.employees || []);

  useEffect(() => {
    setEmployees(schoolInfo.employees || []);
  }, [schoolInfo]);

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
    const matchesSearch = emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || emp.staffType === categoryFilter;
    const matchesDesignation =
      designationFilter === "" || emp.presentDesignation === designationFilter;
    return matchesSearch && matchesCategory && matchesDesignation;
  });

  // Mutation to create an employee.
  const createEmployeeMutation = useMutation({
    mutationFn: async (newEmployee) => {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating employee");
      }
      return response.json();
    },
    onSuccess: (data) => {
      const createdEmployee = data.employee;
      setEmployees((prev) => [...prev, createdEmployee]);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const handleSaveNewEmployee = async () => {
    if (!newEmployeeData.emp_id || !newEmployeeData.emp_name) {
      alert("Please provide at least Employee ID and Name.");
      return;
    }
  
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEmployeeData,
          school: schoolInfo.id, // Attach the school ID
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating employee");
      }
  
      const { employee } = await response.json();
  
      // Add the new employee to the list
      setEmployees((prevEmployees) => [...prevEmployees, employee]);
  
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
  



  const getSanctionedPosts = () => {
    if (newEmployeeData.staffType === "Teaching") return teachingPosts;
    if (newEmployeeData.staffType === "Non-Teaching") return nonTeachingPosts;
    return [];
  };
  const { data: schoolData, refetch } = useQuery({
    queryKey: ["school", schoolInfo.id], // Assuming school has an id
    queryFn: async () => {
      const response = await fetch(`/api/schools/${schoolInfo.id}`);
      return response.json();
    },
    initialData: schoolInfo, // Ensures data is available initially
  });

  const nonTeachingPosts = [
    "Accountant",
    "Accounts Assistant",
    "Assistant Director (P & S)",
    "CEO",
    "Driver",
    "Head Assistant",
    "Junior Assistant",
    "Laboratory Assistant",
    "Library Assistant",
    "Senior Assistant",
    "Statistical Assistant",
    "Assistant Programmer",
    "Assistant Engineer",
    "Computer Assistant",
  ];
  const teachingPosts = [
    "Lecturer",
    "Lecturer Physical Education",
    "Physical Education Master",
    "Physical Education Teacher",
    "Principal GHSS",
    "Principal HSS",
    "Teacher",
    "Teacher 3rd RRET NP",
    "Teacher RRET NP",
    "Teacher Grade II",
    "Teacher Grade III",
    "Teacher RET SSA",
    "Teacher RRET SSA",
    "Special Education Teacher",
  ];
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
      <div className="max-w-7xl mx-auto">
        {/* School Information */}
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
              <span className="font-semibold text-secondary">School Type:</span>{" "}
              {schoolInfo.scheme}
            </p>
          </div>
        </div>

        {/* Employee Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-2 border-primary">
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
          <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-2 border-primary">
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
                      {emp.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.presentDesignation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/home/school-status/${encodeURIComponent(schoolInfo.id)}/${emp._id}`}>
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
          uniqueCategory={uniqueCategory}
          getSanctionedPosts={getSanctionedPosts}
          showError={showError}
          setShowError={setShowError}
        />
      )}
    </div>
  );
}
