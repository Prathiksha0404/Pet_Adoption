const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    age: { type: String },
    image_url: { type: String },
    description: { type: String },
    unique_feature: { type: String },
    is_adopted: { type: Boolean, default: false },
    adoption_status: { type: String, enum: ['available', 'pending', 'approved', 'rejected'], default: 'available' },
    adoption_details: { type: Object },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', PetSchema);
