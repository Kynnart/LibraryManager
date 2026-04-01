const { body, param } = require("express-validator");

// 1. Register student validator
exports.createStudentValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("studentId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Student ID cannot be empty"),
];

// 2. Update student validator
exports.updateStudentValidator = [
  param("studentId").isMongoId().withMessage("Invalid student ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),
  body("studentId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Student ID cannot be empty"),
];
