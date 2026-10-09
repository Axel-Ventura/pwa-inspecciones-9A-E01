# Evidencia individual

- **Estudiante:** Sánchez Ventura Axel Eduardo

- Commit SHA evaluado: 

-Decisión técnica que puedo explicar: Definí un contrato común para las capacidades del dispositivo mediante un resultado explícito de éxito o fallo (`ok/value` y `ok/reason`). Establecí que la cámara, la geolocalización y las notificaciones deben ser opcionales, solicitar permisos únicamente bajo una acción del usuario y mantener funcional el flujo principal mediante fallbacks.

- Prueba que ejecuté y resultado: Preparé `tests/capabilities.spec.ts` con pruebas para API no disponible, permisos concedidos o rechazados, errores de cámara, timeout de geolocalización y notificaciones. La ejecución final queda pendiente de integrar las implementaciones de los tres módulos y ejecutar la suite completa.

- Limitación o fallo diagnosticado: Las pruebas automatizadas utilizan APIs simuladas, por lo que no demuestran por sí solas el funcionamiento en dispositivos reales. Se requiere una comprobación manual en un navegador compatible para validar permisos y comportamiento real.

- Cambio que podría defender o modificar en vivo: Puedo modificar un caso de prueba para simular el rechazo de un permiso o la ausencia de una API y demostrar que el resultado es controlado y que el flujo principal puede continuar.

- Uso declarado de IA (herramienta, propósito, validación): Utilizado como apoyo para estructurar el contrato técnico, los casos de prueba y la documentación de capacidades. Revisaré y adaptaré las propuestas al código integrado y validaré el resultado ejecutando las pruebas, el build y los comandos de verificación del proyecto.




- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):





- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

