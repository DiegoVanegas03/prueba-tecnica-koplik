## Funcionamiento de la API

#### ALMACENAMIENTO DE DATOS:
- Como se indica en el documento, los datos solo se persisten en memoria a través de un archivo JSON (memorizedForms.json), donde se encuentra la información necesaria para que el sistema funcione.

#### ENDPOINTS:
- **[slug].json (provee listados de preguntas)**
  - `http://localhost:4321/forms/api/[slug].json`
  - Este endpoint es de parámetro dinámico y solo acepta dos valores: `sistema-digestivo-humano` o `sistema-nervioso-humano`.
  - Dependiendo del valor, devolverá el listado de preguntas correspondiente.

- **validate.json**
  - `http://localhost:4321/forms/api/validate.json`
  - Este endpoint es el encargado de validar las respuestas.
  - Validará las respuestas obtenidas y formateadas por el Frontend, de acuerdo con el JSON.
  - Devolverá una calificación por las respuestas correctas y un mensaje de confort.

- `export const prerender = false;` 
  - Esto es necesario para que un cliente externo a Astro pueda consumir el endpoint. 
  - Más información en la [documentación de Astro](https://docs.astro.build/en/guides/endpoints/).