"use client";

import { useState } from "react";
import { School } from "lucide-react";
import { useUser } from "@/context/UserContext";
import districtData from "@/data/data.json";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";

// Flatten schools from all zones, attach zone info, and generate a unique id if needed.
const allSchools = districtData.zones.flatMap((zone, zoneIndex) =>
  zone.schools.map((school, schoolIndex) => ({
    ...school,
    zone: zone.zone,
    id: school.id || `${zoneIndex}-${schoolIndex}`,
  }))
);

export default function SchoolStatusPage() {
  const { userRole } = useUser();
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  // Build options for the filters
  const zoneOptions = [...new Set(allSchools.map((s) => s.zone))];
  const filteredByZone = selectedZone
    ? allSchools.filter((school) => school.zone === selectedZone)
    : allSchools;
  const schemeOptions = [...new Set(filteredByZone.map((school) => school.scheme))];

  // Filter schools based on selected zone and scheme
  const filteredSchools = allSchools.filter((school) => {
    if (selectedZone && school.zone !== selectedZone) return false;
    if (selectedScheme && school.scheme !== selectedScheme) return false;
    return true;
  });

  // Convert school id to string for comparison
  const selectedSchool = allSchools.find(
    (school) => String(school.id) === selectedSchoolId
  );

  // Handlers for filter changes
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

  return (
    <div className="min-h-screen capitalize">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <School className="w-8 h-8 text-primary" /> School Status Dashboard
          </h1>
          <p className="mt-2 font-medium text-gray-600">
            Manage schools and view details
          </p>
        </header>

        {/* Filter Section (including school selector) */}
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
        {selectedSchool && <SchoolDetailsCard schoolInfo={selectedSchool} />}
      </div>
    </div>
  );
}
