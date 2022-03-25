import catchAsyncError from '../middleware/catchAsyncError';
import Stripe from 'stripe';
import { STRIPE_API_KEY, STRIPE_SECRET_KEY } from '../config';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const processPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    metadata: {
      company: 'MYSHOP'
    }
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

export const sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: STRIPE_API_KEY });
});
