# Evidencia individual del equipo

> Un solo archivo compartido. Repitan la sección siguiente por cada integrante; cada persona escribe y explica su propia evidencia. Se aceptan evidencias previas equivalentes. El SHA final se entrega en Classroom después del último commit, para evitar modificar el commit que se está identificando.

- Grupo y equipo:
- Repositorio del equipo:

## Integrante: Reyes Torres Manelic Alitzel (MART)

- **Mi contribución concreta y enlace a archivo, commit anterior o revisión:** 
  Estructuración y documentación completa del archivo `README.md` (detallando propósito, comandos `npm ci`, `npm run dev`, `npm run verify` y limitaciones) y registro de evidencia individual.

- **Decisión que puedo explicar y por qué:** 
  Declarar explícitamente en el `README.md` las funcionalidades que aún no están implementadas (Service Worker, Manifest, Modo Offline, Sincronización, Notificaciones y Autenticación) para delimitar el alcance de la Semana 1 y evitar confusiones en la revisión.

- **Comando o prueba proporcionada que ejecuté:** 
  `npm ci`, `npm run dev` y `npm run verify`

- **Resultado real que observé:** 
  Visualización correcta de la PWA con las 3 inspecciones sintéticas en `http://localhost:3000`. Al ejecutar la prueba de verificación técnica se obtuvo la salida: `Verificación técnica: pass. Revisión académica: pendiente.`

- **Qué verifica esa prueba y qué no verifica:** 
  Verifica la presencia de la estructura base de archivos, la ejecución exitosa de `starter.spec.mjs` y la compilación con `next build`. No verifica instalación PWA, persistencia offline ni sincronización.

- **Limitación, dificultad o riesgo que identifiqué:** 
  Permisos iniciales en `/Users` (resueltos trabajando desde `~`). La aplicación actual no cuenta con soporte offline.

- **Uso de IA: herramienta, propósito, partes influenciadas y validación propia:** 
  Uso de IA para estructurar la documentación técnica según los lineamientos académicos; validado manualmente mediante la ejecución de comandos locales.