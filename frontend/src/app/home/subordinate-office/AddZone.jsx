"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/api/axiosClient";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewZones from "./ViewZones";

const AddZone = () => {
  const router = useRouter();
  const { user } = useUser();
  const districtId = user?.districtId;
  
  // Zone fields
  const [zoneName, setZoneName] = useState("");
  
  // ZEO credentials (auto-generated when zone name is entered)
  const [zeoUserName, setZeoUserName] = useState("");
  const [zeoPassword, setZeoPassword] = useState("");
  
  // Zonal Office fields
  const [zonalOfficeId, setZonalOfficeId] = useState("");
  const [zonalOfficeName, setZonalOfficeName] = useState("");
  const [zonalOfficeType, setZonalOfficeType] = useState("Administrative");
  const [officeContact, setOfficeContact] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Generate a random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // When zone name changes, auto-generate ZEO username and password
  useEffect(() => {
    if (zoneName) {
      const formattedName = zoneName.trim().toLowerCase().replace(/\s+/g, '_');
      setZeoUserName(`zeo_${formattedName}`);
      setZeoPassword(generatePassword());
      setZonalOfficeName(`Zonal Office - ${zoneName}`);
      
    }
  }, [zoneName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!zoneName) {
      setError("Zone name is required.");
      return;
    }
    if (!districtId) {
      setError("Your district information is missing. Please contact the administrator.");
      return;
    }
    if (!zeoUserName || !zeoPassword) {
      setError("ZEO Username and Password are required.");
      return;
    }
    if (!zonalOfficeId || !zonalOfficeName) {
      setError("Zonal Office ID and Name are required.");
      return;
    }
    if (!zoneName || !zonalOfficeId || !zonalOfficeName) {
        setError("All fields are required.");
        return;
      }

    // Prepare payload: include both zone details and zonal office details.
    const payload = {
      name: zoneName,
      district: districtId,
      zeoUserName,
      zeoPassword,
      zonalOffice: {
        officeId: zonalOfficeId,
        officeName: zonalOfficeName,
        officeType: zonalOfficeType,
        contact: officeContact,
        address: officeAddress,
      }
    };

    try {
      const response = await axiosClient.post("/zones", payload);
      if (response.status === 201) {
        setSuccess("Zone and ZEO user created successfully!");
        toast.success("Zone and ZEO user created successfully!");
        setZoneName("");
        setZeoUserName("");
        setZeoPassword("");
        setZonalOfficeId("");
        setZonalOfficeName("");
        setZonalOfficeName("");
        setOfficeContact("");
        setOfficeAddress("");
      }
    } catch (error) {
      console.error("Error creating zone:", error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          "Failed to create zone. Make sure the zone name is unique within the district."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Add New Zone
        </h1>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Zone Name</label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter zone name"
              required
            />
          </div>

          {/* ZEO Credentials */}
          <div>
            <label className="block text-gray-700">ZEO Username</label>
            <input
              type="text"
              value={zeoUserName}
              onChange={(e) => setZeoUserName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">ZEO Password</label>
            <input
              type="text"
              value={zeoPassword}
              onChange={(e) => setZeoPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Zonal Office Details */}
          <div className="border p-4 rounded mt-4">
            <h2 className="text-xl font-semibold mb-2">Zonal Office Details</h2>
            <div>
              <label className="block text-gray-700">Office ID</label>
              <input
                type="text"
                value={zonalOfficeId}
                onChange={(e) => setZonalOfficeId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter zonal office ID"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Office Name</label>
              <input
                type="text"
                value={zonalOfficeName}
                onChange={(e) => setZonalOfficeName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter zonal office name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Contact</label>
              <input
                type="text"
                value={officeContact}
                onChange={(e) => setOfficeContact(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter office contact number"
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter office address"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Zone
          </button>
        </form>
      </div>
      <ViewZones/>
    </div>
  );
};

export default AddZone;
