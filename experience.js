const express = require("express");
const router = express.Router();
const Experience = require("../models/experience");
const auth = require("../middleware/auth");

/**
 * PUBLIC – Get experience + reviews
 */
router.get("/", async (req, res) => {
  try {
    let exp = await Experience.findOne().sort({ createdAt: -1 });
    if (!exp) {
      return res.json({
        success: true,
        experience: {
          title: "",
          content: "",
          reviews: [],
        },
      });
    }

    res.json({ success: true, experience: exp });
  } catch (err) {
    console.error("Experience fetch error:", err);
    res.status(500).json({ success: false, msg: "Failed to load experience" });
  }
});

/**
 * ADMIN – Create or update main experience content
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, reviews } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: "Title & content are required" });
    }

    let exp = await Experience.findOne();

    if (!exp) {
      exp = new Experience({
        title,
        content,
        reviews: Array.isArray(reviews) ? reviews : [],
      });
    } else {
      exp.title = title;
      exp.content = content;

      if (Array.isArray(reviews)) {
        exp.reviews = reviews;
      }
    }

    await exp.save();
    res.json({ success: true, experience: exp });
  } catch (err) {
    console.error("Experience update error:", err);
    res.status(500).json({ success: false, msg: "Server error updating" });
  }
});

/**
 * PUBLIC – Add a review
 * (If you want this protected, add auth as second param)
 */
router.post("/review", async (req, res) => {
  try {
    const { author, text, rating } = req.body;

    if (!author || !text || !rating) {
      return res.status(400).json({ msg: "All fields required" });
    }

    let exp = await Experience.findOne();
    if (!exp) {
      exp = new Experience({
        title: "Experience",
        content: "",
        reviews: [],
      });
    }

    exp.reviews.push({
      author,
      text,
      rating: Number(rating),
    });

    await exp.save();
    res.json({ success: true, experience: exp });
  } catch (err) {
    console.error("Review add error:", err);
    res.status(500).json({ success: false, msg: "Failed to add review" });
  }
});

/**
 * ADMIN – Delete a review
 */
router.delete("/review/:id", auth, async (req, res) => {
  try {
    let exp = await Experience.findOne();
    if (!exp) return res.status(404).json({ msg: "Experience not found" });

    exp.reviews = exp.reviews.filter(
      (rev) => rev._id.toString() !== req.params.id
    );

    await exp.save();
    res.json({ success: true, experience: exp });
  } catch (err) {
    console.error("Review delete error:", err);
    res.status(500).json({ msg: "Failed to delete review" });
  }
});

/**
 * ADMIN – Update a specific review
 */
router.put("/review/:id", auth, async (req, res) => {
  try {
    const { author, text, rating } = req.body;

    let exp = await Experience.findOne();
    if (!exp) return res.status(404).json({ msg: "Experience not found" });

    const review = exp.reviews.id(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    if (author) review.author = author;
    if (text) review.text = text;
    if (rating) review.rating = Number(rating);

    await exp.save();
    res.json({ success: true, experience: exp });
  } catch (err) {
    console.error("Review update error:", err);
    res.status(500).json({ msg: "Failed to update review" });
  }
});

module.exports = router;
