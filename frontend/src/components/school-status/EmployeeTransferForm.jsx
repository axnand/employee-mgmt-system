import { useState } from "react";

export default function EmployeeTransferForm({ schools, onSubmit, onCancel }) {
    const [search, setSearch] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
  
    const filteredSchools = schools.filter((sch) =>
      sch.name.toLowerCase().includes(search.toLowerCase())
    );
  
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
              <option key={sch.id} value={sch.id}>
                {sch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(selectedSchool)}
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
  