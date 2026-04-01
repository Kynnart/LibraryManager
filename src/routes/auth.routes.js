const express = require("express");
const router = express.Router();
const {
  registerStudent,
  registerAttendant,
  login,
} = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");
const validate = require("../middleware/validate.middleware");

// 1. Register student
router.post("/register/student", registerValidator, validate, registerStudent);

// 2. Register attendant
router.post(
  "/register/attendant",
  registerValidator,
  validate,
  registerAttendant,
);

// 3. Login
router.post("/login", loginValidator, validate, login);

module.exports = router;
