import mongoose from 'mongoose';
import  dotenv from "dotenv";
dotenv.config();

export  async function connectDB() {
  await mongoose.connect("mongodb+srv://ashrafulmomin2:1qt7HERDz2KdqK29@cluster0.ye51iwd.mongodb.net/storageApp").then(() => {
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

