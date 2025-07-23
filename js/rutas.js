document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el nombre de usuario si existe en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    }

    // Parámetros de paginación
    let pagina = 1;
    const limite = 25;

    function cargarRutas() {
        const offset = (pagina - 1) * limite;
        fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/ruta/?limit=${limite}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                const rutas = data.items || [];
                const tbody = document.querySelector('#tablaRutas tbody');
                if (!tbody) return;
                tbody.innerHTML = '';

                rutas.forEach(ruta => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${ruta.codigo_ruta ?? ''}</td>
                        <td>${ruta.nombre_ruta ?? ''}</td>
                        <td>${ruta.activa ?? ''}</td>
                    `;
                    tbody.appendChild(fila);
                });

                // Actualizar número de página
                document.getElementById('paginaActual').textContent = pagina;
            })
            .catch(error => {
                alert('Error al obtener las rutas');
            });
    }

    // Botón anterior
    document.getElementById('btnAnterior').onclick = function() {
        if (pagina > 1) {
            pagina--;
            cargarRutas();
        }
    };

    // Botón siguiente
    document.getElementById('btnSiguiente').onclick = function() {
        pagina++;
        cargarRutas();
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

    // Cargar rutas al iniciar
    cargarRutas();
});