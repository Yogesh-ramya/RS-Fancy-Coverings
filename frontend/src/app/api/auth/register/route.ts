import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, email, phone, password } = await req.json();

    if (!username || !email || !phone || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { username }]
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email, phone, or username' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      username,
      email,
      phone,
      password: hashedPassword
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
