import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    await connectDB();
    const { phone } = await params;
    
    // Find orders by phone, populating product details
    const orders = await Order.find({ phone })
      .populate('items.productId')
      .populate('productId')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Get customer orders error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
