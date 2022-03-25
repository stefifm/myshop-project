import React from 'react';
import CheckoutSteps from './CheckoutSteps';
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';
import './ConfirmOrder.css';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 750;

  const tax = subtotal * 0.21;

  const totalPrice = subtotal + shippingCharges + tax;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice
    };
    sessionStorage.setItem('orderInfo', JSON.stringify(data));

    navigate('/payment/process');
  };

  return (
    <>
      <MetaData title="Confirmar Pedido" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div>
            <div className="confirmShippingArea">
              <Typography>Informacion del Envio</Typography>
              <div className="confirmShippingAreaBox">
                <div>
                  <p>Nombre:</p>
                  <span>{user.name}</span>
                </div>
                <div>
                  <p>Telefono:</p>
                  <span>{shippingInfo.phoneNo}</span>
                </div>
                <div>
                  <p>Dirrecion:</p>
                  <span>{address}</span>
                </div>
              </div>
            </div>
            
            <div className="confirmCartItems">

              <Typography>Productos del Carrito</Typography>
              <div className="confirmCartItemsConatiner">
                {cartItems && cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Producto" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>
                    <span>
                      {' '}{item.quantity} X ${item.price} = {' '}
                      <b>${item.quantity * item.price}</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* */}
        <div>
          <div className="orderSummary">
            <Typography>Resumen del Pedido</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>$ {subtotal}</span>
              </div>
              <div>
                <p>Cargos de Envio</p>
                <span> $ {shippingCharges} </span>
              </div>
              <div>
                <p>Impuestos</p>
                <span>$ {tax}</span>
              </div>
            </div>
            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>$ {totalPrice}</span>
            </div>
            <button onClick={proceedPayment}>Proceder al Pago</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
