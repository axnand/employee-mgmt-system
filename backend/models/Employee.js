import mongoose from "mongoose";

const PostingSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: { type: String }, 
    parentageOrSpouse: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    postedOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    workingOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    designationAtAppointment: { type: String, required: true },
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
    currentPayScaleAndLevel: { type: String }, 
    currentBasicPay: { type: String }, 
    grossSalary: { type: String }, 
    pensionScheme: { type: String, enum: ["NPS", "OPS"] },
    previousPostings: [PostingSchema],
    phoneNo: { type: String },
    email: { type: String },
    photograph: { type: String }, 
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    credentials: {
      username: { type: String, unique: true, sparse: true },
      passwordHash: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
