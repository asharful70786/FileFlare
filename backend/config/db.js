import mongoose from 'mongoose';
import  dotenv from "dotenv";
dotenv.config();

export  async function connectDB() {
  await mongoose.connect(process.env.mongoose_url).then(() => {
    console.log("Connected to MongoDB of atlas storageApp");
  }).catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
  
}
process.on("SIGINT", async () => {  
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
}
);

