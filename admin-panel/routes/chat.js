const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// GET all chat messages
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 }); // oldest first
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new chat message
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: "Name and message required" });

    const chat = new Chat({ name, message });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
