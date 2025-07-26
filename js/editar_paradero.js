document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btn-editar-paradero');
    const modal = document.getElementById('modal-editar-paradero');

    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            fetch('../pages/elementos/editar_paradero.html')
                .then(res => res.text())
                .then(html => {
                    modal.innerHTML = html;
                    modal.style.display = 'flex';

                    document.getElementById('cerrar-modal-editar').onclick = () => {
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
                            const selectRuta = document.getElementById('codigo_ruta_editar');
                            data.items.forEach(ruta => {
                                const option = document.createElement('option');
                                option.value = ruta.codigo_ruta;
                                option.textContent = `${ruta.nombre_ruta} (${ruta.codigo_ruta})`;
                                selectRuta.appendChild(option);
                            });
                        });

                    // Autocompletado de paraderos
                    let paraderos = [];
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/paradero/')
                        .then(res => res.json())
                        .then(data => {
                            paraderos = data.items;
                        });

                    const searchInput = modal.querySelector('#paradero_search');
                    const suggestions = modal.querySelector('#paradero_suggestions');

                    searchInput.addEventListener('input', function () {
                        const value = this.value.trim().toLowerCase();
                        suggestions.innerHTML = '';
                        if (value.length === 0) return;
                        const filtered = paraderos.filter(par =>
                            par.codigo_paradero.toLowerCase().includes(value) ||
                            (par.nombre_paradero && par.nombre_paradero.toLowerCase().includes(value))
                        );
                        filtered.slice(0, 8).forEach(par => {
                            const li = document.createElement('li');
                            li.textContent = `${par.codigo_paradero} - ${par.nombre_paradero}`;
                            li.dataset.codigo = par.codigo_paradero;
                            li.classList.add('autocomplete-item');
                            suggestions.appendChild(li);
                        });
                    });

                    suggestions.addEventListener('click', function (e) {
                        if (e.target && e.target.matches('li.autocomplete-item')) {
                            const codigo = e.target.dataset.codigo;
                            searchInput.value = e.target.textContent;
                            suggestions.innerHTML = '';
                            // Cargar datos del paradero seleccionado
                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/paradero/${codigo}`)
                                .then(res => res.json())
                                .then(data => {
                                    const par = data.items[0];
                                    const form = document.getElementById('form-editar-paradero');
                                    form.nombre_paradero.value = par.nombre_paradero || '';
                                    form.codigo_ruta.value = par.codigo_ruta || '';
                                    form.orden_paradero.value = par.orden_paradero ?? '';
                                    form.activo.value = par.activo || 'S';
                                    form.dataset.selectedCodigo = par.codigo_paradero;
                                });
                        }
                    });

                    // Guardar cambios (PUT)
                    modal.addEventListener('submit', function handler(ev) {
                        if (ev.target && ev.target.id === 'form-editar-paradero') {
                            ev.preventDefault();
                            const form = ev.target;
                            const codigoParadero = form.dataset.selectedCodigo;
                            if (!codigoParadero) {
                                alert('Seleccione un paradero válido.');
                                return;
                            }
                            const data = {
                                codigo_paradero: codigoParadero,
                                codigo_ruta: form.codigo_ruta.value,
                                nombre_paradero: form.nombre_paradero.value,
                                orden_paradero: Number(form.orden_paradero.value),
                                activo: form.activo.value
                            };

                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/paradero/${codigoParadero}`, {
                                method: 'PUT',
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
                                    alert('Paradero editado correctamente');
                                    modal.style.display = 'none';
                                    modal.innerHTML = '';
                                    window.location.reload();
                                })
                                .catch(error => {
                                    let msg = 'Error al editar paradero.';
                                    if (error && error.errorMessage) {
                                        msg += '\n' + error.errorMessage;
                                    } else if (error && error.message) {
                                        msg += '\n' + error.message;
                                    }
                                    alert(msg);
                                });
                        }
                    });
                });
        });
    }
});           