# Muelle 3 — Plan maestro del proyecto

> Documento de contexto completo. Si esta conversación de Claude se corta o pierde memoria, empezar por acá — junto con `README.md` (detalle técnico) y el doc de Claude Project `muelle3-preguntas-para-reunion.md` (preguntas abiertas para la reunión con dueños/gerente). Este archivo vive en el repo (`PLAN.md`, raíz) para que tanto Claude (Cowork) como Claude Code puedan leerlo.
>
> Última actualización: 2026-09-16.
>
> **Regla de trabajo:** no inventar contenido, datos, fotos ni decisiones que no estén confirmadas por Juani. Si hay una duda, se pregunta — no se asume.

---

## 1. Qué es este proyecto

Sitio web real para **Muelle 3**, restaurante/bar (Kitchen & Bar) en Playa Mansa, Punta del Este, Uruguay. Cliente real de la agencia de Juani (JG Ventures). El proyecto llegó a través del padre de Juani, que es gerente actual del restaurante. Al 2026-09-16, los dueños mostraron interés real y ya tienen el hosting a su nombre — el proyecto pasó de "pitch" a "cliente que va a avanzar".

## 2. Quién es el cliente y cómo se gestiona

- Contacto principal: el padre de Juani (gerente del restaurante), que transmite pedidos de los dueños y de al menos un gerente adicional.
- El 2026-09-16 un gerente mandó una propuesta ampliada de sitio (ver sección 7). Todavía no hay una reunión formal con los dueños cerrando alcance y precio de esa propuesta ampliada — eso está pendiente.
- Instagram real verificado: `@muelle3.pde`, 25.100 seguidores, 494 publicaciones.

## 3. Stack técnico

- **Next.js 16** (App Router, Server Components/Server Actions, Turbopack) + **TypeScript** + **Tailwind v4**.
- Repo: `github.com/jgarciarios/muelle3-web` (privado). En el filesystem local del usuario: `~/Proyectos/muelle3-web`. En este entorno cloud: `/home/claude/muelle3-web`.
- Deploy pensado para **Vercel** (tier Hobby alcanza para el arranque) — **todavía no conectado** el repo a un proyecto de Vercel real.
- Base de datos: **Supabase** (`jg-ventures-db`), un único proyecto Postgres **compartido por todos los clientes de la agencia** (organización `jg-ventures`), no un proyecto por cliente — para no pegar contra el límite de 2 proyectos gratis por cuenta. Cada tabla de negocio tiene `restaurante_id` + Row Level Security por tenant.
- **Importante para cualquier sesión de Claude Code que trabaje en este repo:** `AGENTS.md`/`CLAUDE.md` en la raíz avisan que esta versión de Next.js puede tener breaking changes vs. el training data de cualquier modelo — hay que revisar `node_modules/next/dist/docs/` antes de escribir código nuevo. Ese archivo lo regenera `next dev` solo; si aparece en un diff sin que nadie lo haya tocado, es normal, se commitea así.

## 4. Identidad de marca — CONFIRMADA, no inventar variantes

### Tipografía (fundamental, no tocar sin discutirlo)

- **Serif (`font-serif`): Fraunces** — variable, con estilos `normal` e `italic`. Se usa en títulos (`h1`, `h2`), siempre en itálica bold para el tono "premium/editorial" del sitio (ver `src/app/layout.tsx`, `src/app/globals.css`).
- **Sans (`font-sans`): Inter** — cuerpo de texto, navegación, botones.
- Ambas cargadas vía `next/font/google` (`Inter`, `Fraunces`), no son imágenes ni web fonts externas — así se mantiene consistencia si algo se toca en el futuro.

### Paleta de colores (tomada de fotos reales del lugar, no inventada)

Definida en `src/app/globals.css` como custom properties + `@theme inline` de Tailwind:

