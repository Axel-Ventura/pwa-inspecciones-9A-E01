import { test, expect } from '@playwright/test';

test.describe('Flujo de Inspecciones PWA - Pruebas E2E', () => {

  // Prueba 1. Carga del listado
  test('Prueba 1: Carga del listado inicial con sus tres inspecciones', async ({ page }) => {
    await page.goto('/inspecciones');

    await expect(page.getByRole('heading', { level: 1, name: /inspecciones/i })).toBeVisible();

    const cards = page.getByRole('article');
    await expect(cards).toHaveCount(3);

    await expect(page.getByText('Laboratorio de Redes')).toBeVisible();
    await expect(page.getByText('Laboratorio de Electrónica')).toBeVisible();
    await expect(page.getByText('Laboratorio de Software')).toBeVisible();
  });

  // Prueba 2. Filtro «Requieren atención»
  test('Prueba 2: Filtro "Requieren atención" muestra solo registros con incidencias', async ({ page }) => {
    await page.goto('/inspecciones');

    const filterBtn = page.getByRole('button', { name: /requieren atención/i });
    await filterBtn.click();

    await expect(filterBtn).toHaveAttribute('aria-pressed', 'true');

    await expect(page.getByText('Laboratorio de Electrónica')).toBeVisible();
    await expect(page.getByText('Laboratorio de Redes')).not.toBeVisible();
    await expect(page.getByText('Laboratorio de Software')).not.toBeVisible();

    const counter = page.getByText(/1 registro|1 inspección/i);
    await expect(counter).toBeVisible();
  });

  // Prueba 3. Filtro «Sin incidencias»
  test('Prueba 3: Filtro "Sin incidencias" excluye laboratorios con alertas', async ({ page }) => {
    await page.goto('/inspecciones');

    const filterBtn = page.getByRole('button', { name: /sin incidencias/i });
    await filterBtn.click();

    await expect(filterBtn).toHaveAttribute('aria-pressed', 'true');

    await expect(page.getByText('Laboratorio de Redes')).toBeVisible();
    await expect(page.getByText('Laboratorio de Software')).toBeVisible();
    await expect(page.getByText('Laboratorio de Electrónica')).not.toBeVisible();

    const counter = page.getByText(/2 registros|2 inspecciones/i);
    await expect(counter).toBeVisible();
  });

  // Prueba 4. Restablecer filtros
  test('Prueba 4: Restablecer filtros muestra nuevamente las tres inspecciones', async ({ page }) => {
    await page.goto('/inspecciones');

    await page.getByRole('button', { name: /requieren atención/i }).click();
    await expect(page.getByRole('article')).toHaveCount(1);

    const allBtn = page.getByRole('button', { name: /todas/i });
    await allBtn.click();

    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('article')).toHaveCount(3);
    await expect(page.getByText('Laboratorio de Redes')).toBeVisible();
    await expect(page.getByText('Laboratorio de Electrónica')).toBeVisible();
    await expect(page.getByText('Laboratorio de Software')).toBeVisible();
  });

  // Prueba 5. Navegación al detalle
  test('Prueba 5: Navegación al detalle desde una tarjeta filtrada', async ({ page }) => {
    await page.goto('/inspecciones');

    await page.getByRole('button', { name: /requieren atención/i }).click();

    const electronicaCard = page.getByRole('article').filter({ hasText: 'Laboratorio de Electrónica' });
    await electronicaCard.getByRole('link', { name: /ver detalle/i }).click();

    await expect(page).toHaveURL(/\/inspecciones\/inspection-002$/);

    await expect(page.getByRole('heading', { name: 'Laboratorio de Electrónica' })).toBeVisible();
    await expect(page.getByText('inspection-002')).toBeVisible();
    
    // Se usa .first() para validar el estado sin violar el strict mode
    await expect(page.getByText(/requiere atención/i).first()).toBeVisible();

    const findings = page.getByRole('listitem');
    await expect(findings).toHaveCount(2);
  });

  // Prueba 6. Regreso al listado
  test('Prueba 6: Retorno consistente al listado desde la vista de detalle', async ({ page }) => {
    await page.goto('/inspecciones/inspection-002');

    const backLink = page.getByRole('link', { name: /volver a inspecciones/i });
    await backLink.click();

    await expect(page).toHaveURL(/\/inspecciones$/);
    await expect(page.getByRole('heading', { level: 1, name: /inspecciones/i })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(3);
  });

  // Prueba 7. Inspección inexistente
  test('Prueba 7: Manejo de error controlado ante ID inexistente', async ({ page }) => {
    await page.goto('/inspecciones/id-inexistente');

    await expect(page.getByText(/inspección no encontrada/i)).toBeVisible();

    const returnLink = page.getByRole('link', { name: /volver a inspecciones|regresar al listado/i });
    await expect(returnLink).toBeVisible();
    await returnLink.click();

    await expect(page).toHaveURL(/\/inspecciones$/);
  });

  // Prueba 8. Navegación directa a un detalle válido
  test('Prueba 8: Acceso directo por URL a un detalle válido', async ({ page }) => {
    await page.goto('/inspecciones/inspection-001');

    await expect(page.getByRole('heading', { name: 'Laboratorio de Redes' })).toBeVisible();
    await expect(page.getByText('inspection-001')).toBeVisible();
    
    // Se usa .first() para validar el estado sin violar el strict mode
    await expect(page.getByText(/sin incidencias|aprobado|completada/i).first()).toBeVisible();
  });

});