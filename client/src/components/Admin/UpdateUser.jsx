import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PersonIcon from '@material-ui/icons/Person';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getUserDetails, updateUser } from '../../actions/userActions';
import Loader from '../layout/Loader/Loader';

const UpdateUser = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, user, error } = useSelector((state) => state.userDetails);
  const { isUpdated, error: updateUserError, loading: updateUserLoading } = useSelector((state) => state.profile);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const userId = id;

  const updateUserSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('role', role);

    dispatch(updateUser(userId, myForm));
  };

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateUserError) {
      alert.error(updateUserError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success('Usuario Actualizado!!!');
      navigate('/admin/users');
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, alert, isUpdated, navigate, updateUserError, user, userId]);
  
  return (
    <>
      <MetaData title="Actualizar Usuario" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? <Loader /> : (
            <form
              className="createProductForm"
              encType="multipart/form-data"
              onSubmit={updateUserSubmit}
            >
              <h1>Actualizar Usuario</h1>
              
              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Elija el Rol</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <Button
                id="createProductBtn"
                type="submit"
                disabled={!!(!!updateUserLoading || role === '')}
              >
                Actualizar
              </Button>
              
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
