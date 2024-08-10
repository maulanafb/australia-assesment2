import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User, { IUser } from "@/models/User";
import connectToDatabase from "./connectToDatabase";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectToDatabase();
        const user: IUser | null = await User.findOne({
          username: credentials?.username,
        });
        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          return {
            id: user._id!.toString(),
            name: user.username,
            token: user.token,
          }; // Ensure to return token if required
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        // token.token = user.token; // Include token if needed
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        // session.user.token = token.token; // Include token if needed
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
