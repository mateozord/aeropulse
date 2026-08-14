import type { Config } from "@netlify/functions";
import { explainSignal } from "../../server/geminiClient.ts";
import type { ExplainPayload } from "../../src/types/explain.ts";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    const input = (await req.json()) as ExplainPayload;
    const explanation = await explainSignal(input);
    return new Response(JSON.stringify({ explanation }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = { path: "/api/explain" };
