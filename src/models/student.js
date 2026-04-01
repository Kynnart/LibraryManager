const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
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
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
