# ADR-001 — Decisión sobre la estrategia de aplicación

> ADR significa registro de decisión arquitectónica. Este documento explica la comparación, la elección y sus consecuencias. Es un documento del equipo; adapten los ejemplos al caso.

## Estado

Aceptada: 6 de septiembre de 2026. El equipo revisó la comparación de alternativas y confirmó la estrategia PWA para el proyecto.

## Contexto y restricciones

La aplicación registra inspecciones de mantenimiento en los laboratorios y permite dar seguimiento a los hallazgos. La utiliza principalmente el personal técnico que se encarga de realizar las inspecciones, y también las personas encargadas de revisar avances. 
Estos son los factores clave que influyen en la decisión:
- El personal técnico revisa los laboratorios y ahí la conexión a internet es intermitente, tal como describe el Escenario 2 de requirements.md
- La aplicación debe ser accesible tanto desde escritorio como desde algún otro dispositivo móvil
- Se debe poder conservar la información sin conexión y sincronizarla después
- Todos los datos son sintéticos, no se utiliza información real de estudiantes ni de la institución
- El curso dura 14 semanas y el sistema avanza semana a semana

## Alternativas consideradas

| Criterio | PWA | Web tradicional | App nativa | Multiplataforma |
|---|---|---|---|---|
| Instalación | Se instala desde el navegador, no se necesita tienda de aplicaciones | No se instala y siempre requiere tener el navegador abierto | Requiere de tienda de apps y de un proceso de publicación | Se requiere de tienda de apps, igual que la nativa |
| Offline | Puede funcionar sin conexión usando Service Worker | No funciona sin conexión | Sí funciona offline pero con más control de almacenamiento | Funciona offline, pero dependería de librerías extras |
| Distribución | Un solo enlace web y se actualiza al recargar | También se distribuye por un solo enlace, sin proceso de instalación | Depende de la revisión y la aprobación de la tienda | Igual que la nativa, depende de la tienda de apps |
| Costo de desarrollo | Un solo código base en JavaScript/TypeScript, sin necesidad de aprender un lenguaje distinto | Un solo código base y es el más simple de los cuatro | Código distinto por plataforma y duplica esfuerzo | Se escribe un solo código con frameworks unificados, aunque cada plataforma sigue necesitando ajustes propios |
| Mantenimiento | Un solo repositorio durante todo el curso | Bajo mantenimiento, pero sin capacidades offline | Alto, ya que son dos bases de código (iOS y Android) | Medio, con dependencias nativas propias |
| Acceso al dispositivo | Acceso limitado a funciones del dispositivo mediante APIs del navegador | Acceso mínimo | Acceso completo a hardware y APIs del sistema | De acceso amplio, pero no siempre suele ser inmediato |
| Riesgos | El soporte puede variar entre navegadores | No resuelve la conectividad intermitente | Tiempo de desarrollo que no se ajusta a las 14 semanas del curso | La configuración puede consumir mucho tiempo |

La operación offline no aparece automáticamente solo por elegir PWA: se necesita diseñar el Service Worker, el almacenamiento local y la sincronización en las semanas del curso dedicadas a esos temas.

## Decisión

El equipo utiliza la estrategia PWA sobre Next.js, que ya es el que se encuentra fijado por el curso. Considerando las condiciones del proyecto, la conectividad intermitente dentro de los laboratorios, necesidad de instalación de forma sencilla, y un equipo con tiempo limitado a solo 14 semanas para trabajar, la PWA ofrece un mejor balance ya que puede funcionar sin conexión mediante Service Worker, se instala directo desde el navegador sin pasar por una tienda de aplicaciones, y usa un solo código base que el equipo ya conoce, sin necesidad de aprender un lenguaje nativo distinto.
Una app nativa sería preferible si se buscara distribuirlo formalmente en una tienda de aplicaciones.

## Consecuencias y riesgos

- Beneficio: guardar los datos en el dispositivo permite seguir registrando inspecciones aunque no haya conexión
- Costo: esa información debe sincronizarse después, sin perderla ni duplicarla al reconectarse 
- Riesgo: no todos los navegadores soportan igual las funciones de PWA, como el Service Worker
- Mitigación: si alguna función no está disponible, la aplicación debe seguir funcionando sin bloquear el resto del sistema.

## Validación

Cuando se implemente el Service Worker, se comprobará que la aplicación siga mostrando datos ya cargados sin conexión. Más adelante, cuando se implementen las siguientes funciones, se comprobarán así:
- Sincronización: un registro creado offline debe sincronizarse bien al reconectar, sin duplicarse ni perderse
- Permisos del dispositivo (como las notificaciones push): el usuario debe poder aceptarlos o rechazarlos correctamente

Todavía no están implementadas ni validadas, solo se describe brevemente cómo se comprobarán al implementarlas.
