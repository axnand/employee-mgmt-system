import React from "react";

const staffTypes = ["Teaching", "Non-Teaching"];
const highestQualificationOptions = ["10TH", "12TH", "GRADUATE", "POSTGRADUATE", "M.PHIL", "PHD"];
const pgSpecializationOptions = [
  "Master of Arts (MA)",
  "MA Arabic",
  "MA Assamese",
  "MA Bengali",
  "MA Comparative Literature",
  "MA Economics",
  "MA Education",
  "MA English",
  "MA Fine Arts",
  "MA French",
  "MA Geography",
  "MA German",
  "MA Hindi",
  "MA History",
  "MA Islamic Studies",
  "MA Journalism and Mass Communication",
  "MA Linguistics",
  "MA Marathi",
  "MA Music",
  "MA Persian",
  "MA Philosophy",
  "MA Political Science",
  "MA Psychology",
  "MA Public Administration",
  "MA Punjabi",
  "MA Sanskrit",
  "MA Sociology",
  "MA Tamil",
  "MA Telugu",
  "MA Urdu",
  "MA Visual Arts",
  // ... (add more if needed)
];
const teachingDesignationOptions = [
  "HEADMASTER",
  "HEADMASTER RMSA",
  "JUNIOR ASSISTANT",
  "LABORATORY ASSISTANT",
  "MTS-LABORATORY BEARER",
  "LECTURER",
  "LECTURER PHYSICAL EDUCATION",
  "LIBRARIAN",
  "LIBRARIAN JUNIOR",
  "LIBRARIAN SENIOR",
  "LIBRARY ASSISTANT",
  "MTS-SAFAIWALA",
  "SPECIAL EDUCATION TEACHER",
  // ... (add more if needed)
];
const nonTeachingDesignationOptions = [
  "ACCOUNTANT",
  "ACCOUNTS ASSISTANT",
  "ASSISTANT DIRECTOR (P & S)",
  "CEO",
  "DRIVER",
  "HEAD ASSISTANT",
  "JUNIOR ASSISTANT",
  "LABORATORY ASSISTANT",
  "MTS-LABORATORY BEARER",
  "SECTION OFFICER",
  "SENIOR ASSISTANT",
  "STATISTICAL ASSISTANT",
  "STATISTICAL OFFICER",
  "STENOGRAPHER",
  "STENOGRAPHER JUNIOR",
  "STENOGRAPHER SENIOR",
  // ... (add more if needed)
];
const currentPayscaleOptions = [
  "SL1 (14800-47100)",
  "SL2 (15900-50400)",
  "SL3 (16900-53500)",
  "LEVEL-1 (18000-56900)",
  "LEVEL-2 (19900-63200)",
  "LEVEL-3A (25300-80500)",
  "LEVEL-3B (25400-81000)",
  "LEVEL-4 (25500-81100)",
  "LEVEL-5 (29200-92300)",
  "LEVEL-6 (35400-112400)",
  "LEVEL-6A (35500-112600)",
  "LEVEL-6B (35600-112800)",
  "LEVEL-6C (35700-113100)",
  "LEVEL-6D (35800-113200)",
  "LEVEL-6E (35900-113500)",
  "LEVEL-6F (40800-129200)",
  "LEVEL-6G (42300-134300)",
  "LEVEL-7 (44900-142400)",
  "LEVEL-8 (47600-151100)",
  "LEVEL-8A (50700-160600)",
  "LEVEL-9 (52700-166700)",
  "LEVEL-10A (56600-179800)",
  "LEVEL-11 (66700-208700)",
  "LEVEL-12 (78800-209200)",
  "LEVEL-13 (123100-215900)",
  "LEVEL-13A (131100-216600)",
  "LEVEL-14 (144200-218200)",
  "LEVEL-15 (182200-224100)",
  "LEVEL-16 (205400-224400)",
  "LEVEL-17 (225000)"
];
const pensionSchemeOptions = ["NPS", "OPS"];

const genderOptions = ["Male", "Female", "Other"];

const maritalStatusOptions = ["Married", "Unmarried"];

