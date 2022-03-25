import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRE, JWT_SECRET } from '../config';
// eslint-disable-next-line no-shadow
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingrese su nombre'],
    maxlength: [30, 'El nombre no puede exceder los 30 caracteres'],
    minlength: [1, 'El nombre debe tener mas de un caracter']
  },
  email: {
    type: String,
    required: [true, 'Ingrese su apellido'],
    unique: true,
    validate: [validator.isEmail, 'Ingrese un email valido']
  },
  password: {
    type: String,
    required: [true, 'Ingrese su contrasena'],
    minlength: [8, 'La contrasena tener mas de 8 caracteres'],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);

  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, salt);
});

// JWT Token
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Compare Password
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generating
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashing and adding Reset Password Token to UserSchema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('User', UserSchema);
