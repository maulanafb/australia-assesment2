import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import connectToDatabase from "@/lib/connectToDatabase";

// Connect to database outside the request handlers to use connection pooling
connectToDatabase();

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { startingNumber, userId } = json;

  if (!startingNumber || isNaN(startingNumber)) {
    return NextResponse.json(
      { error: "Starting number is required and must be a number." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId); // Fetch the user details
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const post = new Post({
      startingNumber,
      user: user._id,
      username: user.username,
    });
    await post.save();
    return NextResponse.json({ message: "Post created", post });
  } catch (error) {
    console.error("Error creating post:", error); // Log error details
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectToDatabase();
  try {
    const posts = await Post.find().lean();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch posts", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
