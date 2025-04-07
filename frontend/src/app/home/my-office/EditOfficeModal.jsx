"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditOfficeModal({ office, isOpen, onClose, onOfficeUpdate }) {
  // Set initial office data and, if applicable, the first school from the office.schools array
  const [officeData, setOfficeData] = useState(office || {});
  const [schoolDetails, setSchoolDetails] = useState(
    office?.officeType === "Educational" && office.schools?.length > 0
      ? office.schools[0]
      : {}
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (office) {
      setOfficeData(office);
      if (office.officeType === "Educational" && office.schools?.length > 0) {
        setSchoolDetails(office.schools[0]);
      } else {
        setSchoolDetails({});
      }
    }
  }, [office]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setOfficeData({ ...officeData, [name]: val });
  };

  const handleSchoolChange = (e) => {
    const { name, value } = e.target;
    setSchoolDetails({ ...schoolDetails, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      // Prepare the payload: for Educational offices, include school details
      const payload =
        officeData.officeType === "Educational"
          ? { ...officeData, schools: [schoolDetails] }
          : officeData;

      const response = await fetch(`http://localhost:5000/api/offices/${office._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Office details updated successfully!");
        onOfficeUpdate(data.office);
        onClose();
      } else {
        toast.error(data.message || "Error updating office details");
      }
    } catch (error) {
      toast.error("Error updating office details");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-lg max-w-lg max-h-[30rem]  w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Office Details</h2>
        <div className="space-y-4">
          {/* Office Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Office ID</label>
            <input
              type="text"
              name="officeId"
              value={officeData.officeId || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Office Name</label>
            <input
              type="text"
              name="officeName"
              value={officeData.officeName || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Office Type</label>
            <select
              name="officeType"
              value={officeData.officeType || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value="Administrative">Administrative</option>
              <option value="Educational">Educational</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDdo"
              checked={officeData.isDdo || false}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-gray-700">Has DDO Officer</label>
          </div>

          {officeData.isDdo && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">DDO Officer ID</label>
                <input
                  type="text"
                  name="ddoOfficer"
                  value={officeData.ddoOfficer || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DDO Code</label>
                <input
                  type="text"
                  name="ddoCode"
                  value={officeData.ddoCode || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Office ID (optional)</label>
            <input
              type="text"
              name="parentOffice"
              value={officeData.parentOffice || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </div>

          {/* School Details Section for Educational Offices */}
          {officeData.officeType === "Educational" && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-2">School Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">School Name</label>
                <input
                  type="text"
                  name="name"
                  value={schoolDetails.name || ""}
                  onChange={handleSchoolChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">UDISe ID</label>
                <input
                  type="text"
                  name="udiseId"
                  value={schoolDetails.udiseId || ""}
                  onChange={handleSchoolChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Feasibility Zone</label>
                <input
                  type="text"
                  name="feasibilityZone"
                  value={schoolDetails.feasibilityZone || ""}
                  onChange={handleSchoolChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Admin Username</label>
                <input
                  type="text"
                  name="adminUserName"
                  value={schoolDetails.adminUserName || ""}
                  onChange={handleSchoolChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Admin Password</label>
                <input
                  type="text"
                  name="adminPassword"
                  value={schoolDetails.adminPassword || ""}
                  onChange={handleSchoolChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
