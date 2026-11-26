"use client";

import { useActionState } from "react";
import type { ExplainState } from "@/lib/validation";

export function ExplainPanel({
  action,
  name,
}: {
  action: (state: ExplainState, formData: FormData) => Promise<ExplainState>;
  name: string;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    {} as ExplainState
  );

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
        >
          {pending
            ? "Working on it..."
            : state.info
              ? "Write it again"
              : `What is ${name} for?`}
        </button>
      </form>

      {state.message && (
        <p
          role="alert"
          className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
        >
          {state.message}
        </p>
      )}

      {state.info && (
        <div
          aria-live="polite"
          className="overflow-hidden rounded-bay border-2 border-ink bg-tablet"
        >
          <h2 className="border-b-2 border-ink px-5 py-3 text-2xl">
            {state.info.name}
          </h2>
          <div className="space-y-5 p-5 text-lg">
            <div>
              <h3 className="text-xl">What it&apos;s generally used for</h3>
              <p className="mt-2">{state.info.usedFor}</p>
            </div>
            {state.info.askPharmacist.length > 0 && (
              <div>
                <h3 className="text-xl">Questions to ask your pharmacist</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {state.info.askPharmacist.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}