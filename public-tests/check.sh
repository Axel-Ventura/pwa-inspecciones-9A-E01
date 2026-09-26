#!/usr/bin/env bash

set -euo pipefail

node scripts/verify.mjs --structure

# Week 03
test -e 'public/sw.js' \
  && test -e 'src/lib/pwa/register-service-worker.ts' \
  && test -e 'docs/cache-strategy.md' \
  && test -e 'tests/service-worker.spec.ts' \
  && test -e 'tests/offline.spec.ts'

# Week 04
test -e 'src/app/inspecciones/page.tsx' \
  && test -e 'src/app/inspecciones/[id]/page.tsx' \
  && test -e 'src/components/loading-state.tsx' \
  && test -e 'docs/rendering-decision.md' \
  && test -e 'tests/rendering.spec.ts'

test -f README.md

! rg -n -i '(api[_-]?key|secret|password|token)' --glob '!public-tests/check.sh' .

echo PUBLIC_OK