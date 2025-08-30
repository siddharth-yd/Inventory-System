import React from 'react';
import API from '../api';

function ShoppingCart({ cart, setCart, userId }) {

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const checkout = async () => {
    try {
      const items = cart.map(item => ({
        product_id: item.product._id,
        quantity: item.quantity
      }));

      if (items.length === 0) return alert("Cart is empty!");

      const res = await API.post('/orders', { user_id: userId, items });
      alert(`✅ Order created successfully! Order ID: ${res.data._id}`);
      setCart([]); // clear cart after checkout
    } catch (err) {
      alert("❌ Error creating order: " + err.response?.data?.error || err.message);
    }
  };

  const increaseQty = (product) => {
    setCart(cart.map(item =>
      item.product._id === product._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQty = (product) => {
    setCart(cart.map(item =>
      item.product._id === product._id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.product._id}>
                {item.product.name} - ${item.product.price.toFixed(2)} x {item.quantity}
                {" "}
                <button onClick={() => increaseQty(item.product)}>+</button>
                <button onClick={() => decreaseQty(item.product)}>-</button>
                <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;