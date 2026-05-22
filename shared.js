/* ==========================================================================
   SHARED.JS – Utilidades compartidas entre todas las páginas
   ========================================================================== */

const STORAGE_KEY = 'uniminuto_records';

// --------------------------------------------------------------------------
// ALMACENAMIENTO
// --------------------------------------------------------------------------
function getRecords() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
}

function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function addRecord(record) {
    const list = getRecords();
    list.unshift(record);
    saveRecords(list);
    return list;
}

/* FIX: la versión original usaba índice de array (list.splice(index, 1))
   pero registro.js la llamaba con el ID del registro — esto causaba que
   se borrara el elemento incorrecto. Ahora busca por id. */
function deleteRecord(id) {
    const list = getRecords();
    const idx  = list.findIndex(r => r.id === id);
    if (idx !== -1) list.splice(idx, 1);
    saveRecords(list);
    return list;
}

function clearAllRecords() {
    localStorage.removeItem(STORAGE_KEY);
}

// --------------------------------------------------------------------------
// HELPERS (centralizados – ya no se definen en cada página)
// --------------------------------------------------------------------------
function formatDate(date = new Date()) {
    return date.toLocaleString('es-CO', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

/* FIX: antes estaba duplicada en dashboard.js y registro.js con
   implementaciones ligeramente distintas. Versión única aquí. */
function formatDateToLocal(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('es-CO', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function todayString() {
    return new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
}

/* Devuelve la fecha de hoy en formato ISO (YYYY-MM-DD) para comparar
   con las fechas almacenadas en localStorage ("2026-05-20 14:30"). */
function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

/* FIX: getBadgeHtml estaba definida 3 veces (shared.js, dashboard.js,
   registro.js) con mapeos distintos e incompletos.  Esta es la versión
   única y cubre todas las categorías del formulario. */
function getBadgeHtml(type) {
    const map = {
        'Portátil':            ['badge-portatil',            '💻'],
        'Niñera':              ['badge-ninera',               '🛒'],
        'Audiovisuales':       ['badge-audiovisuales',        '📽️'],
        'Educación ambiental': ['badge-educacion-ambiental',  '🌿'],
        'Educación física':    ['badge-educacion-fisica',     '⚽'],
        'Eventos':             ['badge-eventos',              '🎪'],
    };
    const cleanType = (type || '').trim();
    const [cls, icon] = map[cleanType] || ['badge-default', '📦'];
    return `<span class="badge ${cls}">${icon} ${cleanType}</span>`;
}

// --------------------------------------------------------------------------
// EXPORT EXCEL (disponible en todas las páginas, incluyendo el dashboard)
// --------------------------------------------------------------------------
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        showToast('La librería de Excel no está cargada aún. Intente de nuevo.', 'error');
        return;
    }
    const records = getRecords();
    if (records.length === 0) {
        showToast('No hay registros para exportar.', 'info');
        return;
    }

    const data = records.map(r => ({
        'FECHA Y HORA':  r.date         || '',
        'SERIAL / ID':   r.serial       || '',
        'CATEGORÍA':     r.type         || '',
        'RESPONSABLE':   r.technician   || 'N/A',
        'OBSERVACIONES': r.observations || 'N/A',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 22 }, { wch: 26 }, { wch: 25 }, { wch: 28 }, { wch: 55 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Mantenimientos Lab');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Reporte_Mantenimiento_${stamp}.xlsx`);
    showToast('¡Reporte Excel descargado correctamente!', 'success');
}

// --------------------------------------------------------------------------
// TOAST
// --------------------------------------------------------------------------
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
    document.body.appendChild(t);

    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('visible')));

    setTimeout(() => {
        t.classList.remove('visible');
        setTimeout(() => t.remove(), 400);
    }, 3500);
}

// --------------------------------------------------------------------------
// MODAL
// --------------------------------------------------------------------------
function showModal({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar',
                     onConfirm, iconType = 'danger' }) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true">
            <div class="modal-header">
                <div class="modal-header-icon ${iconType}">
                    ${iconType === 'danger' ? '🗑️' : '⚠️'}
                </div>
                <h3 class="modal-title">${title}</h3>
            </div>
            <div class="modal-body"><p>${message}</p></div>
            <div class="modal-footer">
                <button class="btn-modal-cancel" data-action="cancel">${cancelText}</button>
                <button class="btn-modal-confirm ${iconType}" data-action="confirm">${confirmText}</button>
            </div>
        </div>`;
    document.body.appendChild(backdrop);

    requestAnimationFrame(() => requestAnimationFrame(() => backdrop.classList.add('visible')));

    const close = () => {
        backdrop.classList.remove('visible');
        setTimeout(() => backdrop.remove(), 280);
    };

    backdrop.querySelector('[data-action="cancel"]').addEventListener('click', close);
    backdrop.querySelector('[data-action="confirm"]').addEventListener('click', () => {
        onConfirm();
        close();
    });
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
}

// --------------------------------------------------------------------------
// REEMPLAZAR ICONOS SVG en el DOM (procesa atributos data-icon)
// FIX: esta función faltaba completamente — los iconos nunca se mostraban
// en registro.html y manual.html.
// --------------------------------------------------------------------------
function replaceIcons() {
    if (typeof Icons === 'undefined') return;
    document.querySelectorAll('[data-icon]').forEach(el => {
        const svg = Icons[el.dataset.icon];
        if (svg) el.innerHTML = svg;
    });
}

// --------------------------------------------------------------------------
// NAV ACTIVE LINK
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename || (filename === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    // Reemplazar iconos al cargar la página
    replaceIcons();
});
