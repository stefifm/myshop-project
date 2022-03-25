/* eslint-disable no-await-in-loop */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import Product from '../models/Product';
import mongoose from 'mongoose';
import ErrorHander from '../utils/errorhander';
import catchAsyncError from '../middleware/catchAsyncError';
import ApiFeatures from '../utils/apiFeatures';
import cloudinary from 'cloudinary';

// Create Product -- Admin
export const createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLink = [];

  for (let i = 0; i < images.length; i += 1) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'products'
    });

    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url
    });
  }

  req.body.user = req.user.id;
  req.body.images = imagesLink;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// Get All Products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;

  const filteredProductsCount = products.length;

  apiFeatures.pagination(resultPerPage);

  products = await apiFeatures.query.clone();
  
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount
  });
});

// Get All Products (ADMIN)
export const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  
  res.status(200).json({
    success: true,
    products
  });
});

// Get Product Details
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHander('Producto no encontrado', 404));
  }

  res.status(200).json({ success: true, product });
});

// Update Product -- Admin
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHander('Producto no encontrado', 404));
  }

  // Update Images
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i += 1) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    const imagesLink = [];

    for (let i = 0; i < images.length; i += 1) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'products'
      });
  
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    req.body.images = imagesLink;
  }

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    product
  });
});

// Delete Product
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHander('Producto no encontrado', 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i += 1) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({ success: true, message: 'Producto eliminado' });
});

// Create New Review or Update Review
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSafe: false });

  res.status(200).json({
    success: true
  });
});

// Get all Reviews of a Product
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHander('El producto no se encunetra', 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

// Delete Review

export const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander('El producto no se encunetra', 404));
  }
  
  const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });
});
