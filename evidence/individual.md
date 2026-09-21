# Evidencia individual — Semana 3

## Integrante: Sánchez Ventura Axel Eduardo

- Estudiante: Sánchez Ventura Axel Eduardo
- Commit SHA evaluado: 2fb60ecd2c214d32d00a8d2d9a4f54736b131aa8

### Decisión técnica que puedo explicar

Implementé la integración del Service Worker para agregar capacidades PWA de funcionamiento offline y manejo controlado de caché.

La solución separa el registro del Service Worker de su implementación. El registro se realiza mediante `src/lib/pwa/register-service-worker.ts` y el componente `src/lib/pwa/service-worker-register.tsx`, integrado desde `src/app/layout.tsx`.

En `public/sw.js` definí estrategias diferentes según el tipo de recurso:

- Precache de `/` y `/manifest.webmanifest`.
- Cache First para recursos estáticos del mismo origen, como JavaScript, CSS, imágenes y fuentes.
- Network First para las navegaciones.
- Fallback a una respuesta HTML legible cuando una navegación no puede resolverse desde la red ni desde la caché.
- Exclusión de peticiones que no sean `GET`.
- Exclusión de recursos pertenecientes a otros orígenes.
- Versionado de las cachés para permitir la invalidación controlada de versiones anteriores.

Se evitó utilizar `skipWaiting()` y `clientsClaim()` de forma agresiva para mantener una actualización más controlada del Service Worker.

### Pruebas que ejecuté y resultados

Ejecuté las siguientes comprobaciones:

- `npm run build`: compilación correcta con `Compiled successfully` y generación de páginas estáticas sin errores.
- `npm run test`: pruebas ejecutadas con resultado `PASS` para los archivos principales del proyecto.
- `npm run verify`: verificación técnica en `pass` y revisión académica en `pending`.

También realicé una comprobación manual en el navegador mediante DevTools:

- Se registró `/sw.js`.
- El Service Worker alcanzó el estado `activated and is running`.
- El scope quedó establecido en `http://localhost:3000/`.
- Se comprobó la caché `inspecciones-laboratorio-v1-static`.
- Se comprobó la caché `inspecciones-laboratorio-v1-runtime`.
- El caché estático contiene `/` y `/manifest.webmanifest`.
- El caché runtime contiene recursos generados por Next.js, incluyendo JavaScript y CSS.
- Se activó el modo Offline de DevTools y la aplicación pudo responder utilizando los recursos almacenados.

### Limitación o fallo diagnosticado

La limitación es que el proyecto todavía utiliza datos sintéticos y no implementa sincronización de datos creados offline con un backend. La funcionalidad desarrollada en esta semana se enfoca en el Service Worker, la caché y la recuperación de la aplicación.

### Cambio que podría defender o modificar en vivo

Puedo explicar y modificar:

- El registro del Service Worker desde React.
- La integración del registro en `layout.tsx`.
- El precache definido en `sw.js`.
- La estrategia Cache First para recursos estáticos.
- La estrategia Network First para navegaciones.
- El fallback HTML para situaciones offline.
- El versionado e invalidación de las cachés.
- Las condiciones que evitan almacenar peticiones que no sean `GET` o recursos externos.

También puedo demostrar mediante DevTools el registro, la activación y el contenido de las cachés del Service Worker.

### Uso declarado de IA

Utilicé ChatGPT como apoyo durante la implementación de la Semana 3 para analizar la estrategia de Service Worker, organizar la estructura de los archivos, revisar la estrategia de caché y diagnosticar problemas durante las pruebas.

La implementación fue revisada manualmente y validada mediante `npm run build`, `npm run test`, `npm run verify` y pruebas manuales utilizando las herramientas de desarrollo del navegador.

---

## Integrante: Paniagua González Concepción Guadalupe

- Estudiante: Paniagua González Concepción Guadalupe - 3523110114
- Commit SHA evaluado: 9c81266d5346091c71ee45abe30d2dda34d979f0

### Decisión técnica que puedo explicar

Me encargué de crear los archivos de prueba para simular el entorno de un Service Worker, ya que el código de `public/sw.js` no corre en un navegador real dentro de las pruebas. Agregué ese archivo dentro del entorno simulado y ejecuté los eventos `install`, `activate` y `fetch` para comprobar el resultado.

