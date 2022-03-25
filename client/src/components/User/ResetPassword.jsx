/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react';
import './ResetPassword.css';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, resetPassword } from '../../actions/userActions';
import { useAlert } from 'react-alert';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const { error, success, loading } = useSelector((state) => state.forgotPassword);
      
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
      
  const resetPasswordSubmit = (e) => {
    e.preventDefault();
        
    const myForm = new FormData();
    myForm.set('password', password);
    myForm.set('confirmPassword', confirmPassword);
    dispatch(resetPassword(token, myForm));
  };
    
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    
    if (success) {
      alert.success('Nueva contrasena con exito');
      navigate('/login');
    }
  }, [dispatch, alert, error, navigate, success]);
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title="Cambiar Contrasena" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Cambiar Contrasena</h2>
              <form
                className="resetPasswordForm"
                encType="multipart/form-data"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Nueva Contrasena"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirmar Nueva Contrasena"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Actualizar"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;
