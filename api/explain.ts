import { explainSignal } from "../server/geminiClient.js";
import type { ExplainPayload } from "../src/types/explain.js";

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return new Response(null, { status: 405 });
    }

    try {
      const input = (await request.json()) as ExplainPayload;
      const explanation = await explainSignal(input);
      return Response.json({ explanation });
    } catch (err) {
      return Response.json({ error: (err as Error).message }, { status: 502 });
    }
  },
};
