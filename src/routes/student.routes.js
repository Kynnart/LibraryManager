const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  createBulkStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const { updateStudentValidator } = require("../validators/student.validator");
const validate = require("../middleware/validate.middleware");

// 1. GET all
router.get("/", protect, authorizeRoles("attendant"), getAllStudents);

// 2. Bulk BEFORE /:id
router.post("/bulk", protect, authorizeRoles("attendant"), createBulkStudents);

// 3. Single resource routes
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
