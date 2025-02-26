import mongoose from "mongoose";
import Zone from "./Zone.js";

const DistrictSchema = new mongoose.Schema({
  districtName: { type: String, required: true }, // e.g. "Central District"
  zones: [Zone.schema]
});

export default mongoose.model("District", DistrictSchema);
