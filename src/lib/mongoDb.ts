import mongoose from "mongoose";

const uri = import.meta.env.MONGO_URI;

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