export default function EmployeeEditForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 text-sm">
      {/* Employee ID */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
        <input type="text" name="employeeId" value={formData.employeeId || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Full Name */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Full Name</label>
        <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Gender */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Gender</label>
        <select name="gender" value={formData.gender || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Gender</option>
          {genderOptions.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Marital Status */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Marital Status</option>
          {maritalStatusOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Parentage/Spouse */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Parentage/Spouse</label>
        <input type="text" name="parentageOrSpouse" value={formData.parentageOrSpouse || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Phone Number */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Phone Number</label>
        <input type="text" name="phoneNo" value={formData.phoneNo || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Email */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Email</label>
        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Staff Type */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Staff Type</label>
        <select name="staffType" value={formData.staffType || ""} onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            staffType: e.target.value,
            // Reset designation fields when staff type changes
            presentDesignation: "",
            designationAtFirstAppointment: ""
          }));
        }} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Staff Type</option>
          {staffTypes.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Present Designation */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Present Designation</label>
        <select name="presentDesignation" value={formData.presentDesignation || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Designation</option>
          {formData.staffType === "Teaching"
            ? teachingDesignationOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)
            : nonTeachingDesignationOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </select>
      </div>

      {/* Designation at First Appointment */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Designation at First Appointment</label>
        <input type="text" name="designationAtFirstAppointment" value={formData.designationAtFirstAppointment || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of First Appointment */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
        <input type="date" name="dateOfFirstAppointment" value={formData.dateOfFirstAppointment ? new Date(formData.dateOfFirstAppointment).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of Recent Promotion */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of Recent Promotion</label>
        <input type="date" name="dateOfRecentPromotion" value={formData.dateOfRecentPromotion ? new Date(formData.dateOfRecentPromotion).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of Retirement */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
        <input type="date" name="dateOfRetirement" value={formData.dateOfRetirement ? new Date(formData.dateOfRetirement).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Actual Place of Posting */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Actual Place of Posting</label>
        <input type="text" name="actualPlaceOfPosting" value={formData.actualPlaceOfPosting || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Working At */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Working At</label>
        <input type="text" name="workingAt" value={formData.workingAt || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Basis of Work */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Basis of Work</label>
        <select
          name="basisOfWork"
          value={formData.basisOfWork || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
        >
          <option value="">Select Basis of Work</option>
          <option value="DEPUTED">DEPUTED</option>
          <option value="FILLED">FILLED</option>
          <option value="SUPERNUMERARY">SUPERNUMERARY</option>
          <option value="PAYORDER">PAYORDER</option>
          <option value="OTHER">OTHER</option>
        </select>
      </div>


      {/* Highest Qualification */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Highest Qualification</label>
        <select name="highestQualification" value={formData.highestQualification || ""} onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            highestQualification: e.target.value,
            // If 10TH or 12TH, reset specialization fields
            specializationSubject: (e.target.value === "10TH" || e.target.value === "12TH") ? "" : prev.specializationSubject,
            pgUniversity: ""  // reset PG University
          }));
        }} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Qualification</option>
          {highestQualificationOptions.map((qual, idx) => (
            <option key={idx} value={qual}>{qual}</option>
          ))}
        </select>
      </div>

      {/* Specialization Subject (if applicable) */}
      {formData.highestQualification && !["10TH", "12TH"].includes(formData.highestQualification) && (
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            {formData.highestQualification === "PHD" ? "Specialization (Enter Text)" : "Specialization Subject"}
          </label>
          {formData.highestQualification === "PHD" ? (
            <input type="text" name="specializationSubject" value={formData.specializationSubject || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
          ) : (
            <select name="specializationSubject" value={formData.specializationSubject || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
              <option value="">Select Specialization Subject</option>
              {pgSpecializationOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      )}

      {/* PG University (only if qualification is not 10TH or 12TH) */}
      {formData.highestQualification && !["10TH", "12TH"].includes(formData.highestQualification) && (
        <div>
          <label className="font-semibold text-gray-600 block mb-1">{formData.highestQualification} University</label>
          <input type="text" name="pgUniversity" value={formData.pgUniversity || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
        </div>
      )}

      {/* B.Ed */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">B.Ed</label>
        <select name="bed" value={formData.bed || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      {formData.bed === "Yes" && (
        <div>
          <label className="font-semibold text-gray-600 block mb-1">B.Ed University</label>
          <input type="text" name="bedUniversity" value={formData.bedUniversity || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
        </div>
      )}

      {/* Any Other Certification */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Any Other Certification</label>
        <input type="text" name="otherCertification" value={formData.otherCertification || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date From Which Working in Current Office */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
        <input type="date" name="dateOfCurrentPosting" value={formData.dateOfCurrentPosting ? new Date(formData.dateOfCurrentPosting).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Current Payscale and Level */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Current Payscale and Level</label>
        <select name="currentPayScaleAndLevel" value={formData.currentPayScaleAndLevel || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Payscale and Level</option>
          {currentPayscaleOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Current Basic Pay */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Current Basic Pay</label>
        <input type="text" name="currentBasicPay" value={formData.currentBasicPay || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Gross Salary */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
        <input type="text" name="grossSalary" value={formData.grossSalary || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Pension Scheme */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Pension Scheme</label>
        <select name="pensionScheme" value={formData.pensionScheme || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Pension Scheme</option>
          {pensionSchemeOptions.map((scheme, idx) => (
            <option key={idx} value={scheme}>{scheme}</option>
          ))}
        </select>
      </div>

      {/* Credentials - Username */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Username</label>
        <input type="text" name="credentials.username" value={formData.credentials?.username || ""} onChange={(e) => setFormData(prev => ({ ...prev, credentials: { ...prev.credentials, username: e.target.value } }))} className="border border-gray-300 rounded w-full p-2" />
      </div>
      {/* Credentials - Password */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Password</label>
        <div className="flex">
          <input type="text" name="credentials.passwordHash" value={formData.credentials?.passwordHash || ""} onChange={(e) => setFormData(prev => ({ ...prev, credentials: { ...prev.credentials, passwordHash: e.target.value } }))} className="border border-gray-300 rounded w-full p-2" />
          <button type="button" onClick={() => {
            const generated = Math.random().toString(36).slice(-8);
            setFormData(prev => ({ ...prev, credentials: { ...prev.credentials, passwordHash: generated } }));
          }} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
            Generate Password
          </button>
        </div>
      </div>

      {/* Previous Postings Section */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Posting Details</label>
        {formData.previousPostings && formData.previousPostings.length > 0 && (
          formData.previousPostings.map((posting, index) => (
            <div key={index} className="border p-2 rounded mb-2">
              <input type="text" name="schoolName" placeholder="School Name" value={posting.schoolName} onChange={(e) => {
                const updatedPosting = { ...posting, schoolName: e.target.value };
                const updatedPostings = [...(formData.previousPostings || [])];
                updatedPostings[index] = updatedPosting;
                setFormData({ ...formData, previousPostings: updatedPostings });
              }} className="border rounded w-full p-1 mb-1" />
              <input type="date" name="startDate" placeholder="Start Date" value={posting.startDate ? posting.startDate.substring(0, 10) : ""} onChange={(e) => {
                const updatedPosting = { ...posting, startDate: e.target.value };
                const updatedPostings = [...(formData.previousPostings || [])];
                updatedPostings[index] = updatedPosting;
                setFormData({ ...formData, previousPostings: updatedPostings });
              }} className="border rounded w-full p-1 mb-1" />
              <input type="date" name="endDate" placeholder="End Date" value={posting.endDate ? posting.endDate.substring(0, 10) : ""} onChange={(e) => {
                const updatedPosting = { ...posting, endDate: e.target.value };
                const updatedPostings = [...(formData.previousPostings || [])];
                updatedPostings[index] = updatedPosting;
                setFormData({ ...formData, previousPostings: updatedPostings });
              }} className="border rounded w-full p-1 mb-1" />
              <button onClick={() => {
                const updatedPostings = formData.previousPostings.filter((_, idx) => idx !== index);
                setFormData({ ...formData, previousPostings: updatedPostings });
              }} className="text-red-500 text-xs">Remove</button>
            </div>
          ))
        )}
        <button onClick={() => {
          const newPosting = { schoolName: "", startDate: "", endDate: "" };
          setFormData({ ...formData, previousPostings: [...(formData.previousPostings || []), newPosting] });
        }} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
          Add Posting
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={() => onSave(formData)} className="font-semibold text-[13px] px-4 py-2 bg-primary text-white rounded transition hover:bg-blue-600">
          Save
        </button>
        <button onClick={onCancel} className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
}
