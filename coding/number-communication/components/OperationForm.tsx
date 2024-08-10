"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react"; // Import useSession hook

interface OperationFormProps {
  postId: string;
  onOperationAdded: () => void;
}

const OperationForm: React.FC<OperationFormProps> = ({
  postId,
  onOperationAdded,
}) => {
  const { data: session } = useSession();
  const [operationType, setOperationType] = useState("add");
  const [rightArgument, setRightArgument] = useState("");

  const handleAddOperation = async () => {
    if (!operationType || rightArgument === "") return;
    if (!session || !session.user) return;

    try {
      await axios.post(`/api/comments`, {
        postId,
        userId: session.user.id,
        type: operationType,
        rightArgument: Number(rightArgument),
        username: session.user.name,
      });
      onOperationAdded();
      setRightArgument("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex gap-2 mb-2">
      <select
        value={operationType}
        onChange={(e) => setOperationType(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="add">Add</option>
        <option value="subtract">Subtract</option>
        <option value="multiply">Multiply</option>
        <option value="divide">Divide</option>
      </select>
      <input
        type="number"
        value={rightArgument}
        onChange={(e) => setRightArgument(e.target.value)}
        placeholder="Enter right argument"
        className="p-2 border border-gray-300 rounded"
      />

      {session && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddOperation}
        >
          Add Comment
        </button>
      )}
    </div>
  );
};

export default OperationForm;
