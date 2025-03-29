import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    udiseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String },
    principal: { type: String },
    contact: { type: String },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true, unique: true },
    isPMShiriSchool: { type: Boolean, default: false },
    feasibilityZone: { type: String, required: true },
    scheme: { type: String },
    subScheme: { type: String },
    dateOfUpgrade: { type: Date },
    dateOfEstablishment: { type: Date },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    numberOfStudents: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.School || mongoose.model("School", SchoolSchema);
