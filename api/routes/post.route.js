import { create, postImageUpload, getPosts, deletePost } from "../controllers/post.controller.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);
router.post("/upload-postImage", uploadSingle, postImageUpload);
router.get("/getPosts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);

export default router;