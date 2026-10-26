# Contrato de pruebas - Documentación de Pruebas y Proyecto

## Resumen de Avances por Semana

* **Semana 1:** Configuración inicial del entorno de trabajo, estructura base del repositorio e instalación de dependencias del proyecto.
* **Semana 2:** Creación de los primeros componentes visuales e integración de rutas base para la navegación.
* **Semana 3:** Implementación de la gestión de estado local, estructuración de datos sintéticos y maquetación de vistas principales.
* **Semana 4:** Separación de estrategias de renderizado (CSR para la lista de inspecciones y SSR para el detalle de inspección), manejo de estados de carga/error y documentación de pruebas.

## Semana 8 — Pirámide de pruebas e integración continua

### Objetivo

Validar el comportamiento crítico de la PWA mediante pruebas unitarias, de integración y End-to-End (E2E), utilizando exclusivamente datos sintéticos.

La estrategia de selección, los riesgos y las limitaciones se documentan en `docs/test-strategy.md`.

### Herramientas

- Node.js 22.x
- npm
- Next.js 14
- TypeScript y `tsx`
- `node:test` para pruebas unitarias y de integración
- Playwright con Chromium para pruebas E2E
- ESLint para análisis estático
- GitHub Actions para automatización

### Instalación

Desde la raíz del repositorio:

```bash
npm ci
```

### Comandos de verificación

| Comando | Función |
|---|---|
| `npm run lint` | Comprobar reglas de ESLint |
| `npm run test:legacy` | Ejecutar pruebas acumuladas de semanas anteriores |
| `npm run test:unit` | Ejecutar pruebas unitarias |
| `npm run test:integration` | Ejecutar pruebas de integración |
| `npm test` | Ejecutar regresión acumulada, unitarias e integración |
| `npm run test:coverage` | Generar cobertura en `coverage/lcov.info` |
| `npm run build` | Compilar la aplicación |
| `npm run verify` | Ejecutar pruebas, build y generar `reports/verification.json` |

`npm run verify` es el equivalente documentado de `make verify` para el entorno Windows del equipo.

### Pruebas E2E

Las pruebas E2E se encuentran en `tests/e2e/` y utilizan Playwright.

Después de instalar las dependencias y generar el build:

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright inicia automáticamente el servidor de la aplicación conforme a `playwright.config.ts`.

Estas pruebas verifican el listado de inspecciones, los filtros, la navegación al detalle, el regreso al listado y el comportamiento ante identificadores inexistentes.

### Reportes

Los resultados se generan mediante herramientas de prueba y no se crean manualmente:

- `coverage/lcov.info`: cobertura de las pruebas unitarias y de integración.
- `test-results/report.json`: resultados de Playwright.
- `playwright-report/`: reporte HTML de Playwright.
- `reports/verification.json`: resultado de la verificación técnica acumulada.

Los reportes generados localmente se excluyen de Git y pueden publicarse como artefactos de GitHub Actions.

### Fallo diagnosticado y corregido

Se identificó que la implementación original de `addPendingOperation()` podía guardar varias operaciones con el mismo `operationId`.

Se implementó una prueba de regresión para detectar duplicados y posteriormente se corrigió el comportamiento.

La evidencia del resultado anterior a la corrección, el commit correspondiente y la ejecución posterior deben registrarse en `docs/test-strategy.md` y en la evidencia individual. No se debe presentar una salida fallida como comprobada si no se conserva evidencia de su ejecución.

### Limitaciones

- Las pruebas utilizan exclusivamente datos sintéticos.
- La persistencia se comprueba mediante almacenamiento local simulado.
- No se utiliza un backend privado.
- Las pruebas E2E requieren Chromium y una compilación previa.
- La cobertura reportada corresponde a los archivos ejecutados, no a toda la PWA.
- Los resultados públicos y formativos no sustituyen la evaluación privada del profesor.


---

## Instrucciones de Instalación y Ejecución

### 1. Instalación de dependencias
Para instalar exactamente las dependencias del proyecto mediante el archivo de bloqueo (`package-lock.json`), ejecuta:
```bash
npm ci