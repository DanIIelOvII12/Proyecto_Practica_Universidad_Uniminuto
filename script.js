// ==========================================================================
// CONTROL DE ALMACENAMIENTO LOCAL Y LOGICA DEL SITIO WEB
// ==========================================================================

// Elementos del DOM
const maintenanceForm = document.getElementById('maintenanceForm');
const serialNumberInput = document.getElementById('serialNumber');
const equipmentTypeSelect = document.getElementById('equipmentType');
const observationsInput = document.getElementById('observations');
const tableBody = document.getElementById('tableBody');
const emptyRow = document.getElementById('emptyRow');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Cargar registros iniciales desde localStorage o un array vacío si no hay datos
let maintenanceRecords = JSON.parse(localStorage.getItem('uniminuto_records')) || [];

// Inicializar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    
    // Escuchar el envío del formulario
    maintenanceForm.addEventListener('submit', handleFormSubmit);
    
    // Escuchar el clic para exportar a Excel
    exportBtn.addEventListener('click', exportToExcel);
    
    // Escuchar el clic para limpiar todo el historial
    clearAllBtn.addEventListener('click', clearAllRecords);
});

// ==========================================================================
// FUNCIÓN: RENDERIZAR LA TABLA EN PANTALLA
// ==========================================================================
function renderTable() {
    // Limpiar el contenido de la tabla excepto la fila vacía por defecto
    tableBody.innerHTML = '';
    
    if (maintenanceRecords.length === 0) {
        tableBody.appendChild(emptyRow);
        exportBtn.disabled = true;
        exportBtn.style.opacity = '0.5';
        exportBtn.style.cursor = 'not-allowed';
        return;
    }
    
    // Habilitar el botón de exportación si hay registros
    exportBtn.disabled = false;
    exportBtn.style.opacity = '1';
    exportBtn.style.cursor = 'pointer';

    // Construir las filas dinámicamente
    maintenanceRecords.forEach((record, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${record.date}</td>
            <td><strong>${record.serial}</strong></td>
            <td>${record.type}</td>
            <td>${record.observations || 'Sin observaciones'}</td>
            <td class="text-center">
                <button class="btn-delete" onclick="deleteRecord(${index})">Eliminar</button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// ==========================================================================
// FUNCIÓN: CAPTURAR DATOS DEL FORMULARIO
// ==========================================================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Obtener la fecha y hora actual formateada
    const now = new Date();
    const formattedDate = now.toLocaleString('es-CO', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    // Crear el objeto del nuevo registro
    const newRecord = {
        date: formattedDate,
        serial: serialNumberInput.value.trim().toUpperCase(),
        type: equipmentTypeSelect.value,
        observations: observationsInput.value.trim()
    };

    // Agregar al array principal y guardar en localStorage
    maintenanceRecords.push(newRecord);
    localStorage.setItem('uniminuto_records', JSON.stringify(maintenanceRecords));
    
    // Resetear formulario y actualizar tabla visual
    maintenanceForm.reset();
    renderTable();
}

// ==========================================================================
// FUNCIÓN: ELIMINAR UN REGISTRO ESPECÍFICO
// ==========================================================================
window.deleteRecord = function(index) {
    if (confirm('¿Está seguro de que desea eliminar este registro de la sesión?')) {
        maintenanceRecords.splice(index, 1);
        localStorage.setItem('uniminuto_records', JSON.stringify(maintenanceRecords));
        renderTable();
    }
};

// ==========================================================================
// FUNCIÓN: LIMPIAR TODO EL HISTORIAL
// ==========================================================================
function clearAllRecords() {
    if (confirm('ATENCION: Se borrarán de forma definitiva todos los registros digitados en este equipo. ¿Desea continuar?')) {
        maintenanceRecords = [];
        localStorage.removeItem('uniminuto_records');
        renderTable();
    }
}

// ==========================================================================
// FUNCIÓN: COMPILAR Y EXPORTAR A EXCEL (SHEETJS)
// ==========================================================================
function exportToExcel() {
    if (maintenanceRecords.length === 0) return;

    // Mapear los datos JSON internos a columnas y títulos limpios
    const excelData = maintenanceRecords.map(record => ({
        'FECHA Y HORA REGISTRO': record.date,
        'NUMERO DE SERIAL / ID': record.serial,
        'TIPO / AREA DE EQUIPO': record.type,
        'OBSERVACIONES DE MANTENIMIENTO': record.observations || 'N/A'
    }));

    // Crear libro de trabajo y hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Ajustar anchos automáticos recomendados
    const columnWidths = [
        { wch: 22 }, // Fecha y Hora
        { wch: 25 }, // Serial
        { wch: 25 }, // Tipo/Área
        { wch: 50 }  // Observaciones
    ];
    worksheet['!cols'] = columnWidths;

    // Añadir hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mantenimientos Lab');

    // Generar archivo binario y forzar descarga
    const dateStamp = new Date().toISOString().slice(0,10);
    XLSX.writeFile(workbook, `Reporte_Mantenimiento_Laboratorios_${dateStamp}.xlsx`);
}