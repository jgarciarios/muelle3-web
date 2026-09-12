"use client";

import { useActionState } from "react";
import { createReservation, type ReservationFormState } from "./actions";

const initialState: ReservationFormState = { status: "idle" };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export function ReservationForm() {
  const [state, formAction, pending] = useActionState(createReservation, initialState);

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
          <label htmlFor="telefono" className="block text-sm font-medium text-ink">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            placeholder="+598 xx xxx xxx"
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.telefono} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email <span className="text-ink-muted font-normal">(opcional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-ink">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.fecha} />
        </div>
        <div>
          <label htmlFor="hora" className="block text-sm font-medium text-ink">
            Horario
          </label>
          <input
            id="hora"
            name="hora"
            type="time"
            required
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.hora} />
        </div>
        <div>
          <label htmlFor="personas" className="block text-sm font-medium text-ink">
            Personas
          </label>
          <input
            id="personas"
            name="personas"
            type="number"
            min={1}
            max={30}
            required
            defaultValue={2}
            className="mt-1 w-full rounded-md border border-ink-muted/30 px-3 py-2 focus:border-celeste-deep focus:outline-none focus:ring-1 focus:ring-celeste-deep"
          />
          <FieldError message={state.fieldErrors?.personas} />
        </div>
      </div>

      <div>
        <label htmlFor="notas" className="block text-sm font-medium text-ink">
          Algo que debamos saber <span className="text-ink-muted font-normal">(opcional)</span>
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          placeholder="Cumpleaños, mesa con vista, alguna preferencia..."
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
        {pending ? "Enviando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
