import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './MyOrders.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, myOrders } from '../../actions/orderActions';
import Loader from '../layout/Loader/Loader';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Typography } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import LaunchIcon from '@material-ui/icons/Launch';

const MyOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user } = useSelector((state) => state.user);
  const { loading, error, orders } = useSelector((state) => state.myOrders);

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
      flex: 0.3
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
      flex: 0.3,
      headerName: 'Acciones',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, 'id')}`}>
            <LaunchIcon />
          </Link>
        );
      }
    }
  ];
  const rows = [];

  if (orders) {
    orders.forEach((item) => (
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice
      })
    ));
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error, alert]);

  return (
    <>
      <MetaData title={`${user.name} -- Pedidos`} />
      {loading ? <Loader /> : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />
          <Typography id="myOrdersHeading">Pedidos de {user.name}</Typography>
        </div>
      )}
    </>
  );
};

export default MyOrders;
