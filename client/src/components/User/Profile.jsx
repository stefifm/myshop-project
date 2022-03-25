import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import { useSelector } from 'react-redux';
import './Profile.css';

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
  
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title={`Perfil ${user?.name}`} />
          <div className="profileContainer">
            <div>
              <h1>Mi Cuenta</h1>
              <img src={user?.avatar?.url} alt={user?.name} />
              <Link to="/me/update">Editar Cuenta</Link>
            </div>
            <div>
              <div>
                <h4>Nombre y Apellido</h4>
                <p>{user?.name}</p>
              </div>

              <div>
                <h4>Email</h4>
                <p>{user?.email}</p>
              </div>

              <div>
                <h4>Se Unio</h4>
                <p>{String(user?.createdAt).substring(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">Mis Pedidos</Link>
                <Link to="/password/update">Cambiar Contrasena</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
