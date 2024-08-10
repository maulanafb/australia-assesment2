import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  token: string;
  posts: mongoose.Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  token: { type: String },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
