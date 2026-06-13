// Carousel Logic
const carouselSlide = document.getElementById('carouselSlide');
const slides = document.querySelectorAll('.slide');

let counter = 0;
const size = slides ? 100 / slides.length : 100;

function nextSlide() {
    counter++;
    if (counter >= slides.length) counter = 0;
    if(carouselSlide) carouselSlide.style.transform = `translateX(-${counter * 33.333}%)`;
}

if(carouselSlide && slides.length > 0) {
    setInterval(nextSlide, 3000);
}

// Pet Data Loading (Services Page)
async function fetchPets(type = '') {
    const url = type ? `http://localhost:5000/api/pets/${type}` : 'http://localhost:5000/api/pets';
    try {
        const response = await fetch(url);
        const pets = await response.json();
        displayPets(pets);
    } catch (error) {
        console.error('Error fetching pets:', error);
        
        let petList = document.getElementById('petList');
        if (petList) {
            petList.innerHTML = `<p style="color:red;">Error loading pets. Please ensure the backend server is running.</p>`;
        }
    }
}

function displayPets(pets) {
    const petList = document.getElementById('petList');
    if (!petList) return;

    petList.innerHTML = '';
    
    if (pets.length === 0) {
        petList.innerHTML = `<p>No pets available right now!</p>`;
        return;
    }

    pets.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'pet-card';
        const safeName = pet.name.replace(/'/g, "").replace(/"/g, "");
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
                <div style="display:flex; gap: 10px; margin-top:10px;">
                    <button class="adopt-btn" style="flex:1; background:#4CAF50;" onclick="adoptDirectly('${pet._id}', '${safeName}', '${pet.image_url}', '${pet.type}')">Adopt Now</button>
                    <button class="adopt-btn" style="flex:1;" onclick="addToCart('${pet._id}', '${safeName}', '${pet.image_url}', '${pet.type}')">Add to Cart</button>
                </div>
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

// --- CART LOGIC ---
let cart = [];
try {
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];
    if (!Array.isArray(cart)) cart = [];
} catch(e) {
    cart = [];
}

window.addToCart = function (petId, petName, imageUrl, petType) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please login first to adopt a pet!');
        window.location.href = 'login.html';
        return;
    }

    if (cart.find(p => p.id === petId)) {
        alert('Pet is already in your cart!');
        return;
    }

    cart.push({ id: petId, name: petName, image: imageUrl, type: petType });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${petName} added to cart!`);
}

window.adoptDirectly = function (petId, petName, imageUrl, petType) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please login first to adopt a pet!');
        window.location.href = 'login.html';
        return;
    }

    sessionStorage.setItem('directCheckout', JSON.stringify({
        id: petId,
        name: petName,
        image: imageUrl,
        type: petType
    }));
    
    window.location.href = 'cart.html?direct=true';
}

function updateCartCount() {
    const cartBtns = document.querySelectorAll('.login-btn#cartBtn');
    cartBtns.forEach(btn => {
        btn.textContent = `Cart (${cart.length})`;
    });
}

window.openCart = function() {
    window.location.href = 'cart.html';
}

// Render logic for dedicated cart page
function renderDedicatedCart() {
    const dedicatedCartList = document.getElementById('dedicatedCartList');
    const checkoutForm = document.getElementById('dedicatedCheckoutForm');
    const cartTitle = document.getElementById('cartTitle');
    
    const urlParams = new URLSearchParams(window.location.search);
    const isDirect = urlParams.get('direct');
    
    let activeItems = [];
    if (isDirect === 'true') {
        const directItem = JSON.parse(sessionStorage.getItem('directCheckout'));
        if (directItem) {
            activeItems = [directItem];
            if(cartTitle) cartTitle.innerText = "Adopt Pet Now";
        }
    } else {
        activeItems = cart;
        if(cartTitle) cartTitle.innerText = `Your Adoption Cart (${cart.length} item${cart.length !== 1 ? 's' : ''})`;
    }

    if (!dedicatedCartList) return;

    if (activeItems.length === 0) {
        dedicatedCartList.innerHTML = `<div class="empty-cart">
            <h3>Your cart is completely empty!</h3>
            <p>Go to the <a href="services.html" style="color:var(--primary);">Services</a> page to find your new best friend.</p>
        </div>`;
        if(checkoutForm) checkoutForm.style.display = 'none';
        return;
    }

    if(checkoutForm) checkoutForm.style.display = 'block';

    let itemsHtml = '';
    activeItems.forEach((p, index) => {
        itemsHtml += `
        <div class="cart-item">
            <div class="cart-item-info">
                <img src="${p.image || 'images/hero1.jpg'}" alt="${p.name}">
                <div class="cart-item-text">
                    <h4>${p.name}</h4>
                    <span>${p.type || 'Pet'}</span>
                </div>
            </div>
            ${isDirect === 'true' ? '<span style="font-weight:bold; color:var(--primary);">Direct Checkout</span>' : 
            `<button onclick="removeDedicated(${index})" class="btn-remove">Remove</button>`}
        </div>`;
    });
    dedicatedCartList.innerHTML = itemsHtml;
}

window.removeDedicated = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderDedicatedCart();
};

const dedicatedForm = document.getElementById('dedicatedCheckoutForm');
if (dedicatedForm) {
    dedicatedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const urlParams = new URLSearchParams(window.location.search);
        const isDirect = urlParams.get('direct');
        let petIds = [];
        
        if (isDirect === 'true') {
            const directItem = JSON.parse(sessionStorage.getItem('directCheckout'));
            if (!directItem) return alert("System Error: Direct item missing!");
            petIds = [directItem.id];
        } else {
            if (cart.length === 0) return alert('Your cart is empty!');
            petIds = cart.map(p => p.id);
        }
        
        const username = localStorage.getItem('username');
        const details = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            reason: document.getElementById('reason').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, petIds, details })
            });
            const data = await response.json();
            if (data.success) {
                alert('Congratulations! Your secure checkout application has been processed.');
                if (isDirect === 'true') {
                    sessionStorage.removeItem('directCheckout');
                } else {
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                }
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Checkout failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong submitting your application.');
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
                localStorage.setItem('username', data.username);
                alert('Login Successful!');
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'services.html';
                }
            } else {
                alert(data.message || 'Invalid Credentials!');
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
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    cart = [];
    window.location.href = 'index.html';
};

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    const loginBtns = document.querySelectorAll('.login-btn#loginBtn');
    const logoutBtns = document.querySelectorAll('.login-btn#logoutBtn');
    const cartBtns = document.querySelectorAll('.login-btn#cartBtn');
    const myAdoptionsLink = document.querySelectorAll('#myAdoptionsLink');
    
    const isNormalUser = (isLoggedIn === 'true' && role !== 'admin');
    
    loginBtns.forEach(btn => btn.style.display = (isLoggedIn === 'true') ? 'none' : 'inline-block');
    logoutBtns.forEach(btn => btn.style.display = (isLoggedIn === 'true') ? 'inline-block' : 'none');
    
    cartBtns.forEach(btn => btn.style.display = isNormalUser ? 'inline-block' : 'none');
    myAdoptionsLink.forEach(link => link.style.display = isNormalUser ? 'inline-block' : 'none');
    
    updateCartCount();
}

// Initialization for specific pages
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    if (document.getElementById('petList')) {
        fetchPets();
    }
    if (document.getElementById('dedicatedCartList')) {
        renderDedicatedCart();
    }
});
