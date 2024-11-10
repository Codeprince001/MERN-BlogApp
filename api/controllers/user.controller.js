import User from "../models/user.model.js";
import * as dotenv from "dotenv";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
  const { userId, profilePictureUrl } = req.body;
  const file = req.file;
  const fileKey = `profile-pictures/${Date.now()}_${file.originalname.substring(0, 5).trim()}`;

  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {

    // Upload file to s3 Bucket
    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate a signed Url
    // const getObjectParams = {
    //   Bucket: bucketName,
    //   Key: fileKey,
    // };
    // const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), {
    //   expiresIn: 3600,
    // });

    // const updateUser = await User.findByIdAndUpdate(userId, { profilePicture: signedUrl }, { new: true });
    // console.log(updateUser);

    // if (!updateUser) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // res.status(200).json({
    //   message: "Profile picture updated successfully",
    //   profilePicture: signedUrl,
    // });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};