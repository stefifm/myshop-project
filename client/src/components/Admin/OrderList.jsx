import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './OrderList.css';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Sidebar from './Sidebar';
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderActions';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrderList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, orders } = useSelector((state) => state.allOrders);
  const { error: deleteOrderError, orderDeleted } = useSelector((state) => state.order);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  const columns = [
    { field: 'id', headerName: 'ID Pedido', minWidth: 300, flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered'
          ? 'greenColor'
          : 'redColor';
      }
    },
    {
      field: 'itemsQty',
      headerName: 'Cant. Items',
      type: 'number',
      minWidth: 150,
      flex: 0.4
    },
    {
      field: 'amount',
      headerName: 'Monto',
      type: 'number',
      minWidth: 270,
      flex: 0.5
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.getValue(params.id, 'id')}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteOrderHandler(params.getValue(params.id, 'id'))}>
              <DeleteIcon />
            </Button>
          </>
        );
      }
    }
  ];

  const rows = [];

  if (orders) {
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus
      });
    });
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteOrderError) {
      alert.error(deleteOrderError);
      dispatch(clearErrors());
    }

    if (orderDeleted) {
      alert.success('Pedido Eliminado');
      navigate('/admin/orders');
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [alert, error, dispatch, deleteOrderError, orderDeleted, navigate]);

  return (
    <>
      <MetaData title="TODOS LOS PEDIDOS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">TODOS LOS PEDIDOS</h1>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default OrderList;
