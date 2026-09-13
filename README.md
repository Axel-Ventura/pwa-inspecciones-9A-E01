# PWA de inspecciones de laboratorio — Proyecto del Equipo

Comiencen por `START_HERE.md` y lean `ACTIVIDAD-01.md`. Este es un proyecto acumulativo: un repositorio privado por equipo durante el curso. La Semana 1 consiste en arrancar, documentar y explicar la verificación; no en implementar toda la PWA.

## ¿Qué es el proyecto y problema que aborda?
Es una Progressive Web App (PWA) diseñada para el registro, consulta y seguimiento de inspecciones técnicas en laboratorio e instalaciones universitarias. Resuelve la falta de un sistema digitalizado para el levantamiento de inspecciones en campo, permitiendo a los inspectores visualizar el estado de las revisiones y coordinar atenciones técnicas.

> **Nota sobre los datos:** Este proyecto utiliza **datos sintéticos** preparados exclusivamente con fines académicos de prueba.

## Entorno y Requisitos
- **Node.js:** v22.x (compatible con Node 20.19 o posterior)
- **npm:** v10.x u posterior
- Git y cuenta de GitHub. No se requiere Make.

## Instalación e Inicio Rápido

1. **Instalar dependencias:**
   ```bash
   npm ci
   ```

2. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## Verificación y Pruebas (Semana 2)

### Ejecución de Pruebas Unitarias
Para ejecutar la validación automatizada del manifest PWA:
```bash
npm run test
```

### Comando de Verificación Completa
```bash
make verify
```

### Evidencia de las Pruebas
Al ejecutar `npm run test`, se valida la estructura del manifiesto web y la presencia de sus artefactos:
```text
 PASS  tests/manifest.spec.ts
  Pruebas de Manifest PWA - Semana 2
    ✓ El archivo manifest debe existir en la carpeta public/
    ✓ El manifest debe ser un JSON bien formado
    Validación de campos requeridos del Manifest
      ✓ Debe contener todos los campos principales requeridos
      ✓ Coherencia de instalación: start_url debe estar dentro del scope
      ✓ Los iconos declarados deben existir físicamente en la carpeta public/
```

## Supuestos
- El archivo del manifiesto (`manifest.webmanifest` o `manifest.json`) está alojado en `public/`.
- Los recursos gráficos declarados en la propiedad `icons` existen dentro de la carpeta `public/`.

## Limitaciones Relevantes (Semana 2)
- Las pruebas automáticas verifican la validez del manifiesto y la existencia de los recursos en tiempo de compilación. La instalación PWA real en pantalla de inicio y la sincronización offline mediante Service Worker deben comprobarse manualmente en el navegador.
