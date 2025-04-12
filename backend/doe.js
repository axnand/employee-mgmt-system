import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourDatabaseName";

const cleanOfficeCollection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("offices");

    // Drop index if exists
    const indexes = await collection.indexes();
    const indexToDrop = indexes.find(index => index.name === "officeId_1");
    if (indexToDrop) {
      await collection.dropIndex("officeId_1");
      console.log("✅ Dropped index 'officeId_1'");
    } else {
      console.log("ℹ️ No 'officeId_1' index found.");
    }

    // Remove officeId field from all documents
    const result = await collection.updateMany({}, { $unset: { officeId: "" } });
    console.log(`✅ Removed 'officeId' field from ${result.modifiedCount} documents.`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

cleanOfficeCollection();
