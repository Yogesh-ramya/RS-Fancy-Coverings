import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

// GET /api/orders - Get all orders (Admin)
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().populate('productId').sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, items, customerName, phone, address, orderType, paymentId, upiLast4, totalPrice, deliveryCharge } = body;

    // Handle stock reduction
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }
      }
    } else if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -1 } });
    }

    // Sanitize item IDs
    const sanitizedItems = (items || []).map((item: any) => ({
      ...item,
      productId: (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) ? item.productId : null
    }));

    const sanitizedProductId = (productId && mongoose.Types.ObjectId.isValid(productId)) ? productId : null;

    const order = await Order.create({
      productId: sanitizedProductId,
      items: sanitizedItems,
      customerName,
      phone,
      address,
      totalPrice,
      deliveryCharge: deliveryCharge || 0,
      orderType,
      paymentId: paymentId || null,
      upiLast4: upiLast4 || null,
      status: 'Pending'
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order create error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
