import express from 'express';
import errorMiddleware from './middleware/error';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
// IMPORT ROUTES
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());

// Routes
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
// Middleware Error
app.use(errorMiddleware);

export default app;
