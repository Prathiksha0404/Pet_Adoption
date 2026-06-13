const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
    details: {
        fullName: String,
        email: String,
        phone: String,
        reason: String
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
