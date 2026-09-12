# Evidencia individual

## Integrante: Sánchez Ventura Axel Eduardo 

- Estudiante: Sánchez Ventura Axel Eduardo

- Commit SHA evaluado: []

- Decisión técnica que puedo explicar:
  Integré el AppShell como estructura común de la aplicación mediante `src/components/app-shell.tsx` y lo incorporé desde `src/app/layout.tsx`. La decisión permite mantener una estructura compartida para la navegación principal y el contenido de las páginas, manteniendo separados el shell y el contenido específico de la página.
- Prueba que ejecuté y resultado:
  Ejecuté `npm run build` y la compilación terminó correctamente con `Compiled successfully`, generando las páginas estáticas sin errores. También ejecuté `npm run test` y la prueba disponible del starter terminó con `starter.spec.mjs: PASS`. Finalmente, ejecuté `npm run dev` y comprobé visualmente que la aplicación cargara correctamente en `http://localhost:3000`, mostrando la navegación y las inspecciones sintéticas.

- Limitación o fallo diagnosticado:
  Los datos de las inspecciones todavía provienen de información sintética y estática. Los estados de carga, error y vacío están contemplados en la estructura de `page.tsx`, pero la fuente de datos actual no utiliza todavía una operación asíncrona que produzca esos estados durante la ejecución normal.

- Cambio que podría defender o modificar en vivo:
  Puedo explicar y modificar la estructura de `AppShell`, incluyendo la navegación principal, el uso de `children` para recibir el contenido de la página y su integración desde `layout.tsx`. También puedo modificar los estados definidos en `page.tsx` y explicar cómo se presenta cada uno.

- Uso declarado de IA (herramienta, propósito, validación):
  Utilicé como apoyo para organizar y revisar la implementación del shell y los estados solicitados para la Semana 2. La solución fue revisada manualmente y validada mediante `npm run build`, `npm run test` y la ejecución local de la aplicación.




## Integrante: 

- Estudiante: 
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
  [Completar con su propia decisión técnica.]
- Prueba que ejecuté y resultado:
  [Completar con el comando ejecutado y el resultado real.]
- Limitación o fallo diagnosticado:
  [Completar con la limitación o fallo encontrado.]
- Cambio que podría defender o modificar en vivo:
  [Completar con un cambio realizado por el integrante.]
- Uso declarado de IA (herramienta, propósito, validación):
  [Completar con su uso de IA y la validación realizada.]

---

## Integrante: 

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
  [Completar con su propia decisión técnica.]
- Prueba que ejecuté y resultado:
  [Completar con el comando ejecutado y el resultado real.]
- Limitación o fallo diagnosticado:
  [Completar con la limitación o fallo encontrado.]
- Cambio que podría defender o modificar en vivo:
  [Completar con un cambio realizado por el integrante.]
- Uso declarado de IA (herramienta, propósito, validación):
  [Completar con su uso de IA y la validación realizada.]