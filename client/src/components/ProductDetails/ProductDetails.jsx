/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import './ProductDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProductDetail, newReview } from '../../actions/productActions';
import { useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import ReviewCard from './ReviewCard';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { addItemsToCart } from '../../actions/cartActions';
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import NotImage from '../../images/no-image.png';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  
  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { success, error: reviewError } = useSelector((state) => state.newReview);

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const upQuantity = () => {
    if (product.Stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const downQuantity = () => {
    if (quantity <= 1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success('Se Agrego al Carrito');
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const submitReviewHandler = () => {
    const myForm = new FormData();

    myForm.set('rating', rating);
    myForm.set('comment', comment);
    myForm.set('productId', id);
    dispatch(newReview(myForm));
    setOpen(false);
  };

  const isApiSubscribed = useRef(false);

  useEffect(() => {
    isApiSubscribed.current = true;
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success('Su comentario fue enviado con exito');
      dispatch({ type: NEW_REVIEW_RESET });
    }

    if (isApiSubscribed.current) {
      dispatch(getProductDetail(id));
    }
    return () => { isApiSubscribed.current = false; };
  }, [dispatch, id, error, alert, success, reviewError]);

  const options = {
    size: 'large',
    value: product.ratings,
    readOnly: true,
    precision: 0.5
  };
  
  return (
    <>
      {loading ? <Loader /> : (
        <>
          <MetaData title={`${product.name} -- MYSHOP`} />
          <div className="ProductDetails">
            <div>

              {
                product.images && (
                  <Carousel autoPlay="false">
                    { product.images.map((item, i) => (
                      <img
                        src={item.url}
                        alt={`${i} Slide`}
                        className="CarouselImage"
                        key={i}
                      />
                    ))}
                  </Carousel>

                )
              }
      
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Producto # {product?._id}</p>
              </div>

              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">({product.numOfReviews === 1 ? `${product.numOfReviews} comentario` : `${product.numOfReviews} comentarios`})</span>
              </div>
          
              <div className="detailsBlock-3">
                <h1>{`$ ${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={downQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={upQuantity}>+</button>
                  </div>
                  <button disabled={product.Stock < 1} onClick={addToCartHandler}>Agregar a carrito</button>
                </div>
                <p>
                  Status:
                  <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
                    {product.Stock < 1 ? ' Sin Stock' : ` Hay Stock (${product.Stock} unidades)`}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Descripcion: <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">Escribir Comentario</button>
            </div>
          </div>

          <h3 className="reviewsHeading">COMENTARIOS</h3>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Enviar Comentario</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                value={Number(rating)}
                name="unique-rating"
                onChange={(e) => setRating(e.target.value)}
                size="large"
              />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">Cancelar</Button>
              <Button onClick={submitReviewHandler} color="primary">Enviar</Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                  product.reviews.map((review) => <ReviewCard review={review} key={review._id} />)
              }
            </div>
          ) : (
            <p className="noReviews">No hay comentarios</p>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
