const mongoose = require('mongoose');
const Pet = require('./models/Pet');

const MONGO_URI = 'mongodb://localhost:27017/pet_adoption';

mongoose.connect(MONGO_URI)
    .then(async () => {
        const result = await Pet.updateMany({}, { is_adopted: false });
        console.log('Updated pets:', result.modifiedCount);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
