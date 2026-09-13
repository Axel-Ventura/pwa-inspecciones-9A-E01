import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

let manifestPath = path.join(publicDir, 'manifest.webmanifest');
if (!fs.existsSync(manifestPath)) {
  manifestPath = path.join(publicDir, 'manifest.json');
}

// 1. Verificar existencia del archivo
assert.strictEqual(fs.existsSync(manifestPath), true, 'El archivo manifest debe existir en public/');

// 2. Verificar validez del JSON
const rawData = fs.readFileSync(manifestPath, 'utf-8');
let manifest;
assert.doesNotThrow(() => {
  manifest = JSON.parse(rawData);
}, 'El manifest debe ser un JSON bien formado');

// 3. Campos requeridos
const requiredFields = ['name', 'short_name', 'start_url', 'scope', 'display', 'icons'];
requiredFields.forEach((field) => {
  assert.ok(manifest[field] !== undefined, `El manifest debe contener el campo: ${field}`);
  if (field !== 'icons') {
    assert.strictEqual(typeof manifest[field], 'string', `El campo ${field} debe ser string`);
    assert.ok(manifest[field].trim().length > 0, `El campo ${field} no debe estar vacío`);
  }
});

// 4. Coherencia de start_url y scope
const startUrl = manifest.start_url;
const scope = manifest.scope;
assert.ok(
  startUrl.startsWith(scope) || startUrl.startsWith('.') || startUrl.startsWith('/'),
  'start_url debe ser coherente con el scope'
);

// 5. Existencia de iconos en public/
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'Debe haber al menos un icono');
manifest.icons.forEach((icon) => {
  assert.ok(icon.src, 'Cada icono debe tener la propiedad src');
  const relativePath = icon.src.startsWith('/') ? icon.src.substring(1) : icon.src;
  const fullPath = path.join(publicDir, relativePath);
  assert.strictEqual(fs.existsSync(fullPath), true, `El archivo de icono no existe en public/: ${icon.src}`);
});

console.log('manifest.spec.mjs: PASS');
