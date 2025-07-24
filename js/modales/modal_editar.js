// Función para cargar y mostrar el modal flotante
async function cargarModalFlotante(codigoCarrera, nombreCarrera, activa) {
    try {
        // Eliminar modal existente si existe
        const modalExistente = document.getElementById('modalEditarCarrera');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Cargar el HTML del modal
        const response = await fetch('./elementos/modal_editar.html');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const modalHTML = await response.text();
        
        // Crear un contenedor temporal
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML;
        const modalElement = tempDiv.firstElementChild;
        
        // Mostrar el modal (quitar display: none)
        modalElement.style.display = 'flex';
        
        // Cargar CSS si no está cargado
        if (!document.getElementById('modal-css')) {
            const link = document.createElement('link');
            link.id = 'modal-css';
            link.rel = 'stylesheet';
            link.href = '../css/modales/modal_editar.css';
            document.head.appendChild(link);
        }
        
        // Insertar el modal en el body
        document.body.appendChild(modalElement);
        
        // Llenar los datos
        llenarDatosModal(codigoCarrera, nombreCarrera, activa);
        
        // Configurar eventos
        configurarEventosModal();
        
        console.log('Modal flotante cargado exitosamente');
        
    } catch (error) {
        console.error('Error al cargar el modal:', error);
        alert('Error al cargar el modal de edición');
    }
}

// Función para llenar los datos del modal
function llenarDatosModal(codigoCarrera, nombreCarrera, activa) {
    const inputCodigo = document.getElementById('modalCodigoCarrera');
    const inputNombre = document.getElementById('modalNombreCarrera');
    const selectActiva = document.getElementById('modalEstadoActiva');
    
    if (inputCodigo) inputCodigo.value = codigoCarrera;
    if (inputNombre) inputNombre.value = nombreCarrera;
    if (selectActiva) selectActiva.value = activa;
}

// Función para configurar eventos del modal
function configurarEventosModal() {
    const btnCerrar = document.getElementById('btnCerrarModal');
    const btnCancelar = document.getElementById('btnCancelarModal');
    const btnGuardar = document.getElementById('btnGuardarModal');
    const modalOverlay = document.getElementById('modalEditarCarrera');
    
    if (btnCerrar) btnCerrar.onclick = cerrarModal;
    if (btnCancelar) btnCancelar.onclick = cerrarModal;
    if (btnGuardar) btnGuardar.onclick = guardarCambios;
    
    // Cerrar al hacer clic en el overlay
    if (modalOverlay) {
        modalOverlay.onclick = function(e) {
            if (e.target === modalOverlay) {
                cerrarModal();
            }
        };
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', handleEscape);
        }
    });
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modalEditarCarrera');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Función para guardar cambios
async function guardarCambios() {
    const codigoCarrera = document.getElementById('modalCodigoCarrera').value;
    const nombreCarrera = document.getElementById('modalNombreCarrera').value;
    const nuevoEstado = document.getElementById('modalEstadoActiva').value;
    
    // Validar que tengamos el código de carrera
    if (!codigoCarrera) {
        alert('Error: No se encontró el código de carrera');
        return;
    }
    
    try {
        // Deshabilitar botón para evitar múltiples envíos
        const btnGuardar = document.getElementById('btnGuardarModal');
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Guardando...';
        
        // Hacer PUT request al endpoint
        const response = await fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/carrera/${codigoCarrera}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "activa": nuevoEstado
            })
        });
        
        if (response.ok) {
            // Si la respuesta es exitosa
            console.log('Carrera actualizada exitosamente');
            alert(`✅ Carrera actualizada exitosamente:\nCódigo: ${codigoCarrera}\nNombre: ${nombreCarrera}\nNuevo Estado: ${nuevoEstado}`);
            
            // Recargar la tabla en la página principal si la función existe
            if (typeof window.opener !== 'undefined' && window.opener && window.opener.cargarCarreras) {
                window.opener.cargarCarreras();
            } else if (typeof window.cargarCarreras === 'function') {
                window.cargarCarreras();
            }
            
            cerrarModal();
        } else {
            // Si hay error en la respuesta
            const errorData = await response.text();
            console.error('Error en la respuesta:', response.status, errorData);
            alert(`❌ Error al actualizar la carrera:\nCódigo de error: ${response.status}\nDetalles: ${errorData}`);
        }
        
    } catch (error) {
        // Si hay error en la conexión
        console.error('Error al conectar con el servidor:', error);
        alert(`❌ Error de conexión:\n${error.message}\n\nVerifica tu conexión a internet e intenta nuevamente.`);
    } finally {
        // Rehabilitar botón
        const btnGuardar = document.getElementById('btnGuardarModal');
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar Cambios';
        }
    }
}


// Funciones globales
window.editarCarrera = function(codigoCarrera, nombreCarrera, activa) {
    console.log('Abriendo modal flotante para:', codigoCarrera, nombreCarrera, activa);
    cargarModalFlotante(codigoCarrera, nombreCarrera, activa);
};

window.eliminarCarrera = function(codigoCarrera, nombreCarrera) {
    if (confirm(`¿Estás seguro de que deseas eliminar la carrera "${nombreCarrera}"?`)) {
        console.log('Eliminar carrera:', codigoCarrera);
        alert('Función de eliminar en desarrollo');
    }
};

console.log('modal_editar.js cargado correctamente');
