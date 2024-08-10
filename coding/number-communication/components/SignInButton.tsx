"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const SignInButton = () => {
  const { data: session } = useSession();

  const handleSignIn = () => signIn("credentials");
  const handleSignOut = () => signOut();

  return (
    <div className="flex justify-center gap-4 mb-8">
      {session ? (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default SignInButton;
