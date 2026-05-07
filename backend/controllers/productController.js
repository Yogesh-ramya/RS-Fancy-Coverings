const Product = require('../models/product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, isTrending } = req.query;
    let query = {};
    if (category) query.category = category;
    if (isTrending) query.isTrending = isTrending === 'true';

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle Cloudinary Uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      productData.images = imageUrls;
    } else if (req.body.images) {
      // Handle cases where images are provided as URLs (if any)
      productData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // Parse numeric fields
    if (productData.price) productData.price = Number(productData.price);
    if (productData.stock) productData.stock = Number(productData.stock);
    if (productData.isTrending) productData.isTrending = productData.isTrending === 'true';

    const product = new Product(productData);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle Cloudinary Uploads - Replace existing images
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      updateData.images = imageUrls;
    }

    // Parse numeric fields
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.isTrending) updateData.isTrending = updateData.isTrending === 'true';

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
