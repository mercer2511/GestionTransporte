document.getElementById('cerrarSesion').addEventListener('click', function(e) {
    e.preventDefault();
    // Opcional: limpiar datos de usuario guardados
    localStorage.removeItem('nombreUsuario');
    window.location.href = '../index.html';
});

// Mostrar el nombre de usuario si existe en localStorage
const nombreUsuario = localStorage.getItem('nombreUsuario');
if (nombreUsuario) {
    document.getElementById('nombreUsuario').textContent = nombreUsuario;
}