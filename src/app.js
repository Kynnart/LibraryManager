require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDb = require("./config/db");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const authorRoutes = require("./routes/author.routes");
const studentRoutes = require("./routes/student.routes");
const attendantRoutes = require("./routes/libraryAttendant.routes");

const app = express();

// Connect to database
connectDb();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting — applies to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/authors", authorRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/attendants", attendantRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
