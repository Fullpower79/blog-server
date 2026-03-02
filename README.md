# Blog Server

Express backend for the blog application.

## Setup

1. Copy `.env.example` (or create `.env`) and add your configuration values:
   ```dotenv
   MONGO_URI=your-mongo-connection-string
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (If not already installed) add Cloudinary support:
   ```bash
   npm install cloudinary multer-storage-cloudinary
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API

- `POST /api/blogs` – create a blog entry. Accepts `multipart/form-data` with fields `title`, `content`, `tags` and optional file input named `image`.
- `GET  /api/blogs` – retrieve all blog posts, optional `?tag=value` filter.
- `GET  /api/blogs/latest` – fetch the most recent post.

The server uploads any provided image to Cloudinary and stores the resulting URL in the `imageUrl` field of the blog document.