const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  }
});

const ClientDocSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 3000
    },

    category: {
      type: String,
      enum: ["corporate", "individual", "government", "institution", "other"],
      default: "other"
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      sparse: true
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+()\s-]+$/, "Invalid phone number"],
      maxlength: 20
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },

    files: {
      type: [FileSchema],
      validate: {
        validator: (arr) => arr.length <= 30,
        message: "A client cannot have more than 30 uploaded files."
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientDoc", ClientDocSchema);
