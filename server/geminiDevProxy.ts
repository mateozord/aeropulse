import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";
import { explainSignal } from "./geminiClient.ts";
import type { ExplainPayload } from "../src/types/explain.ts";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

/**
 * Dev-only proxy for /api/explain — keeps GEMINI_API_KEY server-side.
 * A production deploy needs the same logic behind a serverless function (Fase 13).
 */
export function geminiDevProxy(): Plugin {
  return {
    name: "gemini-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/explain", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        try {
          const body = await readBody(req);
          const input = JSON.parse(body) as ExplainPayload;
          const explanation = await explainSignal(input);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ explanation }));
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    },
  };
}
