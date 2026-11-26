import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { getMedication } from "@/lib/queries/medications";
import { explainMedicine } from "../../ai-actions";
import { AiNotice } from "@/components/ai/ai-notice";
import { ExplainPanel } from "@/components/ai/explain-panel";

export const metadata = {
  title: `About this medicine: ${brand.name}`,
};

export default async function AboutMedicinePage({
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

      <h1 className="mt-6 text-4xl">About {medication.name}</h1>
      <p className="mt-3 text-lg text-ink-soft">
        General information in plain words. It doesn&apos;t replace the leaflet
        that came with your medicine.
      </p>

      <div className="mt-6">
        <AiNotice sends="Only the medicine's name" />
      </div>

      <div className="mt-8">
        <ExplainPanel
          action={explainMedicine.bind(null, medication.id)}
          name={medication.name}
        />
      </div>
    </main>
  );
}