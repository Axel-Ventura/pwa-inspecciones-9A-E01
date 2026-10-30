# Week 09 — Inventario de datos y privacidad

## 1. Propósito

Este documento identifica las categorías de información utilizadas por la PWA de inspecciones y mantenimiento de laboratorios de la Universidad Tecnológica de Tehuacán, sus finalidades, lugares de tratamiento y medidas de minimización.

La implementación académica trabaja exclusivamente con datos sintéticos. No está autorizada para almacenar información real de estudiantes, trabajadores ni otras personas.

El inventario describe el alcance previsto y señala los aspectos que deben verificarse contra el código antes de considerarse definitivos.

## 2. Alcance y clasificación

Se distinguen tres clases de información:

- **Datos sintéticos de inspección:** registros y ejemplos ficticios usados para demostrar funcionalidades.
- **Datos técnicos de funcionamiento:** identificadores internos, estados, versiones, operaciones pendientes y metadatos necesarios para la sincronización.
- **Datos opcionales del dispositivo:** fotografías, ubicación o capacidades de notificación, sujetos a una necesidad funcional y a una acción autorizada por el usuario.

Aunque se utilicen ejemplos ficticios, se aplican principios de minimización y tratamiento seguro como ejercicio de ingeniería.

## 3. Inventario de datos

| Categoría | Ejemplos | Finalidad | Ubicación o tratamiento | Clasificación |
|---|---|---|---|---|
| Inspecciones | Identificador, laboratorio, descripción y estado | Visualizar y gestionar inspecciones | Aplicación y persistencia según implementación | Sintética |
| Estados de mantenimiento | Pendiente, en proceso o completado, según el modelo real | Representar avance | Aplicación y almacenamiento local | Sintética |
| Operaciones de sincronización | Identificador, tipo de operación y estado de envío | Gestionar conectividad intermitente | Cola y persistencia del navegador | Técnica |
| Metadatos de conflictos | Versiones, marcas de actualización o reglas de resolución | Detectar y resolver cambios incompatibles | Módulos de sincronización | Técnica |
| Recursos offline | Páginas y archivos necesarios para funcionamiento desconectado | Mantener disponibilidad | Caché del navegador y Service Worker | Técnica |
| Cámara | Imagen capturada, si el flujo la conserva | Documentar una inspección, cuando sea necesario | Acceso temporal o almacenamiento según código | Opcional |
| Geolocalización | Coordenadas, si el usuario las proporciona | Asociar ubicación a una operación justificada | Memoria o persistencia según código | Opcional y potencialmente personal |
| Notificaciones | Estado de autorización y mensajes de interfaz | Informar eventos relevantes | Navegador y sistema operativo | Técnica u opcional |

La existencia exacta de cada campo, así como su retención efectiva, deberá contrastarse con los módulos del proyecto. No se asume que todos los datos opcionales sean almacenados.

## 4. Finalidad y minimización

La finalidad principal es demostrar el registro y consulta de inspecciones de laboratorios, la persistencia durante interrupciones de conectividad y la recuperación posterior.

Se aplican los siguientes criterios:

1. Recolectar únicamente los campos necesarios para la operación demostrada.
2. Utilizar valores ficticios en datos de prueba, ejemplos y reportes.
3. Evitar nombres reales, matrículas, teléfonos, correos personales y documentos de identidad.
4. No conservar imágenes ni coordenadas cuando la función pueda realizarse sin ellas.
5. No incorporar contenido de inspecciones en mensajes de error o registros de depuración cuando sea innecesario.
6. Limitar la exposición de información en notificaciones.

La minimización debe comprobarse en las funciones reales y no solo en los ejemplos de prueba.

## 5. Ciclo de vida de la información

