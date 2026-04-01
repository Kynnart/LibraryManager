const { body, param } = require("express-validator");

// 1. Create book validator
exports.createBookValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("isbn").optional().trim().isISBN().withMessage("Invalid ISBN"),
  body("genre")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Genre must not exceed 50 characters"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("availableCopies")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Available copies cannot be negative"),
];

// 2. Update book validator
exports.updateBookValidator = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("isbn").optional().trim().isISBN().withMessage("Invalid ISBN"),
  body("genre")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Genre must not exceed 50 characters"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("availableCopies")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Available copies cannot be negative"),
];

// 3. Borrow book validator
exports.borrowBookValidator = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
  body("studentId").isMongoId().withMessage("Invalid student ID"),
  body("returnDate")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Return date must be in the future");
      }
      return true;
    }),
];

// 4. Return book validator
exports.returnBookValidator = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
  body("studentId").isMongoId().withMessage("Invalid student ID"),
];
