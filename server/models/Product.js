import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingrese el nombre del producto'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Ingrese la descripcion del producto']
  },
  price: {
    type: Number,
    required: [true, 'Ingrese el precio del producto'],
    maxlength: [8, 'El precio no puede exceder los 8 caracteres']
  },
  ratings: {
    type: Number,
    default: 0
  },
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  category: {
    type: String,
    required: [true, 'Ingrese la categoria del producto']
  },
  Stock: {
    type: Number,
    required: [true, 'Ingrese el stock del product'],
    maxlength: [4, 'No puede exceder los 4 caracteres'],
    default: 1
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', ProductSchema);
