import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();

const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.memoryStorage();
const uploadImage = multer({ storage });
const uploadmiddleware = uploadImage.single('images');

const cloud_name = process.env.CLOUD_NAME || '';
const api_key = process.env.API_NAME || '';
const api_secret = process.env.API_SECRET || '';

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      cb(new Error('file is not allowed'));
      return
    }
    cb(null, true);
  },
});
