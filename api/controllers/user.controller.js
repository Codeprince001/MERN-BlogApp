import User from "../models/user.model.js";
import * as dotenv from "dotenv";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import bcryptjs from "bcryptjs";

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.S3_BUCKET_REGION;

const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  region
});

export const updateUserProfile = async (req, res) => {
  const { userId: id } = req.params;
  if (req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not authorized to update this user"));
  }
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  const file = req.file;
  let signedUrl;


  try {
    if (file) {
      const fileKey = `profile-pictures/${Date.now()}_${file.originalname.substring(0, 5).trim()}`;
      // Upload file to s3 Bucket
      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Generate a signed Url
      signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }), {
        expiresIn: 3600, // Expires in 1 hour
      });
    }


    const updateData = {
      ...req.body,
      ...(file && { profilePicture: signedUrl }),
    };

    delete updateData.id;
    delete updateData.email;
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profilePicture: signedUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id != req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }

};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(403, "Permission not allowed");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    return res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
};