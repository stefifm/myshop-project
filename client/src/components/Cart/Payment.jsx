import React, { useEffect, useRef } from 'react';
import CheckoutSteps from './CheckoutSteps';
import { useSelector, useDispatch } from 'react-redux';
import MetaData from '../layout/MetaData';
import { Typography } from '@material-ui/core';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import './Payment.css';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EventIcon from '@material-ui/icons/Event';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { clearErrors, createOrder } from '../../actions/orderActions';

const Payment = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100)
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const { data } = await axios.post(
        '/api/payment/process',
        paymentData,
        config
      );

      const clientSecret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country
            }
          }
        }
      });
      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status
        };
        dispatch(createOrder(order));
        navigate('/success');
      } else {
        alert.error('Hay un problema en el proceso de pago');
      }
    } catch (err) {
      payBtn.current.disabled = false;
      alert.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [alert, error, dispatch]);

  return (
    <>
      <MetaData title="Pago" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Detalles del Pago</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>

          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>

          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pagar - $ ${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>

    </>
  );
};

export default Payment;
