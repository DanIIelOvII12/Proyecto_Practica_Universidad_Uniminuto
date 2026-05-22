/* ==========================================================================
   DASHBOARD.JS – Lógica del inicio (index.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    loadRecentActivity();

    // FIX: el botón de exportación del dashboard ahora funciona correctamente
    // (antes apuntaba a registro.html#exportar, que no hacía nada).
    const btn = document.getElementById('quickExportBtn');
    if (btn) btn.addEventListener('click', exportToExcel);
});

// --------------------------------------------------------------------------
// Animación de conteo para las tarjetas de estadísticas
// --------------------------------------------------------------------------
function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    if (target === 0) { el.textContent = '0'; return; }

    let current = 0;
    const steps  = 24;
    const step   = Math.max(1, Math.round(target / steps));
    const delay  = Math.max(16, Math.round(600 / steps));

    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, delay);
}

// --------------------------------------------------------------------------
// Estadísticas
// FIX: la versión original usaba IDs incorrectos (totalRecords, totalNineras,
// totalPortatiles) que no existen en index.html. Los IDs correctos son
// statTotal, statToday, statNineras y statPrestamo.
// --------------------------------------------------------------------------
function updateDashboardStats() {
    const records = getRecords();
    const today   = todayISO(); // "YYYY-MM-DD"

    animateCount('statTotal',  records.length);
    animateCount('statToday',  records.filter(r => r.date && r.date.startsWith(today)).length);
    animateCount('statNineras',records.filter(r => r.type === 'Niñera').length);
    animateCount('statPrestamo',records.filter(r => r.type === 'Portátil').length);

    // FIX: actualiza la fecha del último registro (antes nunca se actualizaba)
    const lastDateEl = document.getElementById('lastRecordDate');
    if (lastDateEl) {
        lastDateEl.textContent = records.length > 0
            ? formatDateToLocal(records[0].date)
            : 'Sin registros';
    }
}

// --------------------------------------------------------------------------
// Actividad reciente
// FIX: la versión original buscaba '#recentTable tbody', pero el elemento
// en index.html tiene id="recentBody" (sin tabla padre con ese id).
// --------------------------------------------------------------------------
function loadRecentActivity() {
    const tbody = document.getElementById('recentBody');
    if (!tbody) return;

    const records = getRecords();
    tbody.innerHTML = '';

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;color:var(--text-secondary);padding:2.5rem 1rem;">
                    No hay registros aún.
                    <a href="registro.html" style="color:var(--primary);font-weight:700;margin-left:4px;">
                        Crear el primero →
                    </a>
                </td>
            </tr>`;
        return;
    }

    records.slice(0, 5).forEach((record, i) => {
        const tr = document.createElement('tr');
        tr.style.animation = `fadeIn .3s ease ${i * 0.06}s both`;
        tr.innerHTML = `
            <td class="td-date">${formatDateToLocal(record.date)}</td>
            <td class="td-serial">${record.serial || ''}</td>
            <td>${getBadgeHtml(record.type)}</td>
            <td class="td-obs">${record.observations ||
                '<em style="color:#cbd5e1;">Sin observaciones</em>'}</td>
        `;
        tbody.appendChild(tr);
    });
}
