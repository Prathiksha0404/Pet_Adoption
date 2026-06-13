// Admin Authentication Check
window.onload = () => {
    const role = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true' || role !== 'admin') {
        alert('Unauthorized access! Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }
    loadData();
};

function adminLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

function switchTab(tabId) {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
    loadData();
}

function loadData() {
    loadRequests();
    loadApproved();
    loadAllPets();
}

async function loadRequests() {
    try {
        const res = await fetch('http://localhost:5000/api/admin/requests');
        const orders = await res.json();
        const tbody = document.getElementById('requestsTableBody');
        tbody.innerHTML = '';
        orders.forEach(order => {
            const petNames = order.pets.map(p => p.name).join(', ');
            const details = order.details || {};
            tbody.innerHTML += `
                <tr>
                    <td>${petNames}</td>
                    <td>${details.fullName || 'N/A'}</td>
                    <td>${details.email || 'N/A'}</td>
                    <td>${details.phone || 'N/A'}</td>
                    <td>${details.reason || 'N/A'}</td>
                    <td>
                        <button class="action-btn btn-approve" onclick="approveRequest('${order._id}')">Approve</button>
                        <button class="action-btn btn-reject" onclick="rejectRequest('${order._id}')">Reject</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error(e);
    }
}

async function loadApproved() {
    try {
        const res = await fetch('http://localhost:5000/api/admin/approved');
        const orders = await res.json();
        const tbody = document.getElementById('approvedTableBody');
        tbody.innerHTML = '';
        orders.forEach(order => {
            const petNames = order.pets.map(p => p.name).join(', ');
            const details = order.details || {};
            tbody.innerHTML += `
                <tr>
                    <td>${petNames}</td>
                    <td>${details.fullName || 'N/A'}</td>
                    <td>${details.email || 'N/A'}</td>
                    <td>${details.phone || 'N/A'}</td>
                </tr>
            `;
        });
    } catch (e) {
        console.error(e);
    }
}

async function loadAllPets() {
    try {
        const res = await fetch('http://localhost:5000/api/admin/allpets');
        const pets = await res.json();
        const tbody = document.getElementById('allPetsTableBody');
        tbody.innerHTML = '';
        pets.forEach(pet => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${pet.image_url}" width="50" height="50" style="object-fit:cover; border-radius:5px;"></td>
                    <td>${pet.name}</td>
                    <td>${pet.type}</td>
                    <td><span style="padding:4px 8px; border-radius:10px; background:#eee;">${pet.adoption_status}</span></td>
                    <td>
                        <button class="action-btn btn-reject" onclick="deletePet('${pet._id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error(e);
    }
}

async function approveRequest(id) {
    if(confirm('Approve this adoption request?')) {
        await fetch(`http://localhost:5000/api/admin/approve/${id}`, { method: 'POST' });
        loadData();
    }
}

async function rejectRequest(id) {
    if(confirm('Reject this request and return pet to public listing?')) {
        await fetch(`http://localhost:5000/api/admin/reject/${id}`, { method: 'POST' });
        loadData();
    }
}

async function deletePet(id) {
    if(confirm('Are you sure you want to permanently delete this pet?')) {
        await fetch(`http://localhost:5000/api/admin/pets/${id}`, { method: 'DELETE' });
        loadData();
    }
}

document.getElementById('addPetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('petImage');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file to upload.');
        return;
    }

    try {
        // 1. Upload the image first
        const formData = new FormData();
        formData.append('petImage', file);

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) {
            alert('Image upload failed: ' + uploadData.message);
            return;
        }

        let imageUrl = uploadData.imageUrl;

        // 2. Submit the pet data
        const petData = {
            name: document.getElementById('petName').value,
            type: document.getElementById('petType').value,
            breed: document.getElementById('petBreed').value,
            age: document.getElementById('petAge').value,
            image_url: imageUrl,
            unique_feature: document.getElementById('petFeature').value,
            description: document.getElementById('petDesc').value
        };

        const res = await fetch('http://localhost:5000/api/admin/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(petData)
        });
        const data = await res.json();
        if(data.success) {
            alert('Pet added successfully!');
            e.target.reset();
            loadAllPets();
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Check console.');
    }
});
