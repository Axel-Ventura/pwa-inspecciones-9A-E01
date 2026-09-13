import fs from 'fs';
import path from 'path';

describe('Pruebas de Manifest PWA - Semana 2', () => {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  
  let manifestPath = path.join(publicDir, 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    manifestPath = path.join(publicDir, 'manifest.json');
  }

  test('El archivo manifest debe existir en la carpeta public/', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  test('El manifest debe ser un JSON bien formado', () => {
    const rawData = fs.readFileSync(manifestPath, 'utf-8');
    expect(() => JSON.parse(rawData)).not.toThrow();
  });

  describe('Validación de campos requeridos del Manifest', () => {
    let manifest: any;

    beforeAll(() => {
      if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      }
    });

    test('Debe contener todos los campos principales requeridos', () => {
      const requiredFields = ['name', 'short_name', 'start_url', 'scope', 'display', 'icons'];
      requiredFields.forEach((field) => {
        expect(manifest).toHaveProperty(field);
        if (field !== 'icons') {
          expect(typeof manifest[field]).toBe('string');
          expect(manifest[field].trim().length).toBeGreaterThan(0);
        }
      });
    });

    test('Coherencia de instalación: start_url debe estar dentro del scope', () => {
      const startUrl = manifest.start_url;
      const scope = manifest.scope;

      expect(startUrl.startsWith(scope) || startUrl.startsWith('.')).toBe(true);
    });

    test('Los iconos declarados deben existir físicamente en la carpeta public/', () => {
      expect(Array.isArray(manifest.icons)).toBe(true);
      expect(manifest.icons.length).toBeGreaterThan(0);

      manifest.icons.forEach((icon: { src: string; sizes?: string; type?: string }) => {
        expect(icon).toHaveProperty('src');
        
        const relativeIconPath = icon.src.startsWith('/') ? icon.src.substring(1) : icon.src;
        const fullIconPath = path.join(publicDir, relativeIconPath);

        expect(fs.existsSync(fullIconPath)).toBe(true);
      });
    });
  });
});
