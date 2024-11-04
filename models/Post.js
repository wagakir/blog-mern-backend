import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: { type: Array, default: [] },
    viewsCount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    imageUrl: String,
  },

  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const post = mongoose.model("Post", PostSchema);
post.createIndexes();
export default post;
