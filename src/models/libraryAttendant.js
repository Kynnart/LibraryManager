const mongoose = require("mongoose");

const libraryAttendantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Attendant name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    staffId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      default: "attendant",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LibraryAttendant", libraryAttendantSchema);
