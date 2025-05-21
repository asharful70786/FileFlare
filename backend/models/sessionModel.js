import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token expires in 1 hour
    },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;