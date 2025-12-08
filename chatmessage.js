const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Sender email is required"],
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"]
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 5,
      maxlength: 2000
    },

    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new"
    },

    read: {
      type: Boolean,
      default: false
    },

    ipAddress: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Index for faster admin dashboard loading
ChatMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
