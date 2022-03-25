import ErrorHander from '../utils/errorhander';
import catchAsyncError from './catchAsyncError';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User from '../models/User';

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return next(
      new ErrorHander('Inicie sesion para acceder a esta opcion', 401)
    );
  }

  const decodedData = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
});

// Roles

export const authorizeRoles = (...roles) => async (req, res, next) => {
  // const { token } = req.cookies;
  // const decodedData = jwt.verify(token, JWT_SECRET);
  // req.user = await User.findById(decodedData.id);
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorHander(
        `Role: ${req.user.role} no tiene permisos para acceder a esta opcion`,
        403
      )
    );
  }
  next();
};
