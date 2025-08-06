# Environment Configuration

The `.env` file is located in the **root directory** (not inside client or server folders) and contains configuration for both frontend and backend.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
   VITE_API_BASE_URL=http://localhost:5000/api
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ```

## How it works

- **Frontend (Vite)**: Uses `envDir: '../'` in `vite.config.js` to load `.env` from root
- **Backend (Node.js)**: Uses `require('dotenv').config({ path: '../.env' })` to load from root
- **Variables**: Frontend vars must start with `VITE_`, backend vars can be any name

## Benefits

- Single source of truth for environment variables
- Easier management and deployment
- No duplicate configuration files
- Better security (single file to protect)
