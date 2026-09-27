import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

function readSource(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  assert.strictEqual(fs.existsSync(fullPath), true, `${relativePath} debe existir`);
  return fs.readFileSync(fullPath, "utf-8");
}

// ------------------------------------------------------------------
// Test 1 — CSR: src/app/inspecciones/page.tsx
// ------------------------------------------------------------------
function testCsrListado() {
  const source = readSource("src/app/inspecciones/page.tsx");

  assert.match(
    source.trimStart(),
    /^"use client"/,
    'El listado (CSR) debe declarar "use client" al inicio del archivo'
  );

  assert.ok(
    /useState/.test(source),
    "El listado (CSR) debe usar useState para manejar estado en el cliente"
  );
  assert.ok(
    /useEffect|onClick/.test(source),
    "El listado (CSR) debe tener lógica de interacción (useEffect u onClick)"
  );

  console.log("rendering.spec.ts (Test 1 — CSR): PASS");
}

// ------------------------------------------------------------------
// Test 2 — SSR: src/app/inspecciones/[id]/page.tsx
// ------------------------------------------------------------------
function testSsrDetalle() {
  const source = readSource("src/app/inspecciones/[id]/page.tsx");

  assert.ok(
    !/"use client"/.test(source),
    'El detalle (SSR) NO debe declarar "use client"'
  );

  assert.ok(
    /params\.id/.test(source),
    "El detalle (SSR) debe usar params.id para identificar la inspección"
  );
  assert.ok(
    /inspections\.find/.test(source),
    "El detalle (SSR) debe usar el id para buscar la inspección (inspections.find)"
  );

  console.log("rendering.spec.ts (Test 2 — SSR): PASS");
}

// ------------------------------------------------------------------
// Test 3 — Loading
// ------------------------------------------------------------------
function testLoadingState() {
  const componentSource = readSource("src/components/loading-state.tsx");
  assert.match(
    componentSource,
    /export function LoadingState/,
    "Debe existir el componente LoadingState"
  );

  const listSource = readSource("src/app/inspecciones/page.tsx");
  assert.ok(
    /LoadingState/.test(listSource),
    "El listado debe utilizar el componente LoadingState"
  );

  const loadingFilePath = path.join(rootDir, "src/app/inspecciones/[id]/loading.tsx");
  if (fs.existsSync(loadingFilePath)) {
    console.log("rendering.spec.ts (Test 3 — Loading): también se encontró [id]/loading.tsx");
  }

  console.log("rendering.spec.ts (Test 3 — Loading): PASS");
}

// ------------------------------------------------------------------
// Test 4 — Error: inspección inexistente
// ------------------------------------------------------------------
function testErrorState() {
  const source = readSource("src/app/inspecciones/[id]/page.tsx");

  assert.ok(
    /!inspection/.test(source),
    "El detalle debe comprobar el caso de una inspección inexistente (!inspection)"
  );

  assert.ok(
    /role="alert"|no encontrada|no existe/i.test(source),
    "El detalle debe mostrar un estado de error visible cuando la inspección no existe"
  );

  console.log("rendering.spec.ts (Test 4 — Error): PASS");
}

// ------------------------------------------------------------------
// Test 5 — Datos sintéticos: src/lib/data/inspections.ts
// ------------------------------------------------------------------
async function testDatosSinteticos() {
  const dataPath = path.join(rootDir, "src/lib/data/inspections.ts");
  assert.strictEqual(fs.existsSync(dataPath), true, "src/lib/data/inspections.ts debe existir");

  const listSource = readSource("src/app/inspecciones/page.tsx");
  const detailSource = readSource("src/app/inspecciones/[id]/page.tsx");

  assert.ok(
    /lib\/data\/inspections/.test(listSource),
    "El listado debe importar los datos desde src/lib/data/inspections"
  );
  assert.ok(
    /lib\/data\/inspections/.test(detailSource),
    "El detalle debe importar los datos desde src/lib/data/inspections"
  );

  const dataModule = await import(pathToFileURL(dataPath).href);

  assert.ok(Array.isArray(dataModule.inspections), "inspections debe ser un arreglo");
  assert.ok(dataModule.inspections.length > 0, "inspections no debe estar vacío");

  const requiredFields = ["id", "location", "date", "inspector", "status", "statusLabel", "findings", "summary"];
  for (const inspection of dataModule.inspections) {
    for (const field of requiredFields) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(inspection, field),
        `Cada inspección debe tener el campo "${field}"`
      );
    }
  }

  console.log("rendering.spec.ts (Test 5 — Datos): PASS");
}

async function main() {
  testCsrListado();
  testSsrDetalle();
  testLoadingState();
  testErrorState();
  await testDatosSinteticos();
}

await main();