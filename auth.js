const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

/**
 * Authentication Middleware
 * Verifies JWT token and loads admin from DB
 */
module.exports = async function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader)
      return res.status(401).json({ msg: "No authorization header provided" });

    const token = authHeader.replace("Bearer ", "");

    if (!token)
      return res.status(401).json({ msg: "No token, access denied" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin; // contains admin.id & role

    // Fetch admin from DB to ensure it still exists
    const adminRecord = await Admin.findById(req.admin.id);

    if (!adminRecord)
      return res.status(401).json({ msg: "Admin account no longer exists" });

    // Check if admin is suspended
    if (adminRecord.status === "suspended") {
      return res.status(403).json({
        msg: "Your account is suspended. Contact system administrator.",
      });
    }

    req.adminRecord = adminRecord; // attach the full admin document

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

