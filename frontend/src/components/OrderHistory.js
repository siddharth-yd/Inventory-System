import React, { useState, useEffect } from 'react';
import API from '../api';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const userId = "user123"; // Simulated logged-in user

  useEffect(() => {
    API.get(`/orders/user/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  if (!orders.length) {
    return <p>No past orders found.</p>;
  }

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #ddd", marginBottom: "1rem", padding: "1rem" }}>
          <h3>Order #{order._id}</h3>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Ordered At:</strong> {new Date(order.created_at).toLocaleString()}</p>

          <h4>Items:</h4>
          <ul>
            {order.items.map((item) => (
              <li key={item._id}>
                {item.product_id?.name || "Unknown Product"}  
                (x{item.quantity}) @ ${item.price_at_time.toFixed(2)} each
                = ${(item.price_at_time * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;