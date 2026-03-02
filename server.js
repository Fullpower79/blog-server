require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogRoutes = require('./routes/blog-routes');

const app = express();

app.use(cors({ origin: '*'}));
app.use(express.json());

// load cloudinary configuration (must come after dotenv)
require('./config/cloudinary');

// we don't need to serve local uploads any more; images come from Cloudinary
app.use('/api/blogs', blogRoutes);

// return JSON 404 for any /api/* routes that weren't matched
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// basic error handler to surface errors as JSON (helps for multer/cloudinary runtime errors)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || err });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
