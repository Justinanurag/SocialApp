import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database Connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
