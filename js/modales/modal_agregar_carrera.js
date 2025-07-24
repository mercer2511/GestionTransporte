// Función para cargar y mostrar el modal flotante de agregar
async function cargarModalAgregarFlotante() {
    try {
        // Eliminar modal existente si existe
        const modalExistente = document.getElementById('modalAgregarCarrera');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Cargar el HTML del modal
        const response = await fetch('./elementos/modal_agregar_carrera.html');
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
        if (!document.getElementById('modal-agregar-css')) {
            const link = document.createElement('link');
            link.id = 'modal-agregar-css';
            link.rel = 'stylesheet';
            link.href = '../css/modales/modal_agregar_carrera.css';
            document.head.appendChild(link);
        }
        
        // Insertar el modal en el body
        document.body.appendChild(modalElement);

        // ASEGURAR QUE EL CAMPO ACTIVA ESTÉ EN "S" POR DEFECTO
        const selectActiva = document.getElementById('modalEstadoActivaAgregar');
        if (selectActiva) {
            selectActiva.value = 'S';
        }
        
        // Configurar eventos
        configurarEventosModalAgregar();
        
        // Enfocar el primer campo
        setTimeout(() => {
            document.getElementById('modalCodigoCarreraAgregar').focus();
        }, 100);
        
        console.log('Modal agregar carrera cargado exitosamente');
        
    } catch (error) {
        console.error('Error al cargar el modal:', error);
        alert('Error al cargar el modal de agregar carrera');
    }
}

// Función para configurar eventos del modal
function configurarEventosModalAgregar() {
    const btnCerrar = document.getElementById('btnCerrarModalAgregar');
    const btnCancelar = document.getElementById('btnCancelarModalAgregar');
    const btnGuardar = document.getElementById('btnGuardarModalAgregar');
    const modalOverlay = document.getElementById('modalAgregarCarrera');
    
    if (btnCerrar) btnCerrar.onclick = cerrarModalAgregar;
    if (btnCancelar) btnCancelar.onclick = cerrarModalAgregar;
    if (btnGuardar) btnGuardar.onclick = crearCarrera;
    
    // Cerrar al hacer clic en el overlay
    if (modalOverlay) {
        modalOverlay.onclick = function(e) {
            if (e.target === modalOverlay) {
                cerrarModalAgregar();
            }
        };
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModalAgregar();
            document.removeEventListener('keydown', handleEscape);
        }
    });
    
    // Validación en tiempo real
    const codigoInput = document.getElementById('modalCodigoCarreraAgregar');
    const nombreInput = document.getElementById('modalNombreCarreraAgregar');
    
    if (codigoInput) {
        codigoInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }
    
    if (nombreInput) {
        nombreInput.addEventListener('input', function() {
            this.value = this.value.replace(/^\s+/, ''); // No espacios al inicio
        });
    }
}

// Función para cerrar el modal
function cerrarModalAgregar() {
    const modal = document.getElementById('modalAgregarCarrera');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Función para validar los campos
function validarCamposAgregar() {
    const codigo = document.getElementById('modalCodigoCarreraAgregar').value.trim();
    const nombre = document.getElementById('modalNombreCarreraAgregar').value.trim();
    
    const errores = [];
    
    if (!codigo) {
        errores.push('El código de carrera es obligatorio');
    } else if (codigo.length < 2) {
        errores.push('El código debe tener al menos 2 caracteres');
    }
    
    if (!nombre) {
        errores.push('El nombre de carrera es obligatorio');
    } else if (nombre.length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    }
    
    return error|es;
}

// Función para crear nueva carrera
async function crearCarrera() {
    const errores = validarCamposAgregar();
    
    if (errores.length > 0) {
        alert('❌ Por favor corrige los siguientes errores:\n\n' + errores.join('\n'));
        return;
    }
    
    const codigoCarrera = document.getElementById('modalCodigoCarreraAgregar').value.trim();
    const nombreCarrera = document.getElementById('modalNombreCarreraAgregar').value.trim();
    const estadoActiva = document.getElementById('modalEstadoActivaAgregar').value;
    
    const btnGuardar = document.getElementById('btnGuardarModalAgregar');
    const textoOriginal = btnGuardar.textContent;
    
    try {
        // Estado de carga
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Creando...';
        btnGuardar.classList.add('loading');
        
        // Hacer POST request al endpoint
        const response = await fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/carrera/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "CODIGO_CARRERA": codigoCarrera,
                "NOMBRE_CARRERA": nombreCarrera,
                "ACTIVA": estadoActiva
            })
        });
        
        if (response.ok) {
            // Éxito
            btnGuardar.textContent = 'Creada';
            btnGuardar.style.backgroundColor = '#10b981';
            
            console.log('Carrera creada exitosamente');
            
            alert(`✅ Carrera creada exitosamente:\nCódigo: ${codigoCarrera}\nNombre: ${nombreCarrera}\nEstado: ${estadoActiva}`);
            
            // Recargar tabla en la página principal
            if (typeof window.cargarCarreras === 'function') {
                window.cargarCarreras();
            }
            
            // Cerrar modal después de un breve delay
            setTimeout(() => {
                cerrarModalAgregar();
            }, 1000);
            
        } else {
            const errorData = await response.text();
            let errorMessage = `Error ${response.status}`;
            
            // Intentar extraer mensaje de error más específico
            try {
                const errorJson = JSON.parse(errorData);
                if (errorJson.message) {
                    errorMessage = errorJson.message;
                }
            } catch (e) {
                // Si no es JSON válido, usar el texto completo
                errorMessage = errorData || errorMessage;
            }
            
            throw new Error(errorMessage);
        }
        
    } catch (error) {
        // Error
        btnGuardar.textContent = '❌ Error';
        btnGuardar.style.backgroundColor = '#ef4444';
        
        console.error('Error al crear carrera:', error);
        
        let mensajeError = error.message;
        if (mensajeError.includes('unique constraint')) {
            mensajeError = 'Ya existe una carrera con este código';
        }
        
        alert(` Error al crear la carrera:\n${mensajeError}`);
        
        // Restaurar botón después de 2 segundos
        setTimeout(() => {
            btnGuardar.disabled = false;
            btnGuardar.textContent = textoOriginal;
            btnGuardar.style.backgroundColor = '';
            btnGuardar.classList.remove('loading');
        }, 2000);
    }
}

// Función global para abrir el modal de agregar
window.abrirModalAgregarCarrera = function() {
    console.log('Abriendo modal para agregar carrera');
    cargarModalAgregarFlotante();
};

console.log('modal_agregar_carrera.js cargado correctamente');