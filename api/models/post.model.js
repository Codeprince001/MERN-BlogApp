import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      default: "https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-blogging_516790-1495.jpg?semt=ais_hybrid"
    },
    category: {
      type: String,
      default: "uncategorized"
    },
    slug: {
      type: String,
      required: true,
      unique: true
    }
  }, { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;