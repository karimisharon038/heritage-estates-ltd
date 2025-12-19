const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const auth = require('../middleware/auth');

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'heritage-experience', allowed_formats: ['jpg','jpeg','png'] }
});
const parser = multer({ storage });

// GET all experience
router.get('/', auth, async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json({ experiences });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST new experience
router.post('/', auth, parser.array('images', 10), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title & content required" });
    const imageUrl = req.file ? req.file.path : '';
    const experience = new Experience({ title, content, imageUrl });
    await experience.save();
    res.json(experience);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update experience
router.put('/:id', authMiddleware, parser.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };
    if (req.file) updateData.imageUrl = req.file.path;
    const experience = await Experience.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(experience);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE experience
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Experience deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
