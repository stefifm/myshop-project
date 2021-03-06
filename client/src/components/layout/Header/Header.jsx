import React from 'react';
import { ReactNavbar } from 'overlay-navbar';
import logo from '../../../images/logo.png';

const options = {
  burgerColor: '#eb4034',
  burgerColorHover: '#a62d24',
  logo,
  logoWidth: '20vmax',
  navColor1: 'white',
  logoHoverSize: '10px',
  logoHoverColor: '#eb4034',
  link1Text: 'Inicio',
  link2Text: 'Productos',
  link3Text: 'Contacto',
  link4Text: 'Sobre Nosostros',
  link1Url: '/',
  link2Url: '/products',
  link3Url: '/contact',
  link4Url: '/about',
  link1Size: '1.3vmax',
  link1Color: 'rgba(35,35,35,0.8)',
  nav1JustifyContent: 'flex-end',
  nav2JustifyContent: 'flex-end',
  nav3JustifyContent: 'flex-start',
  nav4JustifyContent: 'flex-start',
  link1ColorHover: '#eb4034',
  link1Margin: '1vmax',
  profileIconUrl: '/login',
  searchIconUrl: '/search',
  cartIconUrl: '/cart',
  profileIconColor: 'rgba(35,35,35,0.8)',
  searchIconColor: 'rgba(35,35,35,0.8)',
  cartIconColor: 'rgba(35,35,35,0.8)',
  profileIconColorHover: '#eb4034',
  searchIconColorHover: '#eb4034',
  cartIconColorHover: '#eb4034',
  cartIconMargin: '1vmax'
};

const Header = () => {
  return (
    <ReactNavbar {...options} />
  );
};

export default Header;
