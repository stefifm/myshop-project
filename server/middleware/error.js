/* eslint-disable no-param-reassign */
import ErrorHander from '../utils/errorhander';

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB Id Error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHander(message, 400);
  }

  // MongoDB Duplicate Key
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHander(message, 400);
  }

  // Wrong JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Json Web Token no es valido. Intente de nuevo';
    err = new ErrorHander(message, 400);
  }

  // JWT Expire Error
  if (err.name === 'TokenExpiredError') {
    const message = 'Json Web Token ha expirado. Intente de nuevo';
    err = new ErrorHander(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};

export default errorMiddleware;
