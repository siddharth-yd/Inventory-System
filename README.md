# 🛒 E‑Commerce Inventory Management System (MERN)
This project is a full‑stack E-commerce Inventory System built using the MERN stack (MongoDB, Express, React, Node.js).
It provides inventory management, order processing, and a frontend portal for customers and store managers.

### 🚀 Setup Instructions
####  1️⃣ Backend
```bash
cd backend
npm install
```
Create a .env file:

text
MONGO_URI=mongodb://127.0.0.1:27017/inventorydb
PORT=5000
Start backend:

``` bash
npm start
```
Expected log:

text
✅ Connected to MongoDB
🚀 Server running on port 5000
#### 2️⃣ Frontend
``` bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000.

#### 3️⃣ Insert Sample Data
Categories & Products can be inserted via API (Postman) or MongoDB Compass.

Example Category
http
POST http://localhost:5000/api/categories
```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```
Example Product
http
POST http://localhost:5000/api/products
```json
{
  "name": "Wireless Mouse",
  "sku": "ELEC001",
  "price": 25,
  "stock_quantity": 100,
  "category_id": "<replace_with_category_objectId>"
}
```
📖 API Endpoints
#### Products
- GET /api/products → list products
- POST /api/products → create new product
- PUT /api/products/:id → update product info
- GET /api/products/low-stock → products with <10 stock
- PUT /api/products/:id/stock → update stock quantity
#### Orders
- POST /api/orders → create new order
- GET /api/orders/:id → get order details
- PUT /api/orders/:id/status → update order status
- POST /api/orders/:id/fulfill → fulfill order
- GET /api/orders/user/:id → get user order history
#### Categories
- GET /api/categories → list categories
- POST /api/categories → create category
