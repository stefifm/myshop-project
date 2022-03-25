import React, { useState, useEffect } from 'react';
import './UpdatePassword.css';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updatePassword } from '../../actions/userActions';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);
    
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
      
    const myForm = new FormData();
    myForm.set('oldPassword', oldPassword);
    myForm.set('newPassword', newPassword);
    myForm.set('confirmPassword', confirmPassword);
    dispatch(updatePassword(myForm));
  };
  
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  
    if (isUpdated) {
      alert.success('Su Contrasena se actualizo con exito');
      navigate('/account');
      dispatch({
        type: UPDATE_PASSWORD_RESET
      });
    }
  }, [dispatch, alert, error, navigate, isUpdated]);
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title="Cambiar Contrasena" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Cambiar Contrasena</h2>
              <form
                className="updatePasswordForm"
                encType="multipart/form-data"
                onSubmit={updatePasswordSubmit}
              >
                <div className="signUpPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Actual Contrasena"
                    required
                    name="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Nueva Contrasena"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
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
                  value="Cambiar Contrasena"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePassword;
