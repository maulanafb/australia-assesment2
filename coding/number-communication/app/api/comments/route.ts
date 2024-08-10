import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/connectToDatabase";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

connectToDatabase();

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { postId, userId, type, rightArgument, username } = json;

  if (!postId || !userId || !type || rightArgument === undefined) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // Find the post to calculate the result
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // Get the last result from the post's operations
    const lastResult =
      post.operations.length > 0
        ? post.operations[post.operations.length - 1].result
        : post.startingNumber;

    // Calculate the new result based on the operation type
    let result;
    switch (type) {
      case "add":
        result = lastResult + rightArgument;
        break;
      case "subtract":
        result = lastResult - rightArgument;
        break;
      case "multiply":
        result = lastResult * rightArgument;
        break;
      case "divide":
        if (rightArgument === 0) {
          return NextResponse.json(
            { error: "Cannot divide by zero." },
            { status: 400 }
          );
        }
        result = lastResult / rightArgument;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation type." },
          { status: 400 }
        );
    }

    // Create and save the comment
    const comment = new Comment({
      postId,
      userId,
      type,
      rightArgument,
      result,
      username,
      operationType: type,
    });
    await comment.save();

    // Update the post's operations
    post.operations.push({
      operationType: type,
      type,
      postId,
      userId,
      rightArgument,
      result,
      username,
    });
    await post.save();

    return NextResponse.json({ message: "Comment added", comment });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
