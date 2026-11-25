import { brand } from "@/lib/brand";

export function SafetyNote() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl overflow-hidden rounded-bay border-2 border-ink bg-tablet">
          <h2 className="border-b-2 border-ink px-6 py-5 text-3xl sm:text-4xl">
            {brand.name} reminds. Your care team decides.
          </h2>
          <div className="space-y-4 p-6 text-lg">
            <p>
              {brand.name} is a reminder and tracking tool. It doesn&apos;t
              diagnose anything, give medical advice, or change your doses.
            </p>
            <p>
              Always follow what your doctor or pharmacist tells you. If you
              miss a dose or feel unwell, ask them what to do.
            </p>
            <p className="text-ink-soft">
              When AI suggests a schedule, you review it first. Nothing is saved
              until you confirm it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}