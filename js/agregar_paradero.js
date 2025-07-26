document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar-paradero');
    const modal = document.getElementById('modal-agregar-paradero');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            fetch('../pages/elementos/agregar_paradero.html')
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

                    // Llenar select de rutas
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/ruta/')
                        .then(res => res.json())
                        .then(data => {
                            const selectRuta = document.getElementById('codigo_ruta');
                            data.items.forEach(ruta => {
                                const option = document.createElement('option');
                                option.value = ruta.codigo_ruta;
                                option.textContent = `${ruta.nombre_ruta} (${ruta.codigo_ruta})`;
                                selectRuta.appendChild(option);
                            });
                        });

                    // Guardar nuevo paradero (POST)
                    document.getElementById('form-agregar-paradero').onsubmit = function(ev) {
                        ev.preventDefault();
                        const form = ev.target;
                        const data = {
                            codigo_paradero: form.codigo_paradero.value,
                            codigo_ruta: form.codigo_ruta.value,
                            nombre_paradero: form.nombre_paradero.value,
                            orden_paradero: Number(form.orden_paradero.value),
                            activo: form.activo.value
                        };

                        fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/paradero/', {
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
                            alert('Paradero agregado correctamente');
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                            window.location.reload();
                        })
                        .catch(error => {
                            let msg = 'Error al agregar paradero.';
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