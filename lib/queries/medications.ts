import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { isUuid } from "@/lib/validation";;

export async function getMedications(userId: string) {
  return db
    .select()
    .from(medications)
    .where(and(eq(medications.userId, userId), eq(medications.active, true)))
    .orderBy(asc(medications.name));
}

export async function getMedication(userId: string, id: string) {
  if (!isUuid(id)) return null;

  const [medication] = await db
    .select()
    .from(medications)
    .where(
      and(
        eq(medications.id, id),
        eq(medications.userId, userId),
        eq(medications.active, true)
      )
    )
    .limit(1);

  return medication ?? null;
}