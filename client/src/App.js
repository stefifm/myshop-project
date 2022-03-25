import './App.css';
import Header from './components/layout/Header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer/Footer';
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Products from './components/Products/Products';
import Search from './components/Products/Search';
import LoginSignUp from './components/User/LoginSignUp';
import store from './store';
import { loadUser } from './actions/userActions';
import { useSelector } from 'react-redux';
import UserOptions from './components/layout/Header/UserOptions';
import Profile from './components/User/Profile';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './components/Cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from './components/Admin/ProcessOrder';
import UserList from './components/Admin/UserList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReviews from './components/Admin/ProductReviews';
import Contact from './components/layout/Contact/Contact';
import About from './components/layout/About/About';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState('');

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/stripeapikey');
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    getStripeApiKey();
    store.dispatch(loadUser());
  }, []);
  
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  return (
    <BrowserRouter>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        {/* NORMAL ROUTES -- NO ADMIN */}
        <Route path="/" exact element={<Home />} />

        <Route path="/product/:id" exact element={<ProductDetails />} />
        <Route path="/products" exact element={<Products />} />
        <Route path="/products/:keyword" exact element={<Products />} />
        <Route path="/search" exact element={<Search />} />

        <Route path="/contact" exact element={<Contact />} />
        <Route path="/about" exact element={<About />} />
        <Route path="/login" exact element={<LoginSignUp />} />

        <Route path="/account" exact element={isAuthenticated ? <Profile /> : <LoginSignUp />} />
        <Route path="/me/update" exact element={isAuthenticated ? <UpdateProfile /> : <LoginSignUp />} />
        <Route path="/password/update" exact element={isAuthenticated ? <UpdatePassword /> : <LoginSignUp />} />
        
        <Route path="/password/forgot" exact element={<ForgotPassword />} />
        <Route path="/password/reset/:token" exact element={<ResetPassword />} />
        
        <Route path="/cart" exact element={isAuthenticated ? <Cart /> : <LoginSignUp />} />
        <Route path="/shipping" exact element={isAuthenticated ? <Shipping /> : <LoginSignUp />} />
        <Route path="/order/confirm" exact element={isAuthenticated ? <ConfirmOrder /> : <LoginSignUp />} />
        
        <Route
          path="/payment/process"
          exact
          element={isAuthenticated && stripeApiKey ? (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Payment />
            </Elements>
          ) : (<LoginSignUp />)}
        />
        <Route path="/success" exact element={isAuthenticated ? <OrderSuccess /> : <LoginSignUp />} />
        <Route path="/orders" exact element={isAuthenticated ? <MyOrders /> : <LoginSignUp />} />
        <Route path="/order/:id" exact element={isAuthenticated ? <OrderDetails /> : <LoginSignUp />} />

        {/* ADMIN ROUTES -- ONLY ADMIN */}
        <Route
          path="/admin/dashboard"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <Dashboard />
            ) : (<LoginSignUp />)
          }
        />
        <Route
          path="/admin/products"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <ProductList />
            ) : (<LoginSignUp />)
          }
        />
        <Route
          path="/admin/product"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <NewProduct />
            ) : (<LoginSignUp />)
          }
        />

        <Route
          path="/admin/product/:id"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <UpdateProduct />
            ) : (<LoginSignUp />)
          }
        />

        <Route
          path="/admin/orders"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <OrderList />
            ) : (<LoginSignUp />)
          }
        />

        <Route
          path="/admin/order/:id"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <ProcessOrder />
            ) : (<LoginSignUp />)
          }
        />

        <Route
          path="/admin/users"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <UserList />
            ) : (<LoginSignUp />)
          }
        />

        <Route
          path="/admin/user/:id"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <UpdateUser />
            ) : (<LoginSignUp />)

          }
        />

        <Route
          path="/admin/reviews"
          exact
          isAdmin
          element={
            isAuthenticated && user.role === 'admin' ? (
              <ProductReviews />
            ) : (<LoginSignUp />)

          }
        />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
