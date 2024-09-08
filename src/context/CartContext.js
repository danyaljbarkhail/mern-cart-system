import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);  // Store cartId dynamically
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart and cartId when the component is mounted
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = 'user-123'; // Replace with actual user ID
        // Use the live backend URL
        const response = await axios.get(`https://mern-cart-server.onrender.com/cart/${userId}`);
        setCart(response.data.products || []);
        setCartId(response.data.cartId);  // Store the cartId for future use
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  // Calculate the total price whenever the cart changes
  useEffect(() => {
    const calculateTotal = () => {
      const total = cart.reduce((sum, item) => sum + (item.productId.price || 0) * item.quantity, 0);
      setTotalPrice(total);
    };
    calculateTotal();
  }, [cart]);

  // Add a product to the cart
  const addToCart = async (product) => {
    try {
      console.log('Adding product to cart:', product);

      const response = await axios.post('https://mern-cart-server.onrender.com/cart', {
        userId: 'user-123', // Replace with actual user ID
        productId: product._id,
        quantity: 1,
      });

      setCart(response.data.products); // Update the cart with response data
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Update the quantity of a product in the cart
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return; // Prevent setting quantity to 0 or negative numbers

    // Optimistically update the cart state before the backend response
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      if (cartId) {
        const response = await axios.put(`https://mern-cart-server.onrender.com/cart/${cartId}/${productId}`, {
          quantity: newQuantity,
        });
        setCart(response.data.products);  // Sync cart with backend response
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    // Optimistically remove the item from the cart state before the backend response
    setCart((prevCart) => prevCart.filter((item) => item.productId._id !== productId));

    try {
      if (cartId) {
        const response = await axios.delete(`https://mern-cart-server.onrender.com/cart/${cartId}/${productId}`);
        setCart(response.data.products);  // Sync cart with backend response
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, totalPrice, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
