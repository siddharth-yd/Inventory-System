const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderItem = require('../models/OrderItem');

// --- Create Order (already using transactions, as provided earlier) ---

exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user_id, items } = req.body;
        if (!items || items.length === 0) throw new Error("Order must contain at least one item");

        let orderTotal = 0;
        const newOrder = new Order({ user_id, total: 0, status: 'pending' });
        await newOrder.save({ session });

        for (let item of items) {
            const product = await Product.findById(item.product_id).session(session);
            if (!product) throw new Error("Product not found");
            if (product.stock_quantity < item.quantity) throw new Error(`Not enough stock for ${product.name}`);

            // Deduct stock
            product.stock_quantity -= item.quantity;
            await product.save({ session });

            // Create OrderItem attached to order
            const orderItem = new OrderItem({
                order_id: newOrder._id,
                product_id: product._id,
                quantity: item.quantity,
                price_at_time: product.price
            });
            await orderItem.save({ session });

            orderTotal += product.price * item.quantity;
        }

        // Add tax/fees if needed
        const taxRate = 0.05;
        orderTotal += orderTotal * taxRate;

        // Update order total
        newOrder.total = orderTotal;
        await newOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(newOrder);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: error.message });
    }
};

// --- Get a Single Order with Items + Product Details ---
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const items = await OrderItem.find({ order_id: order._id }).populate('product_id'); 

        res.json({
            ...order.toObject(),
            items
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Get User Orders with Items + Product Details ---
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.params.id });

        // Populate for all orders
        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                const items = await OrderItem.find({ order_id: order._id }).populate('product_id');
                return {
                    ...order.toObject(),
                    items
                };
            })
        );

        res.json(enrichedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Update Order Status ---
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Fulfill an Order ---
exports.fulfillOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: 'fulfilled' },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};