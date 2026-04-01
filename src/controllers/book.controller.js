const Book = require("../models/book");
const Student = require("../models/student");

// 1. Create single
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Book created", data: book });
  } catch (err) {
    next(err);
  }
};

// 2. Create bulk
exports.createBulkBooks = async (req, res, next) => {
  try {
    const books = await Book.insertMany(req.body, { ordered: false });
    res.status(201).json({
      success: true,
      message: `${books.length} books created successfully`,
      data: books,
    });
  } catch (err) {
    next(err);
  }
};

// 3. Get all
exports.getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, genre, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (genre) query.genre = new RegExp(genre, "i");
    if (search) query.title = new RegExp(search, "i");

    const skip = (page - 1) * limit;
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate("authors", "name")
      .populate("borrowedBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: books,
    });
  } catch (err) {
    next(err);
  }
};

// 4. Get single
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate("authors", "name bio")
      .populate("borrowedBy", "name email")
      .populate("issuedBy", "name email");

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// 5. Update single
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Book updated", data: book });
  } catch (err) {
    next(err);
  }
};

// 6. Delete single
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, message: "Book deleted" });
  } catch (err) {
    next(err);
  }
};

// 7. Borrow book
exports.borrowBook = async (req, res, next) => {
  try {
    const { studentId, returnDate } = req.body;
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.availableCopies < 1) {
      return res
        .status(400)
        .json({ success: false, message: "No available copies" });
    }

    book.availableCopies -= 1;
    book.status = book.availableCopies === 0 ? "OUT" : "IN";
    book.borrowedBy = studentId;
    book.issuedBy = req.user._id;
    book.borrowedAt = new Date();
    book.returnDate = new Date(returnDate);

    await book.save();

    await Student.findByIdAndUpdate(studentId, {
      $push: { borrowedBooks: book._id },
    });

    res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      data: book,
    });
  } catch (err) {
    next(err);
  }
};

// 8. Return book
exports.returnBook = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.status === "IN" && book.availableCopies === book.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Book is not currently borrowed" });
    }

    book.availableCopies += 1;
    book.status = "IN";
    book.borrowedBy = null;
    book.issuedBy = null;
    book.borrowedAt = null;
    book.returnDate = null;

    await book.save();

    await Student.findByIdAndUpdate(studentId, {
      $pull: { borrowedBooks: book._id },
    });

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: book,
    });
  } catch (err) {
    next(err);
  }
};
