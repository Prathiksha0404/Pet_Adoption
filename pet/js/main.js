// Carousel Logic
const carouselSlide = document.getElementById('carouselSlide');
const slides = document.querySelectorAll('.slide');

let counter = 0;
const size = 100 / slides.length; // Slide width as % of container

function nextSlide() {
    counter++;
    if (counter >= slides.length) counter = 0;
    carouselSlide.style.transform = `translateX(-${counter * 33.333}%)`;
}

setInterval(nextSlide, 3000); // Change slide every 3 seconds

// Pet Data Loading (Services Page)
async function fetchPets(type = '') {
    const url = type ? `http://localhost:5000/api/pets/${type}` : 'http://localhost:5000/api/pets';
    try {
        const response = await fetch(url);
        const pets = await response.json();
        displayPets(pets);
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
}

function displayPets(pets) {
    const petList = document.getElementById('petList');
    if (!petList) return;

    petList.innerHTML = '';

    pets.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'pet-card';
        card.innerHTML = `
            <img src="${pet.image_url}" alt="${pet.name}">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p><strong>Type:</strong> ${pet.type}</p>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p><strong>Age:</strong> ${pet.age}</p>
                <div class="unique-feature">
                    <strong>Unique Feature:</strong><br>
                    ${pet.unique_feature}
                </div>
                <p>${pet.description}</p>
                <button class="adopt-btn" onclick="adoptPet('${pet._id}')">Adopt Me</button>
            </div>
        `;
        petList.appendChild(card);
    });
}

// Sidebar Dropdown Toggle (Services Page)
const dropdownToggle = document.getElementById('animalDropdownBtn');
const dropdownMenu = document.getElementById('animalDropdownMenu');

if (dropdownToggle) {
    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });
}

// Adoption Logic
function adoptPet(petId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please login first to adopt a pet!');
        window.location.href = 'login.html';
        return;
    }

    // Show modal instead of immediate adoption
    const modal = document.getElementById('adoptionModal');
    const modalPetId = document.getElementById('modalPetId');
    if (modal && modalPetId) {
        modalPetId.value = petId;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('adoptionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('adoptionModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Handle Adoption Form Submission
const adoptionForm = document.getElementById('adoptionForm');
if (adoptionForm) {
    adoptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const petId = document.getElementById('modalPetId').value;
        const details = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            reason: document.getElementById('reason').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/adopt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, details })
            });
            const data = await response.json();
            if (data.success) {
                alert(`Congratulations! Your adoption request for this pet has been submitted. Our team will contact you soon.`);
                closeModal();
                location.reload();
            }
        } catch (error) {
            console.error('Error adopting pet:', error);
            alert('Something went wrong. Please try again.');
        }
    });
}

// Login Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', data.role);
                alert('Login Successful!');
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'services.html';
                }
            } else {
                alert('Invalid Credentials!');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });
}



// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for contacting FurEver Home! We have received your message and will get back to you soon.');
        contactForm.reset();
    });
}

// Auth UI State and Logout
window.logout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
};

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginBtns = document.querySelectorAll('.login-btn#loginBtn');
    const logoutBtns = document.querySelectorAll('.login-btn#logoutBtn');
    
    loginBtns.forEach(btn => btn.style.display = (isLoggedIn === 'true') ? 'none' : 'inline-block');
    logoutBtns.forEach(btn => btn.style.display = (isLoggedIn === 'true') ? 'inline-block' : 'none');
}

// Run immediately instead of waiting for window.onload
updateAuthUI();

// Initialization for specific pages
window.onload = () => {
    updateAuthUI();
    if (document.getElementById('petList')) {
        fetchPets();
    }
};
