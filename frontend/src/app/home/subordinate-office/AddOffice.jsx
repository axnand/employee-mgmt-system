'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOffice } from "@/api/officeService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewOffice from "./ViewOffice"; // Make sure react-toastify is installed

export default function AddOffice() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const zoneId = user?.zoneId;  
  const districtId = user?.districtId; 
  const [officeId, setOfficeId] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [officeType, setOfficeType] = useState("Administrative");
  const [isDdo, setIsDdo] = useState(false);
  const [ddoOfficer, setDdoOfficer] = useState("");
  const [ddoCode, setDdoCode] = useState("");
  const [parentOffice, setParentOffice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // School fields for Educational office
  const [udiseId, setUdiseId] = useState("");
  const [schoolName, setSchoolName] = useState(""); 
  const [scheme, setScheme] = useState("");
  const [subScheme, setSubScheme] = useState("");
  const [feasibilityZone, setFeasibilityZone] = useState("");

  const [adminUserName, setAdminUserName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: createOffice, // Correct usage in v4
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      toast.success("Office added successfully!");
      setOfficeId("");
      setOfficeName("");
      setOfficeType("Administrative");
      setIsDdo(false);
      setDdoOfficer("");
      setDdoCode("");
      setParentOffice("");
      setUdiseId("");
      setSchoolName("");
      setScheme("");
      setSubScheme("");
      setFeasibilityZone("");
      setAdminUserName("");
      setAdminPassword("");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to create office");
    },
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(password);
  };

  const handleUdiseIdChange = (e) => {
    const value = e.target.value;
    setUdiseId(value);
    if (value) {
      setAdminUserName(`schoolAdmin_${value}`);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!zoneId) {
      setError("Zone ID is missing. Please contact your administrator.");
      return;
    }
    if (!officeId) {
      setError("Office ID is required.");
      return;
    }

    const officeData = {
      officeId,
      officeName,
      officeType,
      zone: zoneId,
      isDdo,
      ddoOfficer: isDdo ? ddoOfficer : undefined,
      ddoCode: isDdo ? ddoCode : undefined,
      parentOffice: parentOffice || undefined,
    };

    if (officeType === "Educational") {
      officeData.schools = [
        {
          udiseId,
          name: schoolName,
          scheme,
          subScheme,
          feasibilityZone,
          adminUserName,    
          adminPassword,
          zone: zoneId ,
        },
      ];
    }

    mutation.mutate(officeData);
  };

  return (
    <div className="flex flex-col items-end">
      <ToastContainer />
      {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-40 text-sm font-normal backdrop-blur-sm flex justify-center items-center z-50">
       <div className="bg-white p-8  shadow-2xl max-w-xl max-h-[90vh] w-full overflow-y-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Office</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <label className="block text-sm font-medium text-gray-700">Office ID</label>
          <input
            type="text"
            value={officeId}
            onChange={(e) => setOfficeId(e.target.value)}
             className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Office Name</label>
          <input
            type="text"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
             className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Office Type</label>
          <select
            value={officeType}
            onChange={(e) => setOfficeType(e.target.value)}
             className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          >
            <option value="Administrative">Administrative</option>
            <option value="Educational">Educational</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isDdo}
            onChange={(e) => setIsDdo(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700">Has DDO</label>
        </div>
        {isDdo && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">DDO Officer ID</label>
              <input
                type="text"
                value={ddoOfficer}
                onChange={(e) => setDdoOfficer(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DDO Code</label>
              <input
                type="text"
                value={ddoCode}
                onChange={(e) => setDdoCode(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Parent Office ID (optional)</label>
          <input
            type="text"
            value={parentOffice}
            onChange={(e) => setParentOffice(e.target.value)}
             className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        {officeType === "Educational" && (
          <div className=" rounded pt-8">
            <h2 className="text-xl font-semibold mb-2">School Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">UDISe ID</label>
              <input
                type="text"
                value={udiseId}
                onChange={handleUdiseIdChange}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Scheme</label>
              <input
                type="text"
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sub Scheme</label>
              <input
                type="text"
                value={subScheme}
                onChange={(e) => setSubScheme(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Feasibility Zone</label>
              <input
                type="text"
                value={feasibilityZone}
                onChange={(e) => setFeasibilityZone(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Username</label>
              <input
                type="text"
                value={adminUserName}
                onChange={(e) => setAdminUserName(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Password</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 transition font-medium text-sm text-nowrap text-white rounded"
                >
                  Generate Password
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-4 pt-4">
        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
          Create Office
        </button>
        <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
        </div>
      </form>
      </div>
      </div>
      )}
      <ViewOffice />
      <button
    onClick={() => setIsModalOpen(true)}
    className=" bg-blue-600 px-4 text-sm mt-10 font-medium  text-white py-2 rounded hover:bg-blue-700 transition "
  >
    Add New Office
  </button>
    </div>
  );
}
