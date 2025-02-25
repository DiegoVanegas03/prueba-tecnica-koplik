# Prueba tecnica koplik 🧑🏽‍💻

**Desarrollar una pequeña aplicación web de Preguntas y Respuestas orientada a estudiantes de medicina. La aplicación tendrá dos partes principales:**

Frontend en Astro + React + Typescript:

- Una interfaz donde se muestran preguntas y se permiten respuestas.

- Diseño simple y funcional sin necesidad de una gestión global de estado (puedes usar el estado local de cada componente).
- Backend (API) en Astro:
- Una API simple que provea endpoints para obtener las preguntas, enviar respuestas y, opcionalmente, almacenar resultados.

- La API deberá ofrecer endpoints para obtener preguntas y para simular la validación de respuestas (no es necesario guardar datos).

# Pasos para ejecutar el proyecto:

- `git clone https://github.com/DiegoVanegas03/prueba-tecnica-koplik`

- `pnpm install`

- `pnpm run dev`

# Estructura del proyecto

## Desiciones de diseño

### 🌐 Página Estática (Landing Page)

- **Fondo:** Un diseño con puntos azulados al 80% de opacidad para dar un efecto visual agradable.
- **Carta Central:** Contiene dos tarjetas con enlaces a los formularios.
  - Cada tarjeta tiene una **imagen diferenciada** para identificar fácilmente el formulario correspondiente.

### 📝 Página de Formulario

- **Encabezado (Header)**

  - Una tarjeta en la parte superior con:
    - **Imagen representativa** del formulario.
    - **Título** para identificar el formulario.
    - **Descripción** breve sobre el contenido.
    - **Barra de progreso** que sirve como **feedback visual**.

- **Listado de Preguntas**

  - Se muestra dentro de una **carta separada**.
  - Tipos de preguntas admitidos:
    - **Open** (respuesta abierta).
    - **Single Choice** (selección única).
    - **Multiple Choice** (selección múltiple).
    - **Matching** (emparejamiento).
  - El frontend **valida que todas las preguntas estén contestadas** antes de permitir el envío.

### 🏆 Evaluación y Retroalimentación

- **Corrección de Respuestas:**
  - Una vez enviadas, el backend valida las respuestas.
  - Se muestra un **modal con la calificación final**.
  - Opción para visualizar **qué respuestas fueron incorrectas**.

## 🔧 Posibles Mejoras y Futuras Implementaciones

1.  **📄 Paginación de Preguntas (Secciones)**

    - Implementar un sistema de paginación para dividir las preguntas en **secciones**, evitando que el usuario se sienta abrumado con demasiada información en una sola vista.
    - Agregar una **barra de progreso dinámica** para indicar en qué sección se encuentra el usuario.

2.  **🤖 Evaluación Automática de Preguntas Abiertas**

    - Incorporar un **sistema de mapeo de palabras clave** para evaluar respuestas abiertas de manera más flexible.
    - Definir **sinónimos** y variaciones aceptables.

3.  **Mejora en la Interacción de relacionar palabras**

    - Permitir **arrastrar y soltar** palabras para relacionarlas con sus definiciones en lugar de rellenar un input
    - Agregar **animaciones visuales** como una conexión entre cada palabra.