| Token Tailwind | Hex | Uso |
|---|---|---|
| `celeste` | `#7dbeca` | acento día/mar |
| `celeste-deep` | `#3e747f` | secciones celeste oscuro (CTA) |
| `celeste-deep-2` | `#2c5860` | variante más oscura |
| `celeste-pale` | `#dcefef` | texto/fondos claros sobre celeste |
| `navy` | `#0d1a26` | fondo noche / hero / overlay de nav |
| `wood` | `#8a6239` | madera clara |
| `wood-2` | `#4a3421` | madera oscura |
| `mustard` | `#d99a3e` | acento cálido, botones CTA principales |
| `amber` | `#e8b56a` | luces/detalle ámbar, hover de nav |
| `ink` | `#1f3a40` | texto principal |
| `ink-muted` | `#51767b` | texto secundario |

Justificación: paleta sacada de fotos reales (madera, caña, mostaza, celeste de día, navy de noche, luces ámbar), no colores elegidos a ojo. El turquesa del mar (visible en la foto aérea del muelle) es válido como acento si se necesita en algún detalle nuevo.

### Logo

Oficial: blanco y negro, tipografía sans-serif bold en mayúsculas, cuadrado con borde fino, línea horizontal divisoria, "KITCHEN & BAR" debajo. El cuadrado celeste que se ve en Instagram es solo el fondo del avatar de esa red social — **no es el logo real**, no usarlo como tal en el sitio.

### Fotografía — estado actual

**No apresurar nada de fotos.** Juani va a mandar una carpeta/Drive con material adicional más adelante. Lo que hay confirmado hasta ahora:

