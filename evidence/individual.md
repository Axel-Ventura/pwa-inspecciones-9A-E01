# Evidencia individual - Semana 4

## Integrante: Sánchez Ventura Axel Eduardo

- Estudiante: Sánchez Ventura Axel Eduardo

- Commit SHA evaluado:

- Decisión técnica que puedo explicar: Utilicé CSR para la lista de inspecciones porque necesita interacción del usuario mediante filtros sin recargar la página. Utilicé SSR para el detalle de una inspección porque los datos pueden renderizarse en el servidor a partir del ID de la ruta. También reutilicé un componente `LoadingState` para los estados de carga.

- Prueba que ejecuté y resultado: Probé `/inspecciones`, `/inspecciones/inspection-001` y `/inspecciones/abc`. La lista cargó correctamente y los filtros funcionaron; el detalle de `inspection-001` mostró sus datos; y un ID inexistente mostró el estado de error.

- Limitación o fallo diagnosticado: La aplicación utiliza datos sintéticos almacenados localmente en `src/lib/data/inspections.ts`; todavía no existe una API ni una base de datos. Durante la implementación, las rutas de detalle inicialmente mostraban 404 porque la ruta dinámica `[id]` aún no estaba creada; se resolvió implementándola.

- Cambio que podría defender o modificar en vivo: Puedo explicar y modificar el filtro CSR, la búsqueda de una inspección por ID en la ruta SSR y los estados de carga/error.

- Uso declarado de IA (herramienta, propósito, validación): utilizado como apoyo para estructurar las rutas CSR/SSR, el componente de carga y los estados de error. Validé manualmente la implementación ejecutando el proyecto y probando las rutas, filtros y navegación en el navegador.



## Integrante: Paniagua González Concepción Guadalupe

- Estudiante: Paniagua González Concepción Guadalupe - 3523110114

- Commit SHA evaluado: e01b60946a929ca7b780ed590e7c28a6945fffe8

- Decisión técnica que puedo explicar: Me encargué de crear tests/rendering.spec.ts para verificar los 5 requisitos de renderizado: que el listado use "use client" y useState, que el detalle no use "use client" y busque la inspección con el id, que se use el componente LoadingState, que exista manejo para una inspección inexistente, y que ambas rutas usen los datos reales. Para la prueba de datos, importé el archivo real y verifiqué que cada inspección tenga todos sus campos, para que la prueba falle si alguien elimina uno.

- Prueba que ejecuté y resultado:
npm run test: las 5 pruebas de rendering.spec.ts pasaron (CSR, SSR, Loading, Error, Datos), junto con las demás pruebas del proyecto (manifest, starter, service-worker, offline)
npm run build: compiló correctamente
npm run verify: resultado final "Verificación técnica: pass"

- Limitación o fallo diagnosticado: las pruebas de esta semana no revisan si la página realmente funciona en un navegador, solo revisan si el código tiene escritas ciertas palabras claves (como "use client" o "useState")

- Cambio que podría defender o modificar en vivo: Podría explicar por qué el listado y el detalle usan formas distintas de renderizado: el listado (con "use client") deja que el navegador maneje los filtros que el usuario toca, mientras que el detalle (sin "use client") deja que el servidor arme la página lista antes de mandarla, porque no necesita que el usuario interactúe con nada ahí.

- Uso declarado de IA (herramienta, propósito, validación): Usé IA como apoyo para crear las pruebas de rendering.spec.ts, ya que no sabía cómo verificar automáticamente si un componente es de cliente o de servidor.




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

