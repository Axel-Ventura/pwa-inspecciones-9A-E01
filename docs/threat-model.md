# Week 09 — Modelo de amenazas de la PWA de inspecciones

## 1. Objetivo y alcance

Este documento identifica amenazas relevantes para la PWA de inspecciones y mantenimiento de laboratorios de la Universidad Tecnológica de Tehuacán y define medidas técnicas para reducir su impacto.

El análisis cubre la aplicación Next.js, los formularios y rutas de inspección, el almacenamiento local, la cola de sincronización, el Service Worker, las capacidades del dispositivo y la configuración de despliegue.

El proyecto académico utiliza exclusivamente datos sintéticos. Este análisis no constituye una auditoría de seguridad ni una certificación de cumplimiento legal para un sistema en producción.

## 2. Activos que se deben proteger

| Activo | Importancia | Riesgo principal |
|---|---|---|
| Registros de inspección sintéticos | Alta | Alteración, pérdida o lectura no prevista |
| Operaciones pendientes de sincronización | Alta | Duplicación, corrupción o aplicación incorrecta |
| Datos almacenados en el navegador | Alta | Manipulación por terceros con acceso al dispositivo |
| Código y dependencias | Alta | Introducción de vulnerabilidades |
| Permisos de cámara, ubicación y notificaciones | Alta | Uso excesivo o no autorizado |
| Disponibilidad offline | Media-alta | Pérdida de acceso o uso de información desactualizada |
| Configuración HTTP y despliegue | Alta | Exposición de tráfico o ejecución de contenido no autorizado |

## 3. Arquitectura y límites de confianza

El proyecto contempla los siguientes componentes:

1. **Interfaz de usuario:** muestra inspecciones, detalles y estados.
2. **Navegador:** ejecuta código cliente y administra almacenamiento y permisos.
3. **Persistencia y sincronización:** conserva datos y operaciones para conectividad intermitente.
4. **Service Worker:** participa en el comportamiento offline y el uso de caché.
5. **Servidor Next.js y entorno de despliegue:** entrega páginas, recursos y encabezados HTTP.
6. **Servicios externos:** no deben ser necesarios para ejecutar las pruebas académicas.

Los principales límites de confianza están entre la entrada del usuario y la lógica de aplicación; entre el almacenamiento del navegador y el código que recupera datos; entre los permisos del sistema operativo y la aplicación; y entre el cliente y el servidor.

**Regla de diseño:** todo dato que ingrese desde formularios, URLs, almacenamiento o respuestas externas debe considerarse no confiable hasta ser validado.

## 4. Identificación y evaluación de amenazas

Se utiliza una escala cualitativa: probabilidad baja, media o alta; impacto bajo, medio o alto. La prioridad considera ambas dimensiones y el contexto de una PWA académica.

| ID | Amenaza | Probabilidad | Impacto | Prioridad |
|---|---|---|---|---|
| T-01 | Entrada malformada o fuera de los límites permitidos | Alta | Medio | Alta |
| T-02 | Modificación manual de datos locales | Alta | Alto | Alta |
| T-03 | Duplicación de operaciones durante sincronización | Media | Alto | Alta |
| T-04 | Inyección de contenido activo mediante datos no confiables | Media | Alto | Alta |
| T-05 | Solicitud innecesaria de capacidades del dispositivo | Media | Medio | Media |
| T-06 | Exposición de información por almacenamiento o caché | Media | Alto | Alta |
| T-07 | Configuración HTTP excesivamente permisiva | Media | Alto | Alta |
| T-08 | Publicación accidental de credenciales o archivos locales | Baja-media | Alto | Alta |
| T-09 | Intercepción del tráfico en un despliegue inseguro | Media | Alto | Alta |
| T-10 | Dependencias desactualizadas o vulnerables | Media | Alto | Alta |

Estas prioridades son estimaciones de diseño y deben ajustarse si cambia la arquitectura o se utilizan datos reales.

## 5. Controles y mitigaciones

| ID | Medida propuesta | Evidencia de implementación o verificación |
|---|---|---|
| T-01 | Validar tipos, enumeraciones, tamaños y formatos antes de procesar datos | `src/lib/security/` y `tests/security.spec.ts` |
| T-02 | Validar estructuras recuperadas del navegador y aplicar rechazo o recuperación segura | Pruebas con datos manipulados |
| T-03 | Mantener reglas de idempotencia, cola y resolución de conflictos | `src/lib/sync/`, `src/lib/storage/` y pruebas de integración |
| T-04 | Evitar interpretar como código los datos recibidos y definir una política CSP apropiada | Componentes, configuración Next.js y comprobación de encabezados |
| T-05 | Solicitar cada capacidad únicamente cuando una acción del usuario la requiera; manejar denegaciones | Módulos de dispositivo y pruebas |
| T-06 | Minimizar datos persistidos y revisar qué recursos conserva el Service Worker | Inventario de privacidad y estrategia de caché |
| T-07 | Configurar CSP, restricciones de permisos y encabezados HTTP acordes con la aplicación | Configuración de Next.js y respuesta HTTP |
| T-08 | Mantener credenciales fuera del repositorio y del código cliente; revisar archivos antes del commit | `.gitignore`, revisión del repositorio y CI |
| T-09 | Exigir HTTPS en despliegues reales; reservar HTTP local para desarrollo | Configuración y evidencia del entorno desplegado |
| T-10 | Revisar periódicamente el reporte de dependencias y documentar riesgos pendientes | Lockfile y resultados de auditoría |

