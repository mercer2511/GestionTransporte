document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el nombre de usuario si existe en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    }

    // Parámetros de paginación
    let pagina = 1;
    const limite = 25;

    function cargarConductores() {
        const offset = (pagina - 1) * limite;
        fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/conductores/?limit=${limite}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                const conductores = data.items || [];
                const tbody = document.querySelector('#tablaConductores tbody');
                if (!tbody) return;
                tbody.innerHTML = '';

                conductores.forEach(conductor => {
                    const fecha = conductor.fecha_registro
                        ? new Date(conductor.fecha_registro).toLocaleDateString('es-PE')
                        : '';
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${conductor.dni ?? ''}</td>
                        <td>${conductor.nombres ?? ''}</td>
                        <td>${conductor.apellidos ?? ''}</td>
                        <td>${fecha}</td>
                        <td>${conductor.activo ?? ''}</td>
                    `;
                    tbody.appendChild(fila);
                });

                // Actualizar número de página
                document.getElementById('paginaActual').textContent = pagina;
            })
            .catch(error => {
                alert('Error al obtener los conductores');
            });
    }

    // Botón anterior
    document.getElementById('btnAnterior').onclick = function() {
        if (pagina > 1) {
            pagina--;
            cargarConductores();
        }
    };

    // Botón siguiente
    document.getElementById('btnSiguiente').onclick = function() {
        pagina++;
        cargarConductores();
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

    // Cargar conductores al iniciar
    cargarConductores();
});