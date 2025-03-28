// models/District.js
import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.District || mongoose.model("District", DistrictSchema);
