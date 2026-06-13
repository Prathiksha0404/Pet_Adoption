const mongoose = require('mongoose');
const Pet = require('./models/Pet');

const MONGO_URI = 'mongodb://localhost:27017/pet_adoption';

const pets = [
    {
        name: 'Luna',
        type: 'Cat',
        breed: 'Persian',
        age: '2 years',
        image_url: 'images/cat1.jpg',
        description: 'Luna is a very calm and affectionate Persian cat who loves to lounge in the sun.',
        unique_feature: 'Extremely fluffy and has a gentle purr that can soothe anyone.'
    },
    {
        name: 'Shadow',
        type: 'Dog',
        breed: 'Black Labrador',
        age: '3 years',
        image_url: 'images/dog1.jpg',
        description: 'Shadow is an energetic and loyal Black Labrador who loves playing fetch.',
        unique_feature: 'A remarkably high intelligence and can learn new tricks in just one afternoon.'
    },
    {
        name: 'Bella',
        type: 'Rabbit',
        breed: 'Holland Lop',
        age: '1 year',
        image_url: 'images/rabbit1.jpg',
        description: 'Bella is a sweet and curious Holland Lop rabbit who enjoys nibbling on fresh vegetables.',
        unique_feature: 'Unusually social for a rabbit and will often approach humans for gentle nose boops.'
    },
    {
        name: 'Oliver',
        type: 'Cat',
        breed: 'Maine Coon',
        age: '4 years',
        image_url: 'images/cat2.jpg',
        description: 'Oliver is a majestic and large Maine Coon cat with a very friendly personality.',
        unique_feature: 'One of the largest domestic cat breeds, known as a "gentle giant" with tufted ears.'
    },
    {
        name: 'Max',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: '2 years',
        image_url: 'images/golden_retriever.png',
        description: 'Max is a friendly and eager-to-please Golden Retriever who loves running.',
        unique_feature: 'Incredibly gentle and great with children of all ages.'
    },
    {
        name: 'Chloe',
        type: 'Cat',
        breed: 'Siamese',
        age: '1 year',
        image_url: 'images/siamese_cat.png',
        description: 'Chloe is a vocal and striking Siamese cat who loves to follow you around the house.',
        unique_feature: 'Has stunning blue eyes and a very communicative meow.'
    },
    {
        name: 'Thumper',
        type: 'Rabbit',
        breed: 'Mini Rex',
        age: '2 years',
        image_url: 'images/mini_rex_rabbit.png',
        description: 'Thumper is a playful Mini Rex rabbit known for his velvety fur and energetic hops.',
        unique_feature: 'Has incredibly soft, plush fur that feels like velvet.'
    },
    {
        name: 'Daisy',
        type: 'Dog',
        breed: 'Beagle',
        age: '4 years',
        image_url: 'images/beagle_dog.png',
        description: 'Daisy is a curious and sweet-tempered Beagle with an excellent nose for treats.',
        unique_feature: 'Has floppy ears and a distinctive, happy howl when she finds something interesting.'
    },
    {
        name: 'Leo',
        type: 'Cat',
        breed: 'Bengal',
        age: '3 years',
        image_url: 'images/bengal_cat.png',
        description: 'Leo is an active and highly intelligent Bengal cat who loves to climb and explore.',
        unique_feature: 'Features a beautiful spotted coat resembling a wild leopard.'
    },
    {
        name: 'Snowball',
        type: 'Rabbit',
        breed: 'Lionhead',
        age: '1 year',
        image_url: 'images/lionhead_rabbit.png',
        description: 'Snowball is a fluffy Lionhead rabbit who enjoys being gently brushed.',
        unique_feature: 'Has a distinctive "mane" of wool around the head, resembling a male lion.'
    },
    
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB for seeding...');
        await Pet.deleteMany({});
        await Pet.insertMany(pets);
        console.log('Database seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });
