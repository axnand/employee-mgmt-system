import mongoose from "mongoose";
import School from "./School.js";

const ZoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true }, // e.g. "Assar"
  zonation: { type: String }, // e.g. "I"
  schools: [School.schema]
});

export default mongoose.model("Zone", ZoneSchema);
