/// <reference types="node" />
import type { ExplainPayload } from "../src/types/explain.ts";

// "-latest" alias so this keeps working as Google rotates the underlying
// model version — verified empirically against the real API (2026-08-14),
// since the docs' suggested migration path (Interactions API) 404'd.
const MODEL = "gemini-flash-lite-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `Você é o explicador de sinais do AeroPulse. Você vai receber um JSON descrevendo
o Score AeroPulse atual de um aeroporto — um sinal experimental de 0 a 100 já calculado pelo
AeroPulse Engine, junto com os fatores específicos ("drivers") e as leituras brutas de clima/tráfego
que o produziram.

Escreva de 2 a 4 frases curtas, em português do Brasil claro e natural, explicando por que o score é
o que é, referenciando SOMENTE os drivers e valores que foram fornecidos. Nunca invente um fator,
causa ou dado que não esteja no input. Nunca afirme ou sugira uma previsão sobre atrasos de voos,
cancelamentos ou operações reais de companhias aéreas — o AeroPulse não faz isso. Mantenha um tom
neutro e preciso, como uma nota de analista, não um texto de marketing. Se o status for NORMAL sem
drivers relevantes, é aceitável dizer que as condições estão normais — não invente dramaticidade. O
score atual é calculado apenas a partir do clima (Weather Signal) — não mencione tráfego aéreo como
parte do cálculo do score. Se "traffic.observedAircraft" vier como null ou "availability" vier como
"unavailable", isso significa que não há leitura de tráfego disponível — nunca trate isso como zero
aeronaves nem comente sobre tráfego nesse caso.`;

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
