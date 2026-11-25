import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { medications } from "@/db/schema";

export async function getMedications(userId: string) {
  return db
    .select()
    .from(medications)
    .where(and(eq(medications.userId, userId), eq(medications.active, true)))
    .orderBy(asc(medications.name));
}