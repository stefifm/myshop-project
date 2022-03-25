import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO
} from '../constants/cartConstants';
import axios from 'axios';

// ADD ITEMS TO CART
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(
    `/api/product/${id}`
  );
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.Stock,
      quantity
    }
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// REMOVE ITEMS FROM CART
export const removeCartItems = (id) => async (dispacth, getState) => {
  dispacth({
    type: REMOVE_CART_ITEM,
    payload: id
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data
  });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};
