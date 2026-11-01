## Integrante: Reyes Torres Manelic Alitzel

- Estudiante: Reyes Torres Manelic Alitzel - 3523110736

- Commit SHA evaluado: [PEGA_AQUÍ_EL_SHA_DE_TU_COMMIT]

- Decisión técnica que puedo explicar:
  Creé e implementé la configuración de exclusión de rastreo en `public/robots.txt` utilizando la directiva conservadora `User-agent: *` y `Disallow: /inspecciones`. Opté por restringir a todos los motores de búsqueda el acceso a las rutas de inspecciones (`/inspecciones` y sus rutas dinámicas `/inspecciones/[id]`) considerando que se trata de un prototipo académico con datos sintéticos y de uso exclusivamente interno. Esta directiva actúa como una solicitud explícita de no indexación para buscadores que respetan el protocolo SEO, evitando exponer URLs operativas en motores de búsqueda sin interferir con la entrega de recursos estáticos de la PWA.

- Prueba que ejecuté y resultado:
  Inicié el servidor de desarrollo local con `npm run dev` y verifiqué la entrega del archivo mediante la terminal consultando `curl -I http://localhost:3000/robots.txt`. El resultado fue exitoso obteniendo un código de estado `HTTP/1.1 200 OK` y el encabezado `Content-Type: text/plain; charset=UTF-8` con un tamaño de respuesta consistente (`38 bytes`). Posteriormente ejecuté `npm run build` para validar el empaquetado de producción de Next.js, confirmando que las rutas de la PWA y los archivos estáticos dentro de `public/` se compilan e integran correctamente sin generar advertencias ni errores en el servidor.

- Limitación o fallo diagnosticado:
  Durante las pruebas iniciales se obtuvo un error `HTTP 404 Not Found` al realizar la petición `curl`. Se diagnosticó que el servidor en caliente de Next.js no detecta automáticamente la creación de la carpeta `public` o de nuevos archivos estáticos si este ya se encuentra en ejecución, además de requerir la ubicación exacta del archivo en la raíz del directorio de distribución pública (`public/robots.txt`). El fallo se resolvió reiniciando el proceso del servidor de desarrollo. Asimismo, se diagnosticó que `robots.txt` no es un mecanismo de seguridad ni reemplaza el control de acceso: los usuarios o rastreadores no éticos aún pueden acceder directamente a la URL `/inspecciones` si la conocen, por lo que no sustituye un sistema de autenticación ni los controles de la capa de seguridad.

- Cambio que podría defender o modificar en vivo:
  Puedo explicar y defender las diferencias entre las políticas de indexación SEO (`robots.txt`) y las restricciones de acceso por autenticación en Next.js. En vivo puedo modificar el archivo para agregar directivas específicas por agente (ej. `User-agent: Googlebot`), excluir nuevas rutas privadas que se incorporen en carpetas secundarias, o permitir explícitamente el rastreo de recursos o imágenes públicas mediante la directiva `Allow:`.

- Uso declarado de IA (herramienta, propósito, validación):
  Utilicé Gemini como asistente técnico para determinar la política de exclusión conservadora en `robots.txt`, depurar el error de ruta no encontrada (`404 Not Found`) servida por Next.js y estructurar el flujo de comandos de Git para enviar el Pull Request a la rama `dev`. La solución fue validada manualmente en el entorno local verificando el código `HTTP 200 OK` mediante `curl -I http://localhost:3000/robots.txt` y ejecutando `npm run build`.
  