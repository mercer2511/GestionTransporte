document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el nombre de usuario si existe en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    }

    // Parámetros de paginación
    let pagina = 1;
    const limite = 10;

    function cargarRegistros() {
        const offset = (pagina - 1) * limite;
        fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/registro/?limit=${limite}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                const registros = data.items || [];
                const tbody = document.querySelector('#tablaRegistros tbody');
                if (!tbody) return;
                tbody.innerHTML = '';

                registros.forEach(registro => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${registro.id_registro ?? ''}</td>
                        <td>${registro.nombres ?? ''}</td>
                        <td>${registro.apellidos ?? ''}</td>
                        <td>${registro.codigo_universitario ?? ''}</td>
                        <td>${registro.codigo_carrera ?? ''}</td>
                        <td>${registro.codigo_ruta ?? ''}</td>
                        <td>${registro.codigo_paradero ?? ''}</td>
                        <td>${registro.dni_conductor ?? ''}</td>
                        <td>${registro.sentido_viaje ?? ''}</td>
                        <td>${registro.observaciones ?? ''}</td>
                        <td>${registro.placa ?? ''}</td>
                        <td>${registro.ruta_conductor ?? ''}</td>
                    `;
                    tbody.appendChild(fila);
                });

                // Actualizar número de página
                document.getElementById('paginaActual').textContent = pagina;
            })
            .catch(error => {
                alert('Error al obtener los registros');
            });
    }

    // Botón anterior
    document.getElementById('btnAnterior').onclick = function() {
        if (pagina > 1) {
            pagina--;
            cargarRegistros();
        }
    };

    // Botón siguiente
    document.getElementById('btnSiguiente').onclick = function() {
        pagina++;
        cargarRegistros();
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

    // Cargar registros al iniciar
    cargarRegistros();
});
