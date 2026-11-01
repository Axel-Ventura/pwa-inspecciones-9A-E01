# Evidencia individual

- **Estudiante:** Sánchez Ventura Axel Eduardo

- **Commit SHA evaluado:** ...

- **Decisión técnica que puedo explicar:** Elaborar `docs/threat-model.md` y `docs/privacy-data-inventory.md` para identificar los riesgos y los datos utilizados por la PWA antes de integrar los controles de seguridad. En el modelo de amenazas documenté los activos, las posibles vulnerabilidades, las medidas de mitigación y los riesgos residuales. En el inventario de privacidad describí las categorías de datos, sus finalidades, almacenamiento y medidas de minimización, utilizando únicamente datos sintéticos.

- **Prueba que ejecuté y resultado:** Verificación de existencia de los documentos mediante `Test-Path docs/threat-model.md` y `Test-Path docs/privacy-data-inventory.md`. Resultado: pendiente de confirmar mediante ejecución local.

- **Limitación o fallo diagnosticado:** Los documentos se elaboraron antes de finalizar los controles de seguridad de Week 09, por lo que las mitigaciones propuestas deberán contrastarse con la implementación y las pruebas finales. Además, el uso exclusivo de datos sintéticos no demuestra que la aplicación esté preparada para tratar datos personales reales.

- **Cambio que podría defender o modificar en vivo:** Puedo explicar y modificar la matriz de amenazas de `docs/threat-model.md`, cambiar la prioridad de un riesgo según su impacto y probabilidad, o actualizar `docs/privacy-data-inventory.md` si la aplicación incorpora una nueva categoría de datos o cambia su almacenamiento.

- **Uso declarado de IA (herramienta, propósito, validación):** Se usó como apoyo para estructurar y redactar el modelo de amenazas y el inventario de privacidad. La IA influyó en la organización de las tablas, la identificación de riesgos y la descripción de mitigaciones.





- **Estudiante:** Paniagua González Concepción Guadalupe

- **Commit SHA evaluado:** 

- **Decisión técnica que puedo explicar:** Creé `src/lib/security/`validation.ts para validar en tiempo de ejecución las operaciones de sincronización, porque TypeScript solo revisa los tipos al programar y localStorage puede ser modificado por cualquiera con acceso al navegador. La validación comprueba que los IDs sean texto no vacío, con longitud y caracteres permitidos, que el estado sea uno de los cuatro que usa el proyecto (`pending`, `syncing`, `completed`, `failed`), que no falte ningún campo ni sobre alguno, y que los números y el tamaño del payload estén dentro de límites. La conecté a la app real en dos puntos: getStoredOperations() valida lo que se lee del almacenamiento y SyncQueue.enqueue() valida lo que entra a la cola. Decidí que los datos inválidos o corruptos no se borren, sino que se copien a una clave de resguardo, porque antes un JSON dañado hacía que la cola arrancara vacía y el siguiente guardado sobrescribiera todo sin avisar.

- **Prueba que ejecuté y resultado:** Ejecuté `npm ci`, `npm run lint`, `npm test`, `npm run test --if-present -- --run`, `npm run build` y `npm run verify`, todos terminaron sin errores. `tests/security.spec.ts` pasa 18 de 18 pruebas, y las pruebas de semanas anteriores siguen pasando (26 unitarias y 8 de integración). Comenté quarantine(raw) en schema.ts para comprobar la regresión: fallaron 3 pruebas (datos manipulados, REGRESIÓN de JSON corrupto y estructura que no es lista) y al restaurar la línea volvieron a pasar las 18

- **Limitación o fallo diagnosticado:** El código original perdía datos en silencio: si localStorage tenía JSON corrupto, `getStoredOperations()` devolvía una lista vacía y el siguiente guardado lo sobrescribía; eso se corrigió con el resguardo. Una de las limitaciones es que el campo type solo se valida por formato y longitud, porque el proyecto no define una lista cerrada de tipos; localStorage no es una frontera de seguridad, así que la validación reduce el riesgo pero no lo elimina

- **Cambio que podría defender o modificar en vivo:** Puedo explicar y modificar los límites de validation.ts (por ejemplo MAX_ID_LENGTH o MAX_PAYLOAD_LENGTH) o mostrar en vivo cómo la prueba de regresión falla al comentar quarantine(raw)

- **Uso declarado de IA (herramienta, propósito, validación):** Usé IA para analizar el código existente, proponer el diseño de las validaciones y escribir el código de src/lib/security/, los cambios en schema.ts y queue.ts, y tests/security.spec.ts. Validé el resultado ejecutando todos los comandos de verificación en mi equipo, comprobando que las pruebas anteriores siguen pasando y haciendo yo misma la prueba de regresión.




- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):
