# Estrategia de Caché del Service Worker

## 1. Objetivo

La aplicación utiliza un Service Worker para conservar recursos de la aplicación y permitir que determinadas partes continúen disponibles cuando la conexión a Internet no está disponible.

La estrategia de caché se define según el tipo de recurso y contempla precache, caché runtime, navegación y recuperación offline.

## 2. Versionado de cachés

La aplicación utiliza dos cachés versionados:

- `inspecciones-laboratorio-v1-static`
- `inspecciones-laboratorio-v1-runtime`

El versionado permite identificar los recursos correspondientes a una versión determinada de la aplicación y facilita la eliminación controlada de versiones anteriores.

## 3. Precache

Durante la instalación del Service Worker se almacenan previamente:

- `/`
- `/manifest.webmanifest`

Estos recursos forman parte de los recursos mínimos necesarios para iniciar la aplicación.

## 4. Recursos estáticos — Cache First

Para recursos estáticos del mismo origen se utiliza una estrategia Cache First.

Se consideran principalmente:

- JavaScript
- CSS
- imágenes
- fuentes

Primero se busca el recurso en la caché. Si existe, se devuelve la versión almacenada. Si no existe, se solicita a la red y, cuando la respuesta es correcta, se almacena en el runtime cache.

Esta estrategia permite reutilizar recursos que ya fueron descargados y reducir la dependencia de la red.

## 5. Navegaciones — Network First

Las solicitudes de navegación utilizan Network First.

Primero se intenta obtener una versión actualizada desde la red. Si la solicitud falla, se intenta recuperar:

1. La navegación solicitada desde la caché.
2. La página principal `/`.
3. Una respuesta HTML offline.

Esta estrategia permite utilizar contenido actualizado cuando existe conexión y mantener una alternativa cuando la conexión falla.

## 6. Fallback offline

Cuando una navegación no puede recuperarse desde la red ni desde la caché, el Service Worker devuelve una respuesta HTML de respaldo.

La respuesta utiliza:

- Estado HTTP `503`.
- Tipo de contenido `text/html`.
- Un mensaje comprensible indicando que no existe conexión.

El objetivo es evitar que el usuario reciba una página vacía o un error técnico sin explicación.

## 7. Peticiones excluidas

El Service Worker solamente procesa solicitudes `GET`.

Las solicitudes con otros métodos no se almacenan mediante esta estrategia. Tampoco se incluyen recursos cuyo origen sea diferente al origen de la aplicación.

## 8. Invalidación de caché

Durante la activación se revisan las cachés cuyo nombre comienza con `inspecciones-laboratorio-`.

Las versiones que no corresponden a las cachés actuales son eliminadas. Esto evita conservar indefinidamente recursos pertenecientes a versiones anteriores.

## 9. Actualización segura

La implementación no utiliza `skipWaiting()` ni `clientsClaim()` de manera agresiva.

La intención es evitar que una nueva versión del Service Worker tome inmediatamente el control de las páginas abiertas. La actualización utiliza el ciclo normal del Service Worker.

## 10. Limitaciones

La aplicación utiliza actualmente datos sintéticos.

El Service Worker permite conservar recursos de la aplicación, pero todavía no implementa sincronización de registros creados offline con un backend. Por lo tanto, esta semana se cubre principalmente la disponibilidad de la aplicación y sus recursos, no la sincronización de datos de negocio.

## 11. Validación

La estrategia fue validada mediante:

- `npm run build`
- `npm run test`
- `npm run verify`
- DevTools → Application → Service Workers
- DevTools → Cache Storage
- Simulación de conexión offline

Durante la validación manual se comprobó la existencia de los cachés `inspecciones-laboratorio-v1-static` e `inspecciones-laboratorio-v1-runtime`, así como el contenido precacheado y los recursos almacenados durante la ejecución.
