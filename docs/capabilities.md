# Week 6 — Capacidades del dispositivo y notificaciones

## Objetivo

Integrar capacidades opcionales del dispositivo para la PWA de inspecciones:

- **Cámara:** adjuntar evidencia opcional.
- **Geolocalización:** registrar ubicación opcional.
- **Notificaciones:** informar cambios en una inspección.

Las capacidades no deben bloquear el flujo principal cuando no están disponibles o el usuario rechaza el permiso.

---

## Contrato común

Las capacidades deben utilizar un resultado explícito de éxito o fallback:

```ts
type CapabilityResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: string;
    };
```

Los errores de las APIs no deben propagarse de forma que rompan el flujo de la aplicación.

---

## Cámara

**Archivo:** `src/lib/device/camera.ts`

**Función:**

```ts
requestCamera(): Promise<CapabilityResult<MediaStream>>
```

### Comportamiento

- Comprobar que `navigator.mediaDevices` exista.
- Comprobar que `getUserMedia` exista.
- Solicitar acceso únicamente cuando el usuario invoque la función.
- Solicitar únicamente video.
- Si el acceso es concedido, devolver el `MediaStream`.
- Si la API no existe, devolver `ok: false`.
- Si el usuario rechaza el permiso, devolver `ok: false`.
- Si ocurre un error del dispositivo, devolver `ok: false`.

### Fallback

Si la cámara no está disponible, la inspección debe poder continuar sin evidencia fotográfica.

---

## Geolocalización

**Archivo:** `src/lib/device/geolocation.ts`

**Función:**

```ts
getCurrentLocation(): Promise<
  CapabilityResult<{
    latitude: number;
    longitude: number;
  }>
>
```

### Comportamiento

- Comprobar que `navigator.geolocation` exista.
- Solicitar ubicación únicamente cuando el usuario invoque la función.
- Obtener la posición mediante `getCurrentPosition`.
- Considerar timeout.
- Si la posición se obtiene correctamente, devolver únicamente `latitude` y `longitude`.
- Si la API no existe, devolver `ok: false`.
- Si el permiso es rechazado, devolver `ok: false`.
- Si ocurre un error o timeout, devolver `ok: false`.

### Privacidad

No devolver ni almacenar datos adicionales como altitud, velocidad, rumbo o información de identidad.

### Fallback

Si la ubicación no está disponible, la inspección debe poder continuar sin ubicación.

---

## Notificaciones

**Archivo:** `src/lib/notifications/client.ts`

**Funciones:**

```ts
requestNotificationPermission(): Promise<
  CapabilityResult<NotificationPermission>
>

notifyChange(message: string): Promise<CapabilityResult<void>>
```

### `requestNotificationPermission`

Debe:

- Comprobar que `Notification` exista.
- Si el permiso es `granted`, devolver éxito sin solicitarlo nuevamente.
- Si es `default`, solicitar permiso mediante `Notification.requestPermission()`.
- Si es `denied`, devolver `ok: false`.
- Si la API no existe, devolver `ok: false`.

> La solicitud de permiso debe ocurrir únicamente como consecuencia de una acción explícita del usuario.

### `notifyChange`

Debe:

- Comprobar que `Notification` exista.
- Comprobar que el permiso sea `granted`.
- Crear la notificación únicamente cuando el permiso esté concedido.
- Si el permiso está `denied`, devolver `ok: false`.
- Si la API no existe, devolver `ok: false`.

### Fallback

Cuando no pueda mostrarse una notificación, la aplicación debe poder informar el cambio mediante su interfaz normal.

---

## Pruebas obligatorias

`tests/capabilities.spec.ts` debe comprobar como mínimo:

### Cámara

- API no disponible.
- Acceso concedido.
- Permiso rechazado.
- Error del dispositivo.

### Geolocalización

- API no disponible.
- Posición obtenida correctamente.
- Permiso rechazado.
- Timeout/error.

### Notificaciones

- API no disponible.
- Permiso `granted`.
- Permiso `default` y solicitud de permiso.
- Permiso `denied`.
- Notificación exitosa.
- No crear notificación cuando el permiso está denegado.

> Las pruebas deben utilizar APIs simuladas y datos sintéticos, sin depender de hardware, permisos reales, servicios externos o conexión a Internet.

---

## Trazabilidad

| Requisito | Implementación | Prueba |
|---|---|---|
| Evidencia mediante cámara | `src/lib/device/camera.ts` | `tests/capabilities.spec.ts` |
| Ubicación opcional | `src/lib/device/geolocation.ts` | `tests/capabilities.spec.ts` |
| Notificación de cambios | `src/lib/notifications/client.ts` | `tests/capabilities.spec.ts` |
| Permisos mínimos | Los tres módulos | Casos de permisos |
| Fallback | Los tres módulos | Casos de API/error |
| Privacidad | Cámara/geolocalización | Casos de retorno de datos |

---

## Limitaciones

- Las capacidades dependen del soporte y permisos del navegador.
- Las pruebas automatizadas simulan las APIs del navegador y no sustituyen una prueba manual en un dispositivo real.
- Esta actividad utiliza la API de notificaciones del navegador; no implementa un servicio externo de Web Push.