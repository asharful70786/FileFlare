import mongoose from 'mongoose';

export  async function connectDB() {
  await mongoose.connect("mongodb://admin:admin@localhost:27017/storageApp?authSource=admin").then(() => {
    console.log("Connected to MongoDB");
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

