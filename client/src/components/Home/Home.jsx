import React, { useEffect } from 'react';
import { CgMouse } from 'react-icons/all';
import './Home.css';
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from '../../actions/productActions';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.products);
  
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct());
  }, [dispatch, alert]);
  
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title="MYSHOP" />
          <div className="banner">
            <p>
              Bienvenido a MYSHOP
            </p>
            <h1>ENCUENTRE LOS MEJORES PRODUCTOS</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">
            Productos
          </h2>
          {products && (
            <div className="container" id="container">
              { products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
