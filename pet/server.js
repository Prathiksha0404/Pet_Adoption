const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const Pet = require('./models/Pet');

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pet_adoption';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serving root directory for frontend files

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// API Routes

// Get all pets
app.get('/api/pets', async (req, res) => {
    try {
        const pets = await Pet.find({ is_adopted: false });
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get pets by type
app.get('/api/pets/:type', async (req, res) => {
    try {
        const type = req.params.type;
        const pets = await Pet.find({ type: type, is_adopted: false });
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login (Allow any person or admin)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        res.json({ success: true, message: 'Admin LoggedIn', token: 'admin-token', role: 'admin' });
    } else if (username && password) {
        res.json({ success: true, message: 'LoggedIn', token: 'dummy-token', role: 'user' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});



// Adopt a pet
app.post('/api/adopt', async (req, res) => {
    try {
        const { petId, details } = req.body;
        console.log(`Adoption request for pet ${petId}:`, details);

        const result = await Pet.findByIdAndUpdate(petId, {
            is_adopted: true,
            adoption_status: 'pending',
            $set: { adoption_details: details } // Store details in a new field
        });

        if (!result) return res.status(404).json({ message: 'Pet not found' });
        res.json({ success: true, message: 'Pet adoption request submitted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/requests', async (req, res) => {
    try {
        const pets = await Pet.find({ adoption_status: 'pending' });
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/approved', async (req, res) => {
    try {
        const pets = await Pet.find({ adoption_status: 'approved' });
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/allpets', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/approve/:id', async (req, res) => {
    try {
        await Pet.findByIdAndUpdate(req.params.id, { adoption_status: 'approved' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/reject/:id', async (req, res) => {
    try {
        await Pet.findByIdAndUpdate(req.params.id, { adoption_status: 'available', is_adopted: false });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/pets', async (req, res) => {
    try {
        const newPet = new Pet(req.body);
        newPet.is_adopted = false;
        newPet.adoption_status = 'available';
        await newPet.save();
        res.json({ success: true, pet: newPet });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/pets/:id', async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --------------------

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
