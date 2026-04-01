const express = require("express");
const router = express.Router();
const {
  createAuthor,
  createBulkAuthors,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/author.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  createAuthorValidator,
  updateAuthorValidator,
} = require("../validators/author.validator");
const validate = require("../middleware/validate.middleware");

// 1. GET all
router.get("/", protect, getAllAuthors);

// 2. POST single
router.post(
  "/",
  protect,
  authorizeRoles("attendant"),
  createAuthorValidator,
  validate,
  createAuthor,
);

// 3. Bulk BEFORE /:id
router.post("/bulk", protect, authorizeRoles("attendant"), createBulkAuthors);

// 4. Single resource routes
router.get("/:authorId", protect, getAuthor);
router.put(
  "/:authorId",
  protect,
  authorizeRoles("attendant"),
  updateAuthorValidator,
  validate,
  updateAuthor,
);
router.delete("/:authorId", protect, authorizeRoles("attendant"), deleteAuthor);

module.exports = router;
