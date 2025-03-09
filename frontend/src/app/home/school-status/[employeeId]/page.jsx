"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, User } from "lucide-react";
import EmployeeEditForm from "@/components/school-status/EmployeeEditForm";
import EmployeeTransferForm from "@/components/school-status/EmployeeTransferForm";
import districtData from "@/data/data.json"; // Used only for schools list in transfer form
import { useUser } from "@/context/UserContext";

// --- Backend fetch functions ---

// Fetch employee details using your getEmployeeById endpoint
const fetchEmployeeDetails = async (employeeId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch employee details");
  }
  return res.json();
};

// Update employee details via backend (PUT endpoint)
const updateEmployeeDetails = async ({ employeeId, updatedData }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Failed to update employee: " + errorText);
  }
  return res.json();
};

// --- Main Component ---
export default function EmployeeDetailPage() {
  const router = useRouter();
  const { schoolId, employeeId } = useParams(); // Get schoolId from URL params
  const queryClient = useQueryClient();
  const { user } = useUser();

  // Fetch employee details from the backend
  const {
    data: employeeData,
    isLoading: employeeLoading,
    error: employeeError,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployeeDetails(employeeId),
    refetchOnWindowFocus: false,
  });

  // Local state for employee details
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (employeeData) {
      setEmployee(employeeData);
    }
  }, [employeeData]);

  // Local state to control edit and transfer modes
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTransferMode, setIsTransferMode] = useState(false);

  // Mutation for updating employee details
  const updateMutation = useMutation({
    mutationFn: ({ employeeId, updatedData }) =>
      updateEmployeeDetails({ employeeId, updatedData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      setIsEditMode(false);
    },
  });

  const handleSaveEdit = (updatedData) => {
    updateMutation.mutate({ employeeId, updatedData });
  };

  const handleSubmitTransfer = (selectedSchoolId) => {
    // Use the schoolId from URL params in your transfer logic
    console.log(
      `Transfer requested for employee ${employeeId} from school ${schoolId} to school ${selectedSchoolId}`
    );
    setIsTransferMode(false);
  };

  // Loading and error states for employee details
  if (employeeLoading || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    );
  }
  if (employeeError || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Employee not found.</p>
      </div>
    );
  }

  // For the transfer form, if no backend list is available, use local district data.
  const allSchools = districtData.zones.flatMap((zone) =>
    zone.schools.map((school) => ({ ...school, zone: zone.zone }))
  );
  // Remove the current school from the transfer options using schoolId from params
  const filteredSchools = allSchools.filter(
    (sch) => sch.id !== parseInt(schoolId, 10)
  );

  return (
    <div className="min-h-screen p-4 capitalize">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-[15px] font-semibold rounded-md text-secondary hover:text-primary transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        {/* Page Header: Employee Name + Action Buttons */}
        <div className="bg-white shadow-sm border-l-4 border-primary rounded-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-10 h-10 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">
              {employee.employeeName || employee.emp_name}
            </h1>
          </div>
          <div className="flex gap-4">
            {!isEditMode && !isTransferMode && (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="font-semibold text-[13px] px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsTransferMode(true)}
                  className="font-semibold text-[13px] px-4 py-2 bg-red-500 transition text-white rounded hover:bg-red-600"
                >
                  Transfer
                </button>
              </>
            )}
          </div>
        </div>

        {/* Edit Mode */}
        {isEditMode && (
          <EmployeeEditForm
            initialData={employee}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditMode(false)}
          />
        )}

        {/* Transfer Mode */}
        {isTransferMode && (
          <EmployeeTransferForm
            schools={filteredSchools}
            onSubmit={handleSubmitTransfer}
            onCancel={() => setIsTransferMode(false)}
          />
        )}

        {/* View Mode */}
        {!isEditMode && !isTransferMode && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Employee ID:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.employeeId}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Username:
                  </span>
                  <span className="text-gray-600 font-medium">User</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Password:
                  </span>
                  <span className="text-gray-600 font-medium normal-case">
                    user123
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Date of Birth:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {new Date(employee.dateOfBirth).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    First Appointment:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {new Date(employee.dateOfFirstAppointment).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Designation at First Appointment:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.designationAtFirstAppointment}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Qualification:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.qualification}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Subject in PG:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.subjectInPG}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Present Designation:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.presentDesignation}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Latest Promotion:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {new Date(employee.dateOfLatestPromotion).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Retirement Date:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {new Date(employee.dateOfRetirement).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Working Since:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {new Date(employee.dateOfCurrentPosting).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Current Payscale:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.currentPayScale}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Pay Level:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.payLevel}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    Gross Salary:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.grossSalary}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600 mr-1">
                    NPS/OPS:
                  </span>
                  <span className="text-gray-600 font-medium">
                    {employee.pensionScheme}
                  </span>
                </p>
              </div>
            </div>

            {/* Last Three Postings */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                Last Three Postings
              </h2>
              <div className="space-y-4 text-sm">
                {employee.previousPostings && employee.previousPostings.length > 0 ? (
                  employee.previousPostings.map((posting, index) => (
                    <div
                      key={posting._id || index}
                      className="bg-gray-50 p-4 border border-gray-200 rounded-md"
                    >
                      <p className="font-semibold text-secondary mb-2 text-[15px]">
                        Posting {index + 1}:
                      </p>
                      <p>
                        <span className="font-semibold text-gray-600 mr-1">
                          School:
                        </span>
                        <span className="text-gray-600 font-medium">
                          {posting.school}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-600 mr-1">
                          Start Date:
                        </span>
                        <span className="text-gray-600 font-medium">
                          {new Date(posting.start_date).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-600 mr-1">
                          End Date:
                        </span>
                        <span className="text-gray-600 font-medium">
                          {new Date(posting.end_date).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No postings found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
