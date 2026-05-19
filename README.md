# Proyecto de Práctica Profesional: Sistema de Gestión de Laboratorios Tecnológicos y Niñeras de Cómputo

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Logo_Uniminuto.svg" alt="Logo UNIMINUTO" width="220">
</p>

## Descripción del Proyecto
Este repositorio alberga el desarrollo integral de la plataforma web concebida durante el periodo de Práctica Profesional (con una duración de 4 meses), diseñada para optimizar de manera sustancial el control, administración y mantenimiento del inventario técnico en el área de laboratorios tecnológicos de la Corporación Universitaria Minuto de Dios (UNIMINUTO).

El aplicativo resuelve la necesidad crítica de registrar las bitácoras de limpieza y mantenimiento técnico, así como de divulgar de manera interactiva los lineamientos institucionales sobre el uso de recursos tecnológicos compartidos, específicamente las denominadas "niñeras de cómputo" y los equipos de préstamo interno.

---

## Funcionalidades Principales

### 1. Manual Interactivo de Procedimientos
Estructura dinámica tipo acordeón que digitaliza de forma clara y accesible las normativas de la oficina de laboratorios:
* Concepto de Niñeras: Carros especializados que resguardan y transportan 31 equipos portátiles con sus respectivos cargadores, proporcionando acceso a internet bajo la red de dominio de la universidad.
* Protocolo de Operación: Canales de solicitud a través de los responsables de jornada y la Jefa de Laboratorios.
* Garantía de Orden: Reglas estrictas de organización en bandejas de hierro, con cables correctamente envueltos y validación de estado físico al momento de la entrega/recepción.
* Mantenimiento Preventivo Semanal: Detalle de los insumos oficiales permitidos (Líquido limpiador de pantallas, trapos secos y espuma especializada para teclados y carcasas exteriores).
* Flujo de Soporte: Canalización inmediata de fallos de hardware o software con el proveedor institucional (Colsoft).

### 2. Formulario de Registro Técnico
Módulo de captura de datos en tiempo real validado para registrar los procedimientos de mantenimiento aplicados:
* Número de Serial: Entrada única estandarizada (Ej: UNIMINUTO-EQ-001).
* Clasificación de Equipos: Segmentación precisa por categorías:
    * Equipo de Niñera
    * Equipo de Préstamo Interno
    * Área de Bienestar
    * Docente / Materia
* Detalles Técnicos: Área de texto libre para documentar observaciones físicas y lógicas del sistema tratado.

### 3. Visualización Dinámica y Exportación a Excel
* Tabla de Sesión Activa: Muestra en tiempo real los registros digitados en la jornada con marcas de fecha/hora automáticas.
* Generación de Reportes (.xlsx): Integración con la librería xlsx.js para compilar los datos ingresados en un reporte descargable de Excel de forma inmediata, minimizando los tiempos administrativos de digitación doble.

---

## Arquitectura Tecnológica y Despliegue
La plataforma está construida bajo un enfoque ágil, priorizando el rendimiento, la accesibilidad móvil y un diseño UI/UX de estándar premium:

* Frontend: HTML5 semántico, CSS3 estructurado (con paleta institucional basada en azul oscuro y acentos dorados #eaaa00) y JavaScript Vanilla para el manejo del DOM y lógica local.
* Procesamiento de Datos: Integración nativa con la librería XLSX (SheetJS) desde CDN para la exportación de reportes limpios del lado del cliente.
* Despliegue Continuo: Alojado de manera estática y pública a través de GitHub Pages, garantizando disponibilidad inmediata para el equipo de trabajo de los laboratorios.

---

## Estructura Organizacional y Roles
El proyecto interactúa y reporta directamente a la jerarquía técnica de los laboratorios:
* Dirección de Laboratorios: Elizabeth Villalobos (Jefa de Laboratorios).
* Responsables Técnicos: 
  * Jaider Rodríguez (Responsable Jornada Día).
  * Hugo Palacio (Responsable Jornada Noche).
* Desarrollador / Practicante: David Yate (Análisis y Desarrollo de Software - ADSO).

---

## Estructura del Repositorio
```bash
├── index.html        # Estructura principal y marcado semántico del portal (comentado)
├── styles.css        # Hoja de estilos premium (diseño responsive, acordeones, formularios y tablas)
├── script.js         # Lógica interactiva, captura de eventos y procesamiento del Excel
├── README.md         # Documentación general del proyecto (este archivo)
└── LICENCIA          # Licencia de uso del proyecto (MIT License)
