document.addEventListener('DOMContentLoaded', function () {
    // Mostrar el nombre de usuario si existe en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    }

    // Parámetros de paginación
    let pagina = 1;
    const limite = 25;

    function cargarCarreras() {
        const offset = (pagina - 1) * limite;
        fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/carrera/?limit=${limite}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                const carreras = data.items || [];
                const tbody = document.querySelector('#tablaCarreras tbody');
                if (!tbody) return;
                tbody.innerHTML = '';

                carreras.forEach(carrera => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${carrera.codigo_carrera ?? ''}</td>
                        <td>${carrera.nombre_carrera ?? ''}</td>
                        <td>${carrera.activa ?? ''}</td>
                        <td>
                            <button class="btn-editar" onclick="editarCarrera('${carrera.codigo_carrera}', '${carrera.nombre_carrera}', '${carrera.activa}')" title="Editar carrera">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                            </button>
                        </td>
                        <td>
                            <button class="btn-eliminar" onclick="eliminarCarrera('${carrera.codigo_carrera}', '${carrera.nombre_carrera}')" title="Eliminar carrera">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                        </td>

                    `;
                    tbody.appendChild(fila);
                });

                // Actualizar número de página
                document.getElementById('paginaActual').textContent = pagina;

                // Deshabilitar botón siguiente si no hay más datos
                const btnSiguiente = document.getElementById('btnSiguiente');
                if (data.hasMore === false) {
                    btnSiguiente.disabled = true;
                } else {
                    btnSiguiente.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener las carreras');
            });

    }

    // Evento para el botón "Agregar Carrera"
    document.getElementById('btnAgregarCarrera').addEventListener('click', function () {
        console.log('Botón Agregar Carrera clickeado'); // Para debug  
        abrirModalAgregarCarrera();
    });

    // Botón anterior
    document.getElementById('btnAnterior').onclick = function () {
        if (pagina > 1) {
            pagina--;
            cargarCarreras();
        }
    };

    // Botón siguiente
    document.getElementById('btnSiguiente').onclick = function () {
        pagina++;
        cargarCarreras();
    };

    // Botón inicio
    document.getElementById('btnInicio').onclick = function () {
        window.location.href = "inicio.html";
    };

    // Cerrar sesión
    document.getElementById('cerrarSesion').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('nombreUsuario');
        window.location.href = '../index.html';
    });

    // Cargar carreras al iniciar
    cargarCarreras();

    // Hacer la función cargarCarreras global para que el modal pueda acceder a ella
    window.cargarCarreras = cargarCarreras;

    // FUNCIÓN PARA ELIMINAR CARRERA
    window.eliminarCarrera = async function(codigoCarrera, nombreCarrera) {
        // Confirmar eliminación
        if (!confirm(`⚠️ ¿Estás seguro de que deseas eliminar la carrera?\n\nCódigo: ${codigoCarrera}\nNombre: ${nombreCarrera}\n\n⚠️ Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            console.log('Eliminando carrera:', codigoCarrera);

            // Hacer DELETE request al endpoint
            const response = await fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/carrera/${codigoCarrera}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Éxito
                console.log('Carrera eliminada exitosamente');
                alert(`✅ Carrera eliminada exitosamente:\nCódigo: ${codigoCarrera}\nNombre: ${nombreCarrera}`);
                
                // Recargar la tabla
                cargarCarreras();
                
            } else {
                // Error en la respuesta
                const errorData = await response.text();
                console.error('Error en la respuesta:', response.status, errorData);
                
                let mensajeError = `Error ${response.status}`;
                if (errorData) {
                    try {
                        const errorJson = JSON.parse(errorData);
                        if (errorJson.message) {
                            mensajeError = errorJson.message;
                        }
                    } catch (e) {
                        mensajeError = errorData;
                    }
                }
                
                // Verificar si es un error de restricción (carrera en uso)
                if (response.status === 409 || mensajeError.includes('constraint') || mensajeError.includes('foreign key')) {
                    alert(`❌ No se puede eliminar la carrera "${nombreCarrera}".\n\nMotivo: La carrera está siendo utilizada en otros registros del sistema.\n\nPara eliminarla, primero debes eliminar todos los registros relacionados.`);
                } else {
                    alert(`❌ Error al eliminar la carrera:\n${mensajeError}`);
                }
            }

        } catch (error) {
            // Error de conexión
            console.error('Error al conectar con el servidor:', error);
            alert(`❌ Error de conexión:\n${error.message}\n\nVerifica tu conexión a internet e intenta nuevamente.`);
        }
    };
});