"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock Employees Data
const mockEmployees = [
  { id: 1, name: "Riaz Ahmed", designation: "Teacher", office: "High School Sooli", status: "Active" },
  { id: 2, name: "Saqib Ahmed", designation: "Junior Assistant", office: "High School Dugroon", status: "Active" },
  { id: 3, name: "Rafaqat Rasool", designation: "Vocational Trainer", office: "High School Nichlathara", status: "Inactive" },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState("");

  // Open Modal Handler
  const openModal = (type, employee = null) => {
    setSelectedEmployee(employee);
    setModalType(type);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedEmployee(null);
    setModalType("");
  };

  // Handle Adding Employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      name: e.target.name.value,
      designation: e.target.designation.value,
      office: e.target.office.value,
      status: "Active",
    };
    setEmployees([...employees, newEmployee]);
    toast.success("Employee added successfully!");
    closeModal();
  };

  // Handle Employee Deletion
  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.error("Employee deleted!");
    closeModal();
  };

  // Handle Employee Transfer
  const handleTransferEmployee = (e) => {
    e.preventDefault();
    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id ? { ...emp, office: e.target.office.value } : emp
    );
    setEmployees(updatedEmployees);
    toast.success("Employee transferred!");
    closeModal();
  };

  // Filter Employees
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">👥 Employee Management</h1>

      {/* Search & Add Employee */}
      <div className="flex justify-between mb-4">
        <input
          className="border rounded-md p-3 w-2/3"
          placeholder="🔍 Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => openModal("add")}>
          ➕ Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="grid grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold">{emp.name}</h3>
            <p>{emp.designation}</p>
            <p>🏢 {emp.office}</p>
            <p className={`text-sm ${emp.status === "Active" ? "text-green-600" : "text-red-600"}`}>
              {emp.status}
            </p>
            <div className="flex justify-between mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openModal("view", emp)}>
                View
              </button>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => openModal("edit", emp)}>
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => openModal("delete", emp)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Component */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            {/* Close Button */}
            <button className="absolute top-3 right-3 text-xl" onClick={closeModal}>✖</button>

            {/* View Employee Modal */}
            {modalType === "view" && selectedEmployee && (
              <div>
                <h2 className="text-2xl font-bold mb-4">👀 Employee Details</h2>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
                <p><strong>Office:</strong> {selectedEmployee.office}</p>
                <p><strong>Status:</strong> <span className={selectedEmployee.status === "Active" ? "text-green-600" : "text-red-600"}>{selectedEmployee.status}</span></p>
              </div>
            )}

            {/* Add Employee Modal */}
            {modalType === "add" && (
              <form onSubmit={handleAddEmployee}>
                <h2 className="text-xl font-bold mb-2">➕ Add Employee</h2>
                <input className="border p-2 w-full mt-2" name="name" placeholder="Name" required />
                <input className="border p-2 w-full mt-2" name="designation" placeholder="Designation" required />
                <input className="border p-2 w-full mt-2" name="office" placeholder="Office" required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-3 rounded w-full">
                  Add Employee
                </button>
              </form>
            )}

            {/* Edit Employee Modal */}
            {modalType === "edit" && selectedEmployee && (
              <form onSubmit={() => {}}>
                <h2 className="text-xl font-bold mb-2">✏️ Edit Employee</h2>
                <input className="border p-2 w-full mt-2" defaultValue={selectedEmployee.name} required />
                <button className="bg-yellow-500 text-white px-4 py-2 mt-3 rounded w-full">Save Changes</button>
              </form>
            )}

            {/* Delete Employee Confirmation */}
            {modalType === "delete" && selectedEmployee && (
              <>
                <h2 className="text-xl font-bold mb-2">🗑️ Delete Employee?</h2>
                <button className="bg-red-500 text-white px-4 py-2 mt-3 rounded w-full" onClick={() => handleDeleteEmployee(selectedEmployee.id)}>
                  Confirm Delete
                </button>
              </>
            )}

            {/* Transfer Employee Modal */}
            {modalType === "transfer" && selectedEmployee && (
              <form onSubmit={handleTransferEmployee}>
                <h2 className="text-xl font-bold mb-2">🔄 Transfer Employee</h2>
                <input className="border p-2 w-full mt-2" name="office" placeholder="New Office" required />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-3 rounded w-full">
                  Confirm Transfer
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
