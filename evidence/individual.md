# Evidencia individual del equipo

> Un solo archivo compartido. Repitan la sección siguiente por cada integrante; cada persona escribe y explica su propia evidencia. Se aceptan evidencias previas equivalentes. El SHA final se entrega en Classroom después del último commit, para evitar modificar el commit que se está identificando.

- Grupo y equipo:
- Repositorio del equipo:

## Integrante: Reyes Torres Manelic Alitzel 

- **Mi contribución concreta y enlace a archivo, commit anterior o revisión:** 
  Estructuración y documentación completa del archivo `README.md` (detallando propósito, comandos de ejecución `npm ci`, `npm run dev`, `npm run verify` y limitaciones del proyecto) y registro de evidencia individual para la entrega de la Semana 1.

- **Decisión que puedo explicar y por qué:** 
  Declarar explícitamente en el `README.md` las funcionalidades que aún no han sido implementadas (Service Worker, Manifest, Modo Offline, Sincronización, Notificaciones y Autenticación). Decidí estipularlas para delimitarlas con claridad como alcance de entregas académicas futuras y evitar confusiones en la revisión de la versión actual.

- **Comando o prueba proporcionada que ejecuté:** 
  `npm ci`, `npm run dev` y `npm run verify`

- **Resultado real que observé:** 
  Visualización correcta de la PWA con las 3 inspecciones sintéticas en `http://localhost:3000`. Al ejecutar la prueba de verificación técnica se obtuvo la salida: `Verificación técnica: pass. Revisión académica: pendiente.`

- **Qué verifica esa prueba y qué no verifica:** 
  Verifica la presencia de la estructura base de archivos requerida, la ejecución exitosa de la suite inicial `starter.spec.mjs` y la compilación correcta del proyecto mediante `next build`. No verifica comportamientos avanzados como la instalación en dispositivos, la persistencia offline de datos ni la sincronización en segundo plano.

- **Limitación, dificultad o riesgo que identifiqué:** 
  Conflicto inicial de permisos al clonar en el directorio `/Users` del entorno Mac, resuelto al ubicarse dentro del directorio personal `~`. Asimismo, el starter actual carece de soporte PWA offline.

- **Uso de IA: herramienta, propósito, partes influenciadas y validación propia:** 
  Uso de IA para estructurar y redactar la documentación técnica del `README.md` y la evidencia individual según los lineamientos académicos; validado manualmente mediante la ejecución de los comandos locales en la terminal.