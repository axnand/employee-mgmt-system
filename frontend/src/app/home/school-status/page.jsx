"use client";
import { use, useState } from "react";
import Link from "next/link";
import { School } from "lucide-react";
import districtData from "@/data/data.json";
import { useUser } from "@/context/UserContext";

// Flatten schools from all zones, attach zone info, and generate a unique id if needed.
const allSchools = districtData.zones.flatMap((zone, zoneIndex) =>
  zone.schools.map((school, schoolIndex) => ({
    ...school,
    zone: zone.zone,
    id: school.id || `${zoneIndex}-${schoolIndex}`
  }))
);

export default function SchoolStatusPage() {
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedSubScheme, setSelectedSubScheme] = useState("");
  const [filteredSchools, setFilteredSchools] = useState(allSchools);

  const { user, userRole } = useUser();

  // Unique zone options
  const zoneOptions = [...new Set(allSchools.map((s) => s.zone))];

  // Scheme options based on selected zone
  const filteredByZone = selectedZone
    ? allSchools.filter((school) => school.zone === selectedZone)
    : allSchools;
  const schemeOptions = [...new Set(filteredByZone.map((school) => school.scheme))];

  // Sub-scheme options based on selected zone and scheme
  const filteredByZoneAndScheme = selectedScheme
    ? filteredByZone.filter((school) => school.scheme === selectedScheme)
    : filteredByZone;
  const subSchemeOptions = [
    ...new Set(filteredByZoneAndScheme.map((school) => school.sub_scheme))
  ];

  const handleFilter = () => {
    const filtered = allSchools.filter((school) => {
      if (selectedZone && school.zone !== selectedZone) return false;
      if (selectedScheme && school.scheme !== selectedScheme) return false;
      if (selectedSubScheme && school.sub_scheme !== selectedSubScheme) return false;
      return true;
    });
    setFilteredSchools(filtered);
  };

  return (
    <>
    {userRole === "admin" ? (<div className="min-h-screen capitalize">
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

        {/* School Filtering Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-2 border-primary">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
            {/* Zone Filter */}
            <div className="flex-1 mb-4 md:mb-0">
              <label
                htmlFor="zoneSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Zone
              </label>
              <select
                id="zoneSelect"
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  // Reset scheme and sub-scheme when zone changes
                  setSelectedScheme("");
                  setSelectedSubScheme("");
                }}
                className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
              >
                <option value="">All Zones</option>
                {zoneOptions.map((zone, idx) => (
                  <option key={idx} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
            {/* Scheme Filter */}
            <div className="flex-1 mb-4 md:mb-0">
              <label
                htmlFor="schemeSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Type
              </label>
              <select
                id="schemeSelect"
                value={selectedScheme}
                onChange={(e) => {
                  setSelectedScheme(e.target.value);
                  // Reset sub-scheme when scheme changes
                  setSelectedSubScheme("");
                }}
                className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
              >
                <option value="">All Schemes</option>
                {schemeOptions.map((scheme, idx) => (
                  <option key={idx} value={scheme}>
                    {scheme}
                  </option>
                ))}
              </select>
            </div>
            {/* Sub Scheme Filter */}
            {/* <div className="flex-1 mb-4 md:mb-0">
              <label
                htmlFor="subSchemeSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Sub Scheme
              </label>
              <select
                id="subSchemeSelect"
                value={selectedSubScheme}
                onChange={(e) => setSelectedSubScheme(e.target.value)}
                className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
              >
                <option value="">All Sub Schemes</option>
                {subSchemeOptions.map((subScheme, idx) => (
                  <option key={idx} value={subScheme}>
                    {subScheme}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="flex-1 px-10">
              <button
                onClick={handleFilter}
                className="w-1/2 py-2 px-4 bg-blue-500 font-medium text-[13px] rounded-full text-white hover:bg-blue-600 transition"
              >
                Filter Schools
              </button>
            </div>
          </div>
        </div>

        {/* School Table with Horizontal Scroll */}
        <div className="bg-white rounded-lg overflow-x-auto border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  School Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Principal
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sub Scheme
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.principal}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.contact}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.scheme}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.sub_scheme}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/home/school-status/${school.id}`}>
                      <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No schools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>):
    <div className="h-full w-full flex justify-center items-center font-bold text-xl text-secondary">Unauthorized Access</div>
    }
    </>
  );
}
