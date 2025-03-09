"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchAllSchools = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/schools", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch schools");
  }
  // Assuming the API returns an array of school objects
  return res.json();
};

export default function EmployeeTransferForm({ currentSchoolId, onSubmit, onCancel }) {
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [comment, setComment] = useState("");

  // Fetch all schools from the backend
  const { data: schools, isLoading, error } = useQuery({
    queryKey: ["allSchools"],
    queryFn: fetchAllSchools,
    refetchOnWindowFocus: false,
  });

  // Filter schools based on search input and exclude the current school
  const filteredSchools = schools
    ? schools.filter(
        (sch) =>
          sch._id !== currentSchoolId &&
          sch.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSubmit = () => {
    // Pass both the selected school id and the comment/reason to onSubmit
    onSubmit({ selectedSchool, comment });
  };

  if (isLoading) return <p>Loading schools...</p>;
  if (error) return <p>Error loading schools: {error.message}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Transfer Request</h2>
      <div className="mb-4">
        <label className="font-semibold text-gray-600 block mb-1">Search School</label>
        <input
          type="text"
          placeholder="Type to filter schools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded w-full p-2 text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="font-semibold text-gray-600 block mb-1">Select School</label>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="border border-gray-300 rounded w-full p-2 text-sm"
        >
          <option value="">-- Choose a school --</option>
          {filteredSchools.map((sch) => (
            <option key={sch._id} value={sch._id}>
              {sch.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="font-semibold text-gray-600 block mb-1">Comment / Reason</label>
        <textarea
          placeholder="Enter reason for transfer..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border border-gray-300 rounded w-full p-2 text-sm"
        ></textarea>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!selectedSchool}
          className="font-semibold text-[13px] px-4 py-2 bg-red-500 text-white rounded transition hover:bg-red-600 disabled:opacity-50"
        >
          Submit Transfer
        </button>
        <button
          onClick={onCancel}
          className="font-semibold text-[13px] px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
