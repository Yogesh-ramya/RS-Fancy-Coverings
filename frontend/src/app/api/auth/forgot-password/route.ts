import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ message: 'Email or phone is required' }, { status: 400 });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return NextResponse.json({ message: 'No account found with these details' }, { status: 404 });
    }

    // In a real app, you would send an email/SMS with a reset token here.
    // For this implementation, we will simulate the success.
    
    return NextResponse.json({
      message: 'A password reset link has been simulated and sent to your registered contact details.',
      userExists: true
    });

  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
