/* ==========================================================================
   REGISTRO.JS – Lógica de registro.html
   ========================================================================== */

/* FIX: getBadgeHtml y formatDateToLocal ya no se definen aquí;
   se usan las versiones únicas de shared.js. Eliminar duplicados
   evitaba que cambios en una página se reflejaran en la otra. */

document.addEventListener('DOMContentLoaded', () => {
    loadTableData();

    const dateInput = document.getElementById('recordDate');
    if (dateInput) setNow(dateInput);

    const form = document.getElementById('recordForm');
    if (form) form.addEventListener('submit', handleSubmit);

    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            form.reset();
            if (dateInput) setNow(dateInput);
        });
    }

    const searchInput = document.getElementById('searchInput');
    const filterType  = document.getElementById('filterType');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterType)  filterType.addEventListener('change', applyFilters);

    // FIX: el botón de exportar ya usa la función centralizada de shared.js
    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', exportToExcel);
});

// --------------------------------------------------------------------------
// Utilidad: establece fecha/hora actual en un input datetime-local
// --------------------------------------------------------------------------
function setNow(input) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    input.value = now.toISOString().slice(0, 16);
}

// --------------------------------------------------------------------------
// Guardar registro
// --------------------------------------------------------------------------
function handleSubmit(e) {
    e.preventDefault();

    const dateInput  = document.getElementById('recordDate');
    const serialEl   = document.getElementById('serial');
    const typeEl     = document.getElementById('equipmentType');
    const techEl     = document.getElementById('technician');
    const obsEl      = document.getElementById('observations');

    const dateVal   = dateInput?.value  || '';
    const serialVal = (serialEl?.value  || '').trim().toUpperCase();
    const typeVal   = typeEl?.value     || '';
    const techVal   = (techEl?.value    || '').trim();
    const obsVal    = (obsEl?.value     || '').trim();

    if (!dateVal || !serialVal || !typeVal || !techVal) {
        showToast('Por favor, complete todos los campos obligatorios.', 'error');
        return;
    }

    const newRecord = {
        id:           Date.now().toString(),
        date:         dateVal.replace('T', ' '),
        serial:       serialVal,
        type:         typeVal,
        technician:   techVal,
        observations: obsVal
    };

    const records = getRecords();
    records.unshift(newRecord);
    saveRecords(records);

    showToast('Registro guardado exitosamente.', 'success');
    document.getElementById('recordForm').reset();
    if (dateInput) setNow(dateInput);
    loadTableData();
}

// --------------------------------------------------------------------------
// Renderizar tabla
// --------------------------------------------------------------------------
function loadTableData(recordsToRender = null) {
    const tbody      = document.querySelector('#recordsTable tbody');
    const emptyState = document.getElementById('emptyState');
    const table      = document.getElementById('recordsTable');
    const countEl    = document.getElementById('recordsCount');

    if (!tbody || !emptyState || !table) return;

    const records = recordsToRender !== null ? recordsToRender : getRecords();

    // Actualizar contador de registros mostrados
    if (countEl) {
        countEl.textContent = `${records.length} registro${records.length !== 1 ? 's' : ''}`;
    }

    tbody.innerHTML = '';

    if (records.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';

    // Obtener el SVG del ícono de basura directamente (evita llamar replaceIcons en cada render)
    const trashSvg = (typeof Icons !== 'undefined' && Icons.trash) ? Icons.trash : '🗑️';

    records.forEach((record, i) => {
        const tr = document.createElement('tr');
        tr.style.animation = `fadeIn .25s ease ${Math.min(i, 10) * 0.03}s both`;
        tr.innerHTML = `
            <td class="td-date">${formatDateToLocal(record.date)}</td>
            <td class="td-serial">${record.serial || ''}</td>
            <td>${getBadgeHtml(record.type)}</td>
            <td>${record.technician || ''}</td>
            <td class="td-obs">${record.observations ||
                '<em style="color:#cbd5e1;">Sin observaciones</em>'}</td>
            <td class="text-center">
                <button type="button" class="btn-icon del"
                        onclick="deleteRecordHandler('${record.id}')"
                        title="Eliminar registro">
                    <span class="svg-icon">${trashSvg}</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --------------------------------------------------------------------------
// Eliminar registro
// FIX 1: antes usaba window.confirm(), ahora usa el modal institucional.
// FIX 2: deleteRecord() se llama con el id (string), no con un índice.
//         La versión anterior de shared.js usaba splice(index) lo que
//         borraba el elemento incorrecto.
// --------------------------------------------------------------------------
window.deleteRecordHandler = function(id) {
    showModal({
        title:       'Eliminar Registro',
        message:     '¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.',
        confirmText: 'Sí, eliminar',
        cancelText:  'Cancelar',
        iconType:    'danger',
        onConfirm:   () => {
            deleteRecord(id); // deleteRecord ahora busca por id correctamente
            applyFilters();   // re-aplica filtros activos en lugar de recargar todo
            showToast('Registro eliminado.', 'info');
        }
    });
};

// --------------------------------------------------------------------------
// Filtros
// --------------------------------------------------------------------------
function applyFilters() {
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const filterType = document.getElementById('filterType')?.value || 'ALL';

    const records  = getRecords();
    const filtered = records.filter(r => {
        const matchesSearch =
            (r.serial        || '').toLowerCase().includes(searchTerm) ||
            (r.technician    || '').toLowerCase().includes(searchTerm) ||
            (r.observations  || '').toLowerCase().includes(searchTerm);
        const matchesType = filterType === 'ALL' || r.type === filterType;
        return matchesSearch && matchesType;
    });

    loadTableData(filtered);
}
