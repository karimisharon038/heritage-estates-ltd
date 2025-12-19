const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'heritage-clients', allowed_formats: ['jpg','jpeg','png'] }
});
const parser = multer({ storage });

// GET all clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ clients });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST new client
router.post('/', auth, parser.array('images', 10), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const imageUrl = req.file ? req.file.path : '';
    const client = new Client({ title, content, imageUrl });
    await client.save();
    res.json(client);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update client
router.put('/:id', authMiddleware, parser.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };
    if (req.file) updateData.imageUrl = req.file.path;
    const client = await Client.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(client);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE client
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
