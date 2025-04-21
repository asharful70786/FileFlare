import { model, Schema } from "mongoose";

const directorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Directory",
    },
  },

);

const Directory = model("Directory", directorySchema);

export default Directory;
