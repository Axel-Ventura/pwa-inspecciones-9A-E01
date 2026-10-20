# Estrategia de pruebas — Semana 8

## 1. Propósito

Esta estrategia define las pruebas unitarias, de integración y End-to-End (E2E) de la PWA de inspecciones y mantenimiento de laboratorios de la Universidad Tecnológica de Tehuacán.

El objetivo es verificar comportamientos críticos del proyecto acumulativo, identificar regresiones relevantes y automatizar las verificaciones mediante GitHub Actions.

Las pruebas utilizarán exclusivamente datos sintéticos, sin servicios privados, información personal real ni credenciales.

## 2. Alcance y flujo crítico

La aplicación permite consultar inspecciones sintéticas, filtrarlas por estado y acceder al detalle de cada registro.

El flujo crítico seleccionado es:

1. Acceder al listado `/inspecciones`.
2. Comprobar la visualización de los registros.
3. Filtrar las inspecciones que requieren atención.
4. Abrir el detalle de una inspección.
5. Verificar que la información corresponda al registro seleccionado.
6. Regresar al listado.
7. Comprobar el comportamiento ante un identificador inexistente.

Se utilizarán los siguientes registros sintéticos del proyecto:

| ID | Laboratorio | Estado | Hallazgos |
|---|---|---|---|
| `inspection-001` | Laboratorio de Redes | `ok` | 0 |
| `inspection-002` | Laboratorio de Electrónica | `attention` | 2 |
| `inspection-003` | Laboratorio de Software | `ok` | 0 |

También se verificará la lógica de sincronización desarrollada previamente: idempotencia, almacenamiento local, operaciones pendientes, reintentos y resolución de conflictos.

## 3. Pirámide de pruebas

Se utilizarán tres niveles complementarios.

### 3.1. Pruebas unitarias — `tests/unit/`

**Propósito:** comprobar funciones y reglas de negocio de forma aislada, rápida y determinista.

Comportamientos prioritarios:

- Agregar una operación válida a la cola.
- Evitar operaciones duplicadas con el mismo `operationId`.
- Incrementar el contador de reintentos después de un fallo.
- Marcar una operación como completada.
- Seleccionar la versión más reciente de una inspección ante un conflicto.
- Gestionar entradas inválidas o condiciones límite del almacenamiento.
- Verificar que un cambio relevante en las reglas cause un fallo en la prueba correspondiente.

Se utilizarán objetos sintéticos y dependencias simuladas cuando sea necesario.

### 3.2. Pruebas de integración — `tests/integration/`

**Propósito:** comprobar la interacción entre el almacenamiento local, la cola de sincronización y las operaciones de recuperación.

Escenario principal:

1. Crear una operación sintética.
2. Guardarla en un almacenamiento local simulado.
3. Recuperarla mediante `SyncQueue`.
4. Simular un fallo de sincronización.
5. Verificar que la operación permanece pendiente y aumenta `retryCount`.
6. Crear una nueva instancia de la cola para representar otra sesión.
7. Simular un reintento exitoso.
8. Comprobar que la operación queda completada y no se duplica.

Se utilizará una implementación controlada de `localStorage` para evitar dependencias del navegador o de servicios remotos.

### 3.3. Pruebas E2E — `tests/e2e/`

**Propósito:** validar el recorrido del usuario desde un navegador automatizado utilizando Playwright.

Escenarios prioritarios:

- Visualizar los tres registros sintéticos del listado.
- Aplicar el filtro «Requieren atención».
- Comprobar que solo aparece el Laboratorio de Electrónica.
- Abrir el detalle de `inspection-002`.
- Comprobar el identificador, el estado y los dos hallazgos registrados.
- Regresar al listado.
- Acceder a una inspección inexistente y verificar el mensaje «Inspección no encontrada».

Las pruebas esperarán condiciones visibles de la interfaz y evitarán retrasos arbitrarios que provoquen resultados inestables.

