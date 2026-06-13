document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(result.message || 'Signup failed');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred during signup');
    }
});
