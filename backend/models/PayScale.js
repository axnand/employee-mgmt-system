import mongoose from "mongoose";

const PayScaleSchema = new mongoose.Schema({
  payCommission: { type: mongoose.Schema.Types.ObjectId, ref: "PayCommission", required: true },
  payLevelCode: { type: String, required: true, unique: true },  
  scaleRange: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.PayScale || mongoose.model("PayScale", PayScaleSchema);
