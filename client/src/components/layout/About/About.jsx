import React from 'react';
import './About.css';
import { Button, Typography, Avatar } from '@material-ui/core';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';

const About = () => {
  const visitTwitter = () => {
    window.location = 'https://twitter.com/BrueraStefania';
  };
  return (
    <div className="aboutSection">
      <div />
      <div className="aboutSectionGradient" />
      <div className="aboutSectionContainer">
        <Typography component="h1">Sobre Nosotros</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: '10vmax', height: '10vmax', margin: '2vmax 0' }}
              src="https://res.cloudinary.com/stefigallery/image/upload/v1647384759/avatars/kiro1yxlqf40itwmgnjn.jpg"
              alt="Founder"
            />
            <Typography>Stefania Bruera</Typography>
            <Button onClick={visitTwitter} color="primary">
              Ver Twitter
            </Button>
            <span>
              Proyecto MYSHOP realizado por @BrueraStefania. Combina MongoDB,
              React, Express y NodeJS. También hace uso de otros recursos como Postman para probar
              las peticiones, Material-UI para UI, Cloudinary para guardar las imágenes y
              Stripe para el proceso de pagos
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Nuestras Marcas</Typography>
            <a
              href="https://twitter.com/BrueraStefania"
              target="blank"
            >
              <TwitterIcon className="twitterSvgIcon" />
            </a>

            <a href="https://www.instagram.com/bruerastefania/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
