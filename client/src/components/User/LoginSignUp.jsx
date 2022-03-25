/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useState, useEffect } from 'react';
import './LoginSignUp.css';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login, register } from '../../actions/userActions';
import { useAlert } from 'react-alert';

const LoginSignUp = () => {
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');

  const { error, loading, isAuthenticated } = useSelector((state) => state.user);
  
  const { name, email, password } = user;
  
  const registerSubmit = (e) => {
    e.preventDefault();
    
    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);
    myForm.set('avatar', avatar);
    dispatch(register(myForm));
  };
  
  const registerDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const switchTabs = (e, tab) => {
    if (tab === 'login') {
      switcherTab.current.classList.add('shiftToNeutral');
      switcherTab.current.classList.remove('shiftToRight');
      registerTab.current.classList.remove('shiftToNeutralForm');
      loginTab.current.classList.remove('shiftToLeft');
    }
    if (tab === 'register') {
      switcherTab.current.classList.add('shiftToRight');
      switcherTab.current.classList.remove('shiftToNeutral');
      registerTab.current.classList.add('shiftToNeutralForm');
      loginTab.current.classList.add('shiftToLeft');
    }
  };

  const redirect = location.search
    ? `/${location.search.split('=')[1]}`
    : '/account';

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, alert, error, navigate, isAuthenticated, redirect]);

  return (
    <>
      <MetaData title="USUARIO -- MYSHOP" />
      {loading ? <Loader /> : (
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <div>
              <div className="login_signUp-toggle">
                <p onClick={(e) => switchTabs(e, 'login')} aria-hidden="true">INICIAR SESION</p>
                <p onClick={(e) => switchTabs(e, 'register')} aria-hidden="true">REGISTRARSE</p>
              </div>
              <button ref={switcherTab} />
            </div>
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="loginEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Contrasena"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Link to="/password/forgot">Olvido la contrasena?</Link>
              <input type="submit" value="Iniciar Sesion" className="loginBtn" />
            </form>
            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
            >
              <div className="signUpName">
                <FaceIcon />
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpEmail">
                <MailOutlineIcon />
                <input
                  type="text"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Contrasena"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>
              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>
              <input
                type="submit"
                value="Registrarse"
                className="signUpBtn"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignUp;
