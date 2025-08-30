const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    total: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['pending', 'fulfilled', 'cancelled'], 
        default: 'pending' 
    },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);