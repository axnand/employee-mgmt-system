import mongoose from "mongoose";

const PostingSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema({
  sanctionedPost: { type: String, required: true }, 
  employeeName: { type: String, required: true },
  employeeId: { type: Number, required: true, unique: true },
  staffType: { type: String, enum: ["teaching", "non-teaching"], required: true },
  dateOfBirth: { type: Date },
  dateOfFirstAppointment: { type: Date },
  designationAtFirstAppointment: { type: String },
  qualification: { type: String },
  subjectInPG: { type: String },
  presentDesignation: { type: String },
  dateOfLatestPromotion: { type: Date },
  dateOfRetirement: { type: Date },
  dateOfCurrentPosting: { type: Date },
  previousPostings: [PostingSchema], 
  currentPayScale: { type: String },
  payLevel: { type: String },
  grossSalary: { type: String },
  pensionScheme: { type: String, enum: ["NPS", "OPS"] },
  
}, { timestamps: true });

export default mongoose.model("Employee", EmployeeSchema);
