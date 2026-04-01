const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const LibraryAttendant = require("../models/libraryAttendant");

// Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 1. Register student
exports.registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, studentId } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      studentId,
    });

    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 2. Register attendant
exports.registerAttendant = async (req, res, next) => {
  try {
    const { name, email, password, staffId } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const attendant = await LibraryAttendant.create({
      name,
      email,
      password: hashedPassword,
      staffId,
    });

    const token = generateToken(attendant._id);

    res.status(201).json({
      success: true,
      message: "Attendant registered successfully",
      token,
      data: {
        id: attendant._id,
        name: attendant.name,
        email: attendant.email,
        role: attendant.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 3. Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check student first, then attendant
    let user =
      (await Student.findOne({ email }).select("+password")) ||
      (await LibraryAttendant.findOne({ email }).select("+password"));

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
