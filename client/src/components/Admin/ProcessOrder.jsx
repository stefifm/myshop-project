import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';
import { Link, useParams } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import Sidebar from './Sidebar';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { useAlert } from 'react-alert';
import { clearErrors, orderDetails, updateOrder } from '../../actions/orderActions';
import Loader from '../layout/Loader/Loader';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import './ProcessOrder.css';

const ProcessOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  const [status, setStatus] = useState('');

  const { error, order, loading } = useSelector((state) => state.orderDetails);
  const { error: updateOrderError, orderUpdated } = useSelector((state) => state.order);

  const updateOrderSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set('status', status);

    dispatch(updateOrder(id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateOrderError) {
      alert.error(updateOrderError);
      dispatch(clearErrors());
    }

    if (orderUpdated) {
      alert.success('Se actualizo el pedido!!!');
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(orderDetails(id));
  }, [dispatch, error, alert, id, updateOrderError, orderUpdated]);

  return (
    <>
      
      <MetaData title="Proceso del Pedido" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? <Loader /> : (
            <div
              className="confirmOrderPage"
              style={{
                display: order.orderStatus === 'Delivered' ? 'block' : 'grid'
              }}
            >
              <div className="orderDetailsPage">
                <div className="orderDetailsContainer">
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
                      <span>{ order.shippingInfo
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
          
              {/* */}
              <div
                style={{
                  display: order.orderStatus === 'Delivered' ? 'none' : 'block'
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmit}
                >
                  <h1>Proceso del Pedido</h1>
        
                  <div>
                    <AccountTreeIcon />
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Elija la categoria</option>
                      {order.orderStatus === 'Processing' && (
                        <option value="Shipped">Shipped</option>
                      )}
                      {order.orderStatus === 'Shipped' && (
                        <option value="Delivered">Delivered</option>
                      )}

                    </select>
                  </div>
        
                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={!!(!!loading || status === '')}
                  >
                    Procesar Orden
                  </Button>
        
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
