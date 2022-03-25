import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MetaData from '../layout/MetaData';
import { Link, useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { orderDetails, clearErrors } from '../../actions/orderActions';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import './OrderDetails.css';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  const { error, order, loading } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(orderDetails(id));
  }, [dispatch, error, alert, id]);
  
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title="Dettales del Pedido" />
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">
                Pedido # {order && order._id}
              </Typography>
              <Typography>Detalles del Envio</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Nombre:</p>
                  <span>{order.user && order.user.name}</span>
                </div>

                <div>
                  <p>Telefono:</p>
                  <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                </div>

                <div>
                  <p>Direccion:</p>
                  <span>{order.shippingInfo
                          && `${order.shippingInfo.address},
                          ${order.shippingInfo.city},
                          ${order.shippingInfo.state},
                          ${order.shippingInfo.pinCode},
                          ${order.shippingInfo.country}` }
                  </span>
                </div>
              </div>
              <Typography>Pago</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.paymentInfo &&
                      order.paymentInfo.status === 'succeeded'
                        ? 'greenColor'
                        : 'redColor'
                    }
                  >
                    {
                      order.paymentInfo &&
                      order.paymentInfo.status === 'succeeded'
                        ? 'PAGADO'
                        : 'NO SE PAGO'
                    }
                  </p>
                </div>

                <div>
                  <p>Monto</p>
                  <span>${order.totalPrice && order.totalPrice}</span>
                </div>

              </div>
              
              <Typography>Estado del pedido</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.orderStatus && order.orderStatus === 'Delivered'
                        ? 'greenColor'
                        : 'redColor'
                    }
                  >
                    {order.orderStatus &&
                    order.orderStatus }
                  </p>
                </div>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Productos del Pedido</Typography>
              <div className="orderDetailsCartItemsContainer">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt={item.name} />
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>{' '}
                      <span>
                        {' '}{item.quantity} X ${item.price} = {' '}
                        <b>${item.quantity * item.price}</b>
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetails;
