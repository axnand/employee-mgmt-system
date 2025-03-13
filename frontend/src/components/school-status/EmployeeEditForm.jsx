import { useState, useEffect } from "react";

export default function EmployeeEditForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      {Object.keys(initialData || {}).map((key) => {
        if (key === "_id") return null; // Skip _id field

        // Hide Specialization Subject if qualification is 10th or 12th
        if (key === "specializationSubject" && ["10th", "12th"].includes(formData.highestQualification)) {
          return null;
        }

        return (
          <div key={key}>
            <label className="font-semibold text-gray-600 block mb-1">
              {key.replace(/([A-Z])/g, " $1").trim().toUpperCase()}
            </label>
            <input
              type={
                key.includes("date")
                  ? "date"
                  : key.includes("id") || key.includes("salary") || key.includes("pay")
                  ? "number"
                  : "text"
              }
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
        );
      })}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => onSave(formData)}
          className="font-semibold text-[13px] px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