### Pruebas que ejecuté y resultados

- `npm run test`: las 4 pruebas pasaron (`manifest.spec.mjs`, `starter.spec.mjs`, `service-worker.spec.ts` y `offline.spec.ts`) con resultado `PASS`.
- `npm run build`: compilación correcta sin errores.
- `npm run verify`: resultado final `Verificación técnica: pass`.

### Limitación o fallo diagnosticado

Al correr `npm run test`, aparece una advertencia de Node (`MODULE_TYPELESS_PACKAGE_JSON`) porque `package.json` no declara `"type": "module"`; esto no afectó el resultado de las pruebas.

### Cambio que podría defender o modificar en vivo

Simulé que se pierde la conexión sin que hubiera nada guardado. Con esto comprobé que la aplicación responde con el código `503`, que la respuesta es una página HTML y que el mensaje dentro de esa página es `Sin conexión`, para que los usuarios entiendan lo que está ocurriendo sin generar confusión.

### Uso declarado de IA

Usé IA como apoyo para crear los archivos de prueba, ya que no sabía cómo simular el entorno de un Service Worker para poder probarlo.

---

## Integrante: Reyes Torres Manelic Alitzel

- Estudiante: Reyes Torres Manelic Alitzel - 3523110736
- Commit SHA evaluado: d4de5ca4444f724b19afe1add5266db8377e502d

### Decisión técnica que puedo explicar

Me encargué de estructurar y redactar la documentación técnica de la estrategia de caché del Service Worker en `docs/cache-strategy.md`.

En este documento se detallaron los 11 aspectos fundamentales del funcionamiento PWA de la aplicación: el objetivo del Service Worker, el versionado de las cachés (`static` y `runtime`), las reglas de precache para recursos mínimos (`/` y `/manifest.webmanifest`), las estrategias de almacenamiento (Cache First para assets estáticos y Network First para navegaciones), el mecanismo de fallback offline (respuesta HTTP 503 con HTML descriptivo), las exclusiones de peticiones (solo método GET e igual origen), la invalidación limpia de cachés anteriores al activar una nueva versión, el ciclo de actualización segura sin tomar control agresivo de los clientes, las limitaciones actuales con respecto a la sincronización de datos sintéticos y la metodología de validación.

### Pruebas que ejecuté y resultados

Ejecuté las comprobaciones locales del proyecto para validar el entorno y la integración:

- `npm ci`: instalación limpia de dependencias finalizada sin problemas.
- `npm run build`: compilación exitosa del proyecto con Next.js y generación de páginas estáticas sin errores.
- `npm run test`: pasaron las pruebas asociadas al manifest, inicio del proyecto y Service Worker.
- `npm run verify`: confirmación del estado técnico en `pass`.

Validación manual en Google Chrome DevTools (sección Application > Cache Storage):

- Confirmación de la existencia de las cachés `inspecciones-laboratorio-v1-static` e `inspecciones-laboratorio-v1-runtime`.
- Verificación del contenido precacheado e inspección del comportamiento en modo Offline.

### Limitación o fallo diagnosticado

Actualmente la estrategia de caché garantiza la disponibilidad de la shell de la aplicación y sus recursos estáticos en modo offline, pero aún no se contempla la sincronización ni la persistencia local de nuevos registros de datos de inspección creados sin conexión a Internet.

### Cambio que podría defender o modificar en vivo

Puedo explicar y defender la elección de la estrategia **Cache First** para assets estáticos (JS, CSS, imágenes, fuentes) frente a **Network First** para las navegaciones HTML, fundamentando cómo esta combinación equilibra el rendimiento en cargas repetidas con la garantía de mostrar contenido actualizado cuando hay conexión a Internet. También puedo explicar las razones técnicas detrás de devolver un estado HTTP 503 personalizado en el fallback offline.

### Uso declarado de IA

Utilicé IA para apoyar la estructuración técnica del archivo `docs/cache-strategy.md` y sintetizar los conceptos clave de la estrategia de caché a partir de los requerimientos especificados. Toda la documentación generada fue revisada y validada manualmente contra la implementación del Service Worker en el repositorio.