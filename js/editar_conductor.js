document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btn-editar-conductor');
    const modal = document.getElementById('modal-editar-conductor');

    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            fetch('../pages/elementos/editar_conductor.html')
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

                    // Autocompletado de conductores
                    let conductores = [];
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/conductores/?limit=1000')
                        .then(res => res.json())
                        .then(data => {
                            conductores = data.items;
                        });

                    const searchInput = modal.querySelector('#conductor_search');
                    const suggestions = modal.querySelector('#conductor_suggestions');

                    searchInput.addEventListener('input', function () {
                        const value = this.value.trim().toLowerCase();
                        suggestions.innerHTML = '';
                        if (value.length === 0) return;
                        const filtered = conductores.filter(con =>
                            con.dni && con.dni.toLowerCase().includes(value) ||
                            (con.nombres && con.nombres.toLowerCase().includes(value)) ||
                            (con.apellidos && con.apellidos.toLowerCase().includes(value))
                        );
                        filtered.slice(0, 8).forEach(con => {
                            const li = document.createElement('li');
                            li.textContent = `${con.dni} - ${con.nombres} ${con.apellidos}`;
                            li.dataset.dni = con.dni;
                            li.classList.add('autocomplete-item');
                            suggestions.appendChild(li);
                        });
                    });

                    suggestions.addEventListener('click', function (e) {
                        if (e.target && e.target.matches('li.autocomplete-item')) {
                            const dni = e.target.dataset.dni;
                            searchInput.value = e.target.textContent; // Visualmente muestra "DNI - Nombre Apellido"
                            suggestions.innerHTML = '';
                            // Guardar el DNI real en un campo oculto o en el form
                            const form = document.getElementById('form-editar-conductor');
                            form.dataset.selectedDni = dni;
                            // Cargar datos del conductor seleccionado
                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/conductores/${dni}`)
                                .then(res => res.json())
                                .then(data => {
                                    const con = data.items[0];
                                    form.nombres.value = con.nombres || '';
                                    form.apellidos.value = con.apellidos || '';
                                    form.fecha_registro.value = con.fecha_registro ? con.fecha_registro.substring(0, 10) : '';
                                    form.activo.value = con.activo || 'S';
                                });
                        }
                    });

                    // Guardar cambios (PUT)
                    modal.addEventListener('submit', function handler(ev) {
                        if (ev.target && ev.target.id === 'form-editar-conductor') {
                            ev.preventDefault();
                            const form = ev.target;
                            const dni = form.dataset.selectedDni;
                            if (!dni) {
                                alert('Seleccione un conductor válido.');
                                return;
                            }
                            const data = {
                                nombres: form.nombres.value,
                                apellidos: form.apellidos.value,
                                fecha_registro: form.fecha_registro.value || null,
                                activo: form.activo.value
                            };

                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_transporte/tablas/conductores/${dni}`, {
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
                                    alert('Conductor editado correctamente');
                                    modal.style.display = 'none';
                                    modal.innerHTML = '';
                                    window.location.reload();
                                })
                                .catch(error => {
                                    let msg = 'Error al editar conductor.';
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