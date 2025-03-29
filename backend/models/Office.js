import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
  officeName: { type: String, required: true },
  officeType: { type: String, required: true, enum: ['Administrative', 'Educational'] },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
  schools: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "School" }],
    validate: {
      validator: function (value) {
        return this.officeType === 'Educational' ? value.length > 0 : value.length === 0;
      },
      message: "Schools can only be associated with 'Educational' offices."
    },
    default: undefined
  },
  isDdo: { type: Boolean, default: false },
  ddoOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, 
  ddoCode: { type: String, unique: true, sparse: true },
  parentOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office" }, 
}, { timestamps: true });

export default mongoose.models.Office || mongoose.model("Office", OfficeSchema);

