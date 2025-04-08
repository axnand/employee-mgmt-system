"use client";

import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const ViewZones = () => {
  const [zonalOffices, setZonalOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchZonalOffices = async () => {
      try {
        const response = await axiosClient.get("/zones");
        setZonalOffices(response.data.zones || []);
        setFilteredOffices(response.data.zones || []);
      } catch (error) {
        toast.error("Error fetching zonal offices");
      }
    };

    fetchZonalOffices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = zonalOffices.filter((office) =>
        office.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffices(filtered);
    } else {
      setFilteredOffices(zonalOffices);
    }
  }, [searchTerm, zonalOffices]);

  const handleViewDetails = (zoneId) => {
    router.push(`/home/subordinate-office/zone?zoneId=${zoneId}`);
};

console.log("filteredOffices:", filteredOffices);

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">View All Zonal Offices</h1>
        <input
          type="text"
          placeholder="Search by Zone Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zonal Office
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOffices.map((zone) => (
              <tr key={zone._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {zone.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {zone.district?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.offices?.length > 0 ? (
                        zone.offices.map((office, index) => (
                        <div key={index}>
                            {office._id === zone.myOffice ? (
                            <span className="font-bold ">
                                {office.officeName || "Office Name Not Available"}
                            </span>
                            ) : (
                            <span>{office.officeName || "Office Name Not Available"}</span>
                            )}
                        </div>
                        ))
                    ) : (
                        "No offices linked"
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleViewDetails(zone._id)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredOffices.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No zonal offices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewZones;
