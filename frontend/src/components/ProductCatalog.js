import React, { useState, useEffect } from 'react';
import API from '../api';

function ProductCatalog({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [lowStockOnly]);

  const fetchProducts = async () => {
    try {
      const endpoint = lowStockOnly ? "/products/low-stock" : "/products";
      const res = await API.get(endpoint);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>Product Catalog</h2>
      
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "1rem" }}
      />

      <label>
        <input
          type="checkbox"
          checked={lowStockOnly}
          onChange={() => setLowStockOnly(!lowStockOnly)}
        />
        Show Low Stock Only
      </label>

      <ul>
        {filteredProducts.map(p => (
          <li key={p._id} style={{ margin: "0.5rem 0" }}>
            {p.name} - Stock: {p.stock_quantity} - ${p.price.toFixed(2)}
            {" "}
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductCatalog;