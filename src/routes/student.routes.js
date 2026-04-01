const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  createBulkStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const { updateStudentValidator } = require("../validators/student.validator");
const validate = require("../middleware/validate.middleware");

// 1. Create Student
router.post("/", protect, authorizeRoles("attendant"), createStudent);

// 2. GET all Students
router.get("/", protect, authorizeRoles("attendant"), getAllStudents);

// 3. Bulk Create Students
router.post("/bulk", protect, authorizeRoles("attendant"), createBulkStudents);

// 4. Single resource routes
router.get("/:studentId", protect, getStudent);
router.put(
  "/:studentId",
  protect,
  updateStudentValidator,
  validate,
  updateStudent,
);
router.delete(
  "/:studentId",
  protect,
  authorizeRoles("attendant"),
  deleteStudent,
);

module.exports = router;
