import React from 'react';
import './Cart.css';
import CartItemCard from './CartItemCard';
import { useSelector, useDispatch } from 'react-redux';
import { addItemsToCart, removeCartItems } from '../../actions/cartActions';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import Typography from '@material-ui/core/Typography';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const upQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) return;

    dispatch(addItemsToCart(id, newQty));
  };

  const downQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) return;

    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeCartItems(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>NO HAY PRODUCTOS EN EL CARRITO</Typography>
          <Link to="/products">Ir a Productos</Link>
        </div>
      ) : (
        <>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Producto</p>
              <p>Cantidad</p>
              <p>Subtotal</p>
            </div>
  
            {cartItems && cartItems.map((item) => (
              <div className="cartContainer" key={item.product}>
                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                <div className="cartInput">
                  <button
                    onClick={() =>
                      downQuantity(item.product, item.quantity)}
                  >-
                  </button>
                  <input type="number" readOnly value={item.quantity} />
                  <button
                    onClick={() =>
                      upQuantity(item.product, item.quantity, item.stock)}
                  >+
                  </button>
                </div>
                <p className="cartSubtotal">{`$ ${item.price * item.quantity}`}</p>
              </div>
            ))}
  
            <div className="cartGrossProfit">
              <div />
              <div className="cartGrossProfitBox">
                <p>Total</p>
                <p> {`$ ${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}
                </p>
              </div>
              <div />
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Verificar</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
