# Decisión de Estrategia de Renderizado: CSR vs SSR

En este documento se detalla la decisión arquitectónica sobre la estrategia de renderizado utilizada en las distintas rutas del proyecto de inspecciones.

---

## Conceptos Generales

### ¿Qué es CSR (Client-Side Rendering)?
CSR es una técnica donde el servidor entrega al navegador un archivo HTML mínimo junto con los archivos de JavaScript del proyecto. El navegador descarga y ejecuta este JavaScript para construir e renderizar la interfaz de usuario directamente en el cliente.

### ¿Qué es SSR (Server-Side Rendering)?
SSR es una técnica donde el servidor procesa la lógica de la página, obtiene los datos necesarios y genera el HTML completo para cada petición. Luego, envía este HTML estructurado al navegador, permitiendo una carga inicial visible de forma inmediata.

---

## Aplicación de Estrategias en las Rutas del Proyecto

### Ruta con CSR: `/inspecciones`
* **Estrategia utilizada:** Client-Side Rendering (CSR).
* **Por qué se eligió:** La lista general de inspecciones requiere interactividad del lado del cliente (como filtros, búsquedas o paginación) y no necesita optimización avanzada para motores de búsqueda (SEO) al ser un panel interno/operativo. Cargar el cascarón de la página y luego renderizar la lista permite una navegación fluida dentro de la aplicación.

### Ruta con SSR: `/inspecciones/[id]`
* **Estrategia utilizada:** Server-Side Rendering (SSR).
* **Por qué se eligió:** El detalle de una inspección específica requiere que los datos estén disponibles desde el primer renderizado en el servidor. Esto permite pre-cargar la información relevante antes de entregar la respuesta al cliente, asegurando un acceso directo a recursos específicos mediante su identificador.

---

## Ventajas y Limitaciones

### CSR (Lista de Inspecciones)
* **Ventajas:** 
  * Reduce la carga del servidor al delegar el renderizado al cliente.
  * Proporciona transiciones y navegación más rápidas entre vistas tras la carga inicial.
* **Limitaciones:** 
  * Carga inicial potencialmente más lenta mientras se descarga y ejecuta el JavaScript.
  * Indexación SEO reducida si no se combina con pre-renderizado.

### SSR (Detalle de Inspección)
* **Ventajas:** 
  * Visualización rápida del contenido relevante desde la primera respuesta del servidor.
  * Mejor indexación SEO y fácil generación de metadatos dinámicos por ID.
* **Limitaciones:** 
  * Mayor consumo de recursos y latencia en el servidor por cada petición recibida.
  * Posible retraso en la interactividad total mientras se completa el proceso de hidratación en el cliente.

---

## Manejo de Estados de Carga y Error

* **Estados de Carga (Loading):** 
  * En CSR (`/inspecciones`), se muestran indicadores visuales de carga (skeletons o spinners) en el cliente mientras se procesan e insertan los datos en la vista.
  * En SSR (`/inspecciones/[id]`), la carga ocurre durante el procesamiento en el servidor antes de responder al cliente.
* **Estados de Error:**
  * Si un ID no existe o no se encuentra el recurso en `/inspecciones/[id]`, se renderiza una vista de error adecuada (ejemplo: estado de recurso no encontrado o error 404).
  * En la lista (`/inspecciones`), las fallas de carga se capturan en el cliente para mostrar un mensaje descriptivo sin romper la interfaz.

---

## Fuente de Datos y Perspectivas Futuras

* **Uso de Datos Sintéticos:** Actualmente, el proyecto utiliza datos estáticos/sintéticos almacenados de manera local para simular la información de las inspecciones.
* **Cambios Posteriores con API/Base de Datos:**
  * Al conectar una API o base de datos real, la lista en CSR realizará peticiones `fetch`/`axios` hacia los endpoints correspondientes para obtener datos dinámicos.
  * La vista SSR (`/inspecciones/[id]`) realizará la consulta a la base de datos o API desde el servidor (`getServerSideProps` o Fetch en Server Components) en cada solicitud para garantizar que la información de la inspección esté siempre actualizada.