- Foto aérea del muelle circular, alta resolución (1440×990) — en uso en el Home (`muelle-aereo-hq.png`).
- Fotos de fachada: de día (2104×1436, en uso: `fachada-dia-hq.png`) y de atardecer (882×1144, guardada, no en uso todavía).
- Fotos de terraza/interior (`terraza.png`) y del equipo (`equipo-real.png`), ambas en uso en la galería del Home.
- Fotos reales de mobiliario (wishbone claro), lámparas de mimbre, techo de caña, barra de madera oscura, arte/cuadros en pared.
- Flyer real de evento ("Nostalgia en el Muelle"): estética navy/duotono, serif elegante, texto tracked en caps — sugiere que Eventos podría tener un tratamiento visual nocturno propio en el futuro.
- **Mural de Carlos Páez Vilaró** (el de Casapueblo) dentro del restaurante — diferencial real de prestigio, tiene que quedar visible en "Nuestra Historia" cuando se escriba ese contenido. Ningún competidor local (Posto 5, I'marangatú) tiene algo así.
- Foto real del equipo en cocina/servicio ("Un buen servicio no se improvisa") — guardada como asset, todavía sin usar en el sitio.

Diseño de secciones sin fotos reales todavía (Menú, Historia, Eventos) se resuelve con tipografía + color + iconos/formas decorativas — no se espera a tener fotos para que la sección "se vea bien" (instrucción explícita de Juani).

### Hero del Home: carrusel de "moods" (2026-09-17)

Pedido de Juani: que alguien que nunca fue al lugar entienda, antes de reservar, qué se siente estar ahí — mostrar los distintos momentos del día (día, atardecer, noche), no solo una foto fija.

**Implementado** (`src/components/mood-carousel.tsx`): el hero del Home ahora cicla automáticamente cada 5 segundos (con crossfade, pausa al pasar el mouse) entre tres moods:
- **Día**: `muelle-aereo-hq.png` (foto real, vista aérea del muelle).
- **Atardecer**: `fachada-atardecer-hq.png` (foto real, ya estaba guardada sin usar).
- **Noche**: **todavía no hay foto real**. Se muestra un fondo de color de marca (navy + resplandor ámbar), NO una foto de stock bajada de internet — no se inventa contenido visual, y bajar fotos de stock de terceros trae problemas de derechos de autor. Reemplazar en `mood-carousel.tsx` en cuanto llegue una foto real de noche del Drive de Juani.

**Idea para más adelante, no implementada todavía**: reemplazar fotos por video de fondo cuando haya video real — Juani lo planteó como posibilidad futura ("eso se puede ir viendo"), no urgente para el lanzamiento del 1° de octubre.

### Música ambiente (bossa nova) — pendiente, NO implementado

Juani propuso sumar música ambiente tipo bossa nova que arranque al entrar al sitio, para reforzar la inmersión. Dos restricciones reales que hay que resolver antes de construir esto:

1. **Ningún navegador permite autoplay de audio sin un click previo del usuario** (política anti-molestia de Chrome/Safari/todos) — técnicamente no se puede que "sí o sí" arranque solo. La solución estándar es un botón sutil tipo "🔊 Entrar con sonido" en el hero, que dispara el audio recién ahí.
2. **La pista tiene que tener licencia de uso comercial** — no se puede usar una canción de bossa nova de un artista real sin pagar derechos. Falta que Juani consiga una pista con licencia (Artlist, Epidemic Sound, o una librería gratuita con licencia clara tipo Free Music Archive con atribución) — no se implementa nada de audio hasta tener el archivo real con derechos resueltos.

### Visión de experiencia end-to-end (2026-09-17)

Juani planteó que la "experiencia Muelle 3" no es solo la web — es todo el recorrido: desde que alguien entra a la página, hasta que reserva, va, lo atienden, come, y se retira (incluso el estacionamiento). La too web tiene que transmitir eso: vistas, buen trato, buenos platos, atención — no es un dato para programar ahora, es un principio de diseño y copywriting a mantener en cada sección que se escriba de acá en adelante (especialmente Nuestra Historia y la introducción del Home).

## 5. Decisión de arquitectura: Reservas van por Meitre, no sistema propio

Confirmado con los dueños (2026-09-13): **Meitre se mantiene**, no lo van a cambiar. Se investigó y confirmó técnicamente (no es una suposición):

1. La página de reservas de Meitre por restaurante (subdominio propio, ej. `muelle3.meitre.com`) **no se puede embeber en iframe** — probado en vivo, el navegador la bloquea (protección anti-clickjacking estándar).
2. **No hay API pública documentada** de Meitre para crear reservas desde código de terceros.

**Implementado:** `src/lib/meitre.ts` define `MEITRE_RESERVATION_URL = "https://muelle3.meitre.com/"`. Todos los botones "Reservar" del sitio (Home hero, Home CTA, overlay de navegación, páginas "muy pronto") son `<a>` directos a esa URL con `target="_blank"`, sin ningún paso intermedio — corrección explícita de Juani ("el boton de reservar me debe mandar directamente a meitre"). La ruta interna `/reservas` quedó como un `redirect()` puro a la misma URL, solo como red de seguridad por links viejos.

**Qué quedó desconectado pero NO borrado** (por decisión explícita de Juani, útil para otro cliente de la agencia sin sistema externo de reservas):
- `src/app/reservas/reservation-form.tsx`
- `src/app/reservas/actions.ts`
- `src/lib/supabase/tenant.ts`, `src/lib/supabase/admin.ts`
- `supabase/migrations/0001_multi_tenant_core.sql`, `0002_reservas_contacto_y_alta_publica.sql`, `0003_usuario_restaurante_select_policy.sql`
- `supabase/tests/tenant-isolation.mjs`

Detalle completo de la arquitectura multi-tenant de Supabase (incluyendo un incidente de seguridad RLS+anon que se encontró y cerró antes de aplicarse) está en `README.md`, sección "Base de datos — arquitectura multi-tenant".

## 6. Reseñas de Google — estado real

Home (`src/app/page.tsx`) y página `/resenas` tienen `ReviewsCarousel` (`src/components/reviews-carousel.tsx`):

1. **Botón "Dejá tu reseña"**: funcional de verdad, sin costo. Link estático a `https://search.google.com/local/writereview?placeid=...` usando el Place ID real de Muelle 3: `ChIJWXCHkPAFdZURHmmQYvcPoBU` (sacado de la URL pública de Google Maps del lugar, verificado visualmente contra la ubicación real en Playa Mansa).
2. **Carrusel de reviews**: hoy muestra **datos de ejemplo inventados a propósito** (`src/lib/reviews-placeholder.ts` — 5 reviews con nombres, estrellas y textos ficticios), con autoplay cada 3 segundos (pausa al pasar el mouse/foco) y un badge visible **"Vista previa · reseñas de ejemplo"**. Esto fue aprobado explícitamente por Juani como demo interna para mostrarle a los dueños cómo va a quedar — nunca se muestra como si fueran reseñas reales.

**Para pasar a reviews reales** hace falta (no está hecho, bloqueado hasta que exista):
- Un proyecto de Google Cloud con **Places API habilitada y billing activo** (no existe todavía).
- Una llamada server-side a la Places API (`Place Details`, campo `reviews`, máximo 5 resultados — límite de la API, no nuestro), cacheada.
- Sacar el badge de vista previa y reemplazar `PLACEHOLDER_REVIEWS` por datos reales.

**Regla dura:** este sitio no se publica en producción con las reviews de ejemplo mostradas sin el badge de vista previa.

## 7. Navegación — rediseño ya implementado

Se descartó el menú hamburguesa clásico arriba a la derecha por pedido explícito de Juani de algo "más original". Se mostraron variantes visuales (mockup interactivo, Artifact) y Juani eligió **Variante A: overlay a pantalla completa**.

Implementado en `src/components/nav.tsx`: botón "MENÚ" (pill, esquina superior derecha) que abre un overlay navy a pantalla completa, deslizándose desde arriba (500ms, cubic-bezier), con los links en Fraunces itálica grande, entrada escalonada por link, bloqueo de scroll del body mientras está abierto, y cierre con Escape o click afuera del link. Los links internos hoy: Menú, Nuestra Historia, Eventos, Reseñas — más un último ítem "Reservas" en color ámbar que va directo a Meitre (no es un link interno).

## 8. Pricing acordado (antes de la propuesta ampliada)

- **USD 300 de setup** (pago único, precio fijo, incluye dominio propio).
- **USD 50/mes** de mantenimiento (hosting, cambios de contenido, soporte técnico básico, SSL).
- Explícitamente **fuera de este precio** (se cotizan aparte si se quieren): WhatsApp Business API para recordatorios automáticos de reserva, panel de administración propio, base de datos de clientes, blog de comunidad.
- Este pricing sigue vigente para la **Fase 1** actual (ver sección 9). La propuesta ampliada del gerente (Fase 2) todavía no tiene precio definido — pendiente de conversación con los dueños.

## 9. Propuesta ampliada del gerente (2026-09-16) y decisión de fases

Un gerente mandó una propuesta de sitio mucho más grande que el alcance original, con tres partes:

**(a) Buena noticia:** los dueños están interesados de verdad y ya tienen el hosting a su nombre.

**(b) Pedido explícito del gerente:** que el proyecto sea "muy profesional", que se vea "todo el ciclo de vida del desarrollo del software", y que la seguridad ante cualquier amenaza y "todo lo que es legal" sean fundamentales. **Esto todavía no tiene una definición concreta de qué esperan exactamente** (¿documentación formal? ¿ambiente de staging? ¿QA checklist? ¿proceso de aprobación de contenido?) — pendiente de preguntarles.

**(c) Sitemap propuesto, 10 secciones:**
1. Home
2. El Muelle (historia/concepto)
3. Gastronomía (menú en HTML indexable, no PDF)
4. Experiencias (Beach/Day, Sunset, Night, Eventos, Privadas — como sub-secciones)
5. Eventos (con formulario de cotización)
6. **Sponsors & Partners** (media kit descargable, oportunidades de marca: naming, exclusividad de categoría, branding, product placement — apuntado a bancos, bebidas, ropa, autos, tecnología)
7. Agenda (calendario de eventos: fecha/hora/DJ/sponsor)
8. Galería editorial
9. Reservas
10. Contacto/Ubicación

**Lectura de Juani sobre esta propuesta (para discutir con el gerente/dueños, todavía no resuelto):**
1. Este alcance rompe el pricing de USD 300 + USD 50/mes — hay que re-cotizar, no construirlo gratis dentro del precio ya acordado.
2. Sponsors & Partners es en el fondo un producto de ventas B2B: el sitio puede mostrar el media kit y capturar el lead ("quiero ser sponsor"), pero los contratos, exclusividad, facturación a las marcas y cumplimiento fiscal son responsabilidad del restaurante, no algo que resuelva el sitio.
3. "Todo el ciclo de vida del desarrollo" necesita definición concreta del cliente — mientras no la haya, se interpreta como buenas prácticas razonables ya en uso (staging + QA + control de versiones vía GitHub), no como proceso de software enterprise.
4. Seguridad realista para un sitio de este tamaño: HTTPS (Vercel lo da por defecto), secrets nunca en el cliente, rate-limiting/anti-spam en formularios públicos nuevos, validación de inputs, dependencias actualizadas, backups de base de datos. No corresponde un pentest formal salvo que se pida y pague aparte.
5. Legal: **Claude/Juani no son abogados.** Un sitio que junta datos personales (cotización de eventos, contacto de sponsors) probablemente cae bajo la Ley N° 18.331 de Uruguay (protección de datos personales) y su registro ante la URCDP. Se puede redactar una política de privacidad en lenguaje claro, pero su validez legal la tiene que confirmar un abogado real — sobre todo si hay contratos comerciales con sponsors de por medio.

### Decisión tomada por Juani (2026-09-16): avanzar con un subconjunto acotado

**Fase 1 — dentro del pricing actual (USD 300 + USD 50/mes), se construye AHORA:**
- Home (ya existe)
- Menú / Gastronomía (hoy placeholder "muy pronto" — falta contenido real de Juani)
- Nuestra Historia (hoy placeholder — falta contenido real; posible fusión de nombre con "El Muelle" del pitch del gerente, a decidir)
- Eventos, **incluyendo el formulario de solicitud de cotización** (entra en Fase 1 — chico, alto valor, ya estaba contemplado desde antes de la propuesta ampliada)
- Reseñas (ya funcional con datos de ejemplo)
- Reservas (ya resuelto — redirect directo a Meitre)
- Contacto/Ubicación (página nueva, no existía como sección propia — simple: mapa, dirección, WhatsApp/teléfono, horarios)

**Fase 2 — a cotizar aparte con los dueños, NO se construye todavía:**
- Sponsors & Partners (media kit + captura de leads B2B)
- Agenda de eventos (calendario)
- Galería editorial
- "Experiencias" como sección propia segmentada (Beach/Sunset/Night/Eventos/Privadas) — la versión simple de esto ya vive dentro de la página de Eventos de Fase 1

**Pendiente:** decidir con el gerente/dueños si Fase 2 se re-cotiza completa de una vez, o si se va sumando de a partes según interés real (por ejemplo, primero Sponsors si aparece una marca interesada).

## 10. Orden de construcción propuesto para Fase 1

1. **Menú/Gastronomía** — más urgente, hoy vacío. Bloqueado por contenido real (la carta) de Juani.
2. **Nuestra Historia** — bloqueado por contenido real (año de apertura, mención del mural de Páez Vilaró, nombres del equipo).
3. **Formulario de cotización de Eventos** — no depende de contenido nuevo, se puede construir ya.
4. **Contacto/Ubicación** — página nueva simple. Falta el número de WhatsApp real.
5. **Reseñas** — ya está, sin cambios pendientes por ahora.

## 11. Timeline — CONFIRMADO (2026-09-16)

**Deadline real dado por Juani: antes del 1° de octubre de 2026 (~14 días desde el 16/09), sitio 100% terminado, subido a producción con dominio propio, y promocionado activamente desde el link de Instagram.** No es un objetivo suave — es la fecha de lanzamiento público.

### Decisiones tomadas para poder cumplir el plazo (2026-09-16)

- **Reseñas:** Juani eligió activar las reviews reales de Google antes del lanzamiento (no lanzar con el carrusel de ejemplo público). Acción de Juani: crear el proyecto de Google Cloud con Places API + billing activo (ver sección 6) — es el único paso que depende 100% de él para esto.
- **Contenido crítico (carta del menú + texto básico de Nuestra Historia):** Juani se comprometió a entregarlo en 2-3 días desde el 16/09 (o sea, ~18/19 de septiembre). Es la fecha que define si el cronograma de abajo se cumple tal cual.

### Cronograma día por día (arranca 2026-09-16)

| Días | Qué pasa |
|---|---|
| **1-3** (16-18/09) | **No depende de contenido, arranca ya:** formulario de cotización de Eventos, página de Contacto/Ubicación, conectar el repo a un proyecto de Vercel (deploy de staging real). **Depende de Juani, en paralelo:** carta del menú + texto de Historia, crear proyecto Google Cloud + billing para Places API, número de WhatsApp real. |
| **4-7** (19-22/09) | Con el contenido en mano: construir Menú y Nuestra Historia reales, conectar las reviews reales de Google (Places API), sacar el badge de "vista previa". |
| **8-10** (23-25/09) | QA completo: mobile + desktop, todos los navegadores, cada botón "Reservar" probado a mano, formulario de Eventos y de Contacto probados de punta a punta. |
| **11-13** (26-28/09) | Buffer para imprevistos, dominio propio conectado en Vercel, revisión final de Juani de todo el sitio antes de publicar. |
| **14** (~29/09-01/10) | Publicación real: dominio en vivo, actualizar el link de Instagram, avisar a los dueños. |

**Riesgo principal del cronograma, dicho sin vueltas:** lo que puede atrasar esto no es el código — es el contenido que depende de terceros (la carta, el texto de historia, el número de WhatsApp, y que Juani cree el proyecto de Google Cloud). Cualquier atraso en esos puntos come directamente los 3 días de buffer que tiene el plan.

## 12. Backup técnico: Claude Code

Juani tiene Claude Code disponible como respaldo si algo falla en este entorno (Cowork) — por ejemplo, para debug local directo en su Mac, correr el dev server (`npm run dev` — esto **tiene que correr en su Terminal real, no a través del puente a este entorno**, ver nota técnica abajo), o cualquier tarea que necesite estar en su máquina real. Por eso este archivo vive en el repo: para que una sesión de Claude Code, sin memoria de esta conversación, pueda leer `PLAN.md` + `README.md` y tener el mismo contexto.

**Nota técnica confirmada:** el puente a la máquina de Juani desde este entorno cloud (`device_bash`) corre en una VM Linux aislada dentro de su Mac, arquitectónicamente distinta de su Terminal real — no se puede usar para levantar un dev server que Juani vaya a ver en su propio navegador. Confirmado dos veces con errores reales (intento de descarga de binario Linux de SWC fallando por red). Juani debe correr `npm run dev` él mismo en su Terminal.

## 13. Pendientes de Juani — checklist activo (actualizado 2026-09-16, tarde)

**Recordatorio permanente:** en cada turno de esta conversación, si alguno de estos puntos sigue sin resolverse, hay que volver a preguntarlo — no dejar que se pierda.

- [x] **Carta del menú** (texto, sin precios) — RECIBIDA el 16/09 como "Carta 2026.pdf". Contenido completo extraído: Entradas, Pizzas, Sandwiches, Ensaladas, Principales (chef ejecutivo Javier Carballo), Postres, Bebidas/Cervezas/Ponches/Limonadas/Detox, Classic Cocktails + Cocktails de Autor, Desayuno & Tarde, Cafetería. Falta construir la página `/menu` con esto (sin mostrar precios, por la decisión ya tomada).
- [x] **Texto básico de Nuestra Historia** — RECIBIDO en la misma "Carta 2026.pdf" (página 1, "NUESTRA HISTORIA"): origen en la vieja cantina del Club de Pesca en la Parada 3 de La Mansa, mural de Carlos Páez Vilaró (una sirena, restaurada en 1996 para la inauguración). Falta construir la página `/historia` con esto — confirmar con Juani si se usa tal cual (es texto propio del cliente, no de terceros) o se reescribe.
- [ ] **Dirección de mail para el aviso de cotizaciones de Eventos** (`EVENTOS_NOTIFICATION_EMAIL`) — la misma Carta 2026.pdf menciona `muelle3pde@gmail.com` como mail de contacto para eventos. Es un candidato fuerte, pero **no se aplicó todavía** — falta confirmación explícita de Juani antes de usarlo (regla: no inventar/asumir datos del cliente).
- [ ] **Carpeta de Drive de fotos** ("FOTOS JUL 26", carpeta compartida el 16/09) — **bloqueada**: la carpeta se confirma accesible (`get_file_metadata` la ve, dueño `contenidovitti@gmail.com`), pero `search_files` con filtro `parentId` devuelve vacío en 4 intentos distintos, y tampoco aparece en `list_recent_files`. No se pudo listar ni un archivo dentro. Posible demora de indexación por lo reciente del share, o alguna limitación de permisos de la carpeta. Pendiente: pedirle a Juani que abra la carpeta él mismo y comparta 2-3 links de archivos individuales como prueba, o esperar y reintentar.
- [ ] **Número de WhatsApp real** (Reservas/Eventos/Contacto) — hoy el bloque de WhatsApp en `/contacto` está oculto (`WHATSAPP_NUMBER = null` en `src/lib/site-info.ts`) hasta tener el número real.
- [ ] **Dirección textual y horarios** para `/contacto` (`ADDRESS_TEXT`, `HORARIOS` en `src/lib/site-info.ts`, hoy vacíos).
- [ ] **Proyecto de Google Cloud con billing activo** para Places API (reviews reales) — Juani eligió activarlo antes del lanzamiento del 1° de octubre (ver sección 11). Sin esto, el carrusel de reseñas no puede salir de "vista previa" y no se puede lanzar públicamente con reviews de ejemplo.
- [ ] **Cuenta de Resend** (gratis) + `RESEND_API_KEY` para que el formulario de Eventos mande el aviso por mail (además de guardarlo en base, que ya funciona sin esto).
- [ ] Definición concreta de "todo el ciclo de vida del desarrollo del software" que pide el gerente (sección 9).
- [ ] Cómo y cuándo se re-cotiza la Fase 2 (Sponsors/Agenda/Galería) con los dueños (sección 9).
- [ ] Nombre final de la sección "Nuestra Historia" vs. "El Muelle" (¿se fusionan, o quedan separadas más adelante?).
- [ ] Nombre de dominio propio a conectar en Vercel antes del lanzamiento.
- [ ] **Preguntar a los dueños en la llamada: orden de las reviews reales de Google.** La API solo devuelve un máximo de 5 reviews (tope de Google, no editable) y solo permite elegir el ORDEN, no cuáles aparecen: `most_relevant` (el mismo criterio/algoritmo que usa Google Maps por default — mezcla utilidad, detalle y calidad, NO es "usuarios con más reseñas dadas" como criterio separado) o `newest` (las 5 últimas por fecha, sin filtrar por calidad). Definir cuál prefieren antes de conectar la Places API real.

## 14. Dónde está cada cosa (mapa de archivos clave)

```
muelle3-web/
├── PLAN.md                          ← este archivo
├── README.md                        ← detalle técnico completo (Supabase, Meitre, seguridad, testing, deploy)
├── AGENTS.md / CLAUDE.md            ← advertencia sobre Next.js 16 (breaking changes vs. training data)
├── .env.local.example               ← variables de entorno documentadas
├── src/
│   ├── app/
│   │   ├── page.tsx                 ← Home
│   │   ├── layout.tsx               ← fuentes (Inter, Fraunces)
│   │   ├── globals.css              ← paleta de colores, tokens de Tailwind
│   │   ├── menu/page.tsx            ← placeholder "muy pronto"
│   │   ├── historia/page.tsx        ← placeholder "muy pronto"
│   │   ├── eventos/page.tsx         ← placeholder "muy pronto"
│   │   ├── resenas/page.tsx         ← carrusel de reseñas real (con datos de ejemplo)
│   │   └── reservas/
│   │       ├── page.tsx             ← redirect puro a Meitre
│   │       ├── reservation-form.tsx ← DESCONECTADO, no borrar
│   │       └── actions.ts           ← DESCONECTADO, no borrar
│   ├── components/
│   │   ├── nav.tsx                  ← overlay de navegación pantalla completa
│   │   ├── reviews-carousel.tsx     ← carrusel con autoplay
│   │   └── coming-soon.tsx          ← template de las páginas "muy pronto"
│   └── lib/
│       ├── meitre.ts                ← MEITRE_RESERVATION_URL
│       ├── reviews-placeholder.ts   ← datos de ejemplo de reseñas
│       └── supabase/
│           ├── tenant.ts            ← DESCONECTADO, no borrar
│           └── admin.ts             ← DESCONECTADO, no borrar
└── supabase/
    ├── migrations/                  ← schema multi-tenant (aplicado en jg-ventures-db)
    └── tests/tenant-isolation.mjs   ← test de aislamiento entre clientes de la agencia
```
