const express = require("express");
const router = express.Router();
const {
  createAttendant,
  getAllAttendants,
  createBulkAttendants,
  getAttendant,
  updateAttendant,
  deleteAttendant,
} = require("../controllers/libraryAttendant.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

// 1. Create Attendant
router.post("/", protect, authorizeRoles("attendant"), createAttendant);

// 2. GET all Attendants
router.get("/", protect, authorizeRoles("attendant"), getAllAttendants);

// 3. Bulk Create Attendants
router.post(
  "/bulk",
  protect,
  authorizeRoles("attendant"),
  createBulkAttendants,
);

// 4. Single resource routes
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
