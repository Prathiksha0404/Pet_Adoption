const mongoose = require('mongoose');
const Pet = require('./models/Pet');

const MONGO_URI = 'mongodb://localhost:27017/pet_adoption';

mongoose.connect(MONGO_URI)
    .then(async () => {
        const count = await Pet.countDocuments();
        console.log('Total pets in DB:', count);
        const pets = await Pet.find();
        console.log('Pets:', JSON.stringify(pets, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
