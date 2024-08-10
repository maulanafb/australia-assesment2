"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import SignInButton from "@/components/SignInButton";
import CreatePostForm from "@/components/CreatePostForm";
import PostList from "@/components/PostList";

interface Operation {
  type: string;
  rightArgument: number;
  result: number;
}

interface Post {
  _id: string;
  startingNumber: number;
  operations: Operation[];
}

const Home = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const response = await axios.get("/api/posts");
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Number Communication
      </h1>
      <SignInButton />
      {session && (
        <>
          <CreatePostForm userId={session.user.id} onPostCreated={fetchPosts} />
        </>
      )}
      <PostList posts={posts} onOperationAdded={fetchPosts} />
    </div>
  );
};

export default Home;
