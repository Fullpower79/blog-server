const express = require('express');
const Blog = require('../models/Blog');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      image: req.file ? req.file.filename : null,
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
  res.json(blogs);
});

router.get('/latest', async (req, res) => {
  const latest = await Blog.findOne().sort({ createdAt: -1 });
  res.json(latest);
});

module.exports = router;
