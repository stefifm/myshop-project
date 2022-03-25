import { config } from 'dotenv';
import { PORT, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } from './config';
import cloudinary from 'cloudinary';

import app from './app';
import './database';

config();

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the Server due to Uncaught Exception');
  process.exit(1);
});

// Cloudinary

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// Connecting to a Server
const server = app.listen(PORT);
console.log(`Server on port ${PORT}`);

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the Server due to Unhandled Promise Rejection');

  server.close(() => {
    process.exit(1);
  });
});
