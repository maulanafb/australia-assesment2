import mongoose, { Schema, Document } from "mongoose";
import { CommentSchema } from "./Comment";

// Define the Operation subdocument schema
const OperationSchema = new Schema({
  type: {
    type: String,
    enum: ["add", "subtract", "multiply", "divide"],
    required: true,
  },
  rightArgument: { type: Number, required: true },
  result: { type: Number, required: true },
  username: { type: String, required: true },
});

const PostSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startingNumber: { type: Number, required: true },
    username: { type: String, required: true },
    operations: [OperationSchema],
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
