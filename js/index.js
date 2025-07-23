document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const usuario = document.getElementById('username').value.trim();
    const contrasena = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (usuario === 'TRANSPORTE_UNDC' && contrasena === '12345') {
        // Guardar el nombre de usuario para mostrarlo en la siguiente página (opcional)
        localStorage.setItem('nombreUsuario', usuario);
        window.location.href = 'pages/inicio.html';
    } else {
        errorDiv.textContent = 'Credenciales incorrectas. Intenta nuevamente.';
    }
});