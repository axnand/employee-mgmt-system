"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";
import { getAllSchools, getSchoolById, getMySchool } from "@/api/schoolService";
import axiosClient from "@/api/axiosClient"; // Make sure your axiosClient is correctly configured

function SchoolStatusPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { userRole, user } = useUser();
  const contextSchoolId = user?.schoolId;
  const userDistrictId = user?.districtId; // ✅ Get districtId from useUser
  
  console.log("user:", user);

  // Determine role flags
  const isCEO = userRole === "CEO";
  const isSchoolAdmin = userRole === "schoolAdmin";
  const isAuthorized = isCEO || isSchoolAdmin;

  // State Hooks – always called in the same order
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [zoneOptions, setZoneOptions] = useState([]);

  // ✅ Fetch zones based on districtId
  useEffect(() => {
    const fetchZones = async () => {
      try {
        if (!userDistrictId) return; // Skip fetching if no districtId is available

        const response = await axiosClient.get(`/zones?district=${userDistrictId}`);
        const zones = response.data.zones || [];
        setZoneOptions(zones.map(zone => zone.name));
      } catch (error) {
        console.error("Error fetching zones:", error.message);
      }
    };

    fetchZones();
  }, [userDistrictId]);

  // Only admin fetches the full school list
  const {
    data: schoolsData = [],
    isLoading: isLoadingSchools,
    error: schoolsError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
    staleTime: 1000 * 60 * 5,
    enabled: isCEO, // only admin fetches all schools
  });

  // For schoolAdmin, use getMySchool; for admin, use getSchoolById.
  const {
    data: selectedSchoolData,
    isLoading: isLoadingSchool,
    error: schoolError,
  } = useQuery({
    queryKey: isSchoolAdmin ? ["mySchool"] : ["school", selectedSchoolId],
    queryFn: isSchoolAdmin ? getMySchool : () => getSchoolById(selectedSchoolId),
    enabled: isSchoolAdmin ? true : !!selectedSchoolId,
  });

  // useEffect: For admin, read from URL; for schoolAdmin, use contextSchoolId.
  useEffect(() => {
    const schoolParam = searchParams.get("school");
    if (isCEO) {
      if (schoolParam) {
        setSelectedSchoolId(schoolParam);
      }
    } else if (isSchoolAdmin && contextSchoolId) {
      setSelectedSchoolId(contextSchoolId);
    }
  }, [searchParams, isCEO, isSchoolAdmin, contextSchoolId, router]);

  if (!isAuthorized) {
    return (
      <div className="h-full w-full flex justify-center items-center font-bold text-xl text-secondary">
        Unauthorized Access
      </div>
    );
  }

  const allSchools = schoolsData.map((school) => ({
    ...school,
    id: school._id,
    zone: school.zone?.name ?? school.zone,
  }));

  const filteredByZone = selectedZone
    ? allSchools.filter((school) => school.zone === selectedZone)
    : allSchools;

  const schemeOptions = [...new Set(filteredByZone.map((s) => s.scheme))];

  const filteredSchools = allSchools.filter((school) => {
    if (selectedZone && school.zone !== selectedZone) return false;
    if (selectedScheme && school.scheme !== selectedScheme) return false;
    return true;
  });

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

  if (isCEO && isLoadingSchools) {
    return <p className="text-center">Loading schools...</p>;
  }
  if (isCEO && schoolsError) {
    return <p className="text-center text-red-500">Error loading schools</p>;
  }

  return (
    <div className="min-h-screen capitalize">
      <div className="">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            School Status Dashboard
          </h1>
          <p className="mt-2 font-medium text-gray-600">
            Manage schools and view details
          </p>
        </header>

        {isCEO && (
          <SchoolFilter
            zoneOptions={zoneOptions}
            schemeOptions={schemeOptions}
            selectedZone={selectedZone}
            selectedScheme={selectedScheme}
            onZoneChange={handleZoneChange}
            onSchemeChange={handleSchemeChange}
            schools={filteredSchools}
            selectedSchool={selectedSchoolId}
            onSchoolChange={handleSchoolChange}
          />
        )}

        {selectedSchoolId && isLoadingSchool && (
          <p className="text-center">Loading school details...</p>
        )}
        {selectedSchoolId && schoolError && (
          <p className="text-center text-red-500">Error loading school details</p>
        )}
        {selectedSchoolData && (
          <SchoolDetailsCard schoolInfo={selectedSchoolData} />
        )}
      </div>
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
