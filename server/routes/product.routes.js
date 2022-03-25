import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts
} from '../controllers/porduct.controller';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth';

const router = express.Router();

router.get('/products', getAllProducts);

router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);

router.post(
  '/admin/product/new',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  createProduct
);
router.put(
  '/admin/product/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  updateProduct
);
router.delete(
  '/admin/product/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  deleteProduct
);
router.get('/product/:id', getProductDetail);

router.put('/review', isAuthenticatedUser, createProductReview);

router.get('/reviews', getProductReviews);

router.delete('/reviews', isAuthenticatedUser, deleteReview);

export default router;
