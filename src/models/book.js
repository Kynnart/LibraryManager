const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [200, "Title must not exceed 200 characters"],
      index: true,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    genre: {
      type: String,
      trim: true,
      maxlength: [50, "Genre must not exceed 50 characters"],
      index: true,
    },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "Quantity cannot be negative"],
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: [0, "Available copies cannot be negative"],
    },
    status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LibraryAttendant",
      default: null,
    },
    borrowedAt: {
      type: Date,
      default: null,
    },
    returnDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
