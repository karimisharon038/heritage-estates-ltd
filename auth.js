const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

// Helper: generate JWT
function generateToken(admin) {
  return jwt.sign(
    { admin: { id: admin._id, role: admin.role } },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

/*==============================================
  REGISTER ADMIN  (USE ONLY ONCE TO CREATE SUPERADMIN)
================================================*/
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let admin = await Admin.findOne({ email });
    if (admin)
      return res.status(400).json({ msg: "An admin with this email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin
    admin = new Admin({
      email,
      passwordHash,
      name,
      role: "superadmin" // default first admin highest privilege
    });

    await admin.save();

    // Return token
    const token = generateToken(admin);
    return res.json({ msg: "Admin registered", token });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/*==============================================
  LOGIN ADMIN
================================================*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    // Check suspended
    if (admin.status === "suspended") {
      return res
        .status(403)
        .json({ msg: "Account suspended. Contact system administrator." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Update login stats
    admin.lastLogin = new Date();
    admin.loginCount = admin.loginCount + 1;
    await admin.save();

    // Return JWT
    const token = generateToken(admin);

    res.json({
      msg: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        loginCount: admin.loginCount,
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
