import React, { useState, useEffect } from 'react';
import API from '../api';
import { Accordion, ListGroup } from 'react-bootstrap';

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
      <Accordion defaultActiveKey="0">
        {orders.map((order, i) => (
          <Accordion.Item eventKey={i.toString()} key={order._id}>
            <Accordion.Header>
              Order #{order._id} - {order.status} - Total: ${order.total.toFixed(2)}
            </Accordion.Header>
            <Accordion.Body>
              <p><strong>Placed:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <ListGroup>
                {order.items.map(item => (
                  <ListGroup.Item key={item._id}>
                    {item.product_id?.name} - {item.quantity} × ${item.price_at_time.toFixed(2)}  
                    = ${(item.quantity * item.price_at_time).toFixed(2)}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default OrderHistory;