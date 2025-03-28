import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true, enum: ['CEO', 'ZEO', 'School', 'Employee'] }
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
