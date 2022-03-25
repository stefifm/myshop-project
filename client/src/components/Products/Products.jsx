import React, { useEffect, useState } from 'react';
import './Products.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productActions';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import MetaData from '../layout/MetaData';

const categories = [
  'Notebook',
  'Celular',
  'Gabinete',
  'Auriculares',
  'Monitores',
  'Mouse',
  'TV'
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount
  } = useSelector((state) => state.products);
  
  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 250000]);
  const [category, setCategory] = useState('');

  const [ratings, setRatings] = useState(0);
  
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    event.preventDefault();
    setPrice(newPrice);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  const count = filteredProductsCount;
    
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title="PRODUCTOS -- MYSHOP" />
          <h2 className="productsHeading">Productos</h2>
          {products && (
            <div className="products">
              { products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="filterBox">
            <Typography>Precio</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={250000}
            />
            <Typography>Categorias</Typography>
            <ul className="categoryBox">
              {categories.map((cate) => (
                <li
                  className="category-link"
                  key={cate}
                  onClick={() => setCategory(cate)}
                  aria-hidden="true"
                >
                  {cate}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                min={0}
                max={5}
                valueLabelDisplay="auto"
              />
            </fieldset>
          </div>

          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Siguiente"
                prevPageText="Anterior"
                firstPageText="Primero"
                lastPageText="Ultimo"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
