import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// PATCH /api/orders/[id] - Update order status (Admin)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { status } = await req.json();
    
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// DELETE /api/orders/[id] - Delete order (Admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const order = await Order.findByIdAndDelete(params.id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
