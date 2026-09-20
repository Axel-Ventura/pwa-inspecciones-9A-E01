# Evidencia individual
+

# Evidencia individual — Semana 3

## Integrante: Sánchez Ventura Axel Eduardo

- Estudiante: Sánchez Ventura Axel Eduardo
- Commit SHA evaluado: ............

### Decisión técnica que puedo explicar

Implementé la integración del Service Worker para agregar capacidades PWA de funcionamiento offline y manejo controlado de caché.

La solución separa el registro del Service Worker de su implementación. El registro se realiza mediante `src/lib/pwa/register-service-worker.ts` y el componente `src/lib/pwa/service-worker-register.tsx`, integrado desde `src/app/layout.tsx`.

En `public/sw.js` se definieron estrategias diferentes según el tipo de recurso:

- Precache de `/` y `/manifest.webmanifest`.
- Cache First para recursos estáticos del mismo origen, como JavaScript, CSS, imágenes y fuentes.
- Network First para las navegaciones.
- Fallback a una respuesta HTML legible cuando una navegación no puede resolverse desde la red ni desde la caché.
- Exclusión de peticiones que no sean `GET`.
- Exclusión de recursos pertenecientes a otros orígenes.
- Versionado de las cachés para permitir la invalidación controlada de versiones anteriores.

Se evitó utilizar `skipWaiting()` y `clientsClaim()` de forma agresiva para mantener una actualización más controlada del Service Worker.

### Prueba que ejecuté y resultado

Ejecuté las siguientes comprobaciones:

`npm run build`

Resultado: la compilación terminó correctamente con `Compiled successfully` y las páginas estáticas fueron generadas sin errores.

`npm run test`

Resultado:

- `manifest.spec.mjs: PASS`
- `starter.spec.mjs: PASS`

`npm run verify`

Resultado:

- Verificación técnica: `pass`
- Revisión académica: `pending`

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

La limitación es que el proyecto todavía utiliza datos sintéticos y no implementa sincronización de datos creados offline con un backend. La funcionalidad desarrollada en esta semana se enfoca en el Service Worker, caché y recuperación de la aplicación.

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

También puedo demostrar mediante DevTools el registro, activación y contenido de las cachés del Service Worker.

### Uso declarado de IA

Utilicé ChatGPT como apoyo durante la implementación de la Semana 3 para analizar la estrategia de Service Worker, organizar la estructura de los archivos, revisar la estrategia de caché y diagnosticar problemas durante las pruebas.

La implementación fue revisada manualmente y validada mediante `npm run build`, `npm run test`, `npm run verify` y pruebas manuales utilizando las herramientas de desarrollo del navegador.




## Integrante: Paniagua González Concepción Guadalupe

- Estudiante: Paniagua González Concepción Guadalupe - 3523110114 
- Commit SHA evaluado: 9c81266d5346091c71ee45abe30d2dda34d979f0

### Decisión técnica que puedo explicar
Me encargué de crear los archivos de prueba para simular el entorno de un Service Worker, ya que el código de public/sw.js no corre en un navegador real dentro de las pruebas. Agregué ese archivo dentro del entorno simulado y ejecuté los eventos install, activate y fetch para comprobar cual era el resultado.

### Prueba que ejecuté y resultado
npm run test: las 4 pruebas pasaron (manifest.spec.mjs, starter.spec.mjs, service-worker.spec.ts, offline.spec.ts) y su resultado fue PASS
npm run build: compiló correctamente sin errores
npm run verify: resultado final "Verificación técnica: pass"

### Limitación o fallo diagnosticado
Al correr npm run test aparece una advertencia de Node (MODULE_TYPELESS_PACKAGE_JSON) porque package.json no declara "type": "module", aunque esto no afectó el resultado de las pruebas 

### Cambio que podcomo ría defender o modificar en vivo
Simulé que se pierde la conexión sin que hubiera nada guardado, con esto comprobé que la app responde con el código 503, que esa respuesta sea una página html y que el mensaje que este dentro de esa página sea "Sin conexión" para que los usuarios entiendan que es lo que pasa y no genere confusión

### Uso declarado de IA
Usé IA como apoyo para crear los archivos de prueba, ya que no sabía cómo simular el entorno de un Service Worker para poder probarlo.


## Integrante:
- Commit SHA evaluado:
### Decisión técnica que puedo explicar
### Prueba que ejecuté y resultado
### Limitación o fallo diagnosticado
### Cambio que podría defender o modificar en vivo
### Uso declarado de IA


