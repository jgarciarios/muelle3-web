#!/usr/bin/env node
/**
 * Test de integración de aislamiento multi-tenant para jg-ventures-db.
 *
 * Corre contra la base REAL (no mockea nada), usando @supabase/supabase-js
 * directo — sin pasar por la app Next.js. Pensado para correrse a mano
 * antes de tocar cualquier policy de RLS de `reservas` / `restaurantes`.
 *
 * Uso:
 *   node --env-file=.env.local supabase/tests/tenant-isolation.mjs
 *
 * Requiere: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
 * SUPABASE_SERVICE_ROLE_KEY.
 *
 * Qué verifica:
 *   1. La clave `anon` NO puede leer ni escribir en `reservas` ni
 *      `restaurantes` directo contra la API REST (sin pasar por ningún
 *      Server Action) — el bug de seguridad que motivó este test.
 *   2. Dos restaurantes de prueba quedan aislados entre sí: un usuario
 *      autenticado que administra solo el restaurante A no puede leer,
 *      insertar ni actualizar reservas del restaurante B.
 *
 * Crea y borra sus propios datos de prueba (dos restaurantes, sus reservas,
 * y un usuario de Supabase Auth) — no debería dejar basura en la base
 * compartida ni si falla a mitad de camino (best-effort cleanup en finally).
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltan env vars. Necesito NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY y SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Corré con: node --env-file=.env.local supabase/tests/tenant-isolation.mjs"
  );
  process.exit(1);
}

const admin = createClient(URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anon = createClient(URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "OK  " : "FAIL"} — ${name}${detail ? ` (${detail})` : ""}`);
}

const runId = randomUUID().slice(0, 8);
const slugA = `test-tenant-a-${runId}`;
const slugB = `test-tenant-b-${runId}`;
const testEmail = `tenant-isolation-test-${runId}@jg-ventures.test`;
const testPassword = `Test-${randomUUID()}`;

let restauranteA, restauranteB, reservaA, reservaB, testUserId;

async function setup() {
  const { data: rA, error: eA } = await admin
    .from("restaurantes")
    .insert({ slug: slugA, nombre: "[TEST] Tenant A" })
    .select("id")
    .single();
  if (eA) throw new Error(`Setup: no pude crear restaurante A: ${eA.message}`);
  restauranteA = rA.id;

  const { data: rB, error: eB } = await admin
    .from("restaurantes")
    .insert({ slug: slugB, nombre: "[TEST] Tenant B" })
    .select("id")
    .single();
  if (eB) throw new Error(`Setup: no pude crear restaurante B: ${eB.message}`);
  restauranteB = rB.id;

  const { data: resA, error: eResA } = await admin
    .from("reservas")
    .insert({
      restaurante_id: restauranteA,
      nombre_cliente: "[TEST] Cliente A",
      telefono: "+598 00 000 000",
      fecha: new Date().toISOString(),
      personas: 2,
      estado: "pendiente",
    })
    .select("id")
    .single();
  if (eResA) throw new Error(`Setup: no pude crear reserva A: ${eResA.message}`);
  reservaA = resA.id;

  const { data: resB, error: eResB } = await admin
    .from("reservas")
    .insert({
      restaurante_id: restauranteB,
      nombre_cliente: "[TEST] Cliente B",
      telefono: "+598 00 000 000",
      fecha: new Date().toISOString(),
      personas: 2,
      estado: "pendiente",
    })
    .select("id")
    .single();
  if (eResB) throw new Error(`Setup: no pude crear reserva B: ${eResB.message}`);
  reservaB = resB.id;

  const { data: userData, error: eUser } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
  });
  if (eUser) throw new Error(`Setup: no pude crear usuario de prueba: ${eUser.message}`);
  testUserId = userData.user.id;

  const { error: eMap } = await admin
    .from("usuario_restaurante")
    .insert({ usuario_id: testUserId, restaurante_id: restauranteA, rol: "admin" });
  if (eMap) throw new Error(`Setup: no pude asignar el usuario a Tenant A: ${eMap.message}`);
}

async function testAnonBlocked() {
  const { data: selReservas, error: errSelReservas } = await anon
    .from("reservas")
    .select("id")
    .eq("restaurante_id", restauranteA);
  check(
    "anon no puede leer reservas",
    !!errSelReservas || (selReservas?.length ?? 0) === 0,
    errSelReservas ? errSelReservas.message : `filas devueltas: ${selReservas?.length ?? 0}`
  );

  const { error: errInsReservas } = await anon.from("reservas").insert({
    restaurante_id: restauranteA,
    nombre_cliente: "[TEST] Insert anon (debe fallar)",
    telefono: "+598 00 000 000",
    fecha: new Date().toISOString(),
    personas: 1,
    estado: "pendiente",
  });
  check("anon no puede insertar en reservas", !!errInsReservas, errInsReservas?.message);

  const { data: selRest, error: errSelRest } = await anon
    .from("restaurantes")
    .select("id")
    .eq("slug", slugA);
  check(
    "anon no puede leer restaurantes",
    !!errSelRest || (selRest?.length ?? 0) === 0,
    errSelRest ? errSelRest.message : `filas devueltas: ${selRest?.length ?? 0}`
  );
}

async function testTenantIsolationForAuthenticatedUser() {
  const authedClient = createClient(URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: signInError } = await authedClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (signInError) {
    check("login del usuario de prueba", false, signInError.message);
    return;
  }

  const { data: propias } = await authedClient
    .from("reservas")
    .select("id")
    .eq("id", reservaA);
  check(
    "usuario admin de Tenant A ve su propia reserva",
    (propias?.length ?? 0) === 1,
    `filas devueltas: ${propias?.length ?? 0}`
  );

  const { data: ajenas } = await authedClient
    .from("reservas")
    .select("id")
    .eq("id", reservaB);
  check(
    "usuario admin de Tenant A NO ve la reserva de Tenant B",
    (ajenas?.length ?? 0) === 0,
    `filas devueltas: ${ajenas?.length ?? 0}`
  );

  const { data: updData, error: updError } = await authedClient
    .from("reservas")
    .update({ estado: "confirmada" })
    .eq("id", reservaB)
    .select("id");
  check(
    "usuario admin de Tenant A NO puede actualizar la reserva de Tenant B",
    !!updError || (updData?.length ?? 0) === 0,
    updError ? updError.message : `filas afectadas: ${updData?.length ?? 0}`
  );

  const { data: restList } = await authedClient.from("restaurantes").select("id");
  const ids = (restList ?? []).map((r) => r.id);
  check(
    "usuario admin de Tenant A solo ve Tenant A en restaurantes",
    ids.length === 1 && ids[0] === restauranteA,
    `restaurantes visibles: ${ids.length}`
  );

  await authedClient.auth.signOut();
}

async function cleanup() {
  const errors = [];
  if (reservaA) {
    const { error } = await admin.from("reservas").delete().eq("id", reservaA);
    if (error) errors.push(`reserva A: ${error.message}`);
  }
  if (reservaB) {
    const { error } = await admin.from("reservas").delete().eq("id", reservaB);
    if (error) errors.push(`reserva B: ${error.message}`);
  }
  // Cualquier reserva que el test de "anon insert" haya logrado colar (no debería).
  if (restauranteA) {
    await admin
      .from("reservas")
      .delete()
      .eq("restaurante_id", restauranteA)
      .ilike("nombre_cliente", "[TEST]%");
  }
  if (testUserId && restauranteA) {
    const { error } = await admin
      .from("usuario_restaurante")
      .delete()
      .eq("usuario_id", testUserId)
      .eq("restaurante_id", restauranteA);
    if (error) errors.push(`usuario_restaurante: ${error.message}`);
  }
  if (testUserId) {
    const { error } = await admin.auth.admin.deleteUser(testUserId);
    if (error) errors.push(`usuario de prueba: ${error.message}`);
  }
  if (restauranteA) {
    const { error } = await admin.from("restaurantes").delete().eq("id", restauranteA);
    if (error) errors.push(`restaurante A: ${error.message}`);
  }
  if (restauranteB) {
    const { error } = await admin.from("restaurantes").delete().eq("id", restauranteB);
    if (error) errors.push(`restaurante B: ${error.message}`);
  }
  if (errors.length > 0) {
    console.warn("Cleanup con errores (puede haber quedado basura de prueba):");
    errors.forEach((e) => console.warn(`  - ${e}`));
  }
}

async function main() {
  console.log(`Corriendo tenant-isolation test (run ${runId}) contra ${URL}...\n`);
  try {
    await setup();
    await testAnonBlocked();
    await testTenantIsolationForAuthenticatedUser();
  } catch (err) {
    console.error("\nError durante el test:", err.message);
    results.push({ name: "ejecución del test", ok: false, detail: err.message });
  } finally {
    await cleanup();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks OK.`);
  if (failed.length > 0) {
    console.log("\nFallaron:");
    failed.forEach((r) => console.log(`  - ${r.name}${r.detail ? `: ${r.detail}` : ""}`));
    process.exit(1);
  }
  process.exit(0);
}

main();
