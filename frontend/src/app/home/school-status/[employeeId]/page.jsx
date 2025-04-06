  "use client";

  import { useParams, useRouter } from "next/navigation";
  import { useState, useEffect, useRef } from "react";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { ChevronLeft, User } from "lucide-react";
  import EmployeeEditForm from "@/components/school-status/EmployeeEditForm";
  import EmployeeTransferForm from "@/components/school-status/EmployeeTransferForm";
  import districtData from "@/data/data.json"; // Used only for schools list in transfer form
  import { useUser } from "@/context/UserContext";
  import { createTransferRequest } from "@/api/transferService";
  import { toast } from "react-toastify";

  // --- Backend fetch functions ---

  // Fetch employee details using your getEmployeeById endpoint
  const token = localStorage.getItem("token");
console.log("Token from localStorage:", token);

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

  async function handleImageUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/uploads", {  // ✅ Make sure this matches your backend
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload failed:", errorText);
      throw new Error("Failed to upload image: " + errorText);
    }

    const data = await res.json();
    return data.url;
  }


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
    const [isUploading, setIsUploading] = useState(false);
    const {employeeId } = useParams(); 
    const queryClient = useQueryClient();
    const { user } = useUser();
    const fileInputRef = useRef(null);

    const handleUploadProfilePicture = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    
    
    const schoolId = user?.schoolId;
    const {
      data: employeeData,
      isLoading: employeeLoading,
      error: employeeError,
    } = useQuery({
      queryKey: ["employee", employeeId],
      queryFn: () => fetchEmployeeDetails(employeeId),
      refetchOnWindowFocus: false,
    });

    // Local state for employee details (populated from backend)
    const [employee, setEmployee] = useState(null);
    useEffect(() => {
      if (employeeData) {
        setEmployee(employeeData);
      }
    }, [employeeData]);

    // State to control edit and transfer modes
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

    const transferMutation = useMutation({
      mutationFn: (transferData) =>
        createTransferRequest(transferData, user, window.location.hostname),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
        toast.success("Transfer request submitted successfully");
        setIsTransferMode(false);
      },
      onError: (error) => {
        toast.error("Error submitting transfer request: " + error.message);
      },
    });
    
    const handleSubmitTransfer = ({ selectedSchool, comment }) => {
      transferMutation.mutate({
        employeeId,
        fromSchoolId: schoolId, 
        toSchoolId: selectedSchool,
        requestedBy: user.userId,
        comment,
      });
    };

    const handleSaveEdit = (updatedData) => {
      updateMutation.mutate({ employeeId, updatedData });
    };


    
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        setIsUploading(true);
        const photoUrl = await handleImageUpload(file);
        console.log("Uploaded photo URL:", photoUrl);
        
        // Call update mutation to update the employee's photograph field
        updateMutation.mutate(
          { employeeId: employee._id, updatedData: { photograph: photoUrl } },
          {
            onSuccess: () => {
              setIsUploading(false);
              toast.success("Profile picture updated successfully");
            },
            onError: (error) => {
              setIsUploading(false);
              console.error("Error updating profile picture:", error);
              toast.error(error.message);
            },
          }
        );
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error(error.message);
      }
    };

    const { data: postingHistoryData, isLoading: postingLoading, error: postingError } = useQuery({
      queryKey: ["postingHistory", employeeId],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/postingHistory/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch posting history");
        }
        return res.json();
      },
      refetchOnWindowFocus: false,
    });
    

    // Loading & error states
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

    console.log("employees-page:",employee);

    // For the transfer form, if no backend list is available, use local district data.
    const allSchools = districtData.zones.flatMap((zone) =>
      zone.schools.map((school) => ({ ...school, zone: zone.zone }))
    );
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
              {employee.photograph ? (
                <img
                  src={employee.photograph}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-800">{employee.fullName}</h1>
            </div>
            <div className="flex flex-col gap-2">
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
              <button
      onClick={handleUploadProfilePicture}
      className={`font-semibold text-[13px] px-4 py-2 transition text-white rounded ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}`}
      disabled={isUploading}
  >
      {isUploading ? "Uploading..." : "Upload Profile Picture"}
  </button>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Edit Mode: EmployeeEditForm is integrated here */}
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
              currentSchoolId={schoolId}
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
            <span className="font-semibold text-gray-600 mr-1">Employee ID:</span>
            <span className="text-gray-600 font-medium">{employee.employeeId}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Full Name:</span>
            <span className="text-gray-600 font-medium">{employee.fullName || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Gender:</span>
            <span className="text-gray-600 font-medium">{employee.gender || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Marital Status:</span>
            <span className="text-gray-600 font-medium">{employee.maritalStatus || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Parentage/Spouse:</span>
            <span className="text-gray-600 font-medium">{employee.parentageOrSpouse || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Username:</span>
            <span className="text-gray-600 font-medium" style={{ textTransform: 'none' }}>
              {employee.credentials.username || "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Password:</span>
            <span className="text-gray-600 font-medium" style={{ textTransform: 'none' }}>
              {employee.credentials.passwordHash || "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Phone Number:</span>
            <span className="text-gray-600 font-medium">{employee.phoneNo || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Email:</span>
            <span className="text-gray-600 font-medium" style={{ textTransform: 'none' }}>{employee.email || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Date of Birth:</span>
            <span className="text-gray-600 font-medium">
              {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Staff Type:</span>
            <span className="text-gray-600 font-medium">{employee.staffType || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Present Designation:</span>
            <span className="text-gray-600 font-medium ">{employee.presentDesignation || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Date of First Appointment:</span>
            <span className="text-gray-600 font-medium">
              {employee.dateOfFirstAppointment ? new Date(employee.dateOfFirstAppointment).toLocaleDateString() : "N/A"}
            </span>
          </p>
          
          <p>
            <span className="font-semibold text-gray-600 mr-1">Designation at First Appointment:</span>
            <span className="text-gray-600 font-medium">{employee.designationAtFirstAppointment || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Latest Promotion:</span>
            <span className="text-gray-600 font-medium">
              {employee.dateOfRecentPromotion ? new Date(employee.dateOfRecentPromotion).toLocaleDateString() : "N/A"}
            </span>
          </p>
        </div>
        <div className="space-y-3">
          
          <p>
            <span className="font-semibold text-gray-600 mr-1">Retirement Date:</span>
            <span className="text-gray-600 font-medium">
              {employee.dateOfRetirement ? new Date(employee.dateOfRetirement).toLocaleDateString() : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Actual Place of Posting:</span>
            <span className="text-gray-600 font-medium">{employee.actualPlaceOfPosting || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Working At:</span>
            <span className="text-gray-600 font-medium">{employee.workingAt || "N/A"}</span>
          </p>
          
          <p>
            <span className="font-semibold text-gray-600 mr-1">Basis of Work:</span>
            <span className="text-gray-600 font-medium">{employee.basisOfWork || "N/A"}</span>
          </p>
          <p>
    <span className="font-semibold text-gray-600 mr-1">Highest Qualification:</span>
    <span className="text-gray-600 font-medium">
      {employee.highestQualification || "N/A"}
    </span>
  </p>

  {/* Show Specialization Subject only if qualification is not 10TH or 12TH */}
  {employee.highestQualification &&
    !["10TH", "12TH"].includes(employee.highestQualification.toUpperCase()) && (
      <p>
        <span className="font-semibold text-gray-600 mr-1">
          {employee.highestQualification.toUpperCase() === "PHD"
            ? "Specialization (Enter Text):"
            : "Specialization Subject:"}
        </span>
        <span className="text-gray-600 font-medium">
          {employee.specializationSubject || "N/A"}
        </span>
      </p>
    )}

  {/* Show PG University if qualification is not 10TH or 12TH */}
  {employee.highestQualification &&
    !["10TH", "12TH"].includes(employee.highestQualification.toUpperCase()) && (
      <p>
        <span className="font-semibold text-gray-600 mr-1">
          {employee.highestQualification.toUpperCase()} University:
        </span>
        <span className="text-gray-600 font-medium">
          {employee.pgUniversity || "N/A"}
        </span>
      </p>
    )}

  <p>
    <span className="font-semibold text-gray-600 mr-1">B.Ed:</span>
    <span className="text-gray-600 font-medium">
      {employee.bed ? "Yes" : "No"}
    </span>
  </p>

  {/* If B.Ed is Yes, show B.Ed University */}
  {employee.bed && (
    <p>
      <span className="font-semibold text-gray-600 mr-1">B.Ed University:</span>
      <span className="text-gray-600 font-medium">
        {employee.bedUniversity || "N/A"}
      </span>
    </p>
  )}

  <p>
    <span className="font-semibold text-gray-600 mr-1">
      Any Other Certification:
    </span>
    <span className="text-gray-600 font-medium">
      {employee.anyOtherCertification || "N/A"}
    </span>
  </p>

          <p>
            <span className="font-semibold text-gray-600 mr-1">Date From Which Working in Current Office:</span>
            <span className="text-gray-600 font-medium">
              {employee.dateOfCurrentPosting ? new Date(employee.dateOfCurrentPosting).toLocaleDateString() : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Current Payscale and Level:</span>
            <span className="text-gray-600 font-medium">
              {employee.currentPayScaleAndLevel || "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-600 mr-1">Current Basic Pay:</span>
            <span className="text-gray-600 font-medium">{employee.currentBasicPay || "N/A"}</span>
          </p>
          
          <p>
            <span className="font-semibold text-gray-600 mr-1">Gross Salary:</span>
            <span className="text-gray-600 font-medium">{employee.grossSalary || "N/A"}</span>
          </p>
          
          <p>
            <span className="font-semibold text-gray-600 mr-1">Pension Scheme:</span>
            <span className="text-gray-600 font-medium">{employee.pensionScheme || "N/A"}</span>
          </p>
          
        </div>
      </div>

      {/* Last Three Postings */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-primary mb-4">Posting History</h2>
        {postingLoading ? (
          <p className="text-gray-600">Loading postings...</p>
        ) : postingError ? (
          <p className="text-gray-600">Error loading postings.</p>
        ) : postingHistoryData && postingHistoryData.length > 0 ? (
          postingHistoryData.slice(0, 3).map((posting, index) => (
            <div key={posting._id || index} className="bg-gray-50 p-4 border border-gray-200 rounded-md">
              <p className="font-semibold text-secondary mb-2 text-[15px]">Posting {index + 1}:</p>
              <p>
                <span className="font-semibold text-gray-600 mr-1">Office ID:</span>
                <span className="text-gray-600 font-medium">{posting.office || "N/A"}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-600 mr-1">Designation:</span>
                <span className="text-gray-600 font-medium">{posting.designationDuringPosting || "N/A"}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-600 mr-1">Start Date:</span>
                <span className="text-gray-600 font-medium">
                  {posting.startDate ? new Date(posting.startDate).toLocaleDateString() : "N/A"}
                </span>
              </p>
              <p>
                <span className="font-semibold text-gray-600 mr-1">End Date:</span>
                <span className="text-gray-600 font-medium">
                  {posting.endDate ? new Date(posting.endDate).toLocaleDateString() : "N/A"}
                </span>
              </p>
              {posting.postingType && (
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Type:</span>
                  <span className="text-gray-600 font-medium">{posting.postingType}</span>
                </p>
              )}
              {posting.reason && (
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Reason:</span>
                  <span className="text-gray-600 font-medium">{posting.reason}</span>
                </p>
              )}
              {posting.remarks && (
                <p>
                  <span className="font-semibold text-gray-600 mr-1">Remarks:</span>
                  <span className="text-gray-600 font-medium">{posting.remarks}</span>
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No postings found.</p>
        )}
      </div>
    </div>
  )}

        </div>
      </div>
    );
  }
