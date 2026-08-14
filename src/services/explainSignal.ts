import type { ExplainPayload } from "../types/explain";

export async function fetchExplanation(payload: ExplainPayload): Promise<string> {
  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Explain request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { explanation: string };
  return data.explanation;
}
