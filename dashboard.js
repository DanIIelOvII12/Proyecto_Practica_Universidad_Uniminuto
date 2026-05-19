/* ==========================================================================
   DASHBOARD.JS – Lógica de la página de inicio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    document.getElementById('quickExportBtn').addEventListener('click', exportToExcel);
});

function loadDashboard() {
    const records = getRecords();
    const today   = todayString();

    const total    = records.length;
    const todayQty = records.filter(r => r.date.startsWith(today) || r.date.includes(today.split('/').reverse().join('-'))).length;
    const nineras  = records.filter(r => r.type === 'Niñera').length;
    const prestamo = records.filter(r => r.type === 'Préstamo').length;

    animateCounter('statTotal',   total);
    animateCounter('statToday',   todayQty);
    animateCounter('statNineras', nineras);
    animateCounter('statPrestamo',prestamo);

    // Último registro
    if (records.length > 0) {
        document.getElementById('lastRecordDate').textContent = records[0].date;
    }

    // Exportar quick: deshabilitar si no hay registros
    const exportBtn = document.getElementById('quickExportBtn');
    if (total === 0) {
        exportBtn.disabled = true;
        exportBtn.textContent = '📥 Sin registros para exportar';
    }

    // Tabla de últimos 5 registros
    renderRecentTable(records.slice(0, 5));
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    if (target === 0) { el.textContent = '0'; return; }

    const duration = 700;
    const step     = Math.ceil(target / 20);
    let current    = 0;
    const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        el.style.animation = 'countUp .2s ease';
        if (current >= target) clearInterval(interval);
    }, duration / 20);
}

function renderRecentTable(records) {
    const tbody = document.getElementById('recentBody');
    if (!tbody) return;

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4">
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>No se han digitado registros aún.<br>
                       <a href="registro.html" style="color:var(--primary);font-weight:700;">Crear el primero →</a></p>
                </div>
            </td></tr>`;
        return;
    }

    tbody.innerHTML = records.map(r => `
        <tr class="fade-in">
            <td class="td-date">${r.date}</td>
            <td class="td-serial">${r.serial}</td>
            <td>${getBadgeHtml(r.type)}</td>
            <td class="td-obs">${r.observations || '—'}</td>
        </tr>
    `).join('');
}

function exportToExcel() {
    const records = getRecords();
    if (records.length === 0) {
        showToast('No hay registros para exportar.', 'info');
        return;
    }

    const data = records.map(r => ({
        'FECHA Y HORA':   r.date,
        'SERIAL / ID':    r.serial,
        'TIPO / ÁREA':    r.type,
        'TÉCNICO':        r.technician || 'N/A',
        'OBSERVACIONES':  r.observations || 'N/A',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 22 }, { wch: 25 }, { wch: 20 }, { wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Mantenimientos Lab');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Reporte_Mantenimiento_${stamp}.xlsx`);
    showToast('¡Reporte Excel generado correctamente!', 'success');
}
