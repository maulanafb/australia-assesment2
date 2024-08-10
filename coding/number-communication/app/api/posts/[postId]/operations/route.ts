import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import connectToDatabase from "@/lib/connectToDatabase";

// Connect to database outside the request handlers to use connection pooling
connectToDatabase();

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  const json = await req.json();
  const { userId, type, rightArgument } = json; // Expect userId in request

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required." },
      { status: 400 }
    );
  }

  if (!userId || !type || rightArgument === undefined || isNaN(rightArgument)) {
    return NextResponse.json(
      {
        error:
          "User ID, type, and right argument are required, and the right argument must be a number.",
      },
      { status: 400 }
    );
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let result = post.startingNumber;
    if (post.operations.length > 0) {
      result = post.operations[post.operations.length - 1].result;
    }

    switch (type) {
      case "add":
        result += rightArgument;
        break;
      case "subtract":
        result -= rightArgument;
        break;
      case "multiply":
        result *= rightArgument;
        break;
      case "divide":
        if (rightArgument === 0) {
          return NextResponse.json(
            { error: "Cannot divide by zero." },
            { status: 400 }
          );
        }
        result /= rightArgument;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation type." },
          { status: 400 }
        );
    }

    post.operations.push({
      type,
      rightArgument,
      result,
      username: user.username,
    });
    await post.save();

    return NextResponse.json({ message: "Operation added", post });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
