import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
    offices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Office" }],
    zedioOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.models.Zone || mongoose.model("Zone", ZoneSchema);
