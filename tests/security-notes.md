# Notas de seguridad (Week 09)

## Archivos fuera de `src/lib/security/` que se modificaron y por qué

- `src/lib/storage/schema.ts`: `getStoredOperations()` hacía `JSON.parse` y devolvía el resultado sin comprobarlo (T-02). Ahora valida en tiempo de ejecución con `parseStoredOperations`. Lo rechazado o corrupto se copia a la clave `pwa_pending_operations_quarantine` antes de que la cola vuelva a guardarse, para no perderlo en silencio. `addPendingOperation()` también valida.
- `src/lib/sync/queue.ts`: `enqueue()` aceptaba cualquier objeto (T-01). Ahora valida y devuelve un resultado (`ok` o código de error) en lugar de lanzar excepción. Si el `operationId` ya existe sigue sin duplicar (T-03).

## Regresión relevante

Si alguien quita la llamada a `quarantine(raw)` en `getStoredOperations()`, falla la prueba
"REGRESIÓN: JSON corrupto no se pierde en silencio al encolar una operación nueva"
(y las dos pruebas de datos manipulados). Verificado ejecutándolo con esa línea comentada.

## Límites conocidos

- `type` solo se valida por formato y longitud (el proyecto no define una lista cerrada de tipos; en las pruebas se usa `"create"`).
- localStorage no es una frontera de seguridad: la validación reduce riesgo, no lo elimina.