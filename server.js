const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const Pet = require('./models/Pet');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pet_adoption';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serving root directory for frontend files

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// API Routes

// Upload Image Route
app.post('/api/upload', upload.single('petImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        res.json({ success: true, imageUrl: 'images/' + req.file.filename });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// Login (Check against database)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === 'admin' && password === 'admin') {
            return res.json({ success: true, message: 'Admin LoggedIn', token: 'admin-token', role: 'admin' });
        }

        const user = await User.findOne({ username, password }); // In a real app, use hashing!
        if (user) {
            res.json({ success: true, message: 'LoggedIn', token: 'dummy-token', role: 'user', username: user.username });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Signup (Create new user)
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or Email already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({ success: true, message: 'Account created successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Checkout multiple pets
app.post('/api/checkout', async (req, res) => {
    try {
        const { username, petIds, details } = req.body;
        console.log(`Checkout request from ${username} for pets:`, petIds);

        const newOrder = new Order({
            username,
            pets: petIds,
            details,
            status: 'pending'
        });
        await newOrder.save();

        await Pet.updateMany({ _id: { $in: petIds } }, {
            is_adopted: true,
            adoption_status: 'pending',
            $set: { adoption_details: details }
        });

        res.json({ success: true, message: 'Checkout successfully submitted!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User get orders
app.get('/api/orders/:username', async (req, res) => {
    try {
        const orders = await Order.find({ username: req.params.username }).populate('pets').sort({ created_at: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/requests', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'pending' }).populate('pets');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/approved', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'approved' }).populate('pets');
        res.json(orders);
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
        const order = await Order.findByIdAndUpdate(req.params.id, { status: 'approved' });
        if(order) {
           await Pet.updateMany({ _id: { $in: order.pets } }, { adoption_status: 'approved' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/reject/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: 'rejected' });
        if(order) {
           await Pet.updateMany({ _id: { $in: order.pets } }, { adoption_status: 'available', is_adopted: false });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/pets', async (req, res) => {
    try {
        const petData = req.body;
        if (petData.image_url) {
            petData.image_url = petData.image_url.replace(/\\/g, '/');
        }
        const newPet = new Pet(petData);
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
