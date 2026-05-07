import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';

// GET /api/products - Get all products with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isTrending = searchParams.get('isTrending');

    let query: any = {};
    if (category) query.category = category;
    if (isTrending) query.isTrending = isTrending === 'true';

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/products - Create a new product (Admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const productData: any = {
      name_en: formData.get('name_en'),
      name_ta: formData.get('name_ta'),
      productId: formData.get('productId'),
      description_en: formData.get('description_en'),
      description_ta: formData.get('description_ta'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      isTrending: formData.get('isTrending') === 'true',
    };

    // Handle Image Uploads
    const images = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    if (images && images.length > 0) {
      for (const file of images) {
        if (file && typeof file !== 'string') {
          const arrayBuffer = await file.arrayBuffer();
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
        } else if (typeof file === 'string' && file.startsWith('http')) {
          imageUrls.push(file);
        }
      }
      productData.images = imageUrls;
    }

    // Handle Variants (expecting JSON string)
    const variantsJson = formData.get('variants');
    if (variantsJson) {
      try {
        productData.variants = JSON.parse(variantsJson as string);
      } catch (e) {
        console.error("Error parsing variants:", e);
      }
    }

    const newProduct = await Product.create(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
