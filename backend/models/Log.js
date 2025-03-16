import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    admin: { type: String, required: true }, // e.g., name or username
    role: { type: String, required: true }, // e.g., "Super Admin" or "Admin"
    action: { type: String, required: true }, // e.g., "Login", "Employee Transfer"
    school: { type: String, default: "-" }, 
    description: { type: String, required: true },
    ip: { type: String }, 
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
