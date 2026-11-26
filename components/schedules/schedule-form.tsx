"use client";

import { useActionState } from "react";
import { TextField } from "@/components/form/text-field";
import { weekdayLabels } from "@/lib/time";
import type {
  ScheduleFormState,
  ScheduleFormValues,
} from "@/lib/validation";

type ScheduleFormProps = {
  action: (
    state: ScheduleFormState,
    formData: FormData
  ) => Promise<ScheduleFormState>;
  defaultStartDate: string;
};

export function ScheduleForm({ action, defaultStartDate }: ScheduleFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    {} as ScheduleFormState
  );

  const defaults: ScheduleFormValues = {
    time: "08:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    startDate: defaultStartDate,
    endDate: "",
  };
  const values = state.values ?? defaults;
  const errors = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.success && state.message && (
        <p
          role="status"
          className="rounded-bay border-2 border-ink bg-foil p-4 font-bold"
        >
          {state.message}
        </p>
      )}
      {!state.success && state.message && (
        <p
          role="alert"
          className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
        >
          {state.message}
        </p>
      )}

      <TextField
        id="time"
        name="time"
        type="time"
        label="Time"
        defaultValue={values.time}
        error={errors.time}
      />

      <fieldset aria-describedby={errors.days ? "days-error" : undefined}>
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
          <p id="days-error" className="mt-2 font-bold text-poppy">
            {errors.days}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="startDate"
          name="startDate"
          type="date"
          label="Starts on"
          defaultValue={values.startDate}
          error={errors.startDate}
        />
        <TextField
          id="endDate"
          name="endDate"
          type="date"
          label="Ends on (optional)"
          hint="Leave empty to repeat with no end."
          defaultValue={values.endDate}
          error={errors.endDate}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add this time"}
      </button>
    </form>
  );
}