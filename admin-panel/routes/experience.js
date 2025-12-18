const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const Experience = require('../models/Experience');

// Cloudinary storage for single image
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'heritage-experience',
    allowed_formats: ['jpg','jpeg','png']
  }
});
const parser = multer({ storage });

// GET all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new experience
router.post('/', parser.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file.path;
    const experience = new Experience({ title, content, imageUrl });
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update experience
router.put('/:id', parser.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };
    if (req.file) updateData.imageUrl = req.file.path;
    const experience = await Experience.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE experience
router.delete('/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
