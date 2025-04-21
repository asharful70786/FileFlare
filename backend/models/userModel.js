import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true , "name field should a string with at least three characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    rootDirId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);  

 const User = mongoose.model("User", userSchema);
export default User;