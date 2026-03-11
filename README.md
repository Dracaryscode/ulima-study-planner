# 🎓 Ulima Tracker - Planificador de Malla Curricular Interactivo

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Una herramienta interactiva diseñada para los estudiantes de Ingeniería de Sistemas de la Universidad de Lima (Malla 2025-2). Este planificador resuelve la complejidad de seguir la malla curricular, gestionar prerrequisitos y planificar estratégicamente las certificaciones parciales y diplomas de especialidad.

## ✨ Características Principales

* **Trazabilidad de Prerrequisitos en Tiempo Real:** Las líneas de dependencia en formato SVG se actualizan dinámicamente. Al marcar un curso como "Aprobado", se desbloquean automáticamente los cursos disponibles.
* **Gestión de Carga Académica ("Para llevar"):** Los estudiantes pueden simular su próximo ciclo seleccionando cursos. El sistema calcula los créditos y alerta si se supera el límite normativo de 27 créditos.
* **Seguimiento de Certificaciones y Diplomas:** Las especializaciones no son solo texto estático. El sistema lee el progreso del estudiante y muestra barras de progreso en tiempo real para las 8 certificaciones parciales y 4 diplomas disponibles.
* **Persistencia de Datos:** El estado de la malla se guarda automáticamente en el `localStorage` del navegador. El usuario no pierde su progreso al cerrar la pestaña.
* **Sistema de Etiquetas Inteligente:** Los cursos electivos y obligatorios muestran *badges* visuales indicando a qué especialización pertenecen, facilitando la toma de decisiones.

## 🚀 Instalación y Desarrollo Local

Si deseas correr este proyecto en tu máquina local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Dracaryscode/ulima-study-planner.git](https://github.com/Dracaryscode/ulima-study-planner.git)