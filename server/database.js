import mongoose from 'mongoose';
import { MONGODB_URL, MONGODB_TEST, NODE_ENV } from './config';

mongoose
  .connect(NODE_ENV === 'test' ? MONGODB_TEST : MONGODB_URL)
  .then(() => console.log('DB is connected'))
  .catch((error) => console.log(error));
