
#!/usr/bin/env bash
set -euo pipefail

# Verificación estructural general
node scripts/verify.mjs --structure

# Week 03 - PWA y funcionamiento offline
test -e 'public/sw.js' \
  && test -e 'src/lib/pwa/register-service-worker.ts' \
  && test -e 'docs/cache-strategy.md' \
  && test -e 'tests/service-worker.spec.ts' \
  && test -e 'tests/offline.spec.ts'

# Week 04 - Renderizado y navegación
test -e 'src/app/inspecciones/page.tsx' \
  && test -e 'src/app/inspecciones/[id]/page.tsx' \
  && test -e 'src/components/loading-state.tsx' \
  && test -e 'docs/rendering-decision.md' \
  && test -e 'tests/rendering.spec.ts'

# Week 05 - Sincronización y persistencia
test -e 'src/lib/sync/queue.ts' \
  && test -e 'src/lib/storage/schema.ts' \
  && test -e 'src/lib/sync/conflict-policy.ts' \
  && test -e 'docs/sync-policy.md' \
  && test -e 'tests/sync.spec.ts'

# Week 06 - Capacidades del dispositivo
test -e 'src/lib/device/camera.ts' \
  && test -e 'src/lib/device/geolocation.ts' \
  && test -e 'src/lib/notifications/client.ts' \
  && test -e 'docs/capabilities.md' \
  && test -e 'tests/capabilities.spec.ts'

# Week 08 - Pruebas unitarias, integración y E2E
test -e 'tests/unit/' \
  && test -e 'tests/integration/' \
  && test -e 'tests/e2e/' \
  && test -e 'docs/test-strategy.md' \
  && test -e '.github/workflows/academic-evaluation.yml'

# Documentación general
test -f README.md

# Verificación pública de posibles secretos
! rg -n -i '(api[_-]?key|secret|password|token)' \
  --glob '!public-tests/check.sh' .

echo PUBLIC_OK
