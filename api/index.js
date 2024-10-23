import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
console.log("key", process.env.MONGODb_URI);

mongoose.connect(process.env.MONGODb_URI)
  .then(() => {
    console.log("Connected to MongoDb Server");
  }
  ).catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});