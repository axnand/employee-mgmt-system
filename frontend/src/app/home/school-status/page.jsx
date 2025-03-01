"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";
import { getAllSchools, getSchoolById } from "@/api/schoolService";

export default function SchoolStatusPage() {
  const { userRole } = useUser();
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  // Fetch all schools (list view) with a 5-minute stale time.
  const { data: schoolsData = [], isLoading, error } = useQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
    staleTime: 1000 * 60 * 5,
  });

  // Map schoolsData so each school has a unique id (using _id) and normalized zone.
  const allSchools = schoolsData.map((school) => ({
    ...school,
    id: school._id,
    zone: school.zone && school.zone.name ? school.zone.name : school.zone,
  }));

  console.log("All Schools Data:", allSchools);

  // Build filter options.
  const zoneOptions = [...new Set(allSchools.map((s) => s.zone))];
  const filteredByZone = selectedZone
    ? allSchools.filter((school) => school.zone === selectedZone)
    : allSchools;
  const schemeOptions = [...new Set(filteredByZone.map((school) => school.scheme))];

  // Filter schools based on the selected zone and scheme.
  const filteredSchools = allSchools.filter((school) => {
    if (selectedZone && school.zone !== selectedZone) return false;
    if (selectedScheme && school.scheme !== selectedScheme) return false;
    return true;
  });

  // When a school is selected, fetch its detailed data (including fresh employee data).
  // The query is enabled only if selectedSchoolId is not empty.
  const { data: selectedSchoolData, isLoading: isSchoolLoading, error: schoolError } = useQuery({
    queryKey: ["school", selectedSchoolId],
    queryFn: () => getSchoolById(selectedSchoolId),
    enabled: !!selectedSchoolId,
  });

  // Handlers for filter changes.
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
    setSelectedSchoolId(e.target.value);
  };

  if (userRole !== "admin") {
    return (
      <div className="h-full w-full flex justify-center items-center font-bold text-xl text-secondary">
        Unauthorized Access
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-center">Loading schools...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error loading schools</p>;
  }

  return (
    <div className="min-h-screen capitalize">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            School Status Dashboard
          </h1>
          <p className="mt-2 font-medium text-gray-600">
            Manage schools and view details
          </p>
        </header>

        {/* Filter Section */}
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

        {/* Render the School Details Card when a school is selected */}
        {selectedSchoolId && isSchoolLoading && (
          <p className="text-center">Loading school details...</p>
        )}
        {selectedSchoolId && schoolError && (
          <p className="text-center text-red-500">Error loading school details</p>
        )}
        {selectedSchoolData && <SchoolDetailsCard schoolInfo={selectedSchoolData} />}
      </div>
    </div>
  );
}
