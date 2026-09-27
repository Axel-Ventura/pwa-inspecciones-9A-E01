# Evidencia individual

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

# Evidencia individual

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

# Evidencia individual 

## Integrante: Reyes Torres Manelic Alitzel

- **Commit SHA evaluado:** 6204de43e8da29b81af26561bf2879224a106b6d

- **Mi contribución concreta y enlace a archivo, commit anterior o revisión:** 
  Creación y documentación técnica de `docs/rendering-decision.md` para la arquitectura de renderizado (CSR vs SSR), reestructuración de `tests/README.md` con la guía de pruebas y comandos de la Semana 4, y registro de la evidencia individual del proyecto.

- **Decisión que puedo explicar y por qué:** 
  La elección de Client-Side Rendering (CSR) para la ruta de la lista (`/inspecciones`) y Server-Side Rendering (SSR / Dynamic) para el detalle (`/inspecciones/[id]`). Se eligió CSR en la lista porque requiere interactividad cliente para filtros/tablas sin necesidad de SEO crítico, mientras que en el detalle se usó SSR para pre-cargar la información del recurso directamente desde el servidor antes de enviarla al cliente.

- **Limitación o fallo diagnosticado:** 
  El proyecto trabaja con datos sintéticos locales. Al ejecutar `npm run verify` se identificó una advertencia en consola (`MODULE_TYPELESS_PACKAGE_JSON`) en las pruebas TypeScript, debido a que `package.json` no tiene definido `"type": "module"`, lo que provoca que Node tenga que re-parsear los archivos TS como ES Modules.

- **Cambio que podría defender o modificar en vivo:** 
  Podría explicar y ajustar la respuesta del servidor en `/inspecciones/[id]` ante un identificador no existente (como `/inspecciones/abc`), mostrando cómo renderizar un estado de error o redirección 404 personalizado, o bien cómo cambiar la revalidación de la vista si se conectara a una API REST en lugar de datos estáticos.

- **Uso declarado de IA (herramienta, propósito, validación):** 
  Utilicé Gemini para la redacción técnica del documento de decisiones de renderizado (`rendering-decision.md`) y la estructura de la documentación de pruebas. Validé la información revisando la estructura del proyecto en VS Code, ejecutando las pruebas con `npm run verify` (resultado PASS) y verificando el build de Next.js.