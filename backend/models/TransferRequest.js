// models/TransferRequest.js
import mongoose from "mongoose";

const TransferRequestSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    fromSchool: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    toSchool: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved_by_main", "accepted_by_receiving", "rejected"],
      default: "pending",
    },
    comment: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.TransferRequest ||
  mongoose.model("TransferRequest", TransferRequestSchema);
