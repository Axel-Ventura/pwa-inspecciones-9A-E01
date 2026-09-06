# Requisitos del producto — documento del equipo

## 1. Problema y contexto

El proyecto busca apoyar el registro y seguimiento de inspecciones de mantenimiento realizadas en laboratorios. Durante una inspección es necesario consultar y registrar información relacionada con el laboratorio, la fecha de revisión y los hallazgos encontrados.

Una dificultad importante ocurre cuando la inspección se realiza en un lugar con conectividad intermitente. Si el funcionamiento del sistema depende completamente de una conexión estable, una interrupción puede dificultar el registro y seguimiento oportuno de la información.

El producto futuro busca proporcionar una aplicación accesible desde dispositivos de escritorio y móviles que permita consultar y registrar información de las inspecciones. Como parte de su evolución, se contempla que pueda continuar registrando información durante periodos sin conexión y sincronizarla posteriormente cuando se recupere la conectividad.

El alcance de esta semana se limita a conservar funcionando el starter y documentar los requisitos y la estrategia del producto. No se implementarán todavía almacenamiento offline, sincronización, notificaciones, autenticación ni otras funciones PWA.

El producto utilizará exclusivamente datos sintéticos para las pruebas y documentación del curso. No se utilizarán datos reales de estudiantes, credenciales ni información sensible.

## 2. Usuarios y escenarios

### Usuarios

El usuario principal será la persona encargada de realizar inspecciones y registrar información relacionada con el mantenimiento de los laboratorios.

De manera secundaria, el personal encargado del seguimiento de las inspecciones podrá consultar los registros disponibles para conocer la información registrada sobre los laboratorios.

### Escenario 1 — Consulta de inspecciones con conectividad

**Situación inicial:**  
La persona encargada necesita consultar las inspecciones realizadas y cuenta con una conexión disponible.

**Acción:**  
Abre la aplicación y consulta los registros de inspección disponibles, identificando el laboratorio correspondiente y la información registrada.

**Resultado esperado:**  
La aplicación muestra los registros disponibles de manera clara y permite identificar la información asociada a cada inspección.

### Escenario 2 — Registro durante conectividad intermitente

**Situación inicial:**  
La persona encargada se encuentra realizando una inspección en un laboratorio donde la conexión a Internet es intermitente o se pierde temporalmente.

**Acción:**  
Registra la información correspondiente a la inspección aunque no exista una conexión estable.

**Resultado esperado:**  
En una versión futura, la información queda conservada en el dispositivo y puede sincronizarse cuando se recupere la conexión.

Este escenario representa una capacidad futura del producto y no una funcionalidad que deba implementarse durante la Semana 1.

## 3. Requisitos funcionales

| ID | Acción del producto | Condición observable de aceptación | Ahora o futuro |
|---|---|---|---|
| RF-01 | Mostrar los registros sintéticos de inspecciones proporcionados por el starter | Al abrir la aplicación se muestran las tres inspecciones sintéticas disponibles | Semana 1 |
| RF-02 | Identificar el laboratorio asociado a cada inspección | Cada registro mostrado permite identificar el laboratorio correspondiente | Semana 1 |
| RF-03 | Consultar la información disponible de una inspección | Al consultar un registro se muestra la información correspondiente a esa inspección | Futuro |
| RF-04 | Registrar una nueva inspección | Al proporcionar datos válidos, el sistema crea un registro con los valores introducidos | Futuro |
| RF-05 | Conservar una inspección cuando no exista conexión | Al registrar datos sin conexión, la información permanece disponible para su posterior sincronización | Futuro |
| RF-06 | Sincronizar las inspecciones pendientes al recuperar la conexión | Cuando se recupera la conectividad, los registros pendientes se sincronizan sin perder la información registrada | Futuro |

Los requisitos RF-03 a RF-06 describen capacidades previstas para el producto futuro y no implican que deban estar implementadas durante la Semana 1.

## 4. Requisitos no funcionales

