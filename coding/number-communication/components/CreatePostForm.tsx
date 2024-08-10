"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface CreatePostFormProps {
  userId: string;
  onPostCreated: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  userId,
  onPostCreated,
}) => {
  const [startingNumber, setStartingNumber] = useState("");
  const { data: session } = useSession();
  const handleCreatePost = async () => {
    if (startingNumber === "") return;
    await axios.post("/api/posts", {
      startingNumber: Number(startingNumber),
      username: session?.user?.name,
      userId,
    });
    onPostCreated();
    setStartingNumber("");
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <input
        type="number"
        value={startingNumber}
        onChange={(e) => setStartingNumber(e.target.value)}
        placeholder="Enter starting number"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCreatePost}
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePostForm;
