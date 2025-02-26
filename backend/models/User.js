import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    role: { 
      type: String, 
      enum: ["admin", "schoolAdmin", "staff"], 
      required: true 
    },
    password: { type: String, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    passwordChanged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
    
  };
  

export default mongoose.model("User", UserSchema);
