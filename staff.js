const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const auth = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const Staff = require("../models/staff");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Get all staff (public)
 */
router.get("/", async (req, res) => {
  try {
    const list = await Staff.find().sort({ createdAt: -1 });
    res.json({ success: true, staff: list });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * Create staff profile (admin)
 */
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { name, position, bio } = req.body;
    let uploadedPhoto = {};

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "heritageestate/staff",
            resource_type: "auto"
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      uploadedPhoto = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const doc = await Staff.create({
      name,
      position,
      bio,
      photo: uploadedPhoto
    });

    res.json({ success: true, staff: doc });
  } catch (err) {
    console.error("Staff upload error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * Delete staff (admin)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const doc = await Staff.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    // delete profile image
    if (doc.photo?.public_id) {
      try {
        await cloudinary.uploader.destroy(doc.photo.public_id);
      } catch (e) {}
    }

    await doc.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("Delete staff error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
