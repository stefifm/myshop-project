import React from 'react';
import './CartItemCard.css';
import { Link } from 'react-router-dom';

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      <img src={item.image} alt="sss" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Precio: $ ${item.price}`}</span>
        <p onClick={() => deleteCartItems(item.product)} aria-hidden="true">Quitar del Carrito</p>
      </div>
    </div>
  );
};

export default CartItemCard;
