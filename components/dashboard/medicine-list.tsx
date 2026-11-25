import Link from "next/link";
import type { Medication } from "@/db/schema";

export function MedicineList({ medications }: { medications: Medication[] }) {
  return (
    <div className="overflow-hidden rounded-bay border-2 border-ink bg-tablet">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-4 py-3">
        <h2 className="text-2xl">Your medicines</h2>
        <Link
          href="/medications/new"
          className="rounded-full bg-ink px-5 py-2 font-bold text-white"
        >
          Add a medicine
        </Link>
      </div>

      <ul className="divide-y-2 divide-foil">
        {medications.map((medication) => (
          <li key={medication.id} className="p-4">
            <p className="font-bold">{medication.name}</p>
            <p className="text-ink-soft">{medication.dose}</p>
            {medication.instructions && (
              <p className="mt-1">{medication.instructions}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}