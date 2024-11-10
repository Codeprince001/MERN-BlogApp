// multer.middleware.js
import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Export middleware for handling single file upload
export const uploadSingle = upload.single("image");
