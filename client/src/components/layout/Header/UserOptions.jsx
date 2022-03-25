import React, { useState } from 'react';
import './Header.css';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Backdrop from '@material-ui/core/Backdrop';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userActions';

const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { cartItems } = useSelector((state) => state.cart);

  const options = [
    { icon: <ListAltIcon />, name: 'Ordenes', func: orders },
    { icon: <PersonIcon />, name: 'Perfil', func: account },
    {
      icon: <ShoppingCartIcon
        style={{ color: cartItems.length > 0 ? 'tomato' : 'unset' }}
      />,
      name: `Carrito(${cartItems.length})`,
      func: cart
    },
    { icon: <ExitToAppIcon />, name: 'Cerrar Sesion', func: logoutUser }
  ];

  if (user.role === 'admin') {
    options.unshift({ icon: <DashboardIcon />, name: 'Dashboard', func: dashboard });
  }

  function dashboard() {
    navigate('/admin/dashboard');
  }

  function orders() {
    navigate('/orders');
  }

  function account() {
    navigate('/account');
  }

  function logoutUser() {
    dispatch(logout());
    alert.success('Sesion cerrada con exito');
  }

  function cart() {
    navigate('/cart');
  }

  return (
    <>
      <Backdrop open={open} style={{ zIndex: '10' }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltop example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction="down"
        style={{ zIndex: '11' }}
        className="speedDial"
        icon={(
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : '/Profile.png'}
            alt="Profile"
          />
        )}
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default UserOptions;
