"use client";

import OperationForm from "./OperationForm";

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

interface PostItemProps {
  post: Post;
  onOperationAdded: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onOperationAdded }) => {
  console.log(post);
  return (
    <div className="border border-gray-300 p-4 mb-4 rounded">
      <p className="mb-2">Starting Number: {post.startingNumber}</p>
      <ul className="mb-4">
        {post.operations.map((op, index) => (
          <li key={index}>
            {op.type} {op.rightArgument} = {op.result}
          </li>
        ))}
      </ul>
      <OperationForm postId={post._id} onOperationAdded={onOperationAdded} />
    </div>
  );
};

export default PostItem;
