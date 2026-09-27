# Evidencia individual - Semana 4

## Integrante:

- Estudiante: 
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

## Integrante: Paniagua González Concepción Guadalupe

- Estudiante: Paniagua González Concepción Guadalupe - 3523110114

- Commit SHA evaluado:

- Decisión técnica que puedo explicar: Me encargué de crear tests/rendering.spec.ts para verificar los 5 requisitos de renderizado: que el listado use "use client" y useState, que el detalle no use "use client" y busque la inspección con el id, que se use el componente LoadingState, que exista manejo para una inspección inexistente, y que ambas rutas usen los datos reales. Para la prueba de datos, importé el archivo real y verifiqué que cada inspección tenga todos sus campos, para que la prueba falle si alguien elimina uno.

- Prueba que ejecuté y resultado:
npm run test: las 5 pruebas de rendering.spec.ts pasaron (CSR, SSR, Loading, Error, Datos), junto con las demás pruebas del proyecto (manifest, starter, service-worker, offline)
npm run build: compiló correctamente
npm run verify: resultado final "Verificación técnica: pass"

- Limitación o fallo diagnosticado: las pruebas de esta semana no revisan si la página realmente funciona en un navegador, solo revisan si el código tiene escritas ciertas palabras claves (como "use client" o "useState")

- Cambio que podría defender o modificar en vivo: Podría explicar por qué el listado y el detalle usan formas distintas de renderizado: el listado (con "use client") deja que el navegador maneje los filtros que el usuario toca, mientras que el detalle (sin "use client") deja que el servidor arme la página lista antes de mandarla, porque no necesita que el usuario interactúe con nada ahí.

- Uso declarado de IA (herramienta, propósito, validación): Usé IA como apoyo para crear las pruebas de rendering.spec.ts, ya que no sabía cómo verificar automáticamente si un componente es de cliente o de servidor.

## Integrante:

- Estudiante: Paniagua González Concepción Guadalupe - 3523110114
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):