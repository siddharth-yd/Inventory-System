const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderItem = require('../models/OrderItem');

exports.createOrder = async (req, res) => {
    try {
        const { user_id, items } = req.body;
        if (!items || items.length === 0) {
            throw new Error("Order must contain at least one item");
        }
        const newOrder = new Order({
            user_id,
            total: 0,
            status: 'pending'
        });
        await newOrder.save();

        let orderTotal = 0;

        for (let item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) throw new Error("Product not found");
            if (product.stock_quantity < item.quantity) {
                throw new Error(`Not enough stock for product ${product.name}`);
            }

            product.stock_quantity -= item.quantity;
            await product.save();

            const orderItem = new OrderItem({
                order_id: newOrder._id,
                product_id: product._id,
                quantity: item.quantity,
                price_at_time: product.price
            });
            await orderItem.save();

            orderTotal += product.price * item.quantity;
        }

        const taxRate = 0.05;
        orderTotal += orderTotal * taxRate;

        newOrder.total = orderTotal;
        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.params.id });

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