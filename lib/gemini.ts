import { GoogleGenAI } from "@google/genai";
import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { aiUsage } from "@/db/schema";

export const AI_DAILY_LIMIT = 20;
const TIMEOUT_MS = 25_000;

export type AiKind = "schedule" | "explain" | "summary";

export type AiResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

let client: GoogleGenAI | null = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export async function askGemini(options: {
  userId: string;
  kind: AiKind;
  system: string;
  prompt: string;
}): Promise<AiResult> {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL;

  if (!ai || !model) {
    return { ok: false, message: "AI features aren't set up on this server yet." };
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [usage] = await db
    .select({ used: count() })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, options.userId), gte(aiUsage.createdAt, since)));

  if (usage.used >= AI_DAILY_LIMIT) {
    return {
      ok: false,
      message: `You've used all ${AI_DAILY_LIMIT} AI requests for today. Try again tomorrow.`,
    };
  }

  await db.insert(aiUsage).values({ userId: options.userId, kind: options.kind });

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          systemInstruction: options.system,
          responseMimeType: "application/json",
        },
      }),
      TIMEOUT_MS
    );

    const text = response.text;
    if (!text) {
      return { ok: false, message: "The AI didn't return an answer. Try again." };
    }

    return { ok: true, text };
  } catch (error) {
    const status = (error as { status?: number }).status;
    const timedOut = error instanceof Error && error.message === "timeout";
    console.error("Gemini request failed:", timedOut ? "timeout" : (status ?? "unknown"));

    if (timedOut) {
      return { ok: false, message: "The AI took too long to answer. Try again." };
    }
    if (status === 429) {
      return {
        ok: false,
        message: "The AI service is busy right now. Try again in a few minutes.",
      };
    }
    if (status === 404) {
      return {
        ok: false,
        message: "The AI model isn't available. Check GEMINI_MODEL in .env.local.",
      };
    }
    return { ok: false, message: "The AI service couldn't answer. Try again." };
  }
}