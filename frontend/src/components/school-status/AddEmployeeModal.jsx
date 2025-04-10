"use client";

import React, { useState, useEffect } from "react";
import { staffTypes,highestQualificationOptions,teachingPosts,nonTeachingPosts,pgSpecializationOptions,currentPayscaleOptions,pensionSchemeOptions,basicPayByPayscale } from "@/data/options";
import Select from "react-select";
import axiosClient from "@/api/axiosClient";





export default function AddEmployeeModal({
  newEmployeeData,
  setNewEmployeeData,
  isOpen,
  onClose,
  showError,
  setShowError,
  schoolInfo, // Selected school information
  setEmployees, // Function to update the employees list
  setIsAddModalOpen, // Function to control modal open state
  queryClient,
  handleSaveNewEmployee // react-query client for refetching data
}) {
  if (!isOpen) return null;

  const [posts, setPosts] = useState([]);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [offices, setOffices] = useState([]);
  const [officeOptions, setOfficeOptions] = useState([]);

  // (Optional) You can add a function here to return a list of sanctioned posts based on staff type if needed.
  // For this updated schema, we assume "Designation" is provided as a free text or via a select list below.


  const getSanctionedPosts = () => {
    if (newEmployeeData.staffType === "Teaching") return teachingPosts;
    if (newEmployeeData.staffType === "Non-Teaching") return nonTeachingPosts;
    return [];
  };

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axiosClient.get("/offices");
        console.log("Fetched Offices:", response.data.offices);
        const options = response.data.offices.map((office) => ({
          value: office._id,
          label: `${office.officeName}`
        }));
        setOffices(response.data.offices);
        setOfficeOptions(options);
      } catch (err) {
        console.error("Error fetching offices:", err);
      }
    };
    fetchOffices();
  }, []);

  console.log("options", officeOptions);



  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 text-[13px] font-normal backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8  shadow-2xl max-w-2xl max-h-[90vh] w-full overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Employee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-6 text-sm">
          {/* Employee ID */}
          <div>
    <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
    <input
      type="text"
      name="employeeId"
      value={newEmployeeData.employeeId || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, employeeId: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

  {/* FULL NAME */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Full Name</label>
    <input
      type="text"
      name="fullName"
      value={newEmployeeData.fullName || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, fullName: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

  {/* GENDER */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Gender</label>
    <select
      name="gender"
      value={newEmployeeData.gender || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, gender: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* MARITAL STATUS */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Marital Status</label>
    <select
      name="maritalStatus"
      value={newEmployeeData.maritalStatus || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, maritalStatus: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select Marital Status</option>
      <option value="Single">Single</option>
      <option value="Married">Married</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* PARENTAGE/SPOUSE */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Parentage/Spouse</label>
    <input
      type="text"
      name="parentageOrSpouse"
      value={newEmployeeData.parentageOrSpouse || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, parentageOrSpouse: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

  
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
    <input
      type="date"
      name="dateOfBirth"
      value={newEmployeeData.dateOfBirth || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, dateOfBirth: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

{/* TYPE (Staff Type) - already defined */}
  <div>
    <label htmlFor="staffType" className="block text-sm font-medium text-gray-700 mb-1">
      Select Staff Type
    </label>
    <select
      id="staffType"
      value={newEmployeeData.staffType || ""}
      onChange={(e) => {
        console.log("Staff Type Selected:", e.target.value);
        setNewEmployeeData({
          ...newEmployeeData,
          staffType: e.target.value,
          presentDesignation: "",
          designationAtFirstAppointment: ""
        });
        console.log("Updated State After Change:", newEmployeeData.staffType);
        setShowError(false);
      }}
      className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
    >
      <option value="">Select Staff Type</option>
      {staffTypes.map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label htmlFor="postCategory" className="block text-sm font-medium text-gray-700 mb-1">
      Select Post Category
    </label>
    <select
      id="postCategory"
      value={newEmployeeData.postCategory || ""}
      onChange={(e) => {
        console.log("Post Category Selected:", e.target.value);
        setNewEmployeeData({
          ...newEmployeeData,
          postCategory: e.target.value,
        });
      }}
      className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
    >
      <option value="">Select Post Category</option>
      <option value="Gazetted">Gazetted</option>
      <option value="Non-Gazetted">Non-Gazetted</option>
    </select>
  </div>
  {/* Name of Sanctioned Posts */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Present Designation</label>
    <select
      value={newEmployeeData.presentDesignation || ""}
      onChange={(e) => {
        
        if (!newEmployeeData.staffType) {
          setShowError(true);
          return;
        }
        console.log("Present Designation Selected:", e.target.value);
        setNewEmployeeData((prev) => ({
          ...prev,
          presentDesignation: e.target.value,
        }));
        console.log("Updated State After Change:", newEmployeeData.presentDesignation);
      }}
      className={`border rounded w-full p-2 ${
        showError && !newEmployeeData.staffType ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">
        {newEmployeeData.staffType ? "Select Post" : "Please select a staff type first"}
      </option>
      {newEmployeeData.staffType &&
        getSanctionedPosts().map((post, index) => (
          <option key={index} value={post}>
            {post}
          </option>
        ))}
    </select>
    {showError && !newEmployeeData.staffType && (
      <p className="text-red-500 text-sm mt-1">Please select a staff type first.</p>
    )}
  </div>

  
  

  {/* DESIGNATION AT THE TIME OF APPOINTMENT */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Designation at  Appointment</label>
    <select
      name="designationAtFirstAppointment"
      value={newEmployeeData.designationAtFirstAppointment || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, designationAtFirstAppointment: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select Designation</option>
      {newEmployeeData.staffType === "Teaching"
        ? teachingPosts.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))
        : nonTeachingPosts.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
    </select>
  </div>

          {/* Date of First Appointment */}
          <div>
    <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
    <input
      type="date"
      name="dateOfFirstAppointment"
      value={newEmployeeData.dateOfFirstAppointment || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, dateOfFirstAppointment: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>
          {/* Date of Retirement */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
            <input
              type="date"
              name="dateOfRetirement"
              value={newEmployeeData.dateOfRetirement || ""}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, dateOfRetirement: e.target.value })}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Date of Recent Promotion */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Date of Recent Promotion</label>
            <input
              type="date"
              name="dateOfRecentPromotion"
              value={newEmployeeData.dateOfRecentPromotion || ""}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, dateOfRecentPromotion: e.target.value })}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          {/* Actual Place of Posting */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Actual Place of Posting</label>
            <input
              type="text"
              name="actualPlaceOfPosting"
              value={newEmployeeData.actualPlaceOfPosting || ""}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, actualPlaceOfPosting: e.target.value })}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Posted Office</label>
            <Select
              options={officeOptions}
              value={officeOptions.find(opt => opt.value === newEmployeeData.postedOffice) || null}
              onChange={(selected) => {
                const value = selected?.value || "";
                setNewEmployeeData({ ...newEmployeeData, postedOffice: value });
                console.log("Updated State After Change:", value);
              }}
              
              
              placeholder="Search and select office"
              className="text-sm"
            />
          </div>

          {/* Working Office */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Working Office</label>
            <Select
              options={officeOptions}
              value={officeOptions.find(opt => opt.value === newEmployeeData.workingOffice) || null}
              onChange={(selected) =>
                setNewEmployeeData({ ...newEmployeeData, workingOffice: selected?.value || "" })
              }
              placeholder="Search and select office"
              className="text-sm"
            />
          </div>
          {/* Basis of Work */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Basis of Work</label>
            <select
              name="basisOfWork"
              value={newEmployeeData.basisOfWork || ""}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, basisOfWork: e.target.value })}
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
    <select
      name="highestQualification"
      value={newEmployeeData.highestQualification || ""}
      onChange={(e) =>
        setNewEmployeeData({
          ...newEmployeeData,
          highestQualification: e.target.value,
          // Reset specialization if 10th or 12th selected.
          specializationSubject: (e.target.value === "10TH" || e.target.value === "12TH") ? "" : newEmployeeData.specializationSubject,
          // Also, for PG university field later, you might want to set the label accordingly.
        })
      }
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select Qualification</option>
      {highestQualificationOptions.map((qual, index) => (
        <option key={index} value={qual}>
          {qual}
        </option>
      ))}
    </select>
  </div>

  {/* SPECIALIZATION SUBJECT */}
  {newEmployeeData.highestQualification && newEmployeeData.highestQualification !== "10TH" && newEmployeeData.highestQualification !== "12TH" && (
    <div>
      <label className="font-semibold text-gray-600 block mb-1">
        {newEmployeeData.highestQualification === "PHD" ? "Specialization (Enter Text)" : "Specialization Subject"}
      </label>
      {newEmployeeData.highestQualification === "PHD" ? (
        <input
          type="text"
          name="specializationSubject"
          value={newEmployeeData.specializationSubject || ""}
          onChange={(e) => setNewEmployeeData({ ...newEmployeeData, specializationSubject: e.target.value })}
          className="border border-gray-300 rounded w-full p-2"
        />
      ) : (
        <select
          name="specializationSubject"
          value={newEmployeeData.specializationSubject || ""}
          onChange={(e) => setNewEmployeeData({ ...newEmployeeData, specializationSubject: e.target.value })}
          className="border border-gray-300 rounded w-full p-2"
        >
          <option value="">Select Specialization Subject</option>
          {pgSpecializationOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
      )}
    </div>
  )}

  {/* PG UNIVERSITY - Label dynamically based on highestQualification */}
  {newEmployeeData.highestQualification && newEmployeeData.highestQualification !== "10TH" && newEmployeeData.highestQualification !== "12TH" && (
    <div>
      <label className="font-semibold text-gray-600 block mb-1">
        {newEmployeeData.highestQualification} University
      </label>
      <input
        type="text"
        name="pgUniversity"
        value={newEmployeeData.pgUniversity || ""}
        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, pgUniversity: e.target.value })}
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
  )}

  {/* B.ED and B.ED UNIVERSITY */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">B.Ed</label>
    <select
      name="bed"
      value={newEmployeeData.bed || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, bed: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  {newEmployeeData.bed === "Yes" && (
    <div>
      <label className="font-semibold text-gray-600 block mb-1">B.Ed University</label>
      <input
        type="text"
        name="bedUniversity"
        value={newEmployeeData.bedUniversity || ""}
        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, bedUniversity: e.target.value })}
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
  )}

  {/* ANY OTHER CERTIFICATION */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Any Other Certification</label>
    <input
      type="text"
      name="otherCertification"
      value={newEmployeeData.otherCertification || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, otherCertification: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

  {/* DATE FROM WHICH WORKING IN CURRENT OFFICE */} 
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
    <input
      type="date"
      name="dateOfCurrentPosting"
      value={newEmployeeData.dateOfCurrentPosting || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, dateOfCurrentPosting: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

  {/* CURRENT PAY SCALE AND LEVEL */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Current Payscale and Level</label>
    <select
      name="payScaleAndLevel"
      value={newEmployeeData.payScaleAndLevel || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, payScaleAndLevel: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select Payscale and Level</option>
      {currentPayscaleOptions.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>

  {/* CURRENT BASIC PAY */}
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Current Basic Pay</label>
  <select
    name="basicPay"
    value={newEmployeeData.basicPay || ""}
    onChange={(e) => setNewEmployeeData({ ...newEmployeeData, basicPay: e.target.value })}
    className="border border-gray-300 rounded w-full p-2"
    disabled={!newEmployeeData.payScaleAndLevel}
  >
    <option value="">Select Basic Pay</option>
    
    {
    (basicPayByPayscale[newEmployeeData.payScaleAndLevel] || []).map((pay, idx) => (
      <option key={idx} value={pay}>
        {pay}
      </option>
    ))}
  </select>
</div>


  {/* GROSS SALARY */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
    <input
      type="text"
      name="grossSalary"
      value={newEmployeeData.grossSalary || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, grossSalary: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    />
  </div>

  {/* PENSION SCHEME */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Pension Scheme</label>
    <select
      name="pensionScheme"
      value={newEmployeeData.pensionScheme || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, pensionScheme: e.target.value })}
      className="border border-gray-300 rounded w-full p-2"
    >
      <option value="">Select Pension Scheme</option>
      {pensionSchemeOptions.map((scheme, idx) => (
        <option key={idx} value={scheme}>
          {scheme}
        </option>
      ))}
    </select>
  </div>

  {/* Salary Details Section */}
{/* <div className="border-t pt-4 mt-4">
  <h3 className="text-lg font-bold mb-2">Salary Details</h3> */}
  
  {/* Basic Pay Section */}
  {/* <div>
    <label className="font-semibold text-gray-600 block mb-1">Basic Pay Amount</label>
    <input
      type="number"
      name="salaryData.basicPay.amount"
      value={newEmployeeData.salaryData?.basicPay?.amount || ""}
      onChange={(e) =>
        setNewEmployeeData({
          ...newEmployeeData,
          salaryData: {
            ...newEmployeeData.salaryData,
            basicPay: {
              ...newEmployeeData.salaryData?.basicPay,
              amount: e.target.value,
            },
          },
        })
      }
      className="border border-gray-300 rounded w-full p-2"
    />
  </div> */}
  
  {/* PayScale (nested in BasicPay) */}
  {/* <div className="mt-2">
    <h4 className="font-semibold text-gray-700">PayScale Details</h4>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">Pay Commission ID</label>
      <input
        type="text"
        name="salaryData.basicPay.payScale.payCommission"
        value={newEmployeeData.salaryData?.basicPay?.payScale?.payCommission || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              basicPay: {
                ...newEmployeeData.salaryData?.basicPay,
                payScale: {
                  ...newEmployeeData.salaryData?.basicPay?.payScale,
                  payCommission: e.target.value,
                },
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">Pay Level Code</label>
      <input
        type="text"
        name="salaryData.basicPay.payScale.payLevelCode"
        value={newEmployeeData.salaryData?.basicPay?.payScale?.payLevelCode || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              basicPay: {
                ...newEmployeeData.salaryData?.basicPay,
                payScale: {
                  ...newEmployeeData.salaryData?.basicPay?.payScale,
                  payLevelCode: e.target.value,
                },
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">Scale Range</label>
      <input
        type="text"
        name="salaryData.basicPay.payScale.scaleRange"
        value={newEmployeeData.salaryData?.basicPay?.payScale?.scaleRange || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              basicPay: {
                ...newEmployeeData.salaryData?.basicPay,
                payScale: {
                  ...newEmployeeData.salaryData?.basicPay?.payScale,
                  scaleRange: e.target.value,
                },
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
  </div> */}
  
  {/* DA Section */}
  {/* <div className="mt-4">
    <h4 className="font-semibold text-gray-700">DA Details</h4>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">DA Percentage</label>
      <input
        type="number"
        name="salaryData.da.daPercentage"
        value={newEmployeeData.salaryData?.da?.daPercentage || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              da: {
                ...newEmployeeData.salaryData?.da,
                daPercentage: e.target.value,
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">DA Effective Date</label>
      <input
        type="date"
        name="salaryData.da.effectiveDate"
        value={newEmployeeData.salaryData?.da?.effectiveDate || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              da: {
                ...newEmployeeData.salaryData?.da,
                effectiveDate: e.target.value,
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">DA - Pay Commission ID</label>
      <input
        type="text"
        name="salaryData.da.payCommission"
        value={newEmployeeData.salaryData?.da?.payCommission || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              da: {
                ...newEmployeeData.salaryData?.da,
                payCommission: e.target.value,
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
  </div> */}
  
  {/* HRA Section */}
  {/* <div className="mt-4">
    <h4 className="font-semibold text-gray-700">HRA Details</h4>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">HRA Type</label>
      <input
        type="text"
        name="salaryData.hra.hraType"
        value={newEmployeeData.salaryData?.hra?.hraType || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              hra: {
                ...newEmployeeData.salaryData?.hra,
                hraType: e.target.value,
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">HRA Percentage</label>
      <input
        type="number"
        name="salaryData.hra.hraPercentage"
        value={newEmployeeData.salaryData?.hra?.hraPercentage || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              hra: {
                ...newEmployeeData.salaryData?.hra,
                hraPercentage: e.target.value,
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">HRA Effective Date</label>
      <input
        type="date"
        name="salaryData.hra.effectiveDate"
        value={newEmployeeData.salaryData?.hra?.effectiveDate || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              hra: {
                ...newEmployeeData.salaryData?.hra,
                effectiveDate: e.target.value,
              },
            },
          })
        }
        className="border border-gray-300 rounded w-full p-2"
      />
    </div>
  </div> */}
{/* </div> */}


  

          
  

          {/* Phone No */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Phone No</label>
            <input
              type="text"
              name="phoneNo"
              value={newEmployeeData.phoneNo || ""}
              onChange={(e) => {
                const phone = e.target.value;
                if (!/^\d{0,10}$/.test(phone)) {
                  setPhoneError("Phone number must be up to 10 digits only");
                } else {
                  setPhoneError("");
                }
                setNewEmployeeData({ ...newEmployeeData, phoneNo: phone });
              }}
              className={`border rounded w-full p-2 ${phoneError ? "border-red-500" : "border-gray-300"}`}
            />
            {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
          </div>
          {/* Email */}
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newEmployeeData.email || ""}
              onChange={(e) => {
                const email = e.target.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email && !emailRegex.test(email)) {
                  setEmailError("Please enter a valid email address");
                } else {
                  setEmailError("");
                }
                setNewEmployeeData({ ...newEmployeeData, email });
              }}
              className={`border rounded w-full p-2 ${emailError ? "border-red-500" : "border-gray-300"}`}
            />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>





  {/* Credentials */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Username</label>
        <input
          type="text"
          value={newEmployeeData.credentials?.username || ""}
          onChange={(e) => {
            const value = e.target.value;
            const isValid = /^[a-zA-Z0-9_]*$/.test(value);
            if (!isValid) {
              setUsernameError("Username can only contain letters, numbers, and underscores.");
            } else {
              setUsernameError("");
            }
            setNewEmployeeData({
              ...newEmployeeData,
              credentials: {
                ...newEmployeeData.credentials,
                username: value,
              },
            });
          }}
          className={`border rounded w-full p-2 ${usernameError ? "border-red-500" : "border-gray-300"}`}
        />
        {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
      </div>
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Password</label>
        <div className="flex flex-col gap-y-2 items-start">
        <input
          type="text"
          value={newEmployeeData.credentials?.passwordHash || ""}
          onChange={(e) => {
            const password = e.target.value;
            if (password.length > 0 && password.length < 6) {
              setPasswordError("Password must be at least 6 characters");
            } else {
              setPasswordError("");
            }
            setNewEmployeeData({
              ...newEmployeeData,
              credentials: {
                ...newEmployeeData.credentials,
                passwordHash: password,
              },
            });
          }}
          className={`border rounded w-full p-2 ${passwordError ? "border-red-500" : "border-gray-300"}`}
        />
        {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          <button
            type="button"
            onClick={() => {
              const generated = Math.random().toString(36).slice(-8); // generates an 8-character random password
              setNewEmployeeData({
                ...newEmployeeData,
                credentials: {
                  ...newEmployeeData.credentials,
                  passwordHash: generated,
                },
              });
            }}
            className=" bg-blue-500 text-nowrap text-[13px] font-medium text-white px-3 py-1 rounded"
          >
            Generate Password
          </button>
        </div>
      </div>
      <div>
  <label className="font-semibold text-gray-600 block mb-1">
    Posting History
  </label>
  {newEmployeeData.postingHistory && newEmployeeData.postingHistory.length > 0 && (
    newEmployeeData.postingHistory.map((posting, index) => (
      <div key={index} className="border p-2 rounded mb-2">
        {/* Office ID */}
        <input
          type="text"
          name="office"
          placeholder="Office ID"
          value={posting.office || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, office: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        {/* Designation During Posting */}
        <input
          type="text"
          name="designationDuringPosting"
          placeholder="Designation During Posting"
          value={posting.designationDuringPosting || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, designationDuringPosting: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={posting.startDate ? posting.startDate.substring(0, 10) : ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, startDate: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        {/* End Date */}
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={posting.endDate ? posting.endDate.substring(0, 10) : ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, endDate: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        {/* Posting Type */}
        <select
          name="postingType"
          value={posting.postingType || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, postingType: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        >
          <option value="">Select Posting Type</option>
          <option value="Transfer">Transfer</option>
          <option value="Deputation">Deputation</option>
          <option value="Attachment">Attachment</option>
          <option value="Other">Other</option>
        </select>
        {/* Reason */}
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={posting.reason || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, reason: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        {/* Remarks */}
        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={posting.remarks || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, remarks: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        <button
          onClick={() => {
            const updatedPostings = newEmployeeData.postingHistory.filter((_, idx) => idx !== index);
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="text-red-500 text-xs"
        >
          Remove
        </button>
      </div>
    ))
  )}
  <button
    onClick={() => {
      const newPosting = {
        office: "",
        designationDuringPosting: "",
        startDate: "",
        endDate: "",
        postingType: "",
        reason: "",
        remarks: "",
      };
      setNewEmployeeData({
        ...newEmployeeData,
        postingHistory: [...(newEmployeeData.postingHistory || []), newPosting],
      });
    }}
    className=" bg-blue-500 text-nowrap text-[13px] font-medium text-white px-3 py-1 rounded"
  >
    Add Posting History
  </button>
</div>

          
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSaveNewEmployee}
            className="font-semibold text-[13px] px-4 py-2 bg-primary text-white rounded transition hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
