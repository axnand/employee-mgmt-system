"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/api/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ZoneDetails = () => {
  const [zoneDetails, setZoneDetails] = useState(null);
  const [offices, setOffices] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
    const zoneId = searchParams.get("zoneId");

  useEffect(() => {
    const fetchZoneDetails = async () => {
      try {
        const response = await axiosClient.get(`/zones/${zoneId}`);
        console.log(response.data);
        setZoneDetails(response.data.zone);
        setOffices(response.data.zone.offices);
      } catch (error) {
        toast.error("Error fetching zone details");
      }
    };

    if (zoneId) fetchZoneDetails();
  }, [zoneId]);

  console.log("offices:", offices);

  const handleViewOffice = (officeId) => {
    router.push(`/home/office?officeId=${officeId}`);
  };

  

  if (!zoneDetails) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Zone Details: {zoneDetails.name}</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Offices in {zoneDetails.name}</h2>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offices?.map((office) => (
              <tr key={office._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-900">{office.officeName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{office.officeType}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleViewOffice(office._id)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZoneDetails;
