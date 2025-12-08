const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinary");
const Project = require("../models/project");
const auth = require("../middleware/auth");

// Multer memory storage with file size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

/* ---------------------------------------------------------
   PUBLIC – Get all projects
--------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    console.error("❌ Project fetch error:", err);
    res.status(500).json({ success: false, msg: "Failed to load projects" });
  }
});

/* ---------------------------------------------------------
   ADMIN – Create new project with uploaded images
--------------------------------------------------------- */
router.post("/", auth, upload.array("images", 12), async (req, res) => {
  try {
    const { title, description } = req.body;
    const files = req.files || [];

    if (!title) {
      return res.status(400).json({ success: false, msg: "Title is required" });
    }

    const uploadedImages = [];

    for (const file of files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "heritage/projects", // Clean organized folder
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      uploadedImages.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    const project = new Project({
      title,
      description: description || "",
      images: uploadedImages,
    });

    await project.save();

    res.json({ success: true, project });
  } catch (err) {
    console.error("❌ Project upload error:", err);
    res.status(500).json({ success: false, msg: "Upload failed", error: err });
  }
});

/* ---------------------------------------------------------
   ADMIN – Update project text only
--------------------------------------------------------- */
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project)
      return res.status(404).json({ success: false, msg: "Project not found" });

    if (title) project.title = title;
    if (description) project.description = description;

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error("❌ Project update error:", err);
    res.status(500).json({
      success: false,
      msg: "Server error updating project",
    });
  }
});

/* ---------------------------------------------------------
   ADMIN – Delete project + Cloudinary images
--------------------------------------------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, msg: "Project not found" });

    // Remove images from Cloudinary
    for (const img of project.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (e) {
        console.warn("⚠ Cloudinary delete failed:", img.public_id);
      }
    }

    await project.remove();

    res.json({ success: true, msg: "Project deleted" });
  } catch (err) {
    console.error("❌ Project deletion error:", err);
    res.status(500).json({ success: false, msg: "Server error deleting project" });
  }
});

module.exports = router;
