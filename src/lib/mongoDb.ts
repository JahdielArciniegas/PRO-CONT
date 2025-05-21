import mongoose from "mongoose";

const uri = import.meta.env.MONGO_URI;

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(uri, {
      dbName: "procont",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
