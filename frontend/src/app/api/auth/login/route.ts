import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Identifier and password are required' }, { status: 400 });
    }

    // Find user by username, email, or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }, { username: identifier }]
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
