import express from "express";
import { updateUserProfile } from "../controllers/user.controller.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";


const router = express.Router();



router.put("/update-profile", uploadSingle, updateUserProfile);

export default router;