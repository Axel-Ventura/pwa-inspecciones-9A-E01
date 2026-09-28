# Evidencia individual

## Integrante: Sánchez Ventura Axel Eduardo

- Estudiante: Sánchez Ventura Axel Eduardo

- Commit SHA evaluado:

- Decisión técnica que puedo explicar: Definí una política de sincronización basada en `operationId` para evitar duplicados, reintentos mediante `retryCount` y resolución de conflictos mediante versiones, evitando que una versión anterior sobrescriba una más reciente.

- Prueba que ejecuté y resultado: Ejecuté `tests/sync.spec.ts`, validando inserción de operaciones, idempotencia, reintentos, sincronización exitosa, fallos de sincronización, resolución de conflictos y respuestas fuera de orden. Resultado: pruebas exitosas.

- Limitación o fallo diagnosticado: La actividad no cuenta con un backend real de sincronización, por lo que las pruebas utilizan handlers y datos sintéticos para reproducir los escenarios de sincronización.

- Cambio que podría defender o modificar en vivo: Puedo modificar la política de resolución de conflictos o agregar un caso de prueba para un nuevo escenario de reintento, duplicación o respuesta fuera de orden y explicar cómo afecta el comportamiento de la cola.

- Uso declarado de IA (herramienta, propósito, validación): ChatGPT, para apoyar la estructuración inicial de `tests/sync.spec.ts` y `docs/sync-policy.md`. El código y las decisiones fueron revisados, adaptados y validados mediante las pruebas locales del proyecto.


## Integrante:

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):


## Integrante:

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

