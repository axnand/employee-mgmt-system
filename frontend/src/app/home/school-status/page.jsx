"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/api/axiosClient";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";
import { toast } from "react-toastify";

function SchoolStatusPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRole, user } = useUser();

  const userDistrictId = user?.districtId;
  const userZoneId = user?.zoneId;
  const userOfficeId = user?.officeId;

  const userRoleIsCEO = userRole === "CEO";
  const userRoleIsZEO = userRole === "ZEO";
  const userRoleIsSchoolAdmin = userRole === "schoolAdmin";

  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedZone, setSelectedZone] = useState(""); 
  const [selectedScheme, setSelectedScheme] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optionally: state for zone & scheme options (for CEO)
  const [zoneOptions, setZoneOptions] = useState([]);
  const [schemeOptions, setSchemeOptions] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
    
        if (userRoleIsSchoolAdmin && userOfficeId) {
          const response = await axiosClient.get(`/schools/office/${userOfficeId}`);
          if (response?.data?.length > 0) {
            const school = response.data[0];
            setSelectedSchool(school);
            setFilteredSchools([school]);
            setSchools([school]);
            setError(null);
          } else {
            setError("No schools found for School Admin.");
          }
          setIsLoading(false);
          return; // ✅ Prevents falling into the block below
        }
    
        if (userRoleIsCEO && userDistrictId) {
          const response = await axiosClient.get(`/schools/district/${userDistrictId}`);
          const zonesResponse = await axiosClient.get(`/zones?district=${userDistrictId}`);
          if (zonesResponse.data?.zones) {
            setZoneOptions(zonesResponse.data.zones);
          }
          if (response?.data?.length > 0) {
            setSchools(response.data);
            setFilteredSchools(response.data);
            const schemes = response.data.map(s => s.scheme).filter(Boolean);
            setSchemeOptions([...new Set(schemes)]);
            setError(null);
          } else {
            setError("No schools found in this district.");
          }
          setIsLoading(false);
          return;
        }
    
        if (userRoleIsZEO && userZoneId) {
          const response = await axiosClient.get(`/schools/zone/${userZoneId}`);
          if (response?.data?.length > 0) {
            setSchools(response.data);
            setFilteredSchools(response.data);
            const schemes = response.data.map(s => s.scheme).filter(Boolean);
            setSchemeOptions([...new Set(schemes)]);
            setError(null);
          } else {
            setError("No schools found in this zone.");
          }
          setIsLoading(false);
          return;
        }
    
        // Just in case no conditions match
        setError("Unable to determine role or missing zone/district ID.");
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || "Failed to fetch schools.";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchSchools();
  }, [userRole, userDistrictId, userZoneId, userOfficeId]);

  console.log("filteredSchools:", filteredSchools);

  const handleFilter = (filteredList) => {
    setFilteredSchools(filteredList);
  };

  const handleZoneChange = (event) => {
    const zone = event.target.value;
    setSelectedZone(zone);

    const filtered = schools.filter(school => 
      !zone || (school.zone?.name === zone)
    );
    setFilteredSchools(filtered);
  };

  const handleSchemeChange = (event) => {
    const scheme = event.target.value;
    setSelectedScheme(scheme);

    const filtered = schools.filter(school => 
      !scheme || school.scheme === scheme
    );
    setFilteredSchools(filtered);
  };


  const handleSchoolSelect = async (event) => {
    const schoolId = event.target.value;
    const selectedSchoolObject = filteredSchools.find(school => school._id === schoolId);
    setSelectedSchool(selectedSchoolObject);
    router.push(`/home/school-status?school=${schoolId}`);
  };

  if (isLoading) return <div className="flex justify-center items-center h-full">
  <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">School Status Dashboard</h1>
        <p className="mt-2 font-medium text-gray-600">Manage and view school details</p>
      </header>

{user?.role !== "schoolAdmin"  &&
     <SchoolFilter
        schools={filteredSchools}
        onFilter={handleFilter}
        onSchoolSelect={handleSchoolSelect}
        zoneOptions={zoneOptions}
        schemeOptions={schemeOptions}
        selectedZone={selectedZone} 
        selectedScheme={selectedScheme}
        selectedSchool={selectedSchool}
        onZoneChange={handleZoneChange}
        onSchemeChange={handleSchemeChange}
        onSchoolChange={handleSchoolSelect}
      />}

      {selectedSchool && (
        <SchoolDetailsCard schoolInfo={selectedSchool}  />
      )}
    </div>
  );
}

export default function SchoolStatusPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full">
      <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
    </div>}>
      <SchoolStatusPageContent />
    </Suspense>
  );
}
