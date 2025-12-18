const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Client = require('../models/Client');
const Experience = require('../models/Experience');

// GET dashboard summary
router.get('/', async (req, res) => {
  try {
    const projectCount = await Project.countDocuments();
    const clientCount = await Client.countDocuments();
    const experienceCount = await Experience.countDocuments();

    res.json({
      projects: projectCount,
      clients: clientCount,
      experiences: experienceCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