## 4. Selección basada en riesgos

| Riesgo | Impacto | Nivel de prueba | Verificación esperada |
|---|---|---|---|
| Operaciones duplicadas | Alto | Unitaria e integración | Una misma operación no se registra dos veces |
| Pérdida de operaciones pendientes | Alto | Integración | Las operaciones sobreviven a un fallo y pueden recuperarse |
| Reintentos incorrectos | Alto | Unitaria e integración | Se actualizan estado y contador de reintentos |
| Sobrescritura por una versión antigua | Alto | Unitaria | Se conserva la versión más reciente |
| Filtro incorrecto | Medio | E2E | Solo aparecen inspecciones del estado seleccionado |
| Navegación a un detalle equivocado | Alto | E2E | El ID y los datos corresponden al registro seleccionado |
| Identificador inexistente | Medio | E2E | Se muestra un estado de error controlado |
| Dependencia de servicios externos | Medio | Todas | Las pruebas se ejecutan con datos y simulaciones locales |

Se priorizan los casos que podrían producir pérdida de información, inconsistencias o navegación incorrecta.

## 5. Caso de fallo reproducible y corrección

### 5.1. Riesgo seleccionado

La función `addPendingOperation()` del módulo `src/lib/storage/schema.ts` agrega operaciones al almacenamiento sin comprobar si existe previamente otra con el mismo `operationId`.

Este comportamiento puede permitir duplicados cuando se solicita registrar la misma operación más de una vez.

### 5.2. Procedimiento de reproducción

1. Preparar un `localStorage` simulado y vacío.
2. Crear una operación sintética con `operationId = "op-001"`.
3. Invocar `addPendingOperation()` dos veces con la misma operación.
4. Recuperar las operaciones almacenadas.
5. Comprobar que únicamente exista una entrada con ese identificador.

**Resultado esperado:** una sola operación almacenada.

**Comportamiento del código original:** la implementación realiza dos inserciones, por lo que puede almacenar dos entradas.

### 5.3. Corrección propuesta

Modificar `addPendingOperation()` para comprobar si ya existe el `operationId` antes de agregar una operación.

La corrección debe preservar las operaciones existentes y no afectar los reintentos legítimos.

### 5.4. Evidencia requerida

Para considerar el fallo diagnosticado y corregido, deberán conservarse:

- La prueba de regresión que reproduce el defecto.
- La salida real de la prueba fallida antes de aplicar la corrección.
- El cambio de código que corrige la causa.
- La salida real de la misma prueba después de aplicar la corrección.
- Los commits relevantes y los resultados de la verificación final.

**Estado:** pendiente de ejecución y registro de evidencia. No se consideran demostrados resultados que todavía no se hayan obtenido.

## 6. Automatización y CI

GitHub Actions ejecutará las verificaciones sobre el repositorio acumulativo.

El flujo previsto es:

1. Obtener el código del commit.
2. Configurar una versión declarada de Node.js.
3. Instalar dependencias mediante `npm ci --ignore-scripts --no-audit --no-fund`.
4. Ejecutar lint y validaciones estáticas.
5. Compilar el proyecto con `npm run build`.
6. Ejecutar las pruebas unitarias y de integración.
7. Ejecutar las pruebas E2E con un navegador instalado en CI.
8. Ejecutar las verificaciones académicas públicas.
9. Generar y publicar reportes de resultados y cobertura.

Se conservarán los workflows anteriores del proyecto.

La actividad utiliza las rutas:

- `.github/workflows/week-08-w08-testing-ci.yml`
- `.github/workflows/academic-evaluation.yml`

La configuración deberá evitar ejecuciones duplicadas innecesarias y conservar la compatibilidad con los criterios públicos.

## 7. Reportes y trazabilidad

Los artefactos previstos incluyen:

