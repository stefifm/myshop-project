import axios from 'axios';
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  NEW_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  ALL_REVIEWS_REQUEST,
  ALL_REVIEWS_SUCCESS,
  ALL_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS
} from '../constants/productConstants';

// Get Products
export const getProduct = (keyword = '', currentPage = 1, price = [0, 250000], category, ratings = 0) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });

    let link = `/api/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lt]=${price[1]}&ratings[gte]=${ratings}`;
    
    if (category) {
      link = `/api/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lt]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
    }
    
    const { data } = await axios.get(link);
    dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message
    });
  }
};

// Get Products Details
export const getProductDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    
    const { data } = await axios.get(`/api/product/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message
    });
  }
};

// NEW REVIEW
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.put('/api/review', reviewData, config);
    dispatch({ type: NEW_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message
    });
  }
};

// GET ALL PRODUCTS FOR ADMIN
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCT_REQUEST });
    const { data } = await axios.get('/api/admin/products');
    dispatch({ type: ADMIN_PRODUCT_SUCCESS, payload: data.products });
  } catch (error) {
    dispatch({ type: ADMIN_PRODUCT_FAIL, payload: error.response.data.message });
  }
};

// CREATE PRODUCT -- ADMIN
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/admin/product/new', productData, config);
    dispatch({ type: NEW_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message
    });
  }
};

// DELETE PRODUCT -- ADMIN
export const delProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    const { data } = await axios.delete(`/api/admin/product/${id}`);
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message
    });
  }
};

// UPDATE PRODUCT -- ADMIN
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.put(`/api/admin/product/${id}`, productData, config);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message
    });
  }
};

// GET ALL REVIEWS OF A PRODUCT
export const getAllReviews = (productId) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEWS_REQUEST });
    const { data } = await axios.get(`/api/reviews?id=${productId}`);
    dispatch({ type: ALL_REVIEWS_SUCCESS, payload: data.reviews });
  } catch (error) {
    dispatch({
      type: ALL_REVIEWS_FAIL,
      payload: error.response.data.message
    });
  }
};

// DELETE REVIEWS OF A PRODUCT
export const deleteReview = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });
    const { data } = await axios.delete(`/api/reviews?id=${reviewId}&productId=${productId}`);
    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
