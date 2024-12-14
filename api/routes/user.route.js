import express from "express";
import { deleteUser, getUser, getUsers, signout, updateUserProfile } from "../controllers/user.controller.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update-profile/:userId", verifyToken, uploadSingle, updateUserProfile);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);


export default router;