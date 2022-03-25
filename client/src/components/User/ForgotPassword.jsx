import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, forgotPassword } from '../../actions/userActions';
import { useAlert } from 'react-alert';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, message } = useSelector((state) => state.forgotPassword);

  const [email, setEmail] = useState('');

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    
    const myForm = new FormData();
    myForm.set('email', email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(message);
    }
  }, [dispatch, alert, error, message]);
  
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title="Olvido Contrasena" />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Olvido Contrasena</h2>
              <form
                className="forgotPasswordForm"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="forgotPasswordEmail">
                  <MailOutlineIcon />
                  <input
                    type="text"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Enviar"
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
