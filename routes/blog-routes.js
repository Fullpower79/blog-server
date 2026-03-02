const express = require('express');
const Blog = require('../models/Blog');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// use Cloudinary as the multer storage engine; you can still fall back to disk if needed
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({ storage });

// POST /api/blogs
// expects multipart/form-data with an optional `image` field
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // multer-storage-cloudinary sets `path` to the uploaded file's URL
    const imageUrl = req.file ? req.file.path : null;

    const blog = new Blog({
      title,
      content,
      imageUrl,
      tags: tags ? tags.split(',') : []
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  const { tag } = req.query;

  let filter = {};
  if (tag) filter = { tags: tag };

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  // convert to plain objects and ensure `imageUrl` is set (for old docs might still have `image`)
  const normalized = blogs.map(blog => {
    const obj = blog.toObject();
    if (obj.image && !obj.imageUrl) {
      obj.imageUrl = obj.image;
      delete obj.image;
    }
    return obj;
  });
  res.json(normalized);
});
router.get('/latest', async (req, res) => {
  let latest = await Blog.findOne().sort({ createdAt: -1 });
  if (latest) {
    latest = latest.toObject();
    if (latest.image && !latest.imageUrl) {
      latest.imageUrl = latest.image;
      delete latest.image;
    }
  }
  res.json(latest);
});

module.exports = router;
