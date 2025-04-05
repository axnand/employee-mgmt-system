"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";
import { getAllSchools, getSchoolById, getMySchool } from "@/api/schoolService";
import axiosClient from "@/api/axiosClient";

function SchoolStatusPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRole, user } = useUser();
  const contextSchoolId = user?.schoolId;
  const userDistrictId = user?.districtId;
  const userZoneId = user?.zoneId;
  const isCEO = userRole === "CEO";
  const isSchoolAdmin = userRole === "schoolAdmin";
  const isZEO = userRole === "ZEO";
  const isAuthorized = isCEO || isSchoolAdmin || isZEO;
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [searchSchoolName, setSearchSchoolName] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [zoneOptions, setZoneOptions] = useState([]);

  // Fetch zones for CEO only, based on district
  useEffect(() => {
    const fetchZones = async () => {
      try {
        if (!userDistrictId) return;
        const response = await axiosClient.get(`/zones?district=${userDistrictId}`);
        const zones = response.data.zones || [];
        setZoneOptions(zones.map(zone => ({ id: zone._id, name: zone.name })));
      } catch (error) {
        console.error("Error fetching zones:", error.message);
      }
    };
    if (isCEO) fetchZones();
  }, [userDistrictId, isCEO]);

  // Fetch schools based on role
  const {
    data: schoolsData = [],
    isLoading: isLoadingSchools,
    error: schoolsError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
    staleTime: 1000 * 60 * 5,
    enabled: isCEO || isZEO,
  });

  console.log("Schools data:", schoolsData);

  const {
    data: selectedSchoolData,
    isLoading: isLoadingSchool,
    error: schoolError,
  } = useQuery({
    queryKey: isSchoolAdmin ? ["mySchool"] : ["school", selectedSchoolId],
    queryFn: isSchoolAdmin ? getMySchool : () => getSchoolById(selectedSchoolId),
    enabled: isSchoolAdmin ? true : !!selectedSchoolId,
  });

  // Set school selection from URL or context
  useEffect(() => {
    const schoolParam = searchParams.get("school");
    const urlSchoolId = router.query?.schoolId || searchParams.get("school"); // Read schoolId from URL params

    if ( urlSchoolId) {
      setSelectedSchoolId(urlSchoolId); // If URL has schoolId, set it
    } else if (isSchoolAdmin && contextSchoolId) {
      setSelectedSchoolId(contextSchoolId);
    }
  }, [searchParams, isSchoolAdmin, contextSchoolId, router]);

  if (!isAuthorized) {
    return (
      <div className="h-full w-full flex justify-center items-center font-bold text-xl text-secondary">
        Unauthorized Access
      </div>
    );
  }

 
  let allSchools = Array.isArray(schoolsData)
  ? schoolsData.map((school) => ({
      ...school,
      id: school._id,
      zoneId: school.zone?._id,
    }))
  : [];

  console.log("All Schools:", allSchools);



  // For ZEO, filter by user's zone
  if (isZEO && userZoneId) {
    allSchools = allSchools.filter(
      school => school.zoneId?.toString() === userZoneId.toString()
    );
  }

  console.log("Filtered Schools:", allSchools);
  // Create filteredSchools based on search term. If searchSchoolName is empty, show all schools.
  const filteredSchools = searchSchoolName
    ? allSchools.filter(school =>
        school.name.toLowerCase().includes(searchSchoolName.toLowerCase())
      )
    : allSchools;

  // For CEO: filter by zone and scheme if selected
  let displayedSchools = filteredSchools;
  if (isCEO) {
    if (selectedZone) {
      displayedSchools = displayedSchools.filter(school => school.zoneName === selectedZone);
    }
    if (selectedScheme) {
      displayedSchools = displayedSchools.filter(school => school.scheme === selectedScheme);
    }
  }

  const schemeOptions = [...new Set(displayedSchools.map(s => s.scheme).filter(Boolean))];

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
    setSelectedScheme("");
    setSelectedSchoolId("");
  };

  const handleSchemeChange = (e) => {
    setSelectedScheme(e.target.value);
    setSelectedSchoolId("");
  };

  const handleSchoolChange = (e) => {
    const newSchoolId = e.target.value;
    setSelectedSchoolId(newSchoolId);
    router.push(`/home/school-status?school=${newSchoolId}`);
  };

  return (
    <div className="min-h-screen capitalize p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          School Status Dashboard
        </h1>
        <p className="mt-2 font-medium text-gray-600">
          Manage schools and view details
        </p>
      </header>

      {/* Filters for CEO */}
      {isCEO && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <select
              value={selectedZone}
              onChange={handleZoneChange}
              className="border p-2 rounded w-full md:w-auto"
            >
              <option value="">All Zones</option>
              {zoneOptions.map(zone => (
                <option key={zone.id} value={zone.name}>
                  {zone.name}
                </option>
              ))}
            </select>
            <select
              value={selectedScheme}
              onChange={handleSchemeChange}
              className="border p-2 rounded w-full md:w-auto"
            >
              <option value="">All Schemes</option>
              {schemeOptions.map((scheme, index) => (
                <option key={index} value={scheme}>
                  {scheme}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedSchoolId}
            onChange={handleSchoolChange}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">Select a School</option>
            {displayedSchools.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filters for ZEO */}
      {isZEO && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search school by name..."
            value={searchSchoolName}
            onChange={(e) => setSearchSchoolName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
          <select
            value={selectedSchoolId}
            onChange={handleSchoolChange}
            className="border p-2 rounded w-full md:w-1/2 mt-4 md:mt-0"
          >
            <option value="">Select a School</option>
            {filteredSchools.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSchoolId && (
        <>
          {isLoadingSchool && <p className="text-center">Loading school details...</p>}
          {schoolError && <p className="text-center text-red-500">Error: {schoolError.message}</p>}
          {selectedSchoolData && <SchoolDetailsCard schoolInfo={selectedSchoolData} />}
        </>
      )}
    </div>
  );
}

export default function SchoolStatusPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <SchoolStatusPageContent />
    </Suspense>
  );
}
