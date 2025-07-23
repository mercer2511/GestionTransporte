document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el nombre de usuario si existe en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    }

    // Parámetros de paginación
    let pagina = 1;
    const limite = 25;

    function cargarParaderos() {
        const offset = (pagina - 1) * limite;
        fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/paradero/?limit=${limite}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                const paraderos = data.items || [];
                const tbody = document.querySelector('#tablaParaderos tbody');
                if (!tbody) return;
                tbody.innerHTML = '';

                paraderos.forEach(paradero => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${paradero.codigo_paradero ?? ''}</td>
                        <td>${paradero.codigo_ruta ?? ''}</td>
                        <td>${paradero.nombre_paradero ?? ''}</td>
                        <td>${paradero.orden_paradero ?? ''}</td>
                        <td>${paradero.activo ?? ''}</td>
                    `;
                    tbody.appendChild(fila);
                });

                // Actualizar número de página
                document.getElementById('paginaActual').textContent = pagina;
            })
            .catch(error => {
                alert('Error al obtener los paraderos');
            });
    }

    // Botón anterior
    document.getElementById('btnAnterior').onclick = function() {
        if (pagina > 1) {
            pagina--;
            cargarParaderos();
        }
    };

    // Botón siguiente
    document.getElementById('btnSiguiente').onclick = function() {
        pagina++;
        cargarParaderos();
    };

    // Botón inicio
    document.getElementById('btnInicio').onclick = function() {
        window.location.href = "inicio.html";
    };

    // Cerrar sesión
    document.getElementById('cerrarSesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('nombreUsuario');
        window.location.href = '../index.html';
    });

    // Cargar paraderos al iniciar
    cargarParaderos();
});