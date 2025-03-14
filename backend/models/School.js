// models/School.js
import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    udiseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String },
    principal: { type: String },
    contact: { type: String },
    scheme: { type: String },
    subScheme: { type: String },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    numberOfStudents: { type: Number },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.School || mongoose.model("School", SchoolSchema);
