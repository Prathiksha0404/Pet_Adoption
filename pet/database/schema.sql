CREATE DATABASE IF NOT EXISTS pet_adoption;
USE pet_adoption;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'Dog', 'Cat', 'Rabbit', etc.
    breed VARCHAR(50),
    age VARCHAR(20),
    image_url VARCHAR(255),
    description TEXT,
    unique_feature TEXT,
    is_adopted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO pets (name, type, breed, age, image_url, description, unique_feature) VALUES
('Luna', 'Cat', 'Persian', '2 years', '/images/cat1.jpg', 'Luna is a very calm and affectionate Persian cat who loves to lounge in the sun.', 'Extremely fluffy and has a gentle purr that can soothe anyone.'),
('Shadow', 'Dog', 'Black Labrador', '3 years', '/images/dog1.jpg', 'Shadow is an energetic and loyal Black Labrador who loves playing fetch.', 'A remarkably high intelligence and can learn new tricks in just one afternoon.'),
('Bella', 'Rabbit', 'Holland Lop', '1 year', '/images/rabbit1.jpg', 'Bella is a sweet and curious Holland Lop rabbit who enjoys nibbling on fresh vegetables.', 'Unusually social for a rabbit and will often approach humans for gentle nose boops.'),
('Oliver', 'Cat', 'Maine Coon', '4 years', '/images/cat2.jpg', 'Oliver is a majestic and large Maine Coon cat with a very friendly personality.', 'One of the largest domestic cat breeds, known as a "gentle giant" with tufted ears.');
