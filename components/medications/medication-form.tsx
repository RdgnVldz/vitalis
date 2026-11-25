"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TextField } from "@/components/form/text-field";
import type { MedicationFormState } from "@/lib/validation";

type MedicationFormProps = {
  action: (
    state: MedicationFormState,
    formData: FormData
  ) => Promise<MedicationFormState>;
  initialValues?: { name: string; dose: string; instructions: string };
  submitLabel: string;
  pendingLabel: string;
};

const emptyValues = { name: "", dose: "", instructions: "" };

export function MedicationForm({
  action,
  initialValues,
  submitLabel,
  pendingLabel,
}: MedicationFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    {} as MedicationFormState
  );

  const values = state.values ?? initialValues ?? emptyValues;
  const errors = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.message && (
        <p
          role="alert"
          className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
        >
          {state.message}
        </p>
      )}

      <TextField
        id="name"
        name="name"
        label="Medicine name"
        defaultValue={values.name}
        error={errors.name}
      />
      <TextField
        id="dose"
        name="dose"
        label="Dose"
        hint="For example: 500 mg, or 1 tablet."
        defaultValue={values.dose}
        error={errors.dose}
      />
      <TextField
        id="instructions"
        name="instructions"
        label="Instructions (optional)"
        hint="For example: take with food."
        defaultValue={values.instructions}
        error={errors.instructions}
        multiline
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        <Link
          href="/medications"
          className="rounded-full border-2 border-ink px-7 py-3.5 text-lg font-bold"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}