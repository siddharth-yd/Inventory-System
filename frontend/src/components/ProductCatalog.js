import React, { useState, useEffect } from 'react';
import API from '../api';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';

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
    <div>
      <h2>Product Catalog</h2>
      <Form className="d-flex mb-3">
        <Form.Control type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Form.Check
          type="checkbox"
          label="Low Stock Only"
          className="ms-3"
          checked={lowStockOnly}
          onChange={() => setLowStockOnly(!lowStockOnly)}
        />
      </Form>

      <Row>
        {filteredProducts.map(p => (
          <Col sm={12} md={4} lg={3} className="mb-3" key={p._id}>
            <Card>
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Stock: {p.stock_quantity}</Card.Subtitle>
                <Card.Text>${p.price.toFixed(2)}</Card.Text>
                <Button variant="primary" onClick={() => addToCart(p)}>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductCatalog;