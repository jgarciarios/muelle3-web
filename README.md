# Muelle 3 — Sitio web

Sitio real de Muelle 3 (Kitchen & Bar, Playa Mansa, Punta del Este). Next.js 16 + TypeScript + Tailwind v4.

**Reservas**: se manejan por **Meitre** (el sistema que ya usan los dueños), no por un formulario propio — ver sección "Reservas (Meitre)" más abajo. El proyecto sigue usando Supabase (`jg-ventures-db`) para otras cosas (reseñas, y como base multi-tenant para otros clientes de la agencia).

## Alcance v1

- **Home**: hero con foto real, identidad de marca, navegación.
- **Reservas**: botón que lleva a la página de reservas de Muelle 3 en Meitre (`src/lib/meitre.ts`). No hay formulario propio ni datos de reservas en nuestra base.
- **Reseñas**: carrusel en el Home con reviews de EJEMPLO (ver sección "Reseñas de Google" más abajo) — vista previa para mostrarle a los dueños, todavía no conectado a datos reales.
- **Eventos**: página real con formulario de cotización (`src/app/eventos/`) — guarda en Supabase (`eventos_consultas`) y manda un aviso por mail vía Resend si están cargadas `RESEND_API_KEY` y `EVENTOS_NOTIFICATION_EMAIL` (ver "Variables de entorno"). Sin esas dos, la consulta se guarda igual, solo no se manda el mail.
- **Contacto**: página nueva (`src/app/contacto/`) con mapa embebido (coordenadas reales, sin necesitar API key) — WhatsApp, dirección textual y horarios se muestran solo si están cargados en `src/lib/site-info.ts` (hoy están vacíos a propósito, pendientes de Juani).
- Menú y Nuestra Historia: "muy pronto" por ahora — bloqueados por contenido real (carta y texto de historia), ver `PLAN.md` sección 13.

## Setup local

```bash
npm install
cp .env.local.example .env.local   # completar con las claves reales de Supabase
npm run dev
```

## Variables de entorno

**Nota:** desde el cambio a Meitre (ver "Reservas (Meitre)"), nada en el código que corre en producción usa Supabase — las tres variables de Supabase solo importan si en algún momento se reconecta el sistema de reservas propio que quedó desactivado. `NEXT_PUBLIC_GOOGLE_PLACE_ID` sí se usa hoy (botón de reseñas).

| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → `jg-ventures-db` → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → `jg-ventures-db` → Project Settings → API → clave `anon` / `publishable` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → `jg-ventures-db` → Project Settings → API → clave `service_role`. **Server-only** — nunca con prefijo `NEXT_PUBLIC_`, nunca commitear el valor real. Bypassea RLS por completo; si se filtra al cliente, cualquiera puede leer/escribir cualquier dato de cualquier restaurante en la base compartida. |
| `RESTAURANT_SLUG` | Fijo por sitio de cliente. Para este sitio: `muelle-3`. Identifica qué fila de `restaurantes` le corresponde a este deploy — nunca lo define el visitante del sitio. |
| `NEXT_PUBLIC_GOOGLE_PLACE_ID` | Place ID de Google Maps de este restaurante. **No es sensible** (se puede sacar de cualquier link público de Google Maps del lugar), por eso sí lleva prefijo `NEXT_PUBLIC_`. Para Muelle 3: `ChIJWXCHkPAFdZURHmmQYvcPoBU`. Se usa para el botón "Dejá tu reseña" (`https://search.google.com/local/writereview?placeid=...`, sin costo ni API) y, más adelante, para la Places API del carrusel de reseñas (sí requiere billing — ver sección de Reseñas abajo). |
| `RESEND_API_KEY` | Cuenta gratuita en resend.com → API Keys. Server-only. Sin esta variable, el formulario de Eventos sigue guardando la consulta en Supabase, pero no manda el aviso por mail. |
| `EVENTOS_NOTIFICATION_EMAIL` | A qué dirección de mail llega el aviso de cada consulta de evento nueva. Todavía no definida — pendiente de Juani. |

**En Vercel**, las cuatro se cargan igual: Project Settings → Environment Variables. `SUPABASE_SERVICE_ROLE_KEY` va ahí como cualquier otra env var del proyecto (Vercel no expone al bundle del cliente ninguna variable sin el prefijo `NEXT_PUBLIC_`, así que queda server-only automáticamente) — **nunca** se pega en código, ni en un comentario, ni en un README con el valor real. Si en algún momento se conecta la integración oficial de Supabase↔Vercel para este proyecto, las variables se sincronizan solas; si no, se cargan a mano las cuatro. Para quien se sume después: sin `SUPABASE_SERVICE_ROLE_KEY` cargada en Vercel, el formulario de reservas en producción va a fallar en cada submit (ver "Arquitectura de seguridad" abajo).

## Reservas (Meitre)

**Cambio de arquitectura (2026-09-13):** los dueños confirmaron que van a seguir reservando por **Meitre** (meitre.com, el mismo sistema de reservas que ya usan — no se cambia). Antes de esto habíamos construido un sistema de reservas propio sobre Supabase (tabla `reservas`, formulario, Server Action, migraciones, test de aislamiento multi-tenant). Ese trabajo **queda en el repo pero desconectado** — no se usa en este sitio, se dejó por si otro cliente de la agencia sí necesita reservas propias:

- `src/app/reservas/reservation-form.tsx` — el formulario (ya no se importa desde ninguna página).
- `src/app/reservas/actions.ts` — el Server Action que insertaba en Supabase.
- `src/lib/supabase/tenant.ts` — resolución de `restaurante_id` por `RESTAURANT_SLUG`.
- `supabase/migrations/000{1,2,3}_*.sql` y `supabase/tests/tenant-isolation.mjs` — el schema y el test de aislamiento (siguen aplicados en `jg-ventures-db`, no se revirtieron).

**Por qué no se puede integrar más profundo que un link:** la página de reservas de cada restaurante en Meitre vive en su propio subdominio (`https://muelle3.meitre.com/` para Muelle 3), con la marca del restaurante. Confirmamos dos cosas antes de decidir esto:

1. **No se puede embeber**: probamos meter esa página en un `<iframe>` y el navegador la bloquea (protección estándar tipo `X-Frame-Options` / CSP `frame-ancestors`, para evitar clickjacking). No hay forma de que la reserva ocurra "adentro" de nuestro sitio de forma invisible.
2. **No hay API pública documentada** para crear reservas directamente desde código de terceros. Si existiera, requeriría que Meitre le dé credenciales de API a los dueños — no es algo que se pueda armar sin ese acuerdo.

**Solución implementada**: `src/lib/meitre.ts` define `MEITRE_RESERVATION_URL`. La página `/reservas` (`src/app/reservas/page.tsx`) muestra un botón "Reservar en Meitre" que abre esa URL en una pestaña nueva — todos los demás botones "Reservar" del sitio (Home, páginas "muy pronto") ya apuntaban a `/reservas`, así que no hizo falta tocarlos.

**Si se suma un panel de administración a futuro** (para otro cliente sin sistema de reservas externo), el código desconectado de arriba es el punto de partida — ya tiene la arquitectura multi-tenant y el test de aislamiento resueltos.

## Base de datos — arquitectura multi-tenant (JG Ventures)

Este sitio **no tiene su propio proyecto Supabase**. Usa `jg-ventures-db`, un único proyecto Postgres compartido por todos los clientes de la agencia (organización `jg-ventures` en Supabase), para no pegar contra el límite de 2 proyectos gratis por cuenta cada vez que se suma un cliente nuevo.

Cada tabla de negocio tiene una columna `restaurante_id` que separa los datos por cliente, más Row Level Security (RLS) scoped por tenant:

- **`restaurantes`**: un registro por cliente de la agencia (`id`, `slug`, `nombre`, `plan`). Muelle 3 es la fila con `slug = 'muelle-3'`.
- **`usuario_restaurante`**: qué usuario administra qué restaurante (para el futuro panel de administrador).
- **`reservas`**: `restaurante_id` (FK, `not null`), `nombre_cliente`, `telefono`, `email` (opcional), `fecha` (`timestamptz` — incluye la hora, no hay columna separada), `personas`, `notas` (opcional), `estado`. **Sin usar por este sitio** desde el cambio a Meitre (ver "Reservas (Meitre)" arriba) — queda para un futuro cliente que sí necesite reservas propias.

El schema vive versionado en `supabase/migrations/` para referencia, aunque en la práctica se aplicó a mano en el SQL Editor del dashboard (ver esos archivos para el detalle de las policies de RLS).

### Arquitectura de seguridad del formulario público (y la vulnerabilidad que resolvimos)

**Aislamiento del formulario público**: el server action (`src/app/reservas/actions.ts`) resuelve el `restaurante_id` de este sitio mediante `RESTAURANT_SLUG` (`src/lib/supabase/tenant.ts`), consultando la tabla `restaurantes` — nunca a partir de algo que mande el visitante.

**Historial (2026-09-12): del enfoque con RLS+anon al enfoque con service_role.** La primera versión de esta migración le daba a la clave `anon` una policy de RLS para hacer `insert` en `reservas`, con un `with check` que solo validaba "el restaurante existe". Revisando esto antes de aplicarlo, se identificó el riesgo: la clave `anon` es pública (se puede sacar del bundle de JS de cualquiera de los sitios de la agencia) y es la **misma clave para todos los tenants** del proyecto multi-tenant. Con esa policy, cualquiera con la clave `anon` de un sitio podía llamar directo a la API REST de Supabase (sin pasar por ningún formulario ni por el Server Action) e insertar reservas para **cualquier restaurante existente**, no solo el suyo — el escenario exacto de fuga entre tenants que la arquitectura multi-tenant tiene que evitar.

**Solución aplicada**: `reservas` (y `restaurantes`) no tienen ninguna policy de RLS para `anon` — ni de `select` ni de `insert`. El único camino de escritura es el Server Action de cada sitio, que usa un cliente Supabase con la clave `service_role` (`src/lib/supabase/admin.ts`, protegido con el import `"server-only"` de Next.js para que el build falle si algo intenta importarlo desde código de cliente). `service_role` bypassea RLS por completo, así que no depende de ninguna policy — pero como solo se usa server-side, después de que el propio código ya resolvió el `restaurante_id` correcto vía `RESTAURANT_SLUG`, no hay forma de que un sitio escriba datos de otro. `getRestauranteId()` también pasó a usar `service_role` para el lookup por slug, porque `restaurantes` tampoco tiene policy de `select` para `anon`.

**Verificado con un test de integración** (`supabase/tests/tenant-isolation.mjs`) que confirma, contra la base real: (a) la clave `anon` no puede hacer `select` ni `insert` en `reservas` ni `restaurantes`, y (b) dos restaurantes de prueba quedan completamente aislados entre sí incluso para un usuario autenticado que administra solo uno de los dos. Ver la sección de testing más abajo para cómo correrlo.

**Bug real encontrado corriendo este test (2026-09-12), antes de `0003_usuario_restaurante_select_policy.sql`:** `usuario_restaurante` tenía RLS habilitado sin ninguna policy. Eso no solo bloqueaba a extraños (correcto) — bloqueaba a **cualquier** usuario autenticado de leer su propia fila de mapeo, porque el subquery de la policy de `reservas`/`restaurantes` (`... where usuario_id = auth.uid()`) corre con los privilegios de quien pregunta, y sin policy ese subquery devuelve 0 filas para todo el mundo. En la práctica, el futuro panel de administrador iba a estar roto para cualquier admin real, no solo aislado entre tenants. Se agregó una policy de `select` para que cada usuario vea su propia fila (`0003_usuario_restaurante_select_policy.sql`) — `insert`/`update`/`delete` de esa tabla siguen cerrados para `authenticated` a propósito, esa gestión es de la agencia vía `service_role`.

## Reseñas de Google (carrusel del Home)

El Home (`src/app/page.tsx`) tiene un carrusel de reseñas (`src/components/reviews-carousel.tsx`) con dos partes:

1. **Botón "Dejá tu reseña"**: ya funcional, sin costo ni API. Es un link estático a `https://search.google.com/local/writereview?placeid=NEXT_PUBLIC_GOOGLE_PLACE_ID`. El Place ID de Muelle 3 (`ChIJWXCHkPAFdZURHmmQYvcPoBU`) se obtuvo de la URL pública de Google Maps del lugar — no es sensible, no requiere cuenta de Google Cloud.
2. **Carrusel de reviews**: por ahora muestra **datos de ejemplo** (`src/lib/reviews-placeholder.ts`) — nombres, fechas y textos inventados a propósito, con un badge visible de "Vista previa · reseñas de ejemplo" para que quede claro que no son reseñas reales. Esto es intencional: sirve para mostrarle a los dueños cómo va a quedar antes de conectarlo a Google.

**Para conectar las reviews reales** (trae hasta 5 — es el máximo que devuelve la Places API, no hay forma de traer más) hace falta:

1. Un proyecto en Google Cloud con la **Places API** habilitada y **billing activo** (no existe todavía — sin esto no se puede avanzar).
2. Server Action o route handler que llame a Places API (`Place Details`, campo `reviews`) usando el mismo `NEXT_PUBLIC_GOOGLE_PLACE_ID`, cacheado (las reviews no cambian tan seguido) para no gastar cuota de más.
3. Reemplazar `PLACEHOLDER_REVIEWS` por ese resultado real y sacar el badge de "Vista previa".

**Importante**: no publicar este sitio en producción con el badge de vista previa saltado ni con las reviews de ejemplo mostradas como si fueran reales — son inventadas para la demo interna.

## Testing

### Aislamiento multi-tenant (`supabase/tests/tenant-isolation.mjs`)

Test de integración que corre contra la base real de `jg-ventures-db` (no mockea nada) usando `@supabase/supabase-js` directo, sin pasar por la app. Verifica:

1. La clave `anon` no puede leer ni escribir en `reservas` ni `restaurantes` (0 filas / error de RLS en cada intento).
2. Se crean dos restaurantes de prueba + un usuario autenticado que administra solo uno de los dos (vía `usuario_restaurante`), y se confirma que ese usuario ve/edita reservas del suyo pero no las del otro.
3. Al final borra todo lo que creó (restaurantes, reservas y usuario de prueba) — no deja basura en la base compartida.

Requiere las tres env vars de la tabla de arriba (usa `service_role` para el setup/limpieza, y crea un usuario temporal con Supabase Auth para probar el rol `authenticated`). No corre en CI todavía — es manual, antes de cambiar cualquier policy de RLS de `reservas`/`restaurantes`:

```bash
cp .env.local.example .env.local   # si no lo tenés ya con valores reales
node --env-file=.env.local supabase/tests/tenant-isolation.mjs
```

Sale con código 0 y un resumen OK/FAIL por check si todo pasa; con código 1 y el detalle del check que falló si no.

## Eventos — formulario de cotización

`src/app/eventos/` tiene el formulario real (`quote-form.tsx`, Server Action en `actions.ts`). Mismo patrón de seguridad que Reservas (ver arriba): usa `service_role` y resuelve el `restaurante_id` vía `RESTAURANT_SLUG`, nunca desde el formulario. Guarda en la tabla `eventos_consultas` (`supabase/migrations/0004_eventos_consultas.sql`, sin policy de RLS para `anon`, mismo motivo que `reservas`).

Además del guardado en base, manda un aviso por mail usando la API de Resend (`https://api.resend.com/emails`, llamada directa por `fetch`, sin SDK) — si `RESEND_API_KEY` y `EVENTOS_NOTIFICATION_EMAIL` no están cargadas, no manda el mail pero tampoco rompe el formulario (la consulta queda guardada igual, se ve el warning en los logs). El remitente usa el dominio de prueba de Resend (`onboarding@resend.dev`) hasta que se verifique un dominio propio.

## Contacto

`src/app/contacto/` — mapa embebido con las coordenadas reales de Muelle 3 (`src/lib/site-info.ts`, `GOOGLE_MAPS_EMBED_URL`, sin necesitar API key de Google). WhatsApp, dirección textual y horarios se definen en ese mismo archivo (`WHATSAPP_NUMBER`, `ADDRESS_TEXT`, `HORARIOS`) y **están vacíos a propósito** — cada bloque de la página se oculta solo si el dato no está cargado, para nunca mostrar información inventada. Completar ahí cuando Juani confirme los datos reales.

## Notas técnicas — sesión 21/09/2026 (QA visual)

**Segunda pasada de la misma sesión (noche), 4 ajustes puntuales tras revisar capturas mobile — detalle completo en PLAN.md:**
- `src/app/menu/page.tsx` revertido a texto puro (se habían sumado fotos por categoría, Juani decidió que no hacían falta).
- Copy del Home corregido (`src/app/page.tsx`): "Un lugar con los pies en la arena y la vista al muelle" era impreciso, pasa a "Frente al mar, con vista al muelle".
- `/historia` rediseñada (`src/app/historia/page.tsx`, `src/components/historia-collage.tsx`): de un collage con fotos rotadas/superpuestas a bloques alternados texto+foto (`HistoriaSection`), sin rotación ni superposición.
- `src/components/nav.tsx`: link interno "Menú" (la carta) renombrado a "Carta" para no confundir con el botón "Menú" que abre el overlay; se agregó link "Inicio" como primer ítem del overlay.


- **Splash de carga (`src/components/splash-screen.tsx`) y recargas completas**: se agregó un script inline en `src/app/layout.tsx` (antes de `<SplashScreen />`) que chequea `sessionStorage` de forma síncrona, antes de que React hidrate, y le agrega la clase `splash-skip` al `<html>` si ya se vio el splash en esta pestaña. `globals.css` tiene la regla `html.splash-skip [data-splash-screen] { display: none !important }` que lo saca por CSS puro. Esto evita que una recarga completa (link externo, refresh, URL escrita a mano) muestre el splash de nuevo con el logo invisible (`opacity:0` hasta que hidrata JS) durante todo lo que tarde en bajar el bundle — antes se veía como una pantalla navy sólida y vacía. Ver PLAN.md sección 14 para el diagnóstico completo.
- **Imágenes reales pesadas**: todas las fotos en `public/images/*.png` y `public/images/platos*/**.jpg` se recomprimieron con `sharp` (quality ~78-80, máximo 2200px de ancho) sin cambiar nombres ni rutas — 54.9MB → 25.6MB en total. Si se agregan fotos nuevas a futuro, comprimirlas de entrada (no subir directo el archivo que entrega el fotógrafo) para no reintroducir el mismo problema.
- **`menu-category-nav.tsx`**: el IntersectionObserver ahora mantiene un `Map` con el estado acumulado de qué secciones intersectan (antes usaba solo el lote parcial de cada callback, lo que se desincronizaba con scroll rápido).
- **`src/components/mood-carousel.tsx`** exporta ahora `HeroExperience` (antes `MoodCarousel`) — el hero del Home entero (fondo + marca + selector de mood) vive en un solo Client Component. Ver PLAN.md sección 14, Foco 4: es funcionalidad nueva, no mergeada/deployada todavía a propósito.

## Deploy

Pensado para Vercel (Hobby tier alcanza para el arranque). Conectar el repo de GitHub a un proyecto de Vercel. Env var necesaria para que el sitio funcione como está hoy: `NEXT_PUBLIC_GOOGLE_PLACE_ID`. Las de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESTAURANT_SLUG`) son opcionales por ahora — solo hacen falta si se reconecta el sistema de reservas propio (ver "Reservas (Meitre)"). La URL de Meitre está hardcodeada en `src/lib/meitre.ts`, no es una env var.

