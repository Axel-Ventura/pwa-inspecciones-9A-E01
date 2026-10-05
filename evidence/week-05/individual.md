## Integrante: Reyes Torres Manelic Alitzel

- **Commit SHA evaluado:** <NUEVO_SHA>

- **Mi contribución concreta y enlace a archivo, commit anterior o revisión:** 
  Implementación del esquema de datos con persistencia local en `src/lib/storage/schema.ts` utilizando `localStorage` para garantizar la supervivencia de las operaciones encoladas ante cierres de pestaña. Actualización del archivo `README.md` con los conceptos clave de sincronización (idempotencia, reintentos, resolución de conflictos y manejo de versiones) y registro de evidencia de la Semana 5.

- **Decisión que puedo explicar y por qué:** 
  La segregación estricta de responsabilidades en `src/lib/storage/schema.ts`. Se delimitó la funcionalidad del archivo exclusivamente a la representación de tipos y la persistencia en `localStorage` (`operationId`, `inspectionId`, `type`, `payload`, `version`, `status`, `createdAt`, `retryCount`), asegurando deliberadamente que no contenga lógica para procesar la cola, ejecutar reintentos, resolver conflictos o comunicarse con el servidor backend.

- **Limitación o fallo diagnosticado:** 
  Aunque `localStorage` permite la persistencia de datos entre recargas y cierres de pestaña, está limitado por el hilo principal síncrono del navegador y carece de soporte nativo para transacciones complejas o almacenamiento de volúmenes masivos de datos (a diferencia de IndexedDB). Además, persiste la advertencia `MODULE_TYPELESS_PACKAGE_JSON` durante las pruebas al no tener `"type": "module"` en `package.json`.

- **Cambio que podría defender o modificar en vivo:** 
  Podría explicar y migrar la capa de persistencia de `localStorage` a `IndexedDB` (utilizando la API nativa o librerías como Dexie) si las inspecciones incluyeran archivos pesados como fotografías o metadatos complejos que superen la capacidad típica de 5 MB de `localStorage`.

- **Uso declarado de IA (herramienta, propósito, validación):** 
  Utilicé Gemini para estructurar las funciones helper de persistencia en TypeScript y sintetizar la documentación técnica en `README.md`. Validé la implementación ejecutando los comandos `npm test`, `npm run build` y `npm run dev` de forma limpia sin errores en consola ni en la compilación de Next.js.


## Integrante: Paniagua González Concepción Guadalupe

- **Commit SHA evaluado:** <pendiente>

- **Mi contribución concreta y enlace a archivo, commit anterior o revisión:**
  Me encargué de crear `src/lib/sync/queue.ts` y `src/lib/sync/conflict-policy.ts`. `queue.ts` es una clase que guarda las operaciones pendientes, evita que se repitan, y lleva el control de cuáles ya se sincronizaron o cuáles fallaron. `conflict-policy.ts` es el que se encarga de decidir cuál versión de una inspección se queda cuando hay dos versiones distintas (se queda la que es más nueva). También instalé tsx porque hacía falta para que se pudieran correr las pruebas.

- **Decisión que puedo explicar y por qué:** 
  Decidí que cada archivo hiciera solo una cosa: `queue.ts` únicamente administra la cola de operaciones (agregarlas, marcarlas como exitosas o fallidas, y reintentarlas) y que `conflict-policy.ts` solo decidiera qué versión de una inspección se debe conservar cuando hay dos distintas. Decidí que fueran separados porque hace más fácil entender y corregir cada parte por separado si algo falla.

  - **Limitación o fallo diagnosticado:**
  Tuve un problema al crear la carpeta `sync`: la dejé al mismo nivel que `lib` en vez de dentro de ella, lo cual hacía que las pruebas no encontraran los archivos y lo corregí moviendo la carpeta al lugar correcto.

  - **Cambio que podría defender o modificar en vivo:**
  Podría explicar por qué cuando falla la sincronización, la operación no se borra: se queda guardada como pendiente, para que se pueda volver a intentar después, parecido a como WhatsApp no borra un mensaje si no hay señal, sino que lo reintenta más tarde.

- **Uso declarado de IA (herramienta, propósito, validación):**
  Utilice IA como apoyo para diseñar y construir `queue.ts` y `conflict-policy.ts`, también me ayudó a diagnosticar el error de la carpeta mal ubicada. Ejecuté las pruebas con el código real `npm run test` confirmé que las 8 pruebas pasaran y tambien que el proyecto compila correctamente (`npm run build`)
