import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  postName: { type: String, required: true },
  postCategory: { type: String, required: true, enum: ['Teaching', 'Non-Teaching', 'Administrative'] },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
