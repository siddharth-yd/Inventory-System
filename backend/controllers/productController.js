const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
};

exports.lowStockProducts = async (req, res) => {
    const products = await Product.find({ stock_quantity: { $lt: 10 } });
    res.json(products);
};

exports.updateStock = async (req, res) => {
    const { stock_quantity } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { stock_quantity }, { new: true });
    res.json(product);
};