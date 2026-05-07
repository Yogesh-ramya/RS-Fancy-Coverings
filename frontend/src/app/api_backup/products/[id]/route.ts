import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';

// GET /api/products/[id] - Get single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/products/[id] - Update product (Admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const updateData: any = {};
    
    // List of basic fields to update if they exist in formData
    const fields = ['name_en', 'name_ta', 'productId', 'description_en', 'description_ta', 'category', 'price', 'stock', 'isTrending'];
    
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price' || field === 'stock') {
          updateData[field] = Number(value);
        } else if (field === 'isTrending') {
          updateData[field] = value === 'true';
        } else {
          updateData[field] = value;
        }
      }
    });

    // Handle Image Uploads
    const images = formData.getAll('images');
    if (images && images.length > 0) {
      const imageUrls: string[] = [];
      for (const file of images) {
        if (typeof file !== 'string') {
          const arrayBuffer = await (file as File).arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'jewelry-products',
                transformation: [{ width: 800, height: 1000, crop: 'limit' }]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });
          
          imageUrls.push(result.secure_url);
        } else {
          // If it's already a URL, keep it
          imageUrls.push(file as string);
        }
      }
      updateData.images = imageUrls;
    }

    // Handle Variants
    const variantsJson = formData.get('variants');
    if (variantsJson) {
      try {
        updateData.variants = JSON.parse(variantsJson as string);
      } catch (e) {
        console.error("Error parsing variants:", e);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// DELETE /api/products/[id] - Delete product (Admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
