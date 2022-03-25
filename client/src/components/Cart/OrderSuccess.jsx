import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './OrderSuccess.css';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
      <CheckCircleIcon />
      <Typography>Su pedido se ha creado con exito</Typography>
      <Link to="/orders">Ver Pedidos</Link>
    </div>
  );
};

export default OrderSuccess;
