const { body, param } = require("express-validator");

// 1. Create author validator
exports.createAuthorValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for date of birth"),
];

// 2. Update author validator
exports.updateAuthorValidator = [
  param("authorId").isMongoId().withMessage("Invalid author ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for date of birth"),
];
