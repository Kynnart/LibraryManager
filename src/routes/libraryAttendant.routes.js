const express = require("express");
const router = express.Router();
const {
  getAllAttendants,
  createBulkAttendants,
  getAttendant,
  updateAttendant,
  deleteAttendant,
} = require("../controllers/libraryAttendant.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

// 1. GET all
router.get("/", protect, authorizeRoles("attendant"), getAllAttendants);

// 2. Bulk BEFORE /:id
router.post(
  "/bulk",
  protect,
  authorizeRoles("attendant"),
  createBulkAttendants,
);

// 3. Single resource routes
router.get("/:attendantId", protect, authorizeRoles("attendant"), getAttendant);
router.put(
  "/:attendantId",
  protect,
  authorizeRoles("attendant"),
  updateAttendant,
);
router.delete(
  "/:attendantId",
  protect,
  authorizeRoles("attendant"),
  deleteAttendant,
);

module.exports = router;
