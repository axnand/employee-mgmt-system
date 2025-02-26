import mongoose from "mongoose";
import Employee from "./Employee.js";
import DailyAttendance from "./DailyAttendance.js";

const SchoolSchema = new mongoose.Schema({
  udiseCode: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String },
  principal: { type: String },
  contact: { type: String },
  scheme: { type: String },
  subScheme: { type: String },
  employees: [Employee.schema],
  numberOfStudents: { type: Number },
  dailyAttendance: [DailyAttendance.schema]
});

export default mongoose.model("School", SchoolSchema);
