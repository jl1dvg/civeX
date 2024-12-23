document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/usuarios/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.access;

            // Guarda el token y redirige a la página principal
            localStorage.setItem('jwt_token', token);
            window.location.href = '/main/';
        } else {
            // Muestra el mensaje de error
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error').style.display = 'block';
    }
});