# Muelle 3 — Sitio web

Sitio real de Muelle 3 (Kitchen & Bar, Playa Mansa, Punta del Este). Next.js 16 + TypeScript + Tailwind v4, con reservas guardadas en Supabase.

## Alcance v1

- **Home**: hero con foto real, identidad de marca, navegación.
- **Reservas**: formulario funcional que guarda en Supabase (`reservas`).
- Menú, Nuestra Historia, Eventos y Reseñas: páginas "muy pronto" por ahora — se completan después de la reunión con los dueños, según lo que se defina (ver `muelle3-preguntas-para-reunion.md` en el proyecto de Claude).

## Setup local

```bash
npm install
cp .env.local.example .env.local   # completar con las claves reales de Supabase
npm run dev
```

## Variables de entorno

| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → `jg-ventures-db` → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → `jg-ventures-db` → Project Settings → API → clave `anon` / `publishable` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → `jg-ventures-db` → Project Settings → API → clave `service_role`. **Server-only** — nunca con prefijo `NEXT_PUBLIC_`, nunca commitear el valor real. Bypassea RLS por completo; si se filtra al cliente, cualquiera puede leer/escribir cualquier dato de cualquier restaurante en la base compartida. |
| `RESTAURANT_SLUG` | Fijo por sitio de cliente. Para este sitio: `muelle-3`. Identifica qué fila de `restaurantes` le corresponde a este deploy — nunca lo define el visitante del sitio. |

**En Vercel**, las tres se cargan igual: Project Settings → Environment Variables. `SUPABASE_SERVICE_ROLE_KEY` va ahí como cualquier otra env var del proyecto (Vercel no expone al bundle del cliente ninguna variable sin el prefijo `NEXT_PUBLIC_`, así que queda server-only automáticamente) — **nunca** se pega en código, ni en un comentario, ni en un README con el valor real. Si en algún momento se conecta la integración oficial de Supabase↔Vercel para este proyecto, las variables se sincronizan solas; si no, se cargan a mano las tres. Para quien se sume después: sin `SUPABASE_SERVICE_ROLE_KEY` cargada en Vercel, el formulario de reservas en producción va a fallar en cada submit (ver "Arquitectura de seguridad" abajo).

## Base de datos — arquitectura multi-tenant (JG Ventures)

Este sitio **no tiene su propio proyecto Supabase**. Usa `jg-ventures-db`, un único proyecto Postgres compartido por todos los clientes de la agencia (organización `jg-ventures` en Supabase), para no pegar contra el límite de 2 proyectos gratis por cuenta cada vez que se suma un cliente nuevo.

Cada tabla de negocio tiene una columna `restaurante_id` que separa los datos por cliente, más Row Level Security (RLS) scoped por tenant:

- **`restaurantes`**: un registro por cliente de la agencia (`id`, `slug`, `nombre`, `plan`). Muelle 3 es la fila con `slug = 'muelle-3'`.
- **`usuario_restaurante`**: qué usuario administra qué restaurante (para el futuro panel de administrador).
- **`reservas`**: `restaurante_id` (FK, `not null`), `nombre_cliente`, `telefono`, `email` (opcional), `fecha` (`timestamptz` — incluye la hora, no hay columna separada), `personas`, `notas` (opcional), `estado`.

El schema vive versionado en `supabase/migrations/` para referencia, aunque en la práctica se aplicó a mano en el SQL Editor del dashboard (ver esos archivos para el detalle de las policies de RLS).

### Arquitectura de seguridad del formulario público (y la vulnerabilidad que resolvimos)

**Aislamiento del formulario público**: el server action (`src/app/reservas/actions.ts`) resuelve el `restaurante_id` de este sitio mediante `RESTAURANT_SLUG` (`src/lib/supabase/tenant.ts`), consultando la tabla `restaurantes` — nunca a partir de algo que mande el visitante.

**Historial (2026-09-12): del enfoque con RLS+anon al enfoque con service_role.** La primera versión de esta migración le daba a la clave `anon` una policy de RLS para hacer `insert` en `reservas`, con un `with check` que solo validaba "el restaurante existe". Revisando esto antes de aplicarlo, se identificó el riesgo: la clave `anon` es pública (se puede sacar del bundle de JS de cualquiera de los sitios de la agencia) y es la **misma clave para todos los tenants** del proyecto multi-tenant. Con esa policy, cualquiera con la clave `anon` de un sitio podía llamar directo a la API REST de Supabase (sin pasar por ningún formulario ni por el Server Action) e insertar reservas para **cualquier restaurante existente**, no solo el suyo — el escenario exacto de fuga entre tenants que la arquitectura multi-tenant tiene que evitar.

**Solución aplicada**: `reservas` (y `restaurantes`) no tienen ninguna policy de RLS para `anon` — ni de `select` ni de `insert`. El único camino de escritura es el Server Action de cada sitio, que usa un cliente Supabase con la clave `service_role` (`src/lib/supabase/admin.ts`, protegido con el import `"server-only"` de Next.js para que el build falle si algo intenta importarlo desde código de cliente). `service_role` bypassea RLS por completo, así que no depende de ninguna policy — pero como solo se usa server-side, después de que el propio código ya resolvió el `restaurante_id` correcto vía `RESTAURANT_SLUG`, no hay forma de que un sitio escriba datos de otro. `getRestauranteId()` también pasó a usar `service_role` para el lookup por slug, porque `restaurantes` tampoco tiene policy de `select` para `anon`.

**Verificado con un test de integración** (`supabase/tests/tenant-isolation.mjs`) que confirma, contra la base real: (a) la clave `anon` no puede hacer `select` ni `insert` en `reservas` ni `restaurantes`, y (b) dos restaurantes de prueba quedan completamente aislados entre sí incluso para un usuario autenticado que administra solo uno de los dos. Ver la sección de testing más abajo para cómo correrlo.

**Bug real encontrado corriendo este test (2026-09-12), antes de `0003_usuario_restaurante_select_policy.sql`:** `usuario_restaurante` tenía RLS habilitado sin ninguna policy. Eso no solo bloqueaba a extraños (correcto) — bloqueaba a **cualquier** usuario autenticado de leer su propia fila de mapeo, porque el subquery de la policy de `reservas`/`restaurantes` (`... where usuario_id = auth.uid()`) corre con los privilegios de quien pregunta, y sin policy ese subquery devuelve 0 filas para todo el mundo. En la práctica, el futuro panel de administrador iba a estar roto para cualquier admin real, no solo aislado entre tenants. Se agregó una policy de `select` para que cada usuario vea su propia fila (`0003_usuario_restaurante_select_policy.sql`) — `insert`/`update`/`delete` de esa tabla siguen cerrados para `authenticated` a propósito, esa gestión es de la agencia vía `service_role`.

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

## Deploy

Pensado para Vercel (Hobby tier alcanza para el arranque). Conectar el repo de GitHub a un proyecto de Vercel y cargar ahí las tres variables de entorno (incluyendo `SUPABASE_SERVICE_ROLE_KEY` y `RESTAURANT_SLUG=muelle-3`).
