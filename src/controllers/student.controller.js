const bcrypt = require("bcryptjs");
const Student = require("../models/student");

// 1. Create bulk
exports.createBulkStudents = async (req, res, next) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const students = await Promise.all(
      req.body.map(async (student) => ({
        ...student,
        password: await bcrypt.hash(student.password, saltRounds),
      })),
    );
    const created = await Student.insertMany(students, { ordered: false });
    res.status(201).json({
      success: true,
      message: `${created.length} students created successfully`,
      data: created.map(({ password, ...rest }) => rest),
    });
  } catch (err) {
    next(err);
  }
};

// 2. Get all
exports.getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: new RegExp(search, "i") } : {};
    const skip = (page - 1) * limit;
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select("-password")
      .populate("borrowedBooks", "title isbn")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

// 3. Get single
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .select("-password")
      .populate("borrowedBooks", "title isbn status returnDate");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

// 4. Update single
exports.updateStudent = async (req, res, next) => {
  try {
    // Prevent password and role update through this route
    delete req.body.password;
    delete req.body.role;

    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true, runValidators: true },
    ).select("-password");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Student updated", data: student });
  } catch (err) {
    next(err);
  }
};

// 5. Delete single
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (err) {
    next(err);
  }
};
