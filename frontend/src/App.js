import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import OrderHistory from './components/OrderHistory';
import { Navbar, Nav, Container } from 'react-bootstrap';

function App() {
  const [cart, setCart] = useState([]);
  const userId = "user123"; // Simulated logged-in user

  const addToCart = (product) => {
    const existing = cart.find(item => item.product._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/products">E-Commerce Inventory</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Nav.Link>
            <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<ProductCatalog addToCart={addToCart} />} />
          <Route path="/cart" element={<ShoppingCart cart={cart} setCart={setCart} userId={userId} />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;