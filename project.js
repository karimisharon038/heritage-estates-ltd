const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  }
});

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: 3,
      maxlength: 150
    },

    slug: {
      type: String,
      unique: true,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000
    },

    category: {
      type: String,
      enum: ["valuation", "survey", "management", "agency", "consultancy", "other"],
      default: "other"
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },

    images: {
      type: [ImageSchema],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "A project cannot have more than 20 images"
      }
    }
  },
  { timestamps: true }
);

// Auto-generate slug
ProjectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