Los controles anteriores son objetivos de Week 09. Su existencia efectiva deberá comprobarse con el código integrado y los resultados de pruebas, no únicamente con esta tabla.

## 6. Principios de mínimo privilegio

- No solicitar cámara, ubicación o notificaciones al cargar la aplicación sin necesidad funcional.
- Permitir que el usuario continúe cuando deniegue una capacidad opcional.
- Evitar registrar coordenadas, fotografías o información adicional si la inspección no las necesita.
- Limitar la información disponible en caché y almacenamiento al propósito declarado.
- No exponer configuraciones privadas en recursos enviados al navegador.
- Mantener los permisos de GitHub Actions restringidos a las operaciones necesarias.

## 7. Validación y comportamiento seguro

Los controles de validación deben trabajar en tiempo de ejecución. Los tipos de TypeScript ayudan durante el desarrollo, pero no garantizan la integridad de los datos externos.

La aplicación debe:

- Aceptar estructuras válidas y valores dentro de los límites definidos.
- Rechazar identificadores vacíos, estados desconocidos, valores incompatibles y estructuras inesperadas.
- Evitar que una entrada inválida provoque una excepción sin manejar.
- Tratar datos de almacenamiento alterados como no confiables.
- Impedir que un fallo de sincronización produzca duplicados o pérdida silenciosa de operaciones.

Las reglas concretas se ajustarán a los modelos reales del proyecto y se verificarán con pruebas positivas y negativas.

## 8. Política de contenido y transporte

Se propone configurar una Content Security Policy razonablemente restrictiva, junto con encabezados de seguridad adecuados.

Antes de cerrar la política se verificará su compatibilidad con Next.js, los recursos estáticos, el Service Worker y las capacidades utilizadas. No se considera seguro copiar una política genérica sin comprobar que la aplicación continúa funcionando.

En producción se requiere HTTPS. Los encabezados y la configuración de transporte deben comprobarse en las respuestas reales del despliegue.

El archivo `public/robots.txt` únicamente orienta a rastreadores que respetan sus directivas. No sustituye la autenticación ni la autorización.

## 9. Plan de pruebas y evidencia

| Riesgo | Prueba o verificación prevista | Resultado esperado |
|---|---|---|
| T-01 | Entradas válidas e inválidas | Aceptación o rechazo conforme al contrato |
| T-02 | Estructuras locales alteradas | Fallo controlado sin corrupción adicional |
| T-03 | Repetición de operaciones | Sin duplicados no deseados |
| T-04 y T-07 | Inspección de encabezados y rutas | Política de contenido y restricciones aplicadas |
| T-05 | Permiso denegado o API no disponible | Comportamiento alternativo seguro |
| T-06 | Revisión de almacenamiento y caché | Ausencia de información innecesaria |
| T-08 | Revisión del repositorio y CI | Sin credenciales incorporadas |
| T-09 | Comprobación del despliegue | Uso de HTTPS |
| T-10 | Auditoría de dependencias | Hallazgos documentados y priorizados |

Comandos de verificación previstos:

```bash
npm ci
npm run lint
npm test
npm run test:coverage
npm run build
npm run verify
```

`npm run verify` es el equivalente de verificación documentado por este proyecto. Los resultados solo se declararán aprobados cuando se ejecuten sobre el código correspondiente.

## 10. Riesgos residuales y limitaciones

- La PWA académica no demuestra una arquitectura completa de autenticación, autorización o administración institucional de usuarios.
- Los datos del navegador pueden ser alterados por personas con acceso al mismo dispositivo; el almacenamiento local no es una frontera de seguridad.
- El comportamiento offline puede conservar información desactualizada hasta que se resuelva la sincronización.
- La protección completa del transporte requiere verificar el entorno de despliegue.
- La política CSP reduce determinadas vías de ataque, pero no reemplaza la validación ni el manejo seguro de datos.
- El uso de datos sintéticos limita la exposición durante las pruebas, pero no acredita que el sistema esté preparado para información personal real.
- Las vulnerabilidades de dependencias deben evaluarse y documentarse antes de cualquier uso productivo.

