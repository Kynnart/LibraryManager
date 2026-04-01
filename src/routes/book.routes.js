const express = require("express");
const router = express.Router();
const {
  createBook,
  createBulkBooks,
  getAllBooks,
  getBook,
  getOverdueBooks,
  borrowBook,
  returnBook,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  borrowBookValidator,
  createBookValidator,
  updateBookValidator,
  returnBookValidator,
} = require("../validators/book.validator");
const validate = require("../middleware/validate.middleware");

// 1. GET all
router.get("/", protect, getAllBooks);

// 2. POST single
router.post(
  "/",
  protect,
  authorizeRoles("attendant"),
  createBookValidator,
  validate,
  createBook,
);

// 3. Bulk BEFORE /:id
router.post("/bulk", protect, authorizeRoles("attendant"), createBulkBooks);

// 4. Get overdue books
router.get("/overdue", protect, authorizeRoles("attendant"), getOverdueBooks);

// 5. Single resource routes
router.get("/:bookId", protect, getBook);
router.put(
  "/:bookId",
  protect,
  authorizeRoles("attendant"),
  updateBookValidator,
  validate,
  updateBook,
);
router.delete("/:bookId", protect, authorizeRoles("attendant"), deleteBook);

// 6. Nested routes
router.post(
  "/:bookId/borrow",
  protect,
  authorizeRoles("attendant"),
  borrowBookValidator,
  validate,
  borrowBook,
);
router.post(
  "/:bookId/return",
  protect,
  authorizeRoles("attendant"),
  returnBookValidator,
  validate,
  returnBook,
);

module.exports = router;
