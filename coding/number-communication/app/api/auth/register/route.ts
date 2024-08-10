import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectToDatabase from "@/lib/connectToDatabase";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { username, password } = await req.json();
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return NextResponse.json({ message: "User created" });
  } catch (error) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