| Etapa | Tratamiento previsto | Medida de privacidad |
|---|---|---|
| Generación | Creación de ejemplos ficticios o datos de prueba | Evitar identificadores personales reales |
| Entrada | Captura o modificación de datos | Validación de tipos, límites y campos |
| Uso | Renderizado y operación de inspecciones | Mostrar únicamente información necesaria |
| Persistencia | Conservación para funcionamiento offline | Validar lo almacenado al recuperarlo |
| Sincronización | Procesamiento de operaciones pendientes | Control de duplicados y conflictos |
| Caché | Almacenamiento temporal de recursos offline | Evitar retención innecesaria de información |
| Eliminación | Limpieza de datos según el comportamiento implementado | Revisar mecanismos de borrado y su alcance |

## 6. Acceso y permisos

Las capacidades del dispositivo deben utilizarse con mínimo privilegio:

- La cámara solo debe solicitarse cuando el usuario inicie una acción que la necesite.
- La ubicación debe ser opcional cuando la operación pueda completarse sin ella.
- Las notificaciones requieren una solicitud explícita cuando corresponda.
- La denegación de una capacidad opcional no debe bloquear funciones independientes.
- La interfaz debe explicar el motivo de una solicitud de permiso.

Las funciones actuales deberán revisarse para confirmar este comportamiento y registrar las pruebas realizadas.

## 7. Almacenamiento local, sincronización y caché

El almacenamiento del navegador facilita el funcionamiento desconectado, pero presenta riesgos:

- Una persona con acceso al dispositivo podría consultar o modificar datos locales.
- Una entrada persistida puede tener un formato inesperado.
- La cola de sincronización puede conservar operaciones antiguas.
- El Service Worker puede mantener recursos desactualizados.

Medidas propuestas:

- Validar toda información recuperada antes de utilizarla.
- Mantener pruebas de integridad, idempotencia y resolución de conflictos.
- Minimizar el contenido conservado y documentar su ciclo de vida.
- Evitar guardar información personal real en la versión académica.
- Revisar la limpieza de datos y el comportamiento ante errores de persistencia.

El almacenamiento local no debe considerarse equivalente a cifrado ni a control de acceso.

## 8. Conservación y eliminación

No se establece un plazo institucional de conservación porque el proyecto utiliza información ficticia y no dispone de una política formal de tratamiento de datos reales.

Para el prototipo:

- La permanencia de los registros depende del mecanismo de almacenamiento implementado.
- Los recursos de caché pueden persistir hasta su invalidación o limpieza.
- Los permisos concedidos se administran desde las opciones del navegador o del sistema.
- La eliminación local no garantiza, por sí sola, la eliminación de información que pudiera existir en otros dispositivos.

Antes de utilizar información real, la institución responsable tendría que definir plazos, procedimientos de supresión, responsables y reglas de conservación.

## 9. Controles técnicos relacionados

| Objetivo | Control o evidencia |
|---|---|
| Evitar entradas inválidas | `src/lib/security/` y `tests/security.spec.ts` |
| Mantener integridad offline | `src/lib/storage/` y `src/lib/sync/` |
| Reducir exposición por contenido web | Configuración de CSP y encabezados HTTP |
| Limitar permisos | Módulos de cámara, ubicación y notificaciones |
| Revisar recursos conservados | Service Worker y estrategia de caché |
| Evitar publicación accidental de credenciales | Exclusiones del repositorio y revisión automatizada |
| Mantener trazabilidad | Pruebas, reportes y GitHub Actions |


## 10. Riesgos y limitaciones

- El modelo académico no sustituye un aviso de privacidad institucional.
- No se ha establecido una política institucional de conservación o supresión.
- Las capacidades del dispositivo pueden ofrecer información sensible si se utilizan con personas reales.
- Un navegador compartido incrementa el riesgo de acceso a datos persistidos.
- No se acredita un mecanismo de autenticación y autorización institucional.
- La configuración de transporte debe revisarse en el despliegue real.
- Los resultados de las pruebas no sustituyen una evaluación integral de privacidad.

