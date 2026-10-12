# Evidencia individual

- **Estudiante:** Sánchez Ventura Axel Eduardo

- Commit SHA evaluado: 

-Decisión técnica que puedo explicar: Definí un contrato común para las capacidades del dispositivo mediante un resultado explícito de éxito o fallo (`ok/value` y `ok/reason`). Establecí que la cámara, la geolocalización y las notificaciones deben ser opcionales, solicitar permisos únicamente bajo una acción del usuario y mantener funcional el flujo principal mediante fallbacks.

- Prueba que ejecuté y resultado: Preparé `tests/capabilities.spec.ts` con pruebas para API no disponible, permisos concedidos o rechazados, errores de cámara, timeout de geolocalización y notificaciones. La ejecución final queda pendiente de integrar las implementaciones de los tres módulos y ejecutar la suite completa.

- Limitación o fallo diagnosticado: Las pruebas automatizadas utilizan APIs simuladas, por lo que no demuestran por sí solas el funcionamiento en dispositivos reales. Se requiere una comprobación manual en un navegador compatible para validar permisos y comportamiento real.

- Cambio que podría defender o modificar en vivo: Puedo modificar un caso de prueba para simular el rechazo de un permiso o la ausencia de una API y demostrar que el resultado es controlado y que el flujo principal puede continuar.

- Uso declarado de IA (herramienta, propósito, validación): Utilizado como apoyo para estructurar el contrato técnico, los casos de prueba y la documentación de capacidades. Revisaré y adaptaré las propuestas al código integrado y validaré el resultado ejecutando las pruebas, el build y los comandos de verificación del proyecto.




- **Estudiante:** Paniagua González Concepción Guadalupe
- Commit SHA evaluado: 
- Decisión técnica que puedo explicar: En camera.ts y geolocation.ts, las funciones no lanzan errores. Si algo sale mal (el usuario dice que no, el navegador no tiene la función o hay una falla), regresan un resultado con ok: false y una razón, y si todo sale bien regresan ok: true con el dato. Esto es así porque la cámara y la ubicación son opcionales: si fallan, la inspección debe poder seguir sin ellas. La cámara solo pide video y que la ubicación devuelva únicamente latitud y longitud, para no guardar datos de mas
- Prueba que ejecuté y resultado: `npm run build` compiló sin errores. Revisé que el código no tuviera throw ni devolviera datos extra de ubicación. Probé en Chrome con localhost: al bloquear la cámara salió el error NotAllowedError, y en ubicación al permitir salieron coordenadas y al bloquear salió el código 1 de permiso denegado. Las pruebas de tests/capabilities.spec.ts quedan pendientes hasta integrar el client.ts del otro integrante 
- Limitación o fallo diagnosticado: Las pruebas usan APIs simuladas, así que no demuestran que la cámara y la ubicación funcionen en un dispositivo real; eso requiere una prueba manual en el navegador
- Cambio que podría defender o modificar en vivo: Podría explicar por qué la ubicación devuelve solo latitud y longitud. El navegador puede entregar más datos, como altitud, velocidad y rumbo, pero el código solo toma la latitud y la longitud y deja fuera los demás, porque no hacen falta para la inspección y guardarlos sería recolectar datos de mas que no son requeridos
- Uso declarado de IA (herramienta, propósito, validación): Usé IA para escribir el código de camera.ts y geolocation.ts. Yo lo guardé en el proyecto, comprobé que cumpliera lo que pide la especificación y lo validé con npm run build y con pruebas manuales en Chrome





- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

