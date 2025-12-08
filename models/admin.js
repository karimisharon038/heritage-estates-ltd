const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"]
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"]
    },

    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin"
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },

    lastLogin: {
      type: Date,
      default: null
    },

    loginCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Ensure email index exists (important for login performance)
AdminSchema.index({ email: 1 });

module.exports = mongoose.model("Admin", AdminSchema);
