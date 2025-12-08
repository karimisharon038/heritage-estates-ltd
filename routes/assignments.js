const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const auth = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const Assignment = require("../models/assignment");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Get all assignments (public)
 */
router.get("/", async (req, res) => {
  try {
    const list = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, assignments: list });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * Create new assignment (admin)
 */
router.post("/", auth, upload.array("images", 20), async (req, res) => {
  try {
    const { title, description } = req.body;

    const uploaded = [];
    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "heritageestate/assignments"
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      uploaded.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      });
    }

    const doc = await Assignment.create({
      title,
      description,
      images: uploaded
    });

    res.json({ success: true, assignment: doc });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * Delete assignment (admin)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const doc = await Assignment.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    // remove Cloudinary images
    for (const img of doc.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (e) {}
    }

    await doc.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
