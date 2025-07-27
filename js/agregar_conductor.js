document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar-conductor');
    const modal = document.getElementById('modal-agregar-conductor');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            fetch('../pages/elementos/agregar_conductor.html')
                .then(res => res.text())
                .then(html => {
                    modal.innerHTML = html;
                    modal.style.display = 'flex';

                    // Cerrar modal
                    document.getElementById('cerrar-modal-agregar').onclick = () => {
                        modal.style.display = 'none';
                        modal.innerHTML = '';
                    };
                    modal.onclick = (ev) => {
                        if (ev.target === modal) {
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                        }
                    };

                    // Guardar nuevo conductor (POST)
                    document.getElementById('form-agregar-conductor').onsubmit = function(ev) {
                        ev.preventDefault();
                        const form = ev.target;
                        const data = {
                            dni: form.dni.value,
                            nombres: form.nombres.value,
                            apellidos: form.apellidos.value,
                            fecha_registro: form.fecha_registro.value || null,
                            activo: form.activo.value
                        };

                        fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/conductores/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => { throw err; });
                            }
                            return response.text();
                        })
                        .then(() => {
                            alert('Conductor agregado correctamente');
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                            window.location.reload();
                        })
                        .catch(error => {
                            let msg = 'Error al agregar conductor.';
                            if (error && error.errorMessage) {
                                msg += '\n' + error.errorMessage;
                            } else if (error && error.message) {
                                msg += '\n' + error.message;
                            }
                            alert(msg);
                         });
                    };
                });
        });
    }
});