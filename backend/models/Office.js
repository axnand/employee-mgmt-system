import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
  officeName: { type: String, required: true },
  officeType: { type: String, required: true, enum: ['Administrative', 'Educational'] },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
  ddoOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, 
  ddoCode: { type: String, unique: true, sparse: true },
  parentOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office" }, 
}, { timestamps: true });

export default mongoose.models.Office || mongoose.model("Office", OfficeSchema);
