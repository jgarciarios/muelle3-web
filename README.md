# Muelle 3 — Sitio web

Sitio real de Muelle 3 (Kitchen & Bar, Playa Mansa, Punta del Este). Next.js 16 + TypeScript + Tailwind v4, con reservas guardadas en Supabase.

## Alcance v1

- **Home**: hero con foto real, identidad de marca, navegación.
- **Reservas**: formulario funcional que guarda en Supabase (`reservations`).
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
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → clave `anon` / `publishable` |

## Base de datos

La migración `supabase/migrations/0001_reservations.sql` crea la tabla `reservations` con RLS: cualquiera puede insertar una reserva, nadie puede leerlas con la clave pública (eso queda para el futuro panel de administrador, con la service role key desde el backend).

## Deploy

Pensado para Vercel (Hobby tier alcanza para el arranque). Conectar el repo de GitHub a un proyecto de Vercel y cargar las mismas variables de entorno ahí.
