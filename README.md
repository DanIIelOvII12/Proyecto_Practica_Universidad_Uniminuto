# Portal Laboratorios UNIMINUTO – Mantenimiento de Equipos y Niñeras
Plataforma web institucional premium para la gestión, control y auditoría de mantenimiento técnico de recursos tecnológicos y niñeras de cómputo.

<p align="center">
  <img src="https://images.seeklogo.com/logo-png/22/1/uniminuto-logo-png_seeklogo-221225.png" alt="Logo UNIMINUTO" width="220">
</p>

## Descripción del Proyecto
Este repositorio alberga el desarrollo integral de la plataforma web concebida durante el periodo de Práctica Profesional (con una duración de 4 meses), diseñada para optimizar de manera sustancial el control, administración y mantenimiento del inventario técnico en el área de laboratorios tecnológicos de la **Corporación Universitaria Minuto de Dios (UNIMINUTO)**.

El aplicativo unifica e interactúa de manera directa con las bitácoras de limpieza y mantenimiento técnico, además de divulgar de forma interactiva los lineamientos institucionales sobre el uso de recursos tecnológicos compartidos, específicamente las denominadas **"niñeras de cómputo"** y los equipos de préstamo interno.

---

## Funcionalidades Principales

### 1. Panel de Control Dinámico (index.html)
Un panel administrativo (Dashboard) que ofrece un diagnóstico visual inmediato del estado de los laboratorios mediante:
* **Métricas en Tiempo Real:** Contadores dinámicos y animados que desglosan el *Total de Registros*, *Registros de Hoy*, cantidad específica de mantenimientos a *Niñeras* y estado de *Préstamos*.
* **Auditoría Rápida:** Visualización automatizada de la fecha/hora del último cambio guardado y una tabla con los 5 registros más recientes capturados en el sistema.
* **Acciones Express:** Botón de exportación rápida a formato Excel directo desde la pantalla de inicio.

### 2. Manual Interactivo de Procedimientos (manual.html)
Estructura dinámica basada en componentes web que digitaliza de forma clara y accesible las normativas de la oficina de laboratorios:
* **Concepto de Niñeras:** Carros especializados que resguardan y transportan 31 equipos portátiles con sus respectivos cargadores, proporcionando acceso a internet bajo la red de dominio de la universidad.
* **Protocolo de Operación:** Canales de solicitud formal a través de los responsables de jornada y la Jefa de Laboratorios.
* **Garantía de Orden:** Reglas estrictas de organización en bandejas de hierro, con cables correctamente envueltos y validación de estado físico al momento de la entrega/recepción.
* **Mantenimiento Preventivo Semanal:** Detalle de los insumos oficiales permitidos (Líquido limpiador de pantallas, trapos secos y espuma especializada para teclados y carcasas exteriores).
* **Flujo de Soporte:** Canalización inmediata de fallos de hardware o software con el proveedor institucional (Colsoft).

### 3. Sistema de Registro Avanzado e Historial (registro.html)
Módulo robusto de captura de datos con validación del lado del cliente y persistencia de datos local:
* **Formulario Validado:** Captura estandarizada de *Número de Serial (Ej: UNIMINUTO-EQ-001)*, *Tipo/Área (Niñera, Préstamo, Bienestar, Docente)*, *Técnico encargado* y *Observaciones*.
* **Herramientas de Búsqueda y Filtrado:** Barra de consulta inteligente por texto (búsqueda por serial u observaciones) combinada con filtros por categoría de equipo.
* **Persistencia de Datos (Local Storage):** Arquitectura persistente que evita la pérdida de información ante cierres del navegador, complementado con un sistema de ventanas modales personalizadas para confirmaciones seguras de borrado individual o total.
* **Módulo de Impresión:** Hoja de estilos de impresión (`@media print`) optimizada para generar reportes físicos limpios y con formato institucional sin elementos CSS innecesarios de la interfaz web.

### 4. Motor de Reportes en Excel
Integración nativa con la librería **SheetJS (xlsx.js)** que automatiza la compilación de datos ingresados. Al dar clic en exportar, procesa el arreglo de objetos del Local Storage, asigna anchos automáticos a las columnas de la hoja de cálculo y genera un archivo `.xlsx` nombrado con la estampa de tiempo actual del sistema (`Reporte_Mantenimiento_YYYY-MM-DD.xlsx`).

---

## Arquitectura Tecnológica y UI/UX Premium
La plataforma está construida bajo un enfoque ágil, priorizando el rendimiento, la accesibilidad móvil y un diseño de estándar premium:

* **Tecnologías Core:** ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) 
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) 
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
* **Frontend Semántico & Estilos:** Desarrollado con HTML5 puro y CSS3 modular utilizando la fuente institucional *Barlow*. Posee animaciones fluidas (`fadeIn`, `countUp`) y una paleta cromática de alta fidelidad basada en la psicología del color del entorno corporativo (Azul Principal `#0c2340`, Dorado de Acento `#eaaa00` y Fondo de Interfaz `#eef2f7`).
* **JavaScript Moderno:** Lógica nativa (Vanilla JS) desacoplada en controladores específicos por vista que gestionan de forma asíncrona la manipulación del DOM.
* **Sistema de Iconos Vectoriales (icons.js):** Repositorio centralizado de iconos en formato SVG puro, inyectados dinámicamente mediante código para garantizar tiempos mínimos de carga y nitidez en pantallas de alta densidad (Retina/4K).
* **Despliegue Continuo:** ![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white) 
  Alojado de manera estática a través de GitHub Pages, garantizando disponibilidad inmediata y segura para el equipo de trabajo de los laboratorios.

---

## Estructura Organizacional y Roles
El proyecto está enfocado rigurosamente en la optimización de funciones y auditorías del área en base a los lineamientos de la institución:

* **Dirección de Laboratorios:** Elizabeth Villalobos (Jefa de Laboratorios).
* **Responsables Técnicos:** * Jaider Rodríguez (Responsable Jornada Día).
  * Hugo Palacio (Responsable Jornada Noche).
* **Desarrollador / Practicante:** David Yate (Análisis y Desarrollo de Software / ADSO).

---

## Estructura General del Repositorio
```bash
├── index.html          # Panel de control principal (Dashboard con métricas y resúmenes)
├── registro.html       # Interfaz del formulario de captura, filtros y tabla histórica
├── manual.html         # Sección interactiva con el manual y lineamientos institucionales
├── styles.css          # Core de diseño: variables de color, layouts, responsive y estilos de impresión
├── shared.js           # Utilidades compartidas: persistencia de datos, alertas toast y modales nativos
├── dashboard.js        # Controlador del panel de inicio, contadores y últimas inserciones
├── registro.js         # Controlador del formulario, lógica de filtrado y exportador a Excel
├── icons.js            # Diccionario y motor de renderizado para iconos SVG institucionales
└── README.md           # Documentación técnica del proyecto (este archivo)
