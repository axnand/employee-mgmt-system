"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSchool } from "@/api/schoolService";

export default function EditSchoolModal({ school, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    udiseId: "",
    name: "",
    address: "",
    principal: "",
    contact: "",
    isPMShiriSchool: false,
    feasibilityZone: "",
    scheme: "",
    subScheme: "",
    dateOfUpgrade: "",
    dateOfEstablishment: "",
    numberOfStudents: "",
  });

  useEffect(() => {
    if (school) {
      setFormData({
        udiseId: school.udiseId || "",
        name: school.name || "",
        address: school.address || "",
        principal: school.principal || "",
        contact: school.contact || "",
        isPMShiriSchool: school.isPMShiriSchool || false,
        feasibilityZone: school.feasibilityZone || "",
        scheme: school.scheme || "",
        subScheme: school.subScheme || "",
        dateOfUpgrade: school.dateOfUpgrade ? school.dateOfUpgrade.slice(0, 10) : "",
        dateOfEstablishment: school.dateOfEstablishment ? school.dateOfEstablishment.slice(0, 10) : "",
        numberOfStudents: school.numberOfStudents || "",
      });
    }
  }, [school]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return updateSchool(school._id, data); 
    },
    onSuccess: (data) => {  // `data` here is the response returned by the mutationFn
      queryClient.invalidateQueries({ queryKey: ["school", school._id] });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating school:", error);
    },
  });
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data before mutation:", formData);
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg max-h-[30rem]  w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit School Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">UDISe ID</label>
            <input
              type="text"
              name="udiseId"
              value={formData.udiseId}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">School Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Principal</label>
            <input
              type="text"
              name="principal"
              value={formData.principal}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPMShiriSchool"
              checked={formData.isPMShiriSchool}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">PM Shiri School</label>
          </div>
          <div>
            <label className="block text-gray-700">Feasibility Zone</label>
            <input
              type="text"
              name="feasibilityZone"
              value={formData.feasibilityZone}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Scheme</label>
            <input
              type="text"
              name="scheme"
              value={formData.scheme}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Sub Scheme</label>
            <input
              type="text"
              name="subScheme"
              value={formData.subScheme}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date of Upgrade</label>
            <input
              type="date"
              name="dateOfUpgrade"
              value={formData.dateOfUpgrade}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date of Establishment</label>
            <input
              type="date"
              name="dateOfEstablishment"
              value={formData.dateOfEstablishment}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Number of Students</label>
            <input
              type="number"
              name="numberOfStudents"
              value={formData.numberOfStudents}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
