import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Cart.css'; // Import the CSS file

const Cart = () => {
  const { cart, totalPrice, updateQuantity, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <div className="cart-item-details">
                <h3>{item.productId.name}</h3>
                <p>Price: ${item.productId.price}</p>
                <div className="cart-item-controls">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
                  />
                  <button className="remove-button" onClick={() => removeFromCart(item.productId._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default Cart;
