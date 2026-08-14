import type { ExplainPayload } from "../src/types/explain.ts";

// "-latest" alias so this keeps working as Google rotates the underlying
// model version — verified empirically against the real API (2026-08-14),
// since the docs' suggested migration path (Interactions API) 404'd.
const MODEL = "gemini-flash-lite-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are AeroPulse's signal explainer. You will receive JSON describing
one airport's current AeroPulse Score — a 0-100 experimental signal already computed by the
AeroPulse Engine, along with the specific factors ("drivers") and raw weather/traffic readings that
produced it.

Write 2-4 short, plain-English sentences explaining why the score is what it is, referencing ONLY
the drivers and values you were given. Never invent a factor, cause, or data point that isn't in the
input. Never state or imply a prediction about flight delays, cancellations, or real airline
operations — AeroPulse does not do that. Keep a neutral, precise tone, like an analyst's note, not
marketing copy. If the status is NORMAL with no notable drivers, it's fine to say conditions are
unremarkable — don't manufacture drama.`;

/**
 * Turns a computed signal into a short natural-language explanation.
 * Server-only: the API key must never reach the browser.
 */
export async function explainSignal(input: ExplainPayload): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ parts: [{ text: JSON.stringify(input) }] }],
      generationConfig: { maxOutputTokens: 220, temperature: 0.4 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}
