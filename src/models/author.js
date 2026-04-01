const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
      index: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio must not exceed 500 characters"],
    },
    dob: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Author", authorSchema);
