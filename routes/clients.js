const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinary");
const ClientDoc = require("../models/clientDoc");
const auth = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * PUBLIC: Get all client documents
 */
router.get("/", async (req, res) => {
  try {
    const docs = await ClientDoc.find().sort({ createdAt: -1 });
    res.json({ success: true, docs });
  } catch (err) {
    console.error("Fetch clients error:", err);
    res.status(500).json({ success: false, msg: "Failed to load client documents" });
  }
});

/**
 * ADMIN: Upload client documents
 */
router.post("/", auth, upload.array("files", 12), async (req, res) => {
  try {
    const { clientName, notes } = req.body;
    const files = req.files || [];

    if (!clientName) return res.status(400).json({ msg: "clientName is required" });

    const uploadedFiles = [];

    for (const file of files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "heritageestate/clients",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      uploadedFiles.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        filename: file.originalname,
      });
    }

    const newClientDoc = new ClientDoc({
      clientName,
      notes: notes || "",
      files: uploadedFiles,
    });

    await newClientDoc.save();

    res.json({ success: true, doc: newClientDoc });
  } catch (err) {
    console.error("Client upload error:", err);
    res.status(500).json({ success: false, msg: "Upload failed", error: err });
  }
});

/**
 * ADMIN: Delete client document
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const doc = await ClientDoc.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    // Delete files from Cloudinary
    for (const f of doc.files) {
      try {
        await cloudinary.uploader.destroy(f.public_id);
      } catch (err) {
        console.warn("Failed deleting Cloudinary file:", err);
      }
    }

    await doc.remove();
    res.json({ success: true, msg: "Client document deleted" });
  } catch (err) {
    console.error("Delete client error:", err);
    res.status(500).json({ msg: "Server error deleting client file" });
  }
});

/**
 * ADMIN: Update notes or name
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { clientName, notes } = req.body;
    const doc = await ClientDoc.findById(req.params.id);

    if (!doc) return res.status(404).json({ msg: "Document not found" });

    if (clientName) doc.clientName = clientName;
    if (notes) doc.notes = notes;

    await doc.save();
    res.json({ success: true, doc });
  } catch (err) {
    console.error("Client update error:", err);
    res.status(500).json({ msg: "Server error updating client doc" });
  }
});

module.exports = router;
