const bcrypt = require("bcryptjs");
const LibraryAttendant = require("../models/libraryAttendant");

// 1. Create single
exports.createAttendant = async (req, res, next) => {
  try {
    const { name, email, password, staffId } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const attendant = await LibraryAttendant.create({
      name,
      email,
      password: hashedPassword,
      staffId,
    });

    res.status(201).json({
      success: true,
      message: "Attendant created successfully",
      data: {
        id: attendant._id,
        name: attendant.name,
        email: attendant.email,
        staffId: attendant.staffId,
        role: attendant.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 2. Create bulk
exports.createBulkAttendants = async (req, res, next) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const attendants = await Promise.all(
      req.body.map(async (attendant) => ({
        ...attendant,
        password: await bcrypt.hash(attendant.password, saltRounds),
      })),
    );
    const created = await LibraryAttendant.insertMany(attendants, {
      ordered: false,
    });
    res.status(201).json({
      success: true,
      message: `${created.length} attendants created successfully`,
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

// 3. Get all
exports.getAllAttendants = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: new RegExp(search, "i") } : {};
    const skip = (page - 1) * limit;
    const total = await LibraryAttendant.countDocuments(query);
    const attendants = await LibraryAttendant.find(query)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: attendants,
    });
  } catch (err) {
    next(err);
  }
};

// 4. Get single
exports.getAttendant = async (req, res, next) => {
  try {
    const attendant = await LibraryAttendant.findById(
      req.params.attendantId,
    ).select("-password");

    if (!attendant) {
      return res
        .status(404)
        .json({ success: false, message: "Attendant not found" });
    }

    res.status(200).json({ success: true, data: attendant });
  } catch (err) {
    next(err);
  }
};

// 5. Update single
exports.updateAttendant = async (req, res, next) => {
  try {
    // Prevent password and role update through this route
    delete req.body.password;
    delete req.body.role;

    const attendant = await LibraryAttendant.findByIdAndUpdate(
      req.params.attendantId,
      req.body,
      { new: true, runValidators: true },
    ).select("-password");

    if (!attendant) {
      return res
        .status(404)
        .json({ success: false, message: "Attendant not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Attendant updated", data: attendant });
  } catch (err) {
    next(err);
  }
};

// 6. Delete single
exports.deleteAttendant = async (req, res, next) => {
  try {
    const attendant = await LibraryAttendant.findByIdAndDelete(
      req.params.attendantId,
    );

    if (!attendant) {
      return res
        .status(404)
        .json({ success: false, message: "Attendant not found" });
    }

    res.status(200).json({ success: true, message: "Attendant deleted" });
  } catch (err) {
    next(err);
  }
};
