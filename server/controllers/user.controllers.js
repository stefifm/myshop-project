/* eslint-disable no-shadow */
import ErrorHander from '../utils/errorhander';
import catchAsyncError from '../middleware/catchAsyncError';
import User from '../models/User';
import sendToken from '../utils/jwtToken';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';
import cloudinary from 'cloudinary';

// Register a User

export const registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale'
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  });

  sendToken(user, 201, res);
});

// Login a User
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHander('Ingrese Email y Contrasena', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHander('Email o contrasena invalidas', 401));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander('Las contrasenas no coinciden', 401));
  }

  sendToken(user, 200, res);
});

// Logout
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: 'Sesion cerrada'
  });
});

// Forgot Password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHander('Usuario no encontrado', 404));
  }
  // Reset Password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

  const message = `Su nueva contrasena y token es :- \n\n ${resetPasswordUrl} \n\n Si no pidio este email, ignorar este mensaje`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Ecommerce Contrasena Recuperar',
      message
    });
    res.status(200).json({
      success: true,
      message: `Email enviado a ${user.email} con exito`
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(
      new ErrorHander('Reinicio de la contrasena invalido o expiro', 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander('Las contrasenas no coinciden', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Get User Detail
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHander('Usuario no autorizado', 401));
  }
  res.status(200).json({
    success: true,
    user
  });
});

// Update Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const isPasswordMatched = user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander('La contrasena anterior es invalida', 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander('Las contrasenas no coinciden', 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Update Profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };
  // !* Cloudinary done
  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale'
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  res.status(200).json({
    success: true,
    user
  });
});

// Get All Users (Admin)
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorHander('No hay usuarios', 404));
  }
  res.status(200).json({
    success: true,
    users
  });
});

// Get Single User
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`Usuario con id ${req.params.id} no existe`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user
  });
});

// Update User Role (Admin)
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  res.status(200).json({
    success: true
  });
});

// Delete User (Admin)
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`Usuario con id ${req.params.id} no existe`, 404)
    );
  }

  const imageId = user.avatar.public_id;
  
  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'Usuario Eliminado'
  });
});
