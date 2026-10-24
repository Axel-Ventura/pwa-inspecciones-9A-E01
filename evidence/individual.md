# Evidencia individual

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

# Evidencia individual

- Estudiante: Paniagua González Concepción Guadalupe
- Commit SHA evaluado: 
- Decisión técnica que puedo explicar: Entiendo que las pruebas unitarias revisan cada parte por separado (la cola, la política de conflictos y el almacenamiento), y que la de integración las prueba juntas. Para eso se uso un localStorage simulado que se comparte entre "recargas": cada new SyncQueue() representa abrir la aplicación otra vez, y así se comprueba que los datos siguen guardados.
- Prueba que ejecuté y resultado: Primero corrí mis pruebas contra el código original y salieron 34 pruebas: 33 pasan y 1 falla. La que falla es "addPendingOperation no duplica la misma operación" (2 !== 1), que demostró el defecto. Después de corregirlo con autorización, volví a correr npm test y pasaron las 34, y npm run build compiló sin errores.
- Limitación o fallo diagnosticado: Las pruebas usan un localStorage simulado, no un navegador real, así que no demuestran el comportamiento en un dispositivo. El defecto que encontré fue que addPendingOperation() guardaba dos veces la misma operación, lo corregí agregando una revisión por operationId antes de guardar.
- Cambio que podría defender o modificar en vivo: Puedo explicar el arreglo de addPendingOperation(): antes de guardar una operación, se revisa si ya existe otra con el mismo operationId, y si existe, no se agrega. 
- Uso declarado de IA (herramienta, propósito, validación): Usé IA como apoyo para escribir las pruebas y la corrección, porque no sabía cómo simular localStorage ni probar la cola junto con el almacenamiento.

# Evidencia individual

- Estudiante:
- Commit SHA evaluado:
- Decisión técnica que puedo explicar:
- Prueba que ejecuté y resultado:
- Limitación o fallo diagnosticado:
- Cambio que podría defender o modificar en vivo:
- Uso declarado de IA (herramienta, propósito, validación):

