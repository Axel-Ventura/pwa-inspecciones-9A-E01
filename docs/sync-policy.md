# Política de sincronización

## 1. Objetivo

Definir cómo se almacenan, procesan y sincronizan las inspecciones
cuando la aplicación se encuentra sin conexión o recupera la conectividad.

La política busca evitar pérdida de datos, duplicados y sobrescrituras
incorrectas durante los reintentos de sincronización.

---

## 2. Persistencia local

Las operaciones de inspección se almacenan localmente antes de intentar
su sincronización.

Cada operación contiene al menos:

- `operationId`
- `inspectionId`
- `type`
- `payload`
- `version`
- `status`
- `createdAt`
- `retryCount`

Una operación permanece en estado `pending` mientras no haya sido
sincronizada correctamente.

---

## 3. Idempotencia

Cada operación utiliza `operationId` como identificador único.

Si una misma operación se intenta agregar nuevamente a la cola, no se
debe crear una segunda operación pendiente.

Esto permite repetir una operación de sincronización sin generar
duplicados.

La idempotencia se verifica en:

- `tests/sync.spec.ts`
- Test 2 — Idempotencia / duplicados

---

## 4. Reintentos

Cuando una operación falla durante la sincronización:

1. La operación permanece en la cola.
2. Su contador `retryCount` aumenta.
3. Puede volver a procesarse posteriormente.
4. Una sincronización exitosa elimina la operación de las pendientes.

Los fallos de red no deben provocar la pérdida de la operación.

La política se verifica en:

- Test 3 — Fallo y retry
- Test 5 — Retry exitoso
- Test 6 — Retry fallido

---

## 5. Resolución de conflictos

Cuando existen dos versiones de una misma inspección, se utiliza una
política determinista basada en la versión.

La versión más reciente tiene prioridad sobre una versión anterior.

Por lo tanto, una respuesta antigua no debe sobrescribir los datos
actualizados localmente.

Esta política se verifica en:

- Test 7 — Resolución de conflicto
- Test 8 — Respuestas fuera de orden

---

## 6. Respuestas fuera de orden

Las respuestas de sincronización pueden llegar en un orden diferente al
orden en que fueron generadas.

Una respuesta correspondiente a una versión anterior no puede sobrescribir
una versión más nueva.

El resultado debe mantenerse determinista independientemente del orden
en que lleguen las respuestas.

---

## 7. Estados de una operación

Una operación puede encontrarse en los siguientes estados:

- `pending`: pendiente de sincronización.
- `synced`: sincronizada correctamente.

Los errores de sincronización no eliminan la operación; permanece como
`pending` para permitir un nuevo intento.

---

## 8. Comportamiento ante pérdida de conexión

Cuando no existe conectividad:

1. La inspección se guarda localmente.
2. Se crea una operación pendiente.
3. La operación permanece disponible para sincronización posterior.

Cuando se recupera la conectividad, la cola puede procesar las operaciones
pendientes.

---

## 9. Resiliencia

La sincronización debe soportar:

- reintentos;
- operaciones duplicadas;
- fallos de red;
- respuestas fuera de orden;
- recuperación de conectividad.

No se utilizan servicios externos ni datos reales. Las pruebas utilizan
datos sintéticos y simulaciones deterministas.

---

## 10. Trazabilidad

| Requisito | Evidencia |
|---|---|
| Persistencia local | `src/lib/storage/schema.ts` |
| Cola de sincronización | `src/lib/sync/queue.ts` |
| Política de conflictos | `src/lib/sync/conflict-policy.ts` |
| Pruebas de sincronización | `tests/sync.spec.ts` |
| Idempotencia | Test 2 |
| Reintentos | Tests 3, 5 y 6 |
| Conflictos | Tests 7 y 8 |
| Respuestas fuera de orden | Test 8 |

---

## 11. Limitaciones

La implementación de esta semana utiliza almacenamiento local y una cola
de sincronización sin depender de un backend real.

No se implementa en esta actividad la comunicación con un servicio externo
ni un servidor de sincronización real.

La integración con un backend real queda fuera del alcance de esta semana.

---

## 12. Uso de IA

Se utilizó asistencia de IA para apoyar la estructuración inicial de las
pruebas y documentación.

La implementación fue revisada y validada mediante pruebas locales y
verificación del proyecto.