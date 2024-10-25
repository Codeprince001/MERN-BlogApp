import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import { errorMiddlewareHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json());
dotenv.config();
console.log("key", process.env.MONGODb_URI);


mongoose.connect(process.env.MONGODb_URI)
  .then(() => {
    console.log("Connected to MongoDb Server");
  }
  ).catch((err) => {
    console.log(err);
  });


app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use(errorMiddlewareHandler);