import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    role: {
      type: String,
      default: "user"
    },
    contact: {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", schema);
