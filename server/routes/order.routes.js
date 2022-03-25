import express from 'express';
import { deleteOrder, getAllOrders, myOrders, newOrder, singleOrder, updateOrder } from '../controllers/order.controller';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth';

const router = express.Router();

router.post('/order/new', isAuthenticatedUser, newOrder);

router.get('/order/:id', isAuthenticatedUser, singleOrder);

router.get('/orders/me', isAuthenticatedUser, myOrders);

router.get('/admin/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);

router.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

export default router;
