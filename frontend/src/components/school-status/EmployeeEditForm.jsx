export default function EmployeeEditForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState(initialData);
  
    // Render fields similar to your edit UI
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* UDISE Code */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            UDISE Code
          </label>
          <input
            type="text"
            value={formData.udise_code || ""}
            onChange={(e) =>
              setFormData({ ...formData, udise_code: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Name of Sanctioned Posts */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Name of Sanctioned Posts
          </label>
          <input
            type="text"
            value={formData.name_of_sanctioned_posts || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                name_of_sanctioned_posts: e.target.value,
              })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Employee Name */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Employee Name
          </label>
          <input
            type="text"
            value={formData.emp_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, emp_name: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Employee ID */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Employee ID
          </label>
          <input
            type="number"
            value={formData.emp_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, emp_id: Number(e.target.value) })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Date of Birth */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.date_of_birth || ""}
            onChange={(e) =>
              setFormData({ ...formData, date_of_birth: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Date of First Appointment */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Date of First Appointment
          </label>
          <input
            type="date"
            value={formData.date_of_first_appointment || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                date_of_first_appointment: e.target.value,
              })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Designation at First Appointment */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Designation at First Appointment
          </label>
          <input
            type="text"
            value={formData.designation_at_first_appointment || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                designation_at_first_appointment: e.target.value,
              })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Qualification */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Qualification
          </label>
          <input
            type="text"
            value={formData.qualification || ""}
            onChange={(e) =>
              setFormData({ ...formData, qualification: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Subject in PG */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Subject in PG
          </label>
          <input
            type="text"
            value={formData.subject_in_pg || ""}
            onChange={(e) =>
              setFormData({ ...formData, subject_in_pg: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Present Designation */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Present Designation
          </label>
          <input
            type="text"
            value={formData.present_designation || ""}
            onChange={(e) =>
              setFormData({ ...formData, present_designation: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Date of Latest Promotion */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Date of Latest Promotion
          </label>
          <input
            type="date"
            value={formData.date_of_latest_promotion || ""}
            onChange={(e) =>
              setFormData({ ...formData, date_of_latest_promotion: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Date of Retirement */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Date of Retirement
          </label>
          <input
            type="date"
            value={formData.date_of_retirement || ""}
            onChange={(e) =>
              setFormData({ ...formData, date_of_retirement: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Working Since (Current Office) */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Working Since (Current Office)
          </label>
          <input
            type="date"
            value={formData.date_from_which_working_in_this_current_office || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                date_from_which_working_in_this_current_office: e.target.value,
              })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Last Three Postings */}
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-600 mb-1">Last Three Postings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["first_posting", "second_posting", "third_posting"].map(
              (key, index) => {
                const posting = formData.last_three_postings?.[key] || {};
                const postingTitle =
                  index === 0 ? "First Posting" : index === 1 ? "Second Posting" : "Third Posting";
                return (
                  <div key={key}>
                    <label className="font-semibold text-gray-600 block mb-1">
                      {postingTitle} School
                    </label>
                    <input
                      type="text"
                      value={posting.school || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_three_postings: {
                            ...formData.last_three_postings,
                            [key]: {
                              ...posting,
                              school: e.target.value,
                            },
                          },
                        })
                      }
                      className="border border-gray-300 rounded w-full p-2"
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
        {/* Current Payscale */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Current Payscale
          </label>
          <input
            type="text"
            value={formData.current_payscale || ""}
            onChange={(e) =>
              setFormData({ ...formData, current_payscale: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Pay Level */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Pay Level
          </label>
          <input
            type="text"
            value={formData.pay_level || ""}
            onChange={(e) =>
              setFormData({ ...formData, pay_level: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* Gross Salary */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            Gross Salary
          </label>
          <input
            type="text"
            value={formData.gross_salary || ""}
            onChange={(e) =>
              setFormData({ ...formData, gross_salary: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
        {/* NPS/OPS */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            NPS/OPS
          </label>
          <input
            type="text"
            value={formData.whether_nps_or_ops || ""}
            onChange={(e) =>
              setFormData({ ...formData, whether_nps_or_ops: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>
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