| ID | Condición | Método de comprobación | Momento de validación |
|---|---|---|---|
| RNF-01 — Reproducibilidad | El proyecto debe poder instalarse utilizando las dependencias fijadas por el lockfile | Ejecutar `npm ci` y posteriormente `npm run verify` desde una copia limpia del proyecto | Semana 1 |
| RNF-02 — Accesibilidad | Los elementos de la interfaz deben poder identificarse y utilizarse mediante mecanismos de interacción accesibles | Revisar la interfaz y realizar una comprobación de accesibilidad con las herramientas definidas por el equipo | Durante la implementación |
| RNF-03 — Seguridad | El repositorio no debe contener credenciales, tokens ni otros secretos | Revisar los archivos antes de cada entrega y comprobar que no existan archivos como `.env` con información sensible | Semana 1 y durante el desarrollo |
| RNF-04 — Privacidad | Los datos utilizados durante el desarrollo y las pruebas deben ser exclusivamente sintéticos | Revisar los datos incluidos en la aplicación y documentación antes de cada entrega | Semana 1 y durante el desarrollo |
| RNF-05 — Rendimiento | El listado de inspecciones deberá mostrar los registros dentro de un tiempo definido bajo condiciones de prueba documentadas | Medir el tiempo de carga utilizando una cantidad definida de registros sintéticos y un dispositivo de referencia en varias ejecuciones | Durante la implementación futura |
| RNF-06 — Operación offline futura | El sistema deberá conservar los registros creados sin conexión y permitir su posterior sincronización | Desactivar la conexión, registrar una inspección, recuperar la conexión y comprobar que el registro se sincroniza correctamente | Cuando se implemente la funcionalidad offline |

Los umbrales específicos de rendimiento y las condiciones de prueba deberán definirse antes de realizar las mediciones correspondientes. Las metas futuras no se consideran mediciones realizadas durante la Semana 1.

## 5. Datos sintéticos y límites

La aplicación utilizará datos ficticios para representar las inspecciones de los laboratorios. Entre los datos sintéticos se incluyen nombres de laboratorios, información de inspecciones, fechas y hallazgos utilizados para representar el funcionamiento del producto.

Los datos reales de estudiantes, nombres personales innecesarios, teléfonos, direcciones, credenciales, contraseñas, tokens y cualquier otra información sensible quedan excluidos del proyecto.

La identificación académica de los integrantes del equipo se registrará únicamente en el repositorio privado y en las entregas correspondientes de Classroom.

El alcance de esta semana tampoco incluye la implementación de almacenamiento offline, sincronización, autenticación, notificaciones ni otras capacidades PWA que serán desarrolladas o evaluadas en semanas posteriores.

## 6. Criterios de aceptación de la Semana 1

| Entrega | Criterio de aceptación | Inspección o comando de comprobación |
|---|---|---|
| Instalación reproducible | Las dependencias del proyecto se instalan correctamente utilizando las versiones y el lockfile declarados | `npm ci` |
| Starter funcionando | La aplicación inicia correctamente y muestra las tres inspecciones sintéticas proporcionadas | `npm run dev` y revisión de `http://localhost:3000` |
| Prueba proporcionada | La prueba incluida en el starter termina correctamente | `npm run verify` |
| Build | El proyecto compila correctamente como parte de la verificación | `npm run verify` |
| Requisitos | El documento contiene un problema, usuarios, escenarios y requisitos funcionales y no funcionales verificables | Revisión de `docs/requirements.md` |
| Decisión de producto | La comparación analiza PWA, web tradicional, aplicación nativa y multiplataforma y justifica la estrategia seleccionada | Revisión de `docs/decision-record.md` |
| Evidencia individual | Cada integrante documenta su contribución, ejecución, resultado, limitación y uso de IA | Revisión de `evidence/individual.md` |

Las comprobaciones técnicas permiten verificar aspectos concretos del proyecto, pero no determinan por sí mismas la calidad del análisis de requisitos o de la decisión arquitectónica. Estos aspectos requieren revisión del contenido de los documentos.

El comando `npm run verify` genera `reports/verification.json` y comprueba la prueba proporcionada y la compilación, pero su resultado técnico no constituye una calificación ni demuestra por sí solo que los requisitos o el análisis académico sean correctos.