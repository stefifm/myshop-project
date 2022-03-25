import Order from '../models/Order';
import ErrorHander from '../utils/errorhander';
import catchAsyncError from '../middleware/catchAsyncError';
import Product from '../models/Product';

// Create new Order
export const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  });

  res.status(200).json({
    success: true,
    order
  });
});

// Get Single Order
export const singleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHander('No se encontro la orden con ese id', 404));
  }
  res.status(200).json({
    success: true,
    order
  });
});

// Get logged in user Order
export const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders
  });
});

// Get all Orders -- Admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  });
});

// Update Order Status -- Admin

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock -= quantity;

  product.save({ validateBeforeSafe: false });
}

export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander('No se encontro la orden con esa id', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHander('Usted ya hizo la entrega de esta orden', 400));
  }

  if (req.body.status === 'Shipped') {
    order.orderItems.forEach(async (ord) => {
      await updateStock(ord.product, ord.quantity);
    });
  }

  order.orderStatus = req.body.status;
  
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSafe: false });

  res.status(200).json({
    success: true
  });
});

// Delete Orders -- Admin
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHander('No se encontro la orden con esa id', 404));
  }
  await order.remove();
  res.status(200).json({
    success: true
  });
});

