import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;

  operationType: string;
  rightArgument: number;
  username: string;
}

export const CommentSchema: Schema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    operationType: {
      type: String,
      enum: ["add", "subtract", "multiply", "divide"],
      required: true,
    },
    rightArgument: { type: Number, required: true },
    username: { type: String, required: true },
    result: { type: Number, required: true },
  },
  { timestamps: true }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
