const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const Project = require('../models/Project');

// Cloudinary storage for multiple images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'heritage-projects',
    allowed_formats: ['jpg','jpeg','png']
  }
});
const parser = multer({ storage });

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new project (multiple images)
router.post('/', parser.array('images', 10), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const project = new Project({
      title,
      content,
      imageUrls
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update project
router.put('/:id', parser.array('images', 10), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };
    if (req.files.length) updateData.imageUrls = req.files.map(f => f.path);
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
