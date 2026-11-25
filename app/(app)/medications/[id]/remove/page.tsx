import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { getMedication } from "@/lib/queries/medications";
import { archiveMedication } from "../../actions";
import { RemoveForm } from "@/components/medications/remove-form";

export const metadata = {
  title: `Remove medicine: ${brand.name}`,
};

export default async function RemoveMedicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  const medication = await getMedication(session.user.id, id);

  if (!medication) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Link href="/medications" className="font-bold underline">
        Back to medicines
      </Link>

      <h1 className="mt-6 text-4xl">Remove {medication.name}?</h1>
      <p className="mt-3 text-lg text-ink-soft">{medication.dose}</p>

      <div className="mt-8 rounded-bay border-2 border-ink bg-tablet p-6">
        <p className="mb-6 text-lg">
          It will no longer show on your dashboard or in your medicines list.
          Its past records are kept.
        </p>
        <RemoveForm action={archiveMedication.bind(null, medication.id)} />
      </div>
    </main>
  );
}