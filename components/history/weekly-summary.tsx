"use client";

import { useActionState } from "react";
import { writeWeeklySummary } from "@/app/(app)/history/actions";
import { AiNotice } from "@/components/ai/ai-notice";
import type { SummaryState } from "@/lib/validation";

export function WeeklySummary() {
  const [state, formAction, pending] = useActionState(
    writeWeeklySummary,
    {} as SummaryState
  );

  return (
    <div className="space-y-5">
      <AiNotice sends="Your dose counts and medicine names (not your name)" />

      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
        >
          {pending
            ? "Working on it..."
            : state.summary
              ? "Write it again"
              : "Write my weekly summary"}
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

      {state.summary && (
        <div
          aria-live="polite"
          className="rounded-bay border-2 border-ink bg-tablet p-6"
        >
          <p className="text-lg leading-relaxed">{state.summary}</p>
        </div>
      )}
    </div>
  );
}