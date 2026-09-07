# Evidencia individual del equipo

> Un solo archivo compartido. Repitan la sección siguiente por cada integrante; cada persona escribe y explica su propia evidencia. Se aceptan evidencias previas equivalentes. El SHA final se entrega en Classroom después del último commit, para evitar modificar el commit que se está identificando.

- Grupo y equipo: 10 - 10
- Repositorio del equipo: 

## Integrante: [Axel Eduardo Sánchez Ventura]

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:
  Preparé la documentación de requisitos del producto en `docs/requirements.md`, incluyendo el problema y contexto, usuarios y escenarios, requisitos funcionales, requisitos no funcionales, datos sintéticos, límites y criterios de aceptación de la Semana 1.

- Decisión que puedo explicar y por qué:
  Definí los requisitos considerando que la conectividad intermitente es una restricción importante del escenario. Por ello, se documentó como requisito futuro la posibilidad de conservar información sin conexión y sincronizarla posteriormente, sin afirmar que esta funcionalidad ya esté implementada en la Semana 1.

- Comando o prueba proporcionada que ejecuté:
  `npm ci`
  
  `npm run dev`
  
  `npm run verify`

- Resultado real que observé:
  `npm ci` terminó correctamente y se instalaron las dependencias del proyecto.

  `npm run dev` inició correctamente el servidor de Next.js en `http://localhost:3000` y la aplicación mostró las tres inspecciones sintéticas.

  `npm run verify` ejecutó la prueba proporcionada y posteriormente realizó el build. La prueba terminó con `starter.spec.mjs: PASS`, la compilación terminó con `✓ Compiled successfully` y finalmente se obtuvo `Verificación técnica: pass`. También se generó `reports/verification.json`.

- Qué verifica esa prueba y qué no verifica:
  La verificación comprueba que la prueba proporcionada por el starter pasa y que el proyecto puede compilarse correctamente. También permite obtener un reporte técnico de la ejecución.

  No verifica la calidad del análisis de requisitos, la justificación de la estrategia PWA, la implementación de funcionalidades offline o sincronización futuras, ni garantiza por sí sola la ausencia de todos los posibles problemas de seguridad o secretos.

- Limitación, dificultad o riesgo que identifiqué:
  Una limitación de esta verificación es que un resultado técnico `pass` no significa que toda la actividad esté correctamente evaluada. La documentación y la decisión sobre la estrategia del producto requieren revisión académica. Además, las funcionalidades offline y sincronización todavía no forman parte de la implementación de esta semana.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia (o «no utilicé IA»):
  Utilicé ChatGPT como apoyo para organizar y redactar propuestas para la documentación de requisitos de la actividad. La IA influyó en la estructura y redacción de `docs/requirements.md`. Revisé el contenido manualmente y comprobé que correspondiera con las instrucciones de la actividad y con el funcionamiento real del starter.


## Integrante: Paniagua González Concepción Guadalupe

- Mi contribución concreta y enlace a archivo, commit anterior o revisión: Redacté el documento decision-record.md: estado y fecha, contexto y restricciones, comparación de las cuatro alternativas (PWA, web tradicional, app nativa y multiplataforma), la decisión, consecuencias, riesgos y validación futura. Archivo en el que trabaje: docs/decision-record.md.
- Decisión que puedo explicar y por qué: Descarté la app nativa porque se requeriría tanto para iOS como para Android, duplicando el trabajo de desarrollo, y ese tiempo no se ajusta a las 14 semanas que tenemos para trabajar. Además de que debía de ser publicada en tiendas de aplicaciones.
- Comando o prueba proporcionada que ejecuté: npm run verify
- Resultado real que observé: starter.spec.mjs: PASS. Next.js compiló correctamente (4/4). Resultado final fue: "Verificación técnica: pass. Revisión académica: pendiente. Reporte: reports/verification.json"
- Qué verifica esa prueba y qué no verifica: Verifica que existan ciertos archivos, que el test pase y que el proyecto compile sin errores. No verifica el contenido de los documentos y si hay datos reales que estan expuestos
- Limitación, dificultad o riesgo que identifiqué: Esta semana no se implementó ninguna funcionalidad, entonces las decisiones documentadas no se pueden comprobar con una prueba real
- Uso de IA: herramienta, propósito, partes influenciadas y validación propia (o «no utilicé IA»): Si utilicé IA, como apoyo para poder redactar mis ideas de forma que fueran claras y entendibles, pero no solo copié y pegué, lo ajusté a mis propias palabras y verifiqué que coincidiera con lo definido en requirements.md





> No necesitan inventar un error ni escribir pruebas nuevas. «Ejecuté npm test» es insuficiente como explicación: indiquen qué observa la prueba y qué comportamiento queda fuera.
