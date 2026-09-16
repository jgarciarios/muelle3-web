"use client";

import { useActionState } from "react";
import { createEventQuote, type EventQuoteFormState } from "./actions";

const initialState: EventQuoteFormState = { status: "idle" };

const TIPOS_EVENTO = [
  { value: "cumpleanos", label: "Cumpleaños" },
  { value: "corporativo", label: "Corporativo" },
  { value: "casamiento", label: "Casamiento" },
  { value: "privado", label: "Evento privado" },
  { value: "otro", label: "Otro" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export function EventQuoteForm() {
  const [state, formAction, pending] = useActionState(createEventQuote, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg bg-celeste-pale p-6 text-celeste-deep-2">
        <p className="font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-ink">
            Nombre y apellido
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.nombre} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-ink">
            Teléfono <span className="text-ink-muted font-normal">(opcional)</span>
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="+598 xx xxx xxx"
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
        </div>
        <div>
          <label htmlFor="tipoEvento" className="block text-sm font-medium text-ink">
            Tipo de evento
          </label>
          <select
            id="tipoEvento"
            name="tipoEvento"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          >
            <option value="" disabled>
              Elegí una opción
            </option>
            {TIPOS_EVENTO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.tipoEvento} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fechaAproximada" className="block text-sm font-medium text-ink">
            Fecha aproximada <span className="text-ink-muted font-normal">(opcional)</span>
          </label>
          <input
            id="fechaAproximada"
            name="fechaAproximada"
            type="date"
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
        </div>
        <div>
          <label htmlFor="cantidadPersonas" className="block text-sm font-medium text-ink">
            Cantidad de personas <span className="text-ink-muted font-normal">(opcional)</span>
          </label>
          <input
            id="cantidadPersonas"
            name="cantidadPersonas"
            type="number"
            min={1}
            max={500}
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.cantidadPersonas} />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-ink">
          Contanos sobre tu evento <span className="text-ink-muted font-normal">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          placeholder="Fecha tentativa, horario, algo que tengamos que saber..."
          className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-celeste-deep px-6 py-3 font-semibold text-white transition hover:bg-celeste-deep-2 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Enviando..." : "Pedir cotización"}
      </button>
    </form>
  );
}
