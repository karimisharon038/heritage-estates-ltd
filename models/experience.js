const mongoose = require("mongoose");

// ------------------- REVIEW SCHEMA -------------------
const ReviewSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "Review author is required"],
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: 1500
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      sparse: true
    },

    status: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible"
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

// ---------------- EXPERIENCE SCHEMA ------------------
const ExperienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Experience title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200
    },

    slug: {
      type: String,
      unique: true,
      index: true
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: 10000
    },

    reviews: {
      type: [ReviewSchema],
      validate: {
        validator: (arr) => arr.length <= 200,
        message: "Cannot exceed 200 reviews per experience entry."
      }
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    }
  },
  { timestamps: true }
);

// Auto create slug when title changes
ExperienceSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Experience", ExperienceSchema);
