const Author = require("../models/author");

// 1. Create single
exports.createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Author created", data: author });
  } catch (err) {
    next(err);
  }
};

// 2. Create bulk
exports.createBulkAuthors = async (req, res, next) => {
  try {
    const authors = await Author.insertMany(req.body, { ordered: false });
    res.status(201).json({
      success: true,
      message: `${authors.length} authors created successfully`,
      data: authors,
    });
  } catch (err) {
    next(err);
  }
};

// 3. Get all
exports.getAllAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: new RegExp(search, "i") } : {};
    const skip = (page - 1) * limit;
    const total = await Author.countDocuments(query);
    const authors = await Author.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: authors,
    });
  } catch (err) {
    next(err);
  }
};

// 4. Get single
exports.getAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId);
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }
    res.status(200).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
};

// 5. Update single
exports.updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true, runValidators: true },
    );
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Author updated", data: author });
  } catch (err) {
    next(err);
  }
};

// 6. Delete single
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.authorId);
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }
    res.status(200).json({ success: true, message: "Author deleted" });
  } catch (err) {
    next(err);
  }
};
