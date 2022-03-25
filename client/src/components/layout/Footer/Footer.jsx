import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DESCARGA MYSHOP</h4>
        <p>Descarga la aplicacion en Android y IOS</p>
        <img src={playStore} alt="Play Store" />
        <img src={appStore} alt="App Store" />
      </div>
      <div className="midFooter">
        <h1>MYSHOP</h1>
        <p>Productos de la mejor calidad</p>
        <p>Copyright 2022 &copy; Stefania Bruera </p>
      </div>
      <div className="rightFooter">
        <h4>Siguenos</h4>
        <a href="https://www.instagram.com/bruerastefania">Instagram</a>
        <a href="https://twitter.com/BrueraStefania">Twitter</a>
        <a href="https://www.facebook.com/stefaniaveronica.bruera">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
