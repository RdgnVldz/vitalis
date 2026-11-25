import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { getMedication } from "@/lib/queries/medications";
import { updateMedication } from "../../actions";
import { MedicationForm } from "@/components/medications/medication-form";

export const metadata = {
  title: `Edit medicine: ${brand.name}`,
};

export default async function EditMedicationPage({
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

      <h1 className="mt-6 text-4xl">Edit medicine</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Change anything that&apos;s different on the label.
      </p>

      <div className="mt-8 rounded-bay border-2 border-ink bg-tablet p-6">
        <MedicationForm
          action={updateMedication.bind(null, medication.id)}
          initialValues={{
            name: medication.name,
            dose: medication.dose,
            instructions: medication.instructions ?? "",
          }}
          submitLabel="Save changes"
          pendingLabel="Saving..."
        />
      </div>
    </main>
  );
}