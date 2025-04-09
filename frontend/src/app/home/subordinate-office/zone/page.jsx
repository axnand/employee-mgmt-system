"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/api/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Building2 } from "lucide-react";

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
  console.log("zoneDetails:", zoneDetails);

  const handleViewOffice = (officeId) => {
    router.push(`/home/office?officeId=${officeId}`);
  };

  

  if (!zoneDetails) return <div className="flex justify-center items-center h-full">
  <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
</div>;

  return (
    <div className="w-full capitalize">
      <ToastContainer />
      <div className="w-full flex items-center gap-3   bg-white border-l-[3px] border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 text-sm">
        <Building2 className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-secondary">Zone Name: {zoneDetails.name}</h1>
      </div>

      <h2 className="text-xl font-bold mb-4">Offices in {zoneDetails.name}</h2>
      <div className="bg-white rounded-lg overflow-x-auto border">
        

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
              <tr key={office._id} className="">
                <td className="px-6 py-4 text-sm text-gray-900">{office.officeName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{office.officeType}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleViewOffice(office._id)}
                    className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition"
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
