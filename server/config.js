import { config } from 'dotenv';

config();

// MONGODB, MONGODB TEST AND NODE_ENV
export const MONGODB_URL = process.env.MONGODB_URL || '';
export const MONGODB_TEST = process.env.MONGODB_TEST || '';
export const NODE_ENV = process.env.NODE_ENV || '';

// PORT
export const PORT = process.env.PORT || '';

// FRONTEND URL
export const FRONTEND_URL = process.env.FRONTEND_URL || '';

// JWT KEY AND EXPIRE
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '';

// COOKIES EXPIRE
export const COOKIE_EXPIRE = process.env.COOKIE_EXPIRE || '';

// SMPT RESOURCES
export const SMPT_SERVICE = process.env.SMPT_SERVICE || '';
export const SMPT_MAIL = process.env.SMPT_MAIL || '';
export const SMPT_PASSWORD = process.env.SMPT_PASSWORD || '';
export const SMPT_HOST = process.env.SMPT_HOST || '';
export const SMPT_PORT = process.env.SMPT_PORT || '';

// CLOUDINARY
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

// STRIPE
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
