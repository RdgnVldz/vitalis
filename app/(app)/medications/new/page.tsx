import Link from "next/link";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { createMedication } from "../actions";
import { MedicationForm } from "@/components/medications/medication-form";

export const metadata = {
  title: `Add a medicine: ${brand.name}`,
};

export default async function NewMedicationPage() {
  await requireSession();

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Link href="/medications" className="font-bold underline">
        Back to medicines
      </Link>

      <h1 className="mt-6 text-4xl">Add a medicine</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Enter what&apos;s on the label.
      </p>

      <div className="mt-8 rounded-bay border-2 border-ink bg-tablet p-6">
        <MedicationForm
          action={createMedication}
          submitLabel="Add a medicine"
          pendingLabel="Adding..."
        />
        <p className="mt-6 text-lg">
          Rather type it in plain words?{" "}
        <Link href="/medications/ai" className="font-bold underline">
          Add with AI
        </Link>
      </p>
      </div>
    </main>
  );
}