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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
