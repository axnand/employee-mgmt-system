"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";
import { getAllSchools, getSchoolById, getMySchool } from "@/api/schoolService";

export default function SchoolStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get user info from context
  const { userRole, user } = useUser();
  const contextSchoolId = user?.schoolId;

  // Determine role flags
  const isAdmin = userRole === "admin";
  const isSchoolAdmin = userRole === "schoolAdmin";
  const isAuthorized = isAdmin || isSchoolAdmin;

  // State Hooks – always called in the same order
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  // Only admin fetches the full school list
  const {
    data: schoolsData = [],
    isLoading: isLoadingSchools,
    error: schoolsError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
    staleTime: 1000 * 60 * 5,
    enabled: isAdmin, // only admin fetches all schools
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
    if (isAdmin) {
      if (schoolParam) {
        setSelectedSchoolId(schoolParam);
      }
    } else if (isSchoolAdmin && contextSchoolId) {
      setSelectedSchoolId(contextSchoolId);
    }
  }, [searchParams, isAdmin, isSchoolAdmin, contextSchoolId, router]);

  // If user is not authorized, display an unauthorized message.
  if (!isAuthorized) {
    return (
      <div className="h-full w-full flex justify-center items-center font-bold text-xl text-secondary">
        Unauthorized Access
      </div>
    );
  }

  // Process school list for admin users
  const allSchools = schoolsData.map((school) => ({
    ...school,
    id: school._id,
    zone: school.zone?.name ?? school.zone,
  }));

  // Build filter options (admin only)
  const zoneOptions = [...new Set(allSchools.map((s) => s.zone))];
  const filteredByZone = selectedZone
    ? allSchools.filter((school) => school.zone === selectedZone)
    : allSchools;
  const schemeOptions = [...new Set(filteredByZone.map((s) => s.scheme))];

  // Final filtered school list for dropdown (admin only)
  const filteredSchools = allSchools.filter((school) => {
    if (selectedZone && school.zone !== selectedZone) return false;
    if (selectedScheme && school.scheme !== selectedScheme) return false;
    return true;
  });

  // Handlers for admin filtering
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

  // For admin: show loading or error if fetching schools
  if (isAdmin && isLoadingSchools) {
    return <p className="text-center">Loading schools...</p>;
  }
  if (isAdmin && schoolsError) {
    return <p className="text-center text-red-500">Error loading schools</p>;
  }

  return (
    <div className="min-h-screen capitalize">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            School Status Dashboard
          </h1>
          <p className="mt-2 font-medium text-gray-600">
            Manage schools and view details
          </p>
        </header>

        {/* Render filter controls only for admin */}
        {isAdmin && (
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

        {/* Render school details if a school is selected */}
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
