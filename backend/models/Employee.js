import mongoose from "mongoose";


const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: { type: String }, 
    parentageOrSpouse: { type: String },
    staffType: { 
      type: String, 
      required: true, 
    },
    presentDesignation: { type: String, required: true },
    postedOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    workingOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    designationAtFirstAppointment: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    dateOfFirstAppointment: { type: Date },
    dateOfRetirement: { type: Date },
    dateOfRecentPromotion: { type: Date },
    dateOfCurrentPosting: { type: Date },
    actualPlaceOfPosting: { type: String },
    basisOfWork: { type: String },
    highestQualification: { type: String },
    specializationSubject: { type: String }, 
    otherSpecialization: { type: String }, 
    pgUniversity: { type: String }, 
    bed: { type: Boolean }, 
    bedUniversity: { type: String }, 
    anyOtherCertification: { type: String },
    // salaryDetails: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeSalaries" },
    payScaleAndLevel: { type: String },
    basicPay: { type: String },
    grossSalary: { type: String },
    pensionScheme: { type: String, enum: ["NPS", "OPS"] },
    phoneNo: { type: String },
    email: { type: String },
    photograph: { type: String }, 
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    credentials: {
      passwordHash: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
