import express from 'express';
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserRole
} from '../controllers/user.controllers';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/logout', logout);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.get(
  '/admin/users',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllUsers
);
router.get(
  '/admin/user/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getSingleUser
);

router.put(
  '/admin/user/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  updateUserRole
);

router.delete(
  '/admin/user/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  deleteUser
);

export default router;
