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
    list.unshift(record); // más recientes primero
    saveRecords(list);
    return list;
}

function deleteRecord(index) {
    const list = getRecords();
    list.splice(index, 1);
    saveRecords(list);
    return list;
}

function clearAllRecords() {
    localStorage.removeItem(STORAGE_KEY);
}

// --------------------------------------------------------------------------
// HELPERS
// --------------------------------------------------------------------------
function formatDate(date = new Date()) {
    return date.toLocaleString('es-CO', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function formatShortDate(dateStr) {
    const [datePart, timePart] = dateStr.split(', ');
    return `${datePart} · ${timePart}`;
}

function getBadgeHtml(type) {
    const map = {
        'Niñera':   ['badge-ninera',    '💻'],
        'Préstamo': ['badge-prestamo',  '📦'],
        'Bienestar':['badge-bienestar', '🏥'],
        'Docente':  ['badge-docente',   '🎓'],
    };
    const [cls, icon] = map[type] || ['badge-ninera', '💻'];
    return `<span class="badge ${cls}">${icon} ${type}</span>`;
}

function todayString() {
    return new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
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

    requestAnimationFrame(() => {
        requestAnimationFrame(() => t.classList.add('visible'));
    });

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

    requestAnimationFrame(() => {
        requestAnimationFrame(() => backdrop.classList.add('visible'));
    });

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
});
