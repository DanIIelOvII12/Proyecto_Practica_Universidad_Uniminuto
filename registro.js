/* ==========================================================================
   REGISTRO.JS – Lógica del formulario y tabla de registros
   ========================================================================== */

// DOM References
const form          = document.getElementById('maintenanceForm');
const serialInput   = document.getElementById('serialNumber');
const typeSelect    = document.getElementById('equipmentType');
const techInput     = document.getElementById('technician');
const obsInput      = document.getElementById('observations');
const tableBody     = document.getElementById('tableBody');
const exportBtn     = document.getElementById('exportBtn');
const clearAllBtn   = document.getElementById('clearAllBtn');
const printBtn      = document.getElementById('printBtn');
const searchInput   = document.getElementById('searchInput');
const filterType    = document.getElementById('filterType');
const countBadge    = document.getElementById('recordsCountBadge');
const filteredCount = document.getElementById('filteredCount');

// --------------------------------------------------------------------------
// INICIALIZACIÓN
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderTable();

    form.addEventListener('submit', handleSubmit);
    exportBtn.addEventListener('click', exportToExcel);
    clearAllBtn.addEventListener('click', handleClearAll);
    printBtn.addEventListener('click', () => window.print());
    searchInput.addEventListener('input', renderTable);
    filterType.addEventListener('change', renderTable);

    // Si viene con hash #exportar, scroll suave
    if (window.location.hash === '#exportar') {
        setTimeout(() => {
            document.getElementById('exportar')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// --------------------------------------------------------------------------
// ENVÍO DEL FORMULARIO
// --------------------------------------------------------------------------
function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const newRecord = {
        date:        formatDate(),
        serial:      serialInput.value.trim().toUpperCase(),
        type:        typeSelect.value,
        technician:  techInput.value.trim() || '',
        observations:obsInput.value.trim()
    };

    addRecord(newRecord);
    form.reset();
    clearErrors();
    renderTable();
    showToast(`Registro "${newRecord.serial}" guardado correctamente.`, 'success');

    // Scroll a la tabla en mobile
    if (window.innerWidth < 768) {
        document.getElementById('exportar')?.scrollIntoView({ behavior: 'smooth' });
    }
}

// --------------------------------------------------------------------------
// VALIDACIÓN
// --------------------------------------------------------------------------
function validateForm() {
    let valid = true;

    clearErrors();

    if (!serialInput.value.trim()) {
        showError('serialNumber', 'err-serial');
        valid = false;
    }

    if (!typeSelect.value) {
        showError('equipmentType', 'err-type');
        valid = false;
    }

    return valid;
}

function showError(fieldId, errId) {
    document.getElementById(fieldId).classList.add('is-error');
    const errEl = document.getElementById(errId);
    if (errEl) errEl.classList.add('show');
}

function clearErrors() {
    document.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
}

// --------------------------------------------------------------------------
// RENDERIZADO DE TABLA CON FILTROS
// --------------------------------------------------------------------------
function renderTable() {
    const records = getRecords();
    const search  = searchInput.value.toLowerCase().trim();
    const type    = filterType.value;

    const filtered = records.filter(r => {
        const matchSearch = !search ||
            r.serial.toLowerCase().includes(search) ||
            (r.observations && r.observations.toLowerCase().includes(search)) ||
            (r.technician && r.technician.toLowerCase().includes(search));
        const matchType = !type || r.type === type;
        return matchSearch && matchType;
    });

    // Actualizar contadores
    countBadge.textContent = records.length;
    filteredCount.textContent = (search || type)
        ? `${filtered.length} de ${records.length} registros`
        : `${records.length} registros`;

    // Habilitar/deshabilitar botón de exportar
    exportBtn.disabled = records.length === 0;

    // Vacío
    if (records.length === 0) {
        tableBody.innerHTML = `
            <tr><td colspan="6">
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>No hay registros aún. <br>Complete el formulario para agregar el primero.</p>
                </div>
            </td></tr>`;
        return;
    }

    // Sin resultados del filtro
    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr><td colspan="6">
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <p>No se encontraron registros con ese criterio de búsqueda.</p>
                </div>
            </td></tr>`;
        return;
    }

    // Índices en el array original para la función de eliminación
    tableBody.innerHTML = filtered.map(record => {
        // Encontrar índice real en records
        const realIdx = records.indexOf(record);
        return `
            <tr class="fade-in">
                <td class="td-date">${record.date}</td>
                <td class="td-serial">${escapeHtml(record.serial)}</td>
                <td>${getBadgeHtml(record.type)}</td>
                <td style="color:var(--text-secondary);font-size:.88rem;">${escapeHtml(record.technician || '—')}</td>
                <td class="td-obs" title="${escapeHtml(record.observations || '')}">${escapeHtml(record.observations || '—')}</td>
                <td style="text-align:center;">
                    <button class="btn-icon del" onclick="handleDelete(${realIdx})" title="Eliminar registro">🗑️</button>
                </td>
            </tr>`;
    }).join('');
}

// --------------------------------------------------------------------------
// ELIMINAR REGISTRO
// --------------------------------------------------------------------------
window.handleDelete = function(index) {
    const records = getRecords();
    const record  = records[index];
    if (!record) return;

    showModal({
        title:       'Eliminar registro',
        message:     `¿Deseas eliminar el registro del equipo <strong>${record.serial}</strong>? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText:  'Cancelar',
        iconType:    'danger',
        onConfirm:   () => {
            deleteRecord(index);
            renderTable();
            showToast(`Registro "${record.serial}" eliminado.`, 'error');
        }
    });
};

// --------------------------------------------------------------------------
// LIMPIAR HISTORIAL
// --------------------------------------------------------------------------
function handleClearAll() {
    const records = getRecords();
    if (records.length === 0) {
        showToast('No hay registros que eliminar.', 'info');
        return;
    }

    showModal({
        title:       'Limpiar historial completo',
        message:     `Se eliminarán <strong>todos los ${records.length} registros</strong> de forma permanente. ¿Desea continuar?`,
        confirmText: 'Sí, limpiar todo',
        cancelText:  'Cancelar',
        iconType:    'danger',
        onConfirm:   () => {
            clearAllRecords();
            renderTable();
            showToast('Historial limpiado correctamente.', 'info');
        }
    });
}

// --------------------------------------------------------------------------
// EXPORTAR A EXCEL
// --------------------------------------------------------------------------
function exportToExcel() {
    const records = getRecords();
    if (records.length === 0) {
        showToast('No hay registros para exportar.', 'info');
        return;
    }

    const data = records.map(r => ({
        'FECHA Y HORA':      r.date,
        'SERIAL / ID':       r.serial,
        'TIPO / ÁREA':       r.type,
        'TÉCNICO':           r.technician || 'N/A',
        'OBSERVACIONES':     r.observations || 'N/A',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 22 }, { wch: 26 }, { wch: 20 }, { wch: 24 }, { wch: 55 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Mantenimientos Lab');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Reporte_Mantenimiento_${stamp}.xlsx`);
    showToast('¡Reporte Excel descargado correctamente!', 'success');
}

// --------------------------------------------------------------------------
// UTILIDAD
// --------------------------------------------------------------------------
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
