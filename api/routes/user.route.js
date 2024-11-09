import express from "express";
import { test, updateUserProfilePicture } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.patch("/update-profile-picture", updateUserProfilePicture);

export default router;