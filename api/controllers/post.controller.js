import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import * as dotenv from "dotenv";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


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


export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");

  const newPost = new Post({ ...req.body, slug, userId: req.user.id, image: req.body.imageFileUrl });

  try {
    const savedPost = await newPost.save();
    res.status(201).json({ savedPost });
  } catch (error) {
    next(error);
  }
};


export const postImageUpload = async (req, res, next) => {
  const file = req.file;
  let signedUrl;



  try {

    if (file) {
      const time = new Date().getTime();
      const fileKey = `post-Images/${time}_${file.originalname.substring(0, 10).trim(" ")}`;
      // Upload file to s3 Bucket
      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Generate a signed Url
      signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      }), {
        expiresIn: 7 * 24 * 3600, // Expires in 1 hour
      });

    }
    res.status(200).json({
      message: "Profile updated successfully",
      signedUrl,
    });

  } catch (error) {
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    // Fetch posts using the constructed query
    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const timeNow = new Date();
    const oneMonthAgo = new Date(
      timeNow.getFullYear(),
      timeNow.getMonth() - 1,
      timeNow.getDate()
    );
    const lastMonthsPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ posts, totalPosts, lastMonthsPosts });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id != req.params.userId) {
    return next(403, "You are not allowed to delete this post");
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post have been deleted");
  } catch (error) {
    next(error);
  }
};