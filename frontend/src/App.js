import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import OrderHistory from './components/OrderHistory';

function App() {
  const [cart, setCart] = useState([]);
  const userId = "user123"; // Simulated logged-in user

  // Cart handler
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
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        
        {/* Navbar */}
        <nav style={{ background: "#333", padding: "1rem" }}>
          <Link to="/products" style={{ color: "#fff", marginRight: "1rem" }}>Products</Link>
          <Link to="/cart" style={{ color: "#fff", marginRight: "1rem" }}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </Link>
          <Link to="/orders" style={{ color: "#fff" }}>My Orders</Link>
        </nav>

        {/* Routes */}
        <div style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            
            <Route 
              path="/products" 
              element={<ProductCatalog addToCart={addToCart} />} 
            />
            
            <Route 
              path="/cart" 
              element={<ShoppingCart cart={cart} setCart={setCart} userId={userId} />} 
            />
            
            <Route 
              path="/orders" 
              element={<OrderHistory />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;