- `reports/verification.json`: verificación técnica acumulada.
- `evaluation-result.json`: resultados de evaluación disponibles.
- `coverage/`: cobertura obtenida mediante una herramienta de pruebas.
- `test-results/`: resultados y evidencias de las pruebas ejecutadas.

Solo se reportarán métricas y resultados generados por herramientas reales. No se declarará cobertura de módulos o pruebas que no hayan sido ejecutados.

La evidencia final deberá relacionarse con el SHA del commit entregado, los logs de GitHub Actions y la ejecución local.

## 8. Reproducibilidad

El proyecto utiliza Next.js, TypeScript, npm y un archivo de bloqueo de dependencias.

Comandos existentes de verificación:

```bash
npm ci
npm test
npm run build
npm run verify
```

`npm run verify` es el equivalente documentado de `make verify` en el entorno Windows utilizado por el equipo.

Los comandos adicionales para las categorías de pruebas, cobertura y Playwright se documentarán en el README una vez implementados y verificados.

La verificación final incluirá una instalación limpia, pruebas, build y ejecución del workflow de GitHub Actions.

## 9. Decisiones técnicas y trade-offs

### Pruebas unitarias y de integración con herramientas de Node.js

Se prioriza aprovechar el entorno TypeScript existente y evitar agregar herramientas innecesarias.

**Ventaja:** menor complejidad y pruebas rápidas.

**Limitación:** es necesario configurar explícitamente el ejecutor y el mecanismo de generación de cobertura.

### Playwright para pruebas E2E

Se selecciona Playwright para comprobar el comportamiento real en un navegador.

**Ventaja:** permite verificar filtros, navegación, contenido visible y errores del recorrido del usuario.

**Costo:** requiere instalar el navegador de pruebas, iniciar el servidor de Next.js y administrar el tiempo de ejecución en CI.

### Simulación del almacenamiento y fallos

Se utilizarán simulaciones controladas en las pruebas unitarias y de integración.

**Ventaja:** resultados reproducibles e independientes de la red.

**Limitación:** una simulación no sustituye por completo las pruebas sobre dispositivos reales o condiciones reales de conectividad.

### Priorización por riesgo

Se prioriza el flujo crítico y la consistencia de los datos por encima de intentar automatizar todas las pantallas y funcionalidades.

**Ventaja:** permite entregar pruebas relevantes dentro del plazo de siete días.

**Limitación:** la cobertura no será exhaustiva y deberán documentarse los escenarios no incluidos.

## 10. Limitaciones conocidas

- La aplicación utiliza registros sintéticos y no dispone de un backend real de inspecciones.
- La sincronización se verifica con handlers y almacenamiento simulado.
- La pantalla de listado contiene un estado de error cuyo disparador no está conectado al flujo actual.
- Los módulos de cámara, geolocalización y notificaciones cuentan con pruebas previas, pero esto no demuestra necesariamente su uso completo desde la interfaz.
- La ejecución E2E en CI puede requerir preparar explícitamente el navegador y el servidor.
- Las pruebas automatizadas reducen riesgos, pero no garantizan ausencia total de defectos.
- Los checks públicos son formativos; la evaluación final puede incluir pruebas privadas sobre el commit fijado.


## 11. Criterios de cierre

La Semana 8 se considerará técnicamente lista cuando:

- Existan pruebas ejecutables en `tests/unit/`, `tests/integration/` y `tests/e2e/`.
- Las pruebas relevantes fallen ante una regresión comprobable.
- Se haya reproducido, corregido y documentado al menos un fallo.
- La instalación limpia y el build finalicen correctamente.
- El workflow ejecute lint, build y las tres categorías de pruebas.
- Se generen reportes auténticos de resultados.
- El README contenga instrucciones verificadas.
- GitHub Actions termine correctamente sobre el commit de entrega.
- La evidencia individual corresponda al trabajo real de cada integrante.

La aprobación técnica no sustituye la evaluación académica final.
