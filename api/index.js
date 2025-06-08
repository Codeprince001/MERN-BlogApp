import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import { errorMiddlewareHandler } from "./middlewares/error.middleware.js";
import CookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(CookieParser());


mongoose.connect(process.env.MONGODb_URI)
  .then(() => {
    console.log("Connected to MongoDb Server");
  }
  ).catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(errorMiddlewareHandler);


// Serve static files from client build
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});

