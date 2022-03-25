import React from 'react';
import Typography from '@material-ui/core/Typography';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Step, StepLabel, Stepper } from '@material-ui/core';
import './CheckoutSteps.css';

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <Typography>Detalles del Envio</Typography>,
      icon: <LocalShippingIcon />
    },
    {
      label: <Typography>Confirmar Compra</Typography>,
      icon: <LibraryAddCheckIcon />
    },
    {
      label: <Typography>Pagar</Typography>,
      icon: <AccountBalanceIcon />
    }
  ];

  const stepsStyles = {
    boxSizing: 'border-box'
  };
  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} style={stepsStyles}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index}
            completed={activeStep >= index}
          >
            <StepLabel
              icon={item.icon}
              style={{ color: activeStep >= index ? 'tomato' : 'rgba(0, 0, 0, 0.649)' }}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
