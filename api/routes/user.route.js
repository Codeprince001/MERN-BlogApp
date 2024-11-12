import express from "express";
import { updateUserProfile } from "../controllers/user.controller.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();



router.put("/update-profile", verifyToken, uploadSingle, updateUserProfile);

export default router;