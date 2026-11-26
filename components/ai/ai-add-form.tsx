"use client";

import { useActionState } from "react";
import { TextField } from "@/components/form/text-field";
import {
  createMedicationFromReview,
  suggestSchedule,
} from "@/app/(app)/medications/ai-actions";
import { weekdayLabels } from "@/lib/time";
import type {
  ReviewState,
  Suggestion,
  SuggestionState,
} from "@/lib/validation";

function ReviewForm({ suggestion }: { suggestion: Suggestion }) {
  const [state, formAction, pending] = useActionState(
    createMedicationFromReview,
    {} as ReviewState
  );

  const values = state.values ?? suggestion;
  const errors = state.errors ?? {};
  const slots = Math.min(6, Math.max(values.times.length + 1, 2));

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-6 rounded-bay border-2 border-ink bg-tablet p-6"
    >
      <div>
        <h2 className="text-3xl">Check the suggestion</h2>
        <p className="mt-2 text-lg text-ink-soft">
          Change anything that&apos;s wrong. Nothing is saved until you press
          Add this medicine.
        </p>
      </div>

      {suggestion.assumptions && (
        <p className="rounded-bay border-2 border-ink bg-foil p-4">
          <span className="font-bold">Check this:</span> {suggestion.assumptions}
        </p>
      )}

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
        defaultValue={values.instructions}
        error={errors.instructions}
        multiline
      />

      <fieldset aria-describedby="times-hint">
        <legend className="font-bold">Times</legend>
        <p id="times-hint" className="text-ink-soft">
          Clear a box to remove that time. Use an empty box to add another.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {Array.from({ length: slots }).map((_, index) => (
            <input
              key={index}
              type="time"
              name="times"
              defaultValue={values.times[index] ?? ""}
              aria-label={`Time ${index + 1}`}
              className="rounded-bay border-2 border-ink bg-white px-4 py-3 text-lg"
            />
          ))}
        </div>
        {errors.times && (
          <p className="mt-2 font-bold text-poppy">{errors.times}</p>
        )}
      </fieldset>

      <fieldset>
        <legend className="font-bold">Days</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {weekdayLabels.map((label, index) => (
            <label
              key={label}
              className="flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-bold"
            >
              <input
                type="checkbox"
                name="days"
                value={index}
                defaultChecked={values.days.includes(index)}
                className="size-5 accent-ink"
              />
              {label}
            </label>
          ))}
        </div>
        {errors.days && (
          <p className="mt-2 font-bold text-poppy">{errors.days}</p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add this medicine"}
      </button>
    </form>
  );
}

export function AiAddForm() {
  const [state, formAction, pending] = useActionState(
    suggestSchedule,
    {} as SuggestionState
  );

  return (
    <div className="space-y-8">
      <form
        action={formAction}
        noValidate
        className="space-y-4 rounded-bay border-2 border-ink bg-tablet p-6"
      >
        {state.message && (
          <p
            role="alert"
            className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
          >
            {state.message}
          </p>
        )}

        <div>
          <label htmlFor="text" className="block font-bold">
            How do you take it?
          </label>
          <p id="text-hint" className="text-ink-soft">
            Write it the way the label reads. For example: Metformin 500 mg
            twice a day after meals.
          </p>
          <textarea
            id="text"
            name="text"
            rows={3}
            maxLength={300}
            defaultValue={state.text ?? ""}
            aria-describedby="text-hint"
            className="mt-2 w-full rounded-bay border-2 border-ink bg-white px-4 py-3 text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
        >
          {pending ? "Working on it..." : "Suggest a schedule"}
        </button>
      </form>

      {state.suggestion && (
        <ReviewForm
          key={JSON.stringify(state.suggestion)}
          suggestion={state.suggestion}
        />
      )}
    </div>
  );
}