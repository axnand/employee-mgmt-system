"use client";

import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutsideClick } from "@/hooks/useOutsideClick";


// Dummy Data for Schools
const schools = [
  { id: 1, name: "High School Sooli", address: "123 Main St", principal: "Mr. Smith", contact: "123-456-7890" },
  { id: 2, name: "High School Nichlathara", address: "456 Elm St", principal: "Mrs. Johnson", contact: "987-654-3210" },
  { id: 3, name: "High School Dugroon", address: "789 Oak St", principal: "Mr. Davis", contact: "555-123-4567" },
];

// Dummy Staff Data
const staffData = [
  { id: 1, name: "John Doe", designation: "Teacher", school: "School A", status: "Present" },
  { id: 2, name: "Jane Smith", designation: "Administrator", school: "School B", status: "Absent" },
  { id: 3, name: "Bob Johnson", designation: "Teacher", school: "School C", status: "Present" },
  { id: 4, name: "Alice Brown", designation: "Teacher", school: "School A", status: "Present" },
  { id: 5, name: "Charlie Davis", designation: "Administrator", school: "School C", status: "Absent" },
];

export default function SchoolStatusPage() {
  const modalRef = useRef(null);


  const [selectedSchool, setSelectedSchool] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalType, setModalType] = useState("");

  // Filter Staff Data
  const filteredStaff = staffData.filter(
    (staff) =>
      (selectedSchool === "" || staff.school === selectedSchool) &&
      (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedSchoolInfo = schools.find((s) => s.name === selectedSchool);

  // Open Modal
  const openModal = (type, employee) => {
    setSelectedEmployee(employee);
    setModalType(type);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedEmployee(null);
    setModalType("");
  };

  useOutsideClick(modalRef, closeModal);

  // Handle Transfer Request
  const handleTransferRequest = () => {
    toast.success("Transfer request sent successfully!");
    closeModal();
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">🏫 School Status Dashboard</h1>

      {/* School Selection & Search */}
      <div className="flex space-x-4 mb-6">
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="border rounded-md p-3 w-1/4"
        >
          <option value="">Select a school</option>
          {schools.map((school) => (
            <option key={school.id} value={school.name}>
              {school.name}
            </option>
          ))}
        </select>

        <input
          className="border rounded-md p-3 w-1/3"
          placeholder="Search by name, designation, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* School Information Card */}
      {selectedSchoolInfo && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold">{selectedSchoolInfo.name}</h2>
          <p>📍 Address: {selectedSchoolInfo.address}</p>
          <p>👨‍🏫 Principal: {selectedSchoolInfo.principal}</p>
          <p>📞 Contact: {selectedSchoolInfo.contact}</p>
        </div>
      )}

      {/* Employee Cards */}
      <h2 className="text-2xl font-semibold mb-4">👥 Employee Management</h2>
      <div className="grid grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold">{staff.name}</h3>
            <p>{staff.designation}</p>
            <p>🏫 {staff.school}</p>
            <p className={`text-sm ${staff.status === "Present" ? "text-green-600" : "text-red-600"}`}>
              {staff.status}
            </p>
            <div className="flex justify-between mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openModal("view", staff)}>
                View Details
              </button>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => openModal("edit", staff)}>
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => openModal("transfer", staff)}>
                Transfer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-2">
              {modalType === "view" && "👤 Employee Details"}
              {modalType === "edit" && "✏️ Edit Employee"}
              {modalType === "transfer" && "🔄 Transfer Employee"}
            </h2>
            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
            <p><strong>School:</strong> {selectedEmployee.school}</p>

            {/* Edit Form */}
            {modalType === "edit" && (
              <div>
                <input className="border p-2 w-full mt-2" placeholder="Edit Name" defaultValue={selectedEmployee.name} />
                <button className="bg-green-500 text-white px-4 py-2 mt-3 rounded w-full">Save Changes</button>
              </div>
            )}

            {/* Transfer Form */}
            {modalType === "transfer" && (
              <div>
                <select className="border p-2 w-full mt-2">
                  {schools.map((school) => (
                    <option key={school.id} value={school.name}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <button onClick={handleTransferRequest} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded w-full">
                  Request Transfer
                </button>
              </div>
            )}

            <button className="bg-gray-500 text-white px-4 py-2 mt-3 rounded w-full" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
