const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/chatmessage");
const auth = require("../middleware/auth");

/**
 * PUBLIC: Website sends chat message
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message || (!name && !email)) {
      return res.status(400).json({
        success: false,
        msg: "Message, and either name or email, are required",
      });
    }

    const newMsg = new ChatMessage({
      name: name || "Anonymous",
      email: email || "",
      message,
    });

    await newMsg.save();
    res.json({ success: true, msg: "Message received" });
  } catch (err) {
    console.error("Chat POST error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

/**
 * ADMIN: Get all messages
 */
router.get("/", auth, async (req, res) => {
  try {
    const msgs = await ChatMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages: msgs });
  } catch (err) {
    console.error("Chat GET error:", err);
    res.status(500).json({ msg: "Unable to fetch messages" });
  }
});

/**
 * ADMIN: Mark as read
 */
router.put("/:id/read", auth, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ msg: "Message not found" });

    msg.read = true;
    await msg.save();

    res.json({ success: true, msg: "Marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * ADMIN: Mark as unread
 */
router.put("/:id/unread", auth, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ msg: "Message not found" });

    msg.read = false;
    await msg.save();

    res.json({ success: true, msg: "Marked as unread" });
  } catch (err) {
    console.error("Mark unread error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * ADMIN: Delete message
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const msg = await ChatMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ msg: "Message not found" });

    res.json({ success: true, msg: "Message deleted" });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
