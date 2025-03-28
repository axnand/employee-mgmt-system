import mongoose from "mongoose";

const EmployeeSalariesSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  basicPay: { type: mongoose.Schema.Types.ObjectId, ref: "BasicPay", required: true },
  daPercentage: { type: Number },
  hra: { type: mongoose.Schema.Types.ObjectId, ref: "HRA", required: true },
  otherAllowances: { type: Number, default: 0 },
  grossSalary: { type: Number }
}, { timestamps: true });

export default mongoose.models.EmployeeSalaries || mongoose.model("EmployeeSalaries", EmployeeSalariesSchema);
