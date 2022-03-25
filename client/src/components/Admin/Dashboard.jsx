import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProducts } from '../../actions/productActions';
import { getAllOrders } from '../../actions/orderActions';
import { getAllUsers } from '../../actions/userActions';

Chart.register(...registerables);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;
  if (products) {
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });
  }

  let totalAmount = 0;

  if (orders) {
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  }

  const lineState = {
    labels: ['Monto Inicial', 'Ingresos'],
    datasets: [
      {
        label: 'MONTO TOTAL',
        backgroundColor: ['tomato'],
        hoverBackgroundColor: ['rgba(197, 72, 49)'],
        data: [0, totalAmount]
      }
    ]
  };

  const doughnutState = {
    labels: ['Sin Stock', 'Con Stock'],
    datasets: [
      {
        backgroundColor: ['#00A6B4', '#6800B4'],
        hoverBackgroundColor: ['#4B5000', '#35014F'],
        data: [outOfStock, products.length - outOfStock]
      }
    ]
  };

  useEffect(() => {
    dispatch(getAdminProducts());

    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Panel</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Monto Total: <br /> ${totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Producto</p>
              <p>{products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Pedidos</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Usuarios</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line
            data={lineState}
          />
        </div>
        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
