import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './ProductReview.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAllReviews, clearErrors, deleteReview } from '../../actions/productActions';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import DeleteIcon from '@material-ui/icons/Delete';
import Star from '@material-ui/icons/Star';
import Sidebar from './Sidebar';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';

const ProductReviews = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error: deleteReviewError, isReviewDeleted } = useSelector((state) => state.review);
  const { error, reviews, loading } = useSelector((state) => state.productReviews);

  const [productId, setProductId] = useState('');

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();

    dispatch(getAllReviews(productId));
  };

  const columns = [
    { field: 'id', headerName: 'ID Comentario', minWidth: 200, flex: 0.5 },
    { field: 'user', headerName: 'Usuario', minWidth: 150, flex: 0.3 },
    { field: 'comment', headerName: 'Comentario', minWidth: 350, flex: 1 },
    { field: 'rating',
      headerName: 'Rating',
      type: 'number',
      minWidth: 270,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, 'rating') >= 3
          ? 'greenColor'
          : 'redColor';
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => deleteReviewHandler(params.getValue(params.id, 'id'))}>
              <DeleteIcon />
            </Button>
          </>
        );
      }
    }
  ];

  const rows = [];

  if (reviews) {
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name
      });
    });
  }

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteReviewError) {
      alert.error(deleteReviewError);
      dispatch(clearErrors());
    }

    if (isReviewDeleted) {
      alert.success('Comentario Eliminado');
      navigate('/admin/reviews');
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [alert, error, dispatch, deleteReviewError, isReviewDeleted, navigate, productId]);
  return (
    <>
      <MetaData title="TODOS LOS COMENTARIOS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">TODOS LOS COMENTARIOS</h1>
              
            <div>
              <Star />
              <input
                type="text"
                placeholder="ID Producto"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
              
            <Button
              id="createProductBtn"
              type="submit"
              disabled={!!(!!loading || productId === '')}
            >
              Buscar
            </Button>
              
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              columns={columns}
              rows={rows}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              rowsPerPageOptions={[5, 10, 20]}
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Hay Comentarios</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
