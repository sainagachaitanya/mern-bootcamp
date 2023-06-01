import mongoose from "mongoose";

const ConnectionString = process.env.MONGO_URL;

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(ConnectionString);
    console.log(`[INFO] MongoDB Connected: ${ConnectionString}`);
  } catch (error) {
    console.log("[ERROR] Couldn't Connect to MongoDB");
    console.log(error);
    process.exit(1);
  }
}

export default ConnectDatabase;