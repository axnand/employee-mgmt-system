"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOffice } from "@/api/officeService";


export default function AddOfficePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const zoneId = user?.zoneId;  

  const [officeName, setOfficeName] = useState("");
  const [officeType, setOfficeType] = useState("Administrative");
  const [isDdo, setIsDdo] = useState(false);
  const [ddoOfficer, setDdoOfficer] = useState("");
  const [ddoCode, setDdoCode] = useState("");
  const [parentOffice, setParentOffice] = useState("");

  // School fields for Educational office
  const [udiseId, setUdiseId] = useState("");
  const [schoolName, setSchoolName] = useState(""); 
  const [scheme, setScheme] = useState("");
  const [subScheme, setSubScheme] = useState("");
  const [feasibilityZone, setFeasibilityZone] = useState("");

  const [adminUserName, setAdminUserName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createOffice, // Correct usage in v4
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
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

    const officeData = {
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
        },
      ];
    }

    mutation.mutate(officeData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Office</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">
        <div>
          <label className="block text-gray-700">Office Name</label>
          <input
            type="text"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Office Type</label>
          <select
            value={officeType}
            onChange={(e) => setOfficeType(e.target.value)}
            className="w-full border rounded p-2"
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
          <label className="text-gray-700">Has DDO Officer</label>
        </div>
        {isDdo && (
          <>
            <div>
              <label className="block text-gray-700">DDO Officer ID</label>
              <input
                type="text"
                value={ddoOfficer}
                onChange={(e) => setDdoOfficer(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">DDO Code</label>
              <input
                type="text"
                value={ddoCode}
                onChange={(e) => setDdoCode(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-gray-700">Parent Office ID (optional)</label>
          <input
            type="text"
            value={parentOffice}
            onChange={(e) => setParentOffice(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        {officeType === "Educational" && (
          <div className="border p-4 rounded mt-4">
            <h2 className="text-xl font-semibold mb-2">School Details</h2>
            <div>
              <label className="block text-gray-700">UDISe ID</label>
              <input
                type="text"
                value={udiseId}
                onChange={handleUdiseIdChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Scheme</label>
              <input
                type="text"
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Sub Scheme</label>
              <input
                type="text"
                value={subScheme}
                onChange={(e) => setSubScheme(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Feasibility Zone</label>
              <input
                type="text"
                value={feasibilityZone}
                onChange={(e) => setFeasibilityZone(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Admin Username</label>
              <input
                type="text"
                value={adminUserName}
                onChange={(e) => setAdminUserName(e.target.value)} // Allow changing username
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Admin Password</label>
              <div className="flex">
                <input
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  Generate Password
                </button>
              </div>
            </div>
          </div>
        )}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
          Create Office
        </button>
      </form>
    </div>
  );
}
