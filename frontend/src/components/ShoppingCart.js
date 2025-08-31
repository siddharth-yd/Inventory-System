import React from 'react';
import API from '../api';
import { Table, Button } from 'react-bootstrap';

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
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.product._id}>
                  <td>{item.product.name}</td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>
                    <Button size="sm" variant="light" onClick={() => decreaseQty(item.product)}>-</Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button size="sm" variant="light" onClick={() => increaseQty(item.product)}>+</Button>
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td><Button size="sm" variant="danger" onClick={() => removeFromCart(item.product._id)}>Remove</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h3>Total: ${total.toFixed(2)}</h3>
          <Button variant="success" onClick={checkout}>Checkout</Button